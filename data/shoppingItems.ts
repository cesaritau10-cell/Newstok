export interface ShoppingItem {
  id: string;
  name: string;
  detail: string;
  price: number; // total price for the given quantity
  qty: number;
  unit: string;
  unitPrice?: number;
  category: string;
  targetBrands: string[];
  searchQuery: string;
  aisle?: string; // Corredor da loja física Stok Center Pelotas
}

export interface CategoryData {
  id: string;
  title: string;
  icon: string;
  color: string;
  badgeColor: string;
  items: ShoppingItem[];
}

export const INITIAL_CATEGORIES: CategoryData[] = [
  {
    id: "mercearia",
    title: "1. Alimentos Básicos e Mercearia",
    icon: "Wheat",
    color: "amber",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    items: [
      {
        id: "item-1",
        name: "Arroz (5kg)",
        detail: "1 pacote — Emoções / Namorado",
        price: 22.90,
        qty: 1,
        unit: "pct",
        category: "mercearia",
        targetBrands: ["Emoções", "Namorado"],
        searchQuery: "Arroz 5kg",
        aisle: "Corredor 2 - Grãos"
      },
      {
        id: "item-2",
        name: "Massa Parafuso (500g)",
        detail: "5 pacotes — Isabela / Orquídea",
        price: 15.95,
        qty: 5,
        unit: "pcts",
        unitPrice: 3.19,
        category: "mercearia",
        targetBrands: ["Isabela", "Orquídea"],
        searchQuery: "Massa Parafuso 500g",
        aisle: "Corredor 3 - Massas"
      },
      {
        id: "item-3",
        name: "Feijão Preto (1kg)",
        detail: "2 pacotes — Calcono / Tordilho",
        price: 13.78,
        qty: 2,
        unit: "pcts",
        unitPrice: 6.89,
        category: "mercearia",
        targetBrands: ["Calcono", "Tordilho"],
        searchQuery: "Feijao Preto 1kg",
        aisle: "Corredor 2 - Grãos"
      },
      {
        id: "item-4",
        name: "Farinha de Trigo (1kg)",
        detail: "2 pacotes — Orquídea / Nordeste",
        price: 7.98,
        qty: 2,
        unit: "pcts",
        unitPrice: 3.99,
        category: "mercearia",
        targetBrands: ["Orquídea", "Nordeste"],
        searchQuery: "Farinha de Trigo 1kg",
        aisle: "Corredor 3 - Farináceos"
      },
      {
        id: "item-5",
        name: "Açúcar (1kg)",
        detail: "2 pacotes — Alto Alegre / Caravelas",
        price: 8.38,
        qty: 2,
        unit: "pcts",
        unitPrice: 4.19,
        category: "mercearia",
        targetBrands: ["Alto Alegre", "Caravelas"],
        searchQuery: "Acucar 1kg",
        aisle: "Corredor 2 - Açúcar"
      },
      {
        id: "item-6",
        name: "Leite UHT (12 Litros)",
        detail: "1 caixa fechada — Piá / Elegê",
        price: 47.88,
        qty: 1,
        unit: "cx (12 un)",
        unitPrice: 3.99,
        category: "mercearia",
        targetBrands: ["Piá", "Elegê"],
        searchQuery: "Leite UHT",
        aisle: "Corredor 4 - Bebidas"
      },
      {
        id: "item-7",
        name: "Margarina (500g)",
        detail: "1 pote — Deline / Claybom",
        price: 5.90,
        qty: 1,
        unit: "un",
        category: "mercearia",
        targetBrands: ["Deline", "Claybom"],
        searchQuery: "Margarina 500g",
        aisle: "Geladeiras - Fundo"
      }
    ]
  },
  {
    id: "matinais",
    title: "2. Molhos, Temperos e Matinais",
    icon: "Utensils",
    color: "red",
    badgeColor: "bg-red-100 text-red-800 border-red-200",
    items: [
      {
        id: "item-8",
        name: "Suco em Pó (Display 20un)",
        detail: "1 caixa — MID / Apti",
        price: 17.80,
        qty: 1,
        unit: "cx (20 un)",
        unitPrice: 0.89,
        category: "matinais",
        targetBrands: ["MID", "Apti"],
        searchQuery: "Suco em Po",
        aisle: "Corredor 5 - Matinais"
      },
      {
        id: "item-9",
        name: "Bolacha Recheada",
        detail: "10 pacotes — Isabela / Zabet",
        price: 22.90,
        qty: 10,
        unit: "pcts",
        unitPrice: 2.29,
        category: "matinais",
        targetBrands: ["Isabela", "Zabet"],
        searchQuery: "Bolacha Recheada",
        aisle: "Corredor 1 - Biscoitos"
      },
      {
        id: "item-10",
        name: "Cereal Matinal (300g)",
        detail: "1 caixa — Zaeli / Apti",
        price: 7.90,
        qty: 1,
        unit: "cx",
        category: "matinais",
        targetBrands: ["Zaeli", "Apti"],
        searchQuery: "Cereal Matinal",
        aisle: "Corredor 1 - Biscoitos"
      },
      {
        id: "item-11",
        name: "Sabor a Mi (Grande)",
        detail: "1 pote — Apti / Arisco",
        price: 3.99,
        qty: 1,
        unit: "un",
        category: "matinais",
        targetBrands: ["Apti", "Arisco"],
        searchQuery: "Sabor a Mi",
        aisle: "Corredor 3 - Temperos"
      },
      {
        id: "item-12",
        name: "Tempero Alho/Sal/Cubo",
        detail: "2 unidades — Apti / Kisabor",
        price: 4.98,
        qty: 2,
        unit: "un",
        unitPrice: 2.49,
        category: "matinais",
        targetBrands: ["Apti", "Kisabor"],
        searchQuery: "Tempero Alho Sal",
        aisle: "Corredor 3 - Temperos"
      },
      {
        id: "item-13",
        name: "Ketchup (390g)",
        detail: "1 frasco — Cepera / Oderich",
        price: 4.49,
        qty: 1,
        unit: "un",
        category: "matinais",
        targetBrands: ["Cepera", "Oderich"],
        searchQuery: "Ketchup 390g",
        aisle: "Corredor 3 - Molhos"
      },
      {
        id: "item-14",
        name: "Maionese (500g)",
        detail: "1 frasco — Salada / Soya",
        price: 5.49,
        qty: 1,
        unit: "un",
        category: "matinais",
        targetBrands: ["Salada", "Soya"],
        searchQuery: "Maionese 500g",
        aisle: "Corredor 3 - Molhos"
      },
      {
        id: "item-15",
        name: "Queijo Ralado (50g)",
        detail: "3 pacotes — Teixeira / Relíquia",
        price: 10.47,
        qty: 3,
        unit: "pcts",
        unitPrice: 3.49,
        category: "matinais",
        targetBrands: ["Teixeira", "Relíquia"],
        searchQuery: "Queijo Ralado 50g",
        aisle: "Corredor 3 - Molhos"
      },
      {
        id: "item-16",
        name: "Bala e Pirulito",
        detail: "2 pacotes — Peccin / Florestal",
        price: 12.98,
        qty: 2,
        unit: "pcts",
        unitPrice: 6.49,
        category: "matinais",
        targetBrands: ["Peccin", "Florestal"],
        searchQuery: "Bala Pirulito",
        aisle: "Corredor 1 - Bomboniere"
      }
    ]
  },
  {
    id: "carnes",
    title: "3. Carnes e Congelados",
    icon: "Beef",
    color: "orange",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    items: [
      {
        id: "item-17",
        name: "Frango Sassami (1kg)",
        detail: "2 pacotes — LeBon / Aurora",
        price: 29.80,
        qty: 2,
        unit: "pcts",
        unitPrice: 14.90,
        category: "carnes",
        targetBrands: ["LeBon", "Aurora"],
        searchQuery: "Sassami 1kg",
        aisle: "Congelados - Fundo"
      }
    ]
  },
  {
    id: "limpeza",
    title: "4. Higiene e Limpeza",
    icon: "Sparkles",
    color: "blue",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    items: [
      {
        id: "item-18",
        name: "Sabão em Pó (1kg)",
        detail: "1 pacote — Brilhus / Tixan Ypê",
        price: 8.90,
        qty: 1,
        unit: "pct",
        category: "limpeza",
        targetBrands: ["Brilhus", "Tixan Ypê"],
        searchQuery: "Sabao em Po 1kg",
        aisle: "Corredor 6 - Limpeza"
      },
      {
        id: "item-19",
        name: "Detergente (500ml)",
        detail: "2 frascos — Minuano / Limpol",
        price: 3.98,
        qty: 2,
        unit: "un",
        unitPrice: 1.99,
        category: "limpeza",
        targetBrands: ["Minuano", "Limpol"],
        searchQuery: "Detergente 500ml",
        aisle: "Corredor 6 - Limpeza"
      },
      {
        id: "item-20",
        name: "Kit Shampoo + Condicionador",
        detail: "1 kit — Monange / Seda",
        price: 12.90,
        qty: 1,
        unit: "kit",
        category: "limpeza",
        targetBrands: ["Monange", "Seda"],
        searchQuery: "Kit Shampoo Condicionador",
        aisle: "Corredor 6 - Higiene"
      },
      {
        id: "item-21",
        name: "Papel Higiênico (12 rolos)",
        detail: "1 pacote — Sublime / Bob",
        price: 11.90,
        qty: 1,
        unit: "pct",
        category: "limpeza",
        targetBrands: ["Sublime", "Bob"],
        searchQuery: "Papel Higienico 12 rolos",
        aisle: "Corredor 6 - Higiene"
      }
    ]
  }
];

