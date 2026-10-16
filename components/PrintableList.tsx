'use client';

import React from 'react';
import { CategoryData, ShoppingItem } from '@/data/shoppingItems';

interface PrintableListProps {
  categories: CategoryData[];
  checkedState: Record<string, boolean>;
  totalEstimated: number;
}

export function PrintableList({ categories, checkedState, totalEstimated }: PrintableListProps) {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="hidden print:block text-black p-4 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="border-b-2 border-black pb-3 mb-4 text-center">
        <h1 className="text-2xl font-black uppercase tracking-tight">Stok Center Pelotas</h1>
        <p className="text-xs uppercase font-semibold text-gray-600">
          Lista de Compras Otimizada • Atacarejo Comercial Zaffari
        </p>
        <div className="flex justify-between items-center text-xs mt-2 text-gray-700">
          <span>Data: <strong>{currentDate}</strong></span>
          <span>Endereço: <strong>Av. Pres. João Goulart / Fernando Osório</strong></span>
          <span>Total Estimado: <strong>R$ {totalEstimated.toFixed(2).replace('.', ',')}</strong></span>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="border border-gray-400 rounded-md p-3">
            <h2 className="text-sm font-bold uppercase bg-gray-100 p-1.5 -m-3 mb-2 border-b border-gray-400">
              {cat.title}
            </h2>
            <div className="grid grid-cols-1 divide-y divide-gray-200">
              {cat.items.map((item) => {
                const isChecked = checkedState[item.id];
                return (
                  <div key={item.id} className="py-1.5 flex items-start justify-between text-xs">
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 border-2 border-black inline-block mt-0.5 text-center font-bold text-[10px] leading-3">
                        {isChecked ? 'X' : ''}
                      </span>
                      <div>
                        <span className={`font-semibold ${isChecked ? 'line-through text-gray-400' : ''}`}>
                          {item.name}
                        </span>
                        {item.aisle && (
                          <span className="font-bold text-[10px] text-gray-700 ml-1.5 border border-gray-400 px-1 rounded">
                            {item.aisle}
                          </span>
                        )}
                        <span className="text-gray-500 ml-1.5 text-[11px]">({item.detail})</span>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-right shrink-0">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Print Footer */}
      <div className="mt-6 pt-3 border-t-2 border-dashed border-gray-400 text-center text-[10px] text-gray-600 space-y-1">
        <p>💡 <strong>Dica de Economia no Stok Center:</strong> Apresente seu CPF no caixa para aplicar os descontos do Clube Stok.</p>
        <p>Preços estimados sujeitos a alteração de acordo com as ofertas diárias da filial Pelotas.</p>
      </div>
    </div>
  );
}
