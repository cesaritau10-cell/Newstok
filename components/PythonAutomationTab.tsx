'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Terminal,
  Settings2,
  FileCode,
  BookOpen,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { ShoppingItem } from '@/data/shoppingItems';
import { generatePythonScript } from '@/data/pythonScript';

interface PythonAutomationTabProps {
  items: ShoppingItem[];
}

export function PythonAutomationTab({ items }: PythonAutomationTabProps) {
  const [copied, setCopied] = useState(false);
  const [store, setStore] = useState('Pelotas');
  const [headless, setHeadless] = useState(true);
  const [slowMo, setSlowMo] = useState(100);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'json'>('csv');
  const [activeGuideTab, setActiveGuideTab] = useState<'pip' | 'colab' | 'cron'>('pip');

  const pythonCode = generatePythonScript(items, {
    store,
    headless,
    slowMo,
    exportFormat,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPy = () => {
    const blob = new Blob([pythonCode], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `stok_${store.toLowerCase()}_scraper.py`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSampleCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Item Solicitado,Produto Encontrado,Marcas Alvo,Qtd,Preco Un. Encontrado (R$),Preco Un. Alvo (R$),Subtotal (R$),Status\n" +
      items.map(it => `"${it.name}","${it.name} Stok","${(it.targetBrands||[]).join(';')}",${it.qty},${it.unitPrice||it.price},${it.unitPrice||it.price},${it.price},"Disponivel"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_compras_stok_${store.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Overview */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
              <Terminal className="w-4 h-4" />
              <span>Web Scraping & Cart Automation Suite</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Script de Automação para StokOnline ({store})
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Script em Python 3 utilizando <strong>Playwright Chromium Headless</strong> e <strong>BeautifulSoup4</strong> para
              extrair os preços atuais do portal Stok Center, comparar com a meta e gerar planilhas automáticas em CSV/Excel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition flex items-center gap-2 shadow-lg shadow-yellow-500/10 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Código Copiado!' : 'Copiar Código Python'}</span>
            </button>

            <button
              onClick={handleDownloadPy}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm rounded-lg border border-slate-700 transition flex items-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Baixar .py</span>
            </button>

            <button
              onClick={handleDownloadSampleCsv}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg border border-slate-700 transition flex items-center gap-1.5"
              title="Baixar planilha modelo"
            >
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Exemplo CSV</span>
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 text-sm">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="font-semibold text-slate-200 flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Renderização Dinâmica</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Supera a renderização reativa (React/NextJS) do portal <code className="text-yellow-300 font-mono">stokonline.com.br</code> com emulação de navegador real e headless Chromium.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="font-semibold text-slate-200 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Matching por Marcas Gaúchas</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filtra automaticamente as marcas recomendadas no Stok Pelotas (Emoções, Isabela, Piá, Orquídea, Calcono, Tixan Ypê).
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="font-semibold text-slate-200 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sincronização em Tempo Real</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              O código Python acima reflete exatamente os <strong>{items.length} itens</strong> ativos no seu gestor de compras neste instante.
            </p>
          </div>
        </div>

        {/* Parameter Customization Controls */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Settings2 className="w-4 h-4 text-yellow-400" />
            <span>Configurações do Gerador de Código</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Filial Stok Center:</label>
              <select
                value={store}
                onChange={(e) => setStore(e.target.value)}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              >
                <option value="Pelotas">Pelotas (RS)</option>
                <option value="Passo Fundo">Passo Fundo (RS)</option>
                <option value="Caxias do Sul">Caxias do Sul (RS)</option>
                <option value="Santa Maria">Santa Maria (RS)</option>
                <option value="Gravataí">Gravataí (RS)</option>
                <option value="Lages">Lages (SC)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Modo de Execução:</label>
              <select
                value={headless ? 'headless' : 'visible'}
                onChange={(e) => setHeadless(e.target.value === 'headless')}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              >
                <option value="headless">Headless (Segundo plano / Servidor)</option>
                <option value="visible">Com Janela Visível (Depuração)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Delay Entre Buscas (Slow-Mo):</label>
              <select
                value={slowMo}
                onChange={(e) => setSlowMo(Number(e.target.value))}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              >
                <option value="50">Rápido (50ms)</option>
                <option value="100">Equilibrado (100ms)</option>
                <option value="250">Cauteloso / Antiban (250ms)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Formato de Exportação:</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as 'csv' | 'excel' | 'json')}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              >
                <option value="csv">CSV (Excel / Google Sheets)</option>
                <option value="excel">Excel (.xlsx)</option>
                <option value="json">JSON API</option>
              </select>
            </div>
          </div>
        </div>

        {/* Python Code Display */}
        <div className="mt-6 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
          <div className="bg-slate-800 px-4 py-2.5 text-xs text-slate-300 font-mono flex items-center justify-between border-b border-slate-700">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              <span className="ml-2 font-semibold">stok_{store.toLowerCase()}_scraper.py</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-[11px] font-mono">{items.length} itens configurados</span>
              <span className="text-yellow-400 text-[11px] font-mono bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                Python 3.10+
              </span>
            </div>
          </div>
          <pre className="m-0 p-4 overflow-x-auto text-xs leading-relaxed text-slate-200 font-mono custom-scrollbar max-h-[500px]">
            <code>{pythonCode}</code>
          </pre>
        </div>
      </div>

      {/* Execution Instructions / Terminal Guide */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-slate-800 text-base">
              Como Executar o Script em sua Máquina
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveGuideTab('pip')}
              className={`px-3 py-1 rounded-md transition ${
                activeGuideTab === 'pip' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              Terminal / VSCode
            </button>
            <button
              onClick={() => setActiveGuideTab('colab')}
              className={`px-3 py-1 rounded-md transition ${
                activeGuideTab === 'colab' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              Google Colab / Nuvem
            </button>
            <button
              onClick={() => setActiveGuideTab('cron')}
              className={`px-3 py-1 rounded-md transition ${
                activeGuideTab === 'cron' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              Agendamento Automático
            </button>
          </div>
        </div>

        {activeGuideTab === 'pip' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-600">
            <p>Siga estes 3 passos simples no seu terminal (Linux, Windows PowerShell ou macOS):</p>
            
            <div className="space-y-2">
              <p className="font-bold text-slate-700">1. Instale as bibliotecas necessárias:</p>
              <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs flex items-center justify-between">
                <code>pip install playwright pandas beautifulsoup4 openpyxl</code>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-slate-700">2. Instale o navegador Chromium do Playwright:</p>
              <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs flex items-center justify-between">
                <code>playwright install chromium</code>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-slate-700">3. Execute o robô:</p>
              <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs flex items-center justify-between">
                <code>python stok_{store.toLowerCase()}_scraper.py</code>
              </div>
            </div>

            <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
              💡 Os resultados serão salvos automaticamente em um arquivo CSV formatado com codificação UTF-8 compatível com Excel e Google Planilhas.
            </p>
          </div>
        )}

        {activeGuideTab === 'colab' && (
          <div className="space-y-3 text-xs sm:text-sm text-slate-600">
            <p>Se você não tem Python instalado no computador, pode rodar gratuitamente no Google Colab:</p>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs space-y-2">
              <p className="text-slate-400"># Na primeira célula do Colab:</p>
              <p className="text-yellow-400">!pip install playwright pandas beautifulsoup4</p>
              <p className="text-yellow-400">!playwright install chromium</p>
              <p className="text-slate-400"># Em seguida cole o código gerado e clique em Executar.</p>
            </div>
          </div>
        )}

        {activeGuideTab === 'cron' && (
          <div className="space-y-3 text-xs sm:text-sm text-slate-600">
            <p>
              Deseja monitorar promoções semanais do Stok Center Pelotas? Configure uma rotina (Cron / Task Scheduler) para rodar toda quarta-feira às 07:00 da manhã (dia de ofertas de hortifruti e carnes):
            </p>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs text-emerald-400">
              0 7 * * 3 /usr/bin/python3 /caminho/stok_pelotas_scraper.py
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
