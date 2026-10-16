import { ShoppingItem } from './shoppingItems';

export function generatePythonScript(
  items: ShoppingItem[],
  options: {
    store: string;
    headless: boolean;
    slowMo: number;
    exportFormat: 'csv' | 'excel' | 'json';
  } = {
    store: 'Pelotas',
    headless: true,
    slowMo: 100,
    exportFormat: 'csv',
  }
): string {
  const itemsJson = items.map(item => ({
    nome: item.name,
    busca: item.searchQuery || item.name,
    marcas: item.targetBrands || [],
    qtd: item.qty,
    preco_alvo: item.unitPrice ? item.unitPrice : Number((item.price / (item.qty || 1)).toFixed(2))
  }));

  const itemsString = JSON.stringify(itemsJson, null, 4);

  return `# -*- coding: utf-8 -*-
"""
=============================================================================
Stok Center Pelotas - Web Scraper & Cart Automation Suite
Rede: Stok Center (Comercial Zaffari) - Filial ${options.store}
Tecnologias: Playwright (Chromium Headless), BeautifulSoup4, Pandas

Requisitos:
    pip install playwright pandas beautifulsoup4 openpyxl
    playwright install chromium
=============================================================================
"""

import asyncio
import re
import sys
import json
from datetime import datetime
import pandas as pd
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

# Configurações do Portal StokOnline
BASE_URL = "https://www.stokonline.com.br"
CARRINHO_URL = "https://www.stokonline.com.br/carrinho"
FILIAL_SELECIONADA = "${options.store}"
HEADLESS_MODE = ${options.headless ? 'True' : 'False'}
SLOW_MO_MS = ${options.slowMo}

# Lista de Produtos Otimizada (Sincronizada com o Gestor)
LISTA_COMPRAS = ${itemsString}

class StokOnlineAutomation:
    """Automação profissional para consulta de preços e montagem de carrinho no Stok Center."""

    def __init__(self, headless=HEADLESS_MODE):
        self.headless = headless
        self.results = []
        self.timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

    async def run(self):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] 🚀 Inicializando Playwright Chromium...")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=self.headless,
                slow_mo=SLOW_MO_MS,
                args=["--no-sandbox", "--disable-setuid-sandbox"]
            )
            
            context = await browser.new_context(
                viewport={"width": 1366, "height": 850},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                locale="pt-BR"
            )
            page = await context.new_page()

            # 1. Acessa o portal Stok Online
            print(f"[{datetime.now().strftime('%H:%M:%S')}] 🔗 Navegando para {BASE_URL}...")
            try:
                await page.goto(BASE_URL, wait_until="networkidle", timeout=30000)
            except Exception as e:
                print(f"⚠️ Aviso de timeout na rede, prosseguindo com carregamento do DOM: {e}")

            # 2. Seleção de Filial / Loja Pelotas
            await self._select_store_branch(page)

            # 3. Varredura da Lista de Compras
            total_items = len(LISTA_COMPRAS)
            print(f"[{datetime.now().strftime('%H:%M:%S')}] 📦 Iniciando varredura de {total_items} produtos na filial {FILIAL_SELECIONADA}...")

            for idx, item in enumerate(LISTA_COMPRAS, 1):
                busca = item["busca"]
                print(f"[{datetime.now().strftime('%H:%M:%S')}] ({idx}/{total_items}) 🔍 Pesquisando: '{busca}'...")
                
                try:
                    search_url = f"{BASE_URL}/busca?q={busca.replace(' ', '+')}"
                    await page.goto(search_url, wait_until="domcontentloaded", timeout=20000)
                    await asyncio.sleep(1.2)  # Aguarda renderização dos cards reativos

                    html = await page.content()
                    soup = BeautifulSoup(html, "html.parser")

                    # Localiza cards de produto no DOM
                    product_cards = soup.select(
                        "div[data-testid='product-card'], div.product-card, div.product-item, div.MuiCard-root"
                    )

                    matched_product = None
                    if product_cards:
                        # Tenta encontrar produto que contenha as marcas alvo
                        for card in product_cards:
                            card_text = card.get_text()
                            if any(marca.lower() in card_text.lower() for marca in item["marcas"]):
                                matched_product = card
                                break
                        # Se não encontrar a marca exata, seleciona o primeiro card retornado
                        if not matched_product and len(product_cards) > 0:
                            matched_product = product_cards[0]

                    if matched_product:
                        title_elem = matched_product.select_one(".product-title, h3, .name, [data-testid='product-title']")
                        price_elem = matched_product.select_one(".product-price, .price, .current-price, [data-testid='price']")

                        nome_encontrado = title_elem.get_text(strip=True) if title_elem else "Produto Encontrado"
                        preco_str = price_elem.get_text(strip=True) if price_elem else "0"
                        
                        # Limpa string de moeda brasileira (R$ 1.234,56 -> 1234.56)
                        preco_limpo = re.sub(r"[^0-9,]", "", preco_str).replace(",", ".")
                        preco_float = float(preco_limpo) if preco_limpo else 0.0

                        subtotal = round(preco_float * item["qtd"], 2)
                        dif_alvo = round(preco_float - item["preco_alvo"], 2)

                        self.results.append({
                            "Item": item["nome"],
                            "Produto no Stok": nome_encontrado,
                            "Marcas Alvo": ", ".join(item["marcas"]),
                            "Qtd": item["qtd"],
                            "Preço Un. Encontrado (R$)": preco_float,
                            "Preço Un. Alvo (R$)": item["preco_alvo"],
                            "Diferença Unitária (R$)": dif_alvo,
                            "Subtotal (R$)": subtotal,
                            "Status": "Disponível" if preco_float > 0 else "Indisponível"
                        })
                        print(f"   ✅ Encontrado: {nome_encontrado} - R$ {preco_float:.2f} (Subtotal: R$ {subtotal:.2f})")
                    else:
                        self.results.append({
                            "Item": item["nome"],
                            "Produto no Stok": "Não localizado na busca",
                            "Marcas Alvo": ", ".join(item["marcas"]),
                            "Qtd": item["qtd"],
                            "Preço Un. Encontrado (R$)": 0.0,
                            "Preço Un. Alvo (R$)": item["preco_alvo"],
                            "Diferença Unitária (R$)": 0.0,
                            "Subtotal (R$)": 0.0,
                            "Status": "Fora de Estoque"
                        })
                        print(f"   ⚠️ Produto não localizado ou sem estoque.")

                except Exception as err:
                    print(f"   ❌ Erro ao consultar '{busca}': {err}")

            await browser.close()
            self.export_data()

    async def _select_store_branch(self, page):
        """Identifica e seleciona a filial correta na tela inicial."""
        try:
            # Verifica se há seletor de cidade/filial
            store_btn = await page.query_selector("button:has-text('Pelotas'), button:has-text('Selecione sua loja')")
            if store_btn:
                await store_btn.click()
                print(f"[{datetime.now().strftime('%H:%M:%S')}] 📍 Loja '{FILIAL_SELECIONADA}' confirmada.")
            else:
                print(f"[{datetime.now().strftime('%H:%M:%S')}] ℹ️ Seletor de filial já pré-selecionado ou padrão.")
        except Exception as e:
            print(f"ℹ️ Seleção de filial: {e}")

    def export_data(self):
        """Exporta os dados obtidos para CSV, Excel e imprime o relatório executivo."""
        df = pd.DataFrame(self.results)
        
        print("\\n" + "=" * 65)
        print(f"🛒 RELATÓRIO DE COMPRAS - STOK CENTER {FILIAL_SELECIONADA.upper()}")
        print("=" * 65)
        
        if not df.empty:
            cols_show = ["Item", "Preço Un. Encontrado (R$)", "Subtotal (R$)", "Status"]
            print(df[cols_show].to_string(index=False))
            
            total_geral = df["Subtotal (R$)"].sum()
            total_itens = df[df["Status"] == "Disponível"]["Qtd"].sum()
            print("-" * 65)
            print(f"💰 VALOR TOTAL ESTIMADO: R$ {total_geral:.2f}")
            print(f"📦 TOTAL DE UNIDADES ENCONTRADAS: {int(total_itens)} un")
            print("=" * 65)

            # Exportação de Arquivos
            csv_file = f"compras_stok_{self.timestamp}.csv"
            excel_file = f"compras_stok_{self.timestamp}.xlsx"

            df.to_csv(csv_file, index=False, encoding="utf-8-sig")
            print(f"💾 Relatório CSV gerado: {csv_file}")
            
            try:
                df.to_excel(excel_file, index=False)
                print(f"📊 Planilha Excel gerada: {excel_file}")
            except Exception:
                pass
        else:
            print("Nenhum dado capturado durante a execução.")

if __name__ == "__main__":
    print("▶️ Executando Robô Stok Center Pelotas...")
    bot = StokOnlineAutomation(headless=HEADLESS_MODE)
    asyncio.run(bot.run())
`;
}

