'use client';

import React from 'react';
import {
  Wheat,
  Utensils,
  Beef,
  Sparkles,
  Trash2,
  Plus,
  Minus,
  Check,
  Tag,
  PackageOpen,
  MapPin
} from 'lucide-react';
import { CategoryData, ShoppingItem } from '@/data/shoppingItems';

interface ShoppingCategoriesProps {
  categories: CategoryData[];
  checkedState: Record<string, boolean>;
  onToggleItem: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onDeleteItem: (id: string) => void;
  searchQuery: string;
  selectedCategory: string;
  filterStatus: 'all' | 'pending' | 'checked';
}

export function ShoppingCategories({
  categories,
  checkedState,
  onToggleItem,
  onUpdateQty,
  onDeleteItem,
  searchQuery,
  selectedCategory,
  filterStatus,
}: ShoppingCategoriesProps) {
  // Category icon mapping
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wheat':
        return <Wheat className="w-4 h-4 text-amber-300" />;
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-red-300" />;
      case 'Beef':
        return <Beef className="w-4 h-4 text-orange-300" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-cyan-300" />;
      default:
        return <Tag className="w-4 h-4 text-yellow-300" />;
    }
  };

  // Filter categories and items based on search, category selection, and checked status
  const filteredCategories = categories
    .filter((cat) => selectedCategory === 'all' || cat.id === selectedCategory)
    .map((cat) => {
      const filteredItems = cat.items.filter((item) => {
        // Status filter
        const isChecked = Boolean(checkedState[item.id]);
        if (filterStatus === 'pending' && isChecked) return false;
        if (filterStatus === 'checked' && !isChecked) return false;

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDetail = item.detail.toLowerCase().includes(q);
          const matchBrand = (item.targetBrands || []).some((b) => b.toLowerCase().includes(q));
          return matchName || matchDetail || matchBrand;
        }

        return true;
      });

      return {
        ...cat,
        items: filteredItems,
      };
    })
    .filter((cat) => cat.items.length > 0);

  if (filteredCategories.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <PackageOpen className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Nenhum produto encontrado</h3>
          <p className="text-sm text-slate-500 mt-1">
            Não encontramos itens com o termo &ldquo;{searchQuery}&rdquo; no filtro atual.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredCategories.map((category) => {
        // Category stats
        const catTotal = category.items.reduce((acc, it) => acc + it.price, 0);
        const catCheckedCount = category.items.filter((it) => checkedState[it.id]).length;
        const allInCatChecked = category.items.length > 0 && catCheckedCount === category.items.length;

        return (
          <div
            key={category.id}
            className="category-card bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-shadow hover:shadow-md"
          >
            {/* Category Header */}
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-800 rounded-lg">
                  {getCategoryIcon(category.icon)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{category.title}</h3>
                  <div className="text-[11px] text-slate-400">
                    {catCheckedCount} de {category.items.length} no carrinho
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-yellow-400">
                  R$ {catTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {allInCatChecked && (
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                    <Check className="w-3 h-3" /> Concluído
                  </div>
                )}
              </div>
            </div>

            {/* Items list */}
            <div className="divide-y divide-slate-100 flex-1">
              {category.items.map((item) => {
                const isChecked = Boolean(checkedState[item.id]);

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 hover:bg-slate-50/80 transition-all flex items-start gap-3 select-none ${
                      isChecked ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleItem(item.id)}
                      className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                      aria-label={`Marcar ${item.name}`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    {/* Item Details */}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => onToggleItem(item.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <span
                            className={`font-semibold text-sm leading-tight block ${
                              isChecked ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}
                          >
                            {item.name}
                          </span>
                          <p className="text-xs text-slate-500">{item.detail}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`font-bold text-sm font-mono block ${
                              isChecked ? 'text-emerald-700' : 'text-slate-900'
                            }`}
                          >
                            R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          {item.unitPrice && item.qty > 1 && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({item.qty}x R$ {item.unitPrice.toFixed(2).replace('.', ',')})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Brand Pill Tags and Aisle Location */}
                      <div className="flex flex-wrap items-center gap-1 mt-1.5">
                        {item.aisle && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border flex items-center gap-1 ${
                              isChecked
                                ? 'bg-slate-100 text-slate-400 border-slate-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
                            }`}
                          >
                            <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{item.aisle}</span>
                          </span>
                        )}

                        {item.targetBrands && item.targetBrands.length > 0 &&
                          item.targetBrands.map((brand) => (
                            <span
                              key={brand}
                              className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${
                                isChecked
                                  ? 'bg-slate-100 text-slate-400 border-slate-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200/80'
                              }`}
                            >
                              {brand}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Quantity modifier & Delete item */}
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateQty(item.id, -1);
                          }}
                          className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-white rounded transition"
                          title="Diminuir quantidade"
                          disabled={item.qty <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-slate-700 font-mono text-[11px]">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateQty(item.id, 1);
                          }}
                          className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-white rounded transition"
                          title="Aumentar quantidade"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item.id);
                        }}
                        className="p-1 text-slate-300 hover:text-red-500 rounded transition"
                        title="Remover item da lista"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
