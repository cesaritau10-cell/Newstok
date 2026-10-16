'use client';

import React from 'react';
import {
  Printer,
  RotateCcw,
  CheckCheck,
  PlusCircle,
  Share2,
  FileSpreadsheet,
  Search,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { ShoppingItem } from '@/data/shoppingItems';

interface ActionBarProps {
  onPrint: () => void;
  onReset: () => void;
  onCheckAll: () => void;
  onRestoreDefaults: () => void;
  onOpenAddItem: () => void;
  onExportCsv: () => void;
  onShareWhatsApp: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  filterStatus: 'all' | 'pending' | 'checked';
  setFilterStatus: (status: 'all' | 'pending' | 'checked') => void;
}

export function ActionBar({
  onPrint,
  onReset,
  onCheckAll,
  onRestoreDefaults,
  onOpenAddItem,
  onExportCsv,
  onShareWhatsApp,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  filterStatus,
  setFilterStatus,
}: ActionBarProps) {
  const categories = [
    { id: 'all', label: 'Todas as Categorias' },
    { id: 'mercearia', label: 'Básicos & Mercearia' },
    { id: 'matinais', label: 'Molhos & Matinais' },
    { id: 'carnes', label: 'Carnes & Congelados' },
    { id: 'limpeza', label: 'Higiene & Limpeza' },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
      {/* Top Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Primary Functional Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onPrint}
            className="px-3.5 py-2 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Imprimir ou gerar arquivo PDF limpo"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>Imprimir / Salvar PDF</span>
          </button>

          <button
            onClick={onOpenAddItem}
            className="px-3.5 py-2 bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-red-800 transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-yellow-300" />
            <span>Adicionar Item</span>
          </button>

          <button
            onClick={onReset}
            className="px-3 py-2 bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg hover:bg-slate-200 transition flex items-center gap-1.5 active:scale-95"
            title="Desmarcar todos os produtos do carrinho"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Desmarcar Tudo</span>
          </button>

          <button
            onClick={onCheckAll}
            className="px-3 py-2 bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg hover:bg-slate-200 transition flex items-center gap-1.5 active:scale-95"
            title="Marcar todos os itens como já colocados no carrinho"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Marcar Todos</span>
          </button>
        </div>

        {/* Secondary Export & Share Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onShareWhatsApp}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Copiar lista formatada para enviar no WhatsApp"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={onExportCsv}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold rounded-lg border border-blue-200 transition flex items-center gap-1.5 active:scale-95"
            title="Baixar lista de compras em formato CSV para Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={onRestoreDefaults}
            className="px-2.5 py-2 text-slate-400 hover:text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition"
            title="Restaurar a lista original de 21 itens do Stok Center"
          >
            Restaurar Original
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por nome do produto ou marca (ex: Isabela, Arroz, Piá)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Status Filters: Todos, No Carrinho, Pendentes */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium self-start md:self-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1.5 rounded-md transition ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-2.5 py-1.5 rounded-md transition flex items-center gap-1 ${
              filterStatus === 'pending'
                ? 'bg-white text-amber-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>A Pegar</span>
          </button>
          <button
            onClick={() => setFilterStatus('checked')}
            className={`px-2.5 py-1.5 rounded-md transition flex items-center gap-1 ${
              filterStatus === 'checked'
                ? 'bg-white text-emerald-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>No Carrinho</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition border ${
              selectedCategory === cat.id
                ? 'bg-red-700 text-white font-bold border-red-700 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