export const STOK_PELOTAS_STORE_INFO = {
  name: "Stok Center Pelotas",
  network: "Rede Comercial Zaffari - Stok Center Atacarejo",
  city: "Pelotas - RS",
  mainAddress: "Av. Pres. João Goulart, 4510 / Av. Fernando Osório (Acesso Principal)",
  openingHours: "Segunda a Sábado: 07:00 às 22:00 | Domingo e Feriados: 08:00 às 21:00",
  features: [
    "Preço de atacado a partir de poucas unidades (fardo/caixa)",
    "Clube Stok com desconto imediato via CPF no caixa",
    "Estacionamento amplo e gratuito",
    "Aceita Pix, Cartão Stok, Cartões de Crédito/Débito e Alimentação/Refeição"
  ],
  dealsCalendar: [
    { day: "Terça & Quarta", title: "Festival do Hortifruti", desc: "Frutas, verduras e legumes frescos direto do produtor gaúcho com preço de atacado." },
    { day: "Quinta & Sexta", title: "Quinta da Carne e Aves", desc: "Cortes bovinos, frango e suínos com cortes especiais e preços reduzidos." },
    { day: "Sábado e Domingo", title: "Fim de Semana do Atacarejo", desc: "Descontos progressivos em caixas fechadas de bebidas, laticínios e itens de limpeza." }
  ]
};