export const SAMPLE_SIMULATION_RESULTS = [
  { item: "Arroz (5kg)", found: "Arroz Branco Tipo 1 Namorado 5kg", brand: "Namorado", price: 21.99, target: 22.90, qty: 1, subtotal: 21.99, status: "Disponível", promo: true },
  { item: "Massa Parafuso (500g)", found: "Massa com Ovos Parafuso Isabela 500g", brand: "Isabela", price: 2.99, target: 3.19, qty: 5, subtotal: 14.95, status: "Disponível", promo: true },
  { item: "Feijão Preto (1kg)", found: "Feijão Preto Tordilho Tipo 1 1kg", brand: "Tordilho", price: 6.79, target: 6.89, qty: 2, subtotal: 13.58, status: "Disponível", promo: false },
  { item: "Farinha de Trigo (1kg)", found: "Farinha de Trigo Especial Orquídea 1kg", brand: "Orquídea", price: 3.89, target: 3.99, qty: 2, subtotal: 7.78, status: "Disponível", promo: false },
  { item: "Açúcar (1kg)", found: "Açúcar Refinado Alto Alegre 1kg", brand: "Alto Alegre", price: 3.99, target: 4.19, qty: 2, subtotal: 7.98, status: "Disponível", promo: true },
  { item: "Leite UHT (12 Litros)", found: "Leite UHT Integral Piá Caixa 12x1L", brand: "Piá", price: 46.68, target: 47.88, qty: 1, subtotal: 46.68, status: "Disponível", promo: true },
  { item: "Margarina (500g)", found: "Margarina com Sal Deline 500g", brand: "Deline", price: 5.79, target: 5.90, qty: 1, subtotal: 5.79, status: "Disponível", promo: false },
  { item: "Suco em Pó (Display 20un)", found: "Refresco em Pó MID Display C/ 20un Sabores", brand: "MID", price: 16.90, target: 17.80, qty: 1, subtotal: 16.90, status: "Disponível", promo: true },
  { item: "Bolacha Recheada", found: "Biscoito Recheado Chocolate Isabela 130g", brand: "Isabela", price: 2.19, target: 2.29, qty: 10, subtotal: 21.90, status: "Disponível", promo: true },
  { item: "Cereal Matinal (300g)", found: "Cereal de Milho com Açúcar Zaeli 300g", brand: "Zaeli", price: 7.49, target: 7.90, qty: 1, subtotal: 7.49, status: "Disponível", promo: false },
  { item: "Sabor a Mi (Grande)", found: "Tempero Completo Arisco sem Pimenta 300g", brand: "Arisco", price: 3.89, target: 3.99, qty: 1, subtotal: 3.89, status: "Disponível", promo: false },
  { item: "Tempero Alho/Sal/Cubo", found: "Tempero de Alho e Sal Kisabor 300g", brand: "Kisabor", price: 2.39, target: 2.49, qty: 2, subtotal: 4.78, status: "Disponível", promo: false },
  { item: "Ketchup (390g)", found: "Ketchup Tradicional Cepera Frasco 390g", brand: "Cepera", price: 4.29, target: 4.49, qty: 1, subtotal: 4.29, status: "Disponível", promo: false },
  { item: "Maionese (500g)", found: "Maionese Tradicional Salada Squeeze 500g", brand: "Salada", price: 5.29, target: 5.49, qty: 1, subtotal: 5.29, status: "Disponível", promo: false },
  { item: "Queijo Ralado (50g)", found: "Queijo Parmesão Ralado Teixeira 50g", brand: "Teixeira", price: 3.29, target: 3.49, qty: 3, subtotal: 9.87, status: "Disponível", promo: false },
  { item: "Bala e Pirulito", found: "Bala Mastigável Peccin Variada 500g", brand: "Peccin", price: 6.19, target: 6.49, qty: 2, subtotal: 12.38, status: "Disponível", promo: false },
  { item: "Frango Sassami (1kg)", found: "Filé de Peito Sassami Congelado Aurora 1kg", brand: "Aurora", price: 14.29, target: 14.90, qty: 2, subtotal: 28.58, status: "Disponível", promo: true },
  { item: "Sabão em Pó (1kg)", found: "Lava Roupas em Pó Tixan Ypê Primavera 1kg", brand: "Tixan Ypê", price: 8.49, target: 8.90, qty: 1, subtotal: 8.49, status: "Disponível", promo: false },
  { item: "Detergente (500ml)", found: "Detergente Líquido Limpol Neutro 500ml", brand: "Limpol", price: 1.89, target: 1.99, qty: 2, subtotal: 3.78, status: "Disponível", promo: false },
  { item: "Kit Shampoo + Condicionador", found: "Kit Monange Hidratação Intensiva Shampoo + Cond", brand: "Monange", price: 12.49, target: 12.90, qty: 1, subtotal: 12.49, status: "Disponível", promo: false },
  { item: "Papel Higiênico (12 rolos)", found: "Papel Higiênico Sublime Folha Dupla 12 Rolos 30m", brand: "Sublime", price: 11.29, target: 11.90, qty: 1, subtotal: 11.29, status: "Disponível", promo: true }
];
