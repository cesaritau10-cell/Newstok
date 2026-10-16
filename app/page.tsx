'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { StatsPanel } from '@/components/StatsPanel';
import { ActionBar } from '@/components/ActionBar';
import { ShoppingCategories } from '@/components/ShoppingCategories';
import { AddItemModal } from '@/components/AddItemModal';
import { PythonAutomationTab } from '@/components/PythonAutomationTab';
import { ScraperSimulatorTab } from '@/components/ScraperSimulatorTab';
import { StoreGuideTab } from '@/components/StoreGuideTab';
import { OcrScannerTab } from '@/components/OcrScannerTab';
import { PrintableList } from '@/components/PrintableList';
import { INITIAL_CATEGORIES, CategoryData, ShoppingItem } from '@/data/shoppingItems';
import { CheckCircle2, ShoppingCart } from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState<CategoryData[]>(() => {
    if (typeof window === 'undefined') return INITIAL_CATEGORIES;
    try {
      const saved = localStorage.getItem('stok_categories_data');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [checkedState, setCheckedState] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem('stok_shopping_state');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [hasCpfClub, setHasCpfClub] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const saved = localStorage.getItem('stok_cpf_club');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [maxBudget, setMaxBudget] = useState<number>(() => {
    if (typeof window === 'undefined') return 300;
    try {
      const saved = localStorage.getItem('stok_max_budget');
      return saved !== null ? Number(saved) : 300;
    } catch {
      return 300;
    }
  });

  const handleUpdateMaxBudget = (val: number) => {
    setMaxBudget(val);
    try {
      localStorage.setItem('stok_max_budget', String(val));
    } catch (err) {
      console.warn(err);
    }
  };

  const [activeTab, setActiveTab] = useState<'lista' | 'ocr' | 'python' | 'simulador' | 'guia'>('lista');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'checked'>('all');

  // Save to localStorage when categories change
  const saveCategories = (newCats: CategoryData[]) => {
    setCategories(newCats);
    try {
      localStorage.setItem('stok_categories_data', JSON.stringify(newCats));
    } catch (err) {
      console.warn(err);
    }
  };

  // Save checked state to localStorage
  const saveCheckedState = (newState: Record<string, boolean>) => {
    setCheckedState(newState);
    try {
      localStorage.setItem('stok_shopping_state', JSON.stringify(newState));
    } catch (err) {
      console.warn(err);
    }
  };

  // Save CPF club state
  const handleToggleCpfClub = (val: boolean) => {
    setHasCpfClub(val);
    try {
      localStorage.setItem('stok_cpf_club', JSON.stringify(val));
    } catch (err) {
      console.warn(err);
    }
  };

  // Flattened items list
  const allItems = useMemo(() => {
    return categories.flatMap((cat) => cat.items);
  }, [categories]);

  // Totals calculations
  const totalEstimated = useMemo(() => {
    return allItems.reduce((acc, it) => acc + it.price, 0);
  }, [allItems]);

  const totalCart = useMemo(() => {
    return allItems.reduce((acc, it) => {
      return checkedState[it.id] ? acc + it.price : acc;
    }, 0);
  }, [allItems, checkedState]);

  const checkedCount = useMemo(() => {
    return allItems.filter((it) => checkedState[it.id]).length;
  }, [allItems, checkedState]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handlers
  const handleToggleItem = (id: string) => {
    const newState = {
      ...checkedState,
      [id]: !checkedState[id],
    };
    saveCheckedState(newState);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    const updatedCats = categories.map((cat) => ({
      ...cat,
      items: cat.items.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta);
          const unitRate = item.unitPrice ?? item.price / item.qty;
          const newPrice = Number((unitRate * newQty).toFixed(2));
          return {
            ...item,
            qty: newQty,
            price: newPrice,
          };
        }
        return item;
      }),
    }));
    saveCategories(updatedCats);
  };

  const handleDeleteItem = (id: string) => {
    const updatedCats = categories.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.id !== id),
    }));
    saveCategories(updatedCats);
    showToast('Produto removido da lista');
  };

  const handleAddItem = (newItem: ShoppingItem) => {
    const updatedCats = categories.map((cat) => {
      if (cat.id === newItem.category) {
        return {
          ...cat,
          items: [...cat.items, newItem],
        };
      }
      return cat;
    });
    saveCategories(updatedCats);
    showToast(`"${newItem.name}" adicionado à lista!`);
  };

  const handleResetList = () => {
    const cleared: Record<string, boolean> = {};
    allItems.forEach((it) => {
      cleared[it.id] = false;
    });
    saveCheckedState(cleared);
    showToast('Carrinho limpo: todos os itens desmarcados.');
  };

  const handleCheckAll = () => {
    const checkedAll: Record<string, boolean> = {};
    allItems.forEach((it) => {
      checkedAll[it.id] = true;
    });
    saveCheckedState(checkedAll);
    showToast('Todos os itens foram marcados como no carrinho!');
  };

  const handleImportOcrItems = (scannedItems: ShoppingItem[]) => {
    // Intelligently merge into matching categories or append new items
    const updatedCats = categories.map((cat) => {
      const itemsForCategory = scannedItems.filter((it) => it.category === cat.id);
      if (itemsForCategory.length === 0) return cat;

      // Filter out duplicate names already present in the category
      const existingNames = new Set(cat.items.map((it) => it.name.toLowerCase()));
      const newItemsToAdd = itemsForCategory.filter(
        (it) => !existingNames.has(it.name.toLowerCase())
      );

      return {
        ...cat,
        items: [...cat.items, ...newItemsToAdd],
      };
    });

    saveCategories(updatedCats);
    setActiveTab('lista');
    showToast(`✨ ${scannedItems.length} produtos da foto/OCR importados com corredores!`);
  };

  const handleRestoreDefaults = () => {
    if (window.confirm('Deseja restaurar a lista padrão de 21 itens do Stok Center Pelotas?')) {
      saveCategories(INITIAL_CATEGORIES);
      const initialChecked: Record<string, boolean> = {};
      saveCheckedState(initialChecked);
      showToast('Lista restaurada para os 21 itens padrão!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const csvRows = [
      'Categoria,Item,Corredor,Detalhes,Qtd,Unidade,Preco Total (R$),No Carrinho',
      ...categories.flatMap((cat) =>
        cat.items.map(
          (it) =>
            `"${cat.title}","${it.name}","${it.aisle || 'Geral'}","${it.detail}",${it.qty},"${it.unit}",${it.price.toFixed(2)},"${
              checkedState[it.id] ? 'SIM' : 'NAO'
            }"`
        )
      ),
    ];
    const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lista_compras_stok_pelotas.csv';
    link.click();
    showToast('Arquivo CSV baixado com sucesso!');
  };

  const handleShareWhatsApp = () => {
    let text = `🛒 *LISTA DE COMPRAS - STOK CENTER PELOTAS*\n`;
    text += `Total Estimado: R$ ${totalEstimated.toFixed(2).replace('.', ',')}\n\n`;

    categories.forEach((cat) => {
      text += `*${cat.title}*\n`;
      cat.items.forEach((it) => {
        const isChecked = checkedState[it.id];
        const checkIcon = isChecked ? '✅' : '⬜';
        const aisleText = it.aisle ? ` [${it.aisle}]` : '';
        text += `${checkIcon} ${it.name} (${it.qty} ${it.unit})${aisleText} - R$ ${it.price.toFixed(2).replace('.', ',')}\n`;
      });
      text += `\n`;
    });

    text += `💡 _Dica: Digite seu CPF no caixa para ativar os descontos do Clube Stok._`;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast('Lista copiada! Cole no WhatsApp para enviar para sua família.');
      })
      .catch(() => {
        showToast('Não foi possível copiar automaticamente.');
      });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-100 text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen View */}
      <div className="print:hidden flex flex-col min-h-screen">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          checkedCount={checkedCount}
          totalCount={allItems.length}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* TAB 1: LISTA INTERATIVA */}
          {activeTab === 'lista' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <StatsPanel
                totalEstimated={totalEstimated}
                totalCart={totalCart}
                checkedCount={checkedCount}
                totalItems={allItems.length}
                hasCpfClub={hasCpfClub}
                setHasCpfClub={handleToggleCpfClub}
                maxBudget={maxBudget}
                setMaxBudget={handleUpdateMaxBudget}
              />

              <ActionBar
                onPrint={handlePrint}
                onReset={handleResetList}
                onCheckAll={handleCheckAll}
                onRestoreDefaults={handleRestoreDefaults}
                onOpenAddItem={() => setIsAddItemOpen(true)}
                onExportCsv={handleExportCsv}
                onShareWhatsApp={handleShareWhatsApp}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />

              <ShoppingCategories
                categories={categories}
                checkedState={checkedState}
                onToggleItem={handleToggleItem}
                onUpdateQty={handleUpdateQty}
                onDeleteItem={handleDeleteItem}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                filterStatus={filterStatus}
              />
            </div>
          )}

          {/* TAB OCR: LER FOTO / LISTA */}
          {activeTab === 'ocr' && (
            <div className="animate-in fade-in duration-200">
              <OcrScannerTab
                onImportItems={handleImportOcrItems}
                onGoToChecklist={() => setActiveTab('lista')}
              />
            </div>
          )}

          {/* TAB 2: AUTOMAÇÃO PYTHON */}
          {activeTab === 'python' && (
            <div className="animate-in fade-in duration-200">
              <PythonAutomationTab items={allItems} />
            </div>
          )}

          {/* TAB 3: SIMULADOR WEB */}
          {activeTab === 'simulador' && (
            <div className="animate-in fade-in duration-200">
              <ScraperSimulatorTab />
            </div>
          )}

          {/* TAB 4: GUIA STOK PELOTAS */}
          {activeTab === 'guia' && (
            <div className="animate-in fade-in duration-200">
              <StoreGuideTab />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5 text-red-600" />
                <span>Stok Center Pelotas — Gestor Inteligente de Compras & Automação Web em Python</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Otimizado para atacarejo • Rede Comercial Zaffari • Pelotas - RS
              </p>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              <span>Dica: Apresente seu CPF no caixa para descontos adicionais do Clube Stok.</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal Add Item */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAdd={handleAddItem}
      />

      {/* Printable Paper/PDF View (visible only during window.print) */}
      <PrintableList
        categories={categories}
        checkedState={checkedState}
        totalEstimated={totalEstimated}
      />
    </div>
  );
}
