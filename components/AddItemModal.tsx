'use client';

import React, { useState } from 'react';
import { X, Plus, ShoppingBag, MapPin } from 'lucide-react';
import { ShoppingItem } from '@/data/shoppingItems';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: ShoppingItem) => void;
}

export function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('mercearia');
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState('un');
  const [unitPrice, setUnitPrice] = useState('');
  const [brands, setBrands] = useState('');
  const [detail, setDetail] = useState('');
  const [aisle, setAisle] = useState('Corredor 2 - Grãos');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedUnitPrice = parseFloat(unitPrice.replace(',', '.')) || 0;
    const finalPrice = parsedUnitPrice * qty;

    const targetBrands = brands
      .split(/[,/]/)
      .map((b) => b.trim())
      .filter(Boolean);

    const newItem: ShoppingItem = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      detail: detail.trim() || `${qty} ${unit} — ${targetBrands.join(' / ') || 'Marca de preferência'}`,
      price: finalPrice > 0 ? Number(finalPrice.toFixed(2)) : 5.0,
      qty: qty > 0 ? qty : 1,
      unit: unit,
      unitPrice: parsedUnitPrice > 0 ? parsedUnitPrice : undefined,
      category: category,
      targetBrands: targetBrands.length > 0 ? targetBrands : ['Geral'],
      searchQuery: name.trim(),
      aisle: aisle,
    };

    onAdd(newItem);
    onClose();
    // Reset form
    setName('');
    setUnitPrice('');
    setBrands('');
    setDetail('');
    setQty(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-base">Adicionar Produto à Lista</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Nome do Produto *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Café em Pó Torrado (500g)"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value;
                  setCategory(val);
                  if (val === 'mercearia') setAisle('Corredor 2 - Grãos');
                  else if (val === 'matinais') setAisle('Corredor 5 - Matinais');
                  else if (val === 'carnes') setAisle('Congelados - Fundo');
                  else if (val === 'limpeza') setAisle('Corredor 6 - Limpeza');
                }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white"
              >
                <option value="mercearia">1. Básicos & Mercearia</option>
                <option value="matinais">2. Molhos & Matinais</option>
                <option value="carnes">3. Carnes & Congelados</option>
                <option value="limpeza">4. Higiene & Limpeza</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Preço Unitário Estimado (R$)
              </label>
              <input
                type="text"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="Ex: 14.90"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Quantidade
              </label>
              <input
                type="number"
                min="1"
                max="999"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Unidade / Embalagem
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Ex: un, pct, cx, kg"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Corredor / Rota no Stok Pelotas</span>
            </label>
            <select
              value={aisle}
              onChange={(e) => setAisle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white"
            >
              <option value="Corredor 1 - Biscoitos">Corredor 1 - Biscoitos & Bolachas</option>
              <option value="Corredor 1 - Bomboniere">Corredor 1 - Bomboniere, Balas & Doces</option>
              <option value="Corredor 2 - Grãos">Corredor 2 - Arroz, Feijão & Grãos</option>
              <option value="Corredor 2 - Açúcar">Corredor 2 - Açúcar & Farinhas</option>
              <option value="Corredor 3 - Massas">Corredor 3 - Massas & Macarrão</option>
              <option value="Corredor 3 - Molhos">Corredor 3 - Molhos & Extratos</option>
              <option value="Corredor 3 - Temperos">Corredor 3 - Temperos, Alho & Sal</option>
              <option value="Corredor 4 - Bebidas">Corredor 4 - Bebidas & Leite UHT</option>
              <option value="Corredor 5 - Matinais">Corredor 5 - Matinais, Cafés & Sucos</option>
              <option value="Corredor 6 - Limpeza">Corredor 6 - Sabão, Detergentes & Limpeza</option>
              <option value="Corredor 6 - Higiene">Corredor 6 - Shampoo, Sabonetes & Papel</option>
              <option value="Geladeiras - Fundo">Geladeiras - Manteigas & Laticínios</option>
              <option value="Congelados - Fundo">Congelados - Carnes, Frangos & Peixes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Marcas Sugeridas (separadas por vírgula)
            </label>
            <input
              type="text"
              value={brands}
              onChange={(e) => setBrands(e.target.value)}
              placeholder="Ex: Melitta, Três Corações, Caboclo"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Observações / Detalhe
            </label>
            <input
              type="text"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Ex: Levar 1 pacote a vácuo se estiver na promoção"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Salvar Produto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
