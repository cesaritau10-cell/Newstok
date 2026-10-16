'use client';

import React, { useState } from 'react';
import {
  Calculator,
  ShoppingBag,
  CheckCircle2,
  PiggyBank,
  Sparkles,
  CreditCard,
  AlertTriangle,
  Target,
  Pencil,
  Check,
  RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';

interface StatsPanelProps {
  totalEstimated: number;
  totalCart: number;
  checkedCount: number;
  totalItems: number;
  hasCpfClub: boolean;
  setHasCpfClub: (val: boolean) => void;
  maxBudget: number;
  setMaxBudget: (val: number) => void;
}

export function StatsPanel({
  totalEstimated,
  totalCart,
  checkedCount,
  totalItems,
  hasCpfClub,
  setHasCpfClub,
  maxBudget,
  setMaxBudget,
}: StatsPanelProps) {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudgetInput, setTempBudgetInput] = useState<string>(String(maxBudget || ''));

  const percentComplete = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;
  const remainingCost = Math.max(0, totalEstimated - totalCart);

  // Approximate savings from Atacado pricing (~24% cheaper than conventional supermarkets)
  const baseSavings = totalEstimated * 0.24;
  // Club Stok adds an extra 3.5% on eligible items when CPF is entered at checkout
  const clubSavings = hasCpfClub ? totalEstimated * 0.035 : 0;
  const totalSavings = baseSavings + clubSavings;

  // Budget calculations
  const hasBudgetLimit = maxBudget > 0;
  const isOverBudget = hasBudgetLimit && totalCart > maxBudget;
  const overBudgetAmount = isOverBudget ? totalCart - maxBudget : 0;
  const remainingBudget = hasBudgetLimit ? Math.max(0, maxBudget - totalCart) : 0;
  const budgetUsagePercent = hasBudgetLimit ? Math.min(100, Math.round((totalCart / maxBudget) * 100)) : 0;

  const handleSaveBudget = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseFloat(tempBudgetInput.replace(',', '.'));
    if (!isNaN(parsed) && parsed >= 0) {
      setMaxBudget(Number(parsed.toFixed(2)));
    } else if (tempBudgetInput.trim() === '') {
      setMaxBudget(0);
    }
    setIsEditingBudget(false);
  };

  const handleApplyPreset = (amount: number) => {
    setMaxBudget(amount);
    setTempBudgetInput(String(amount));
    setIsEditingBudget(false);
  };

  return (
    <div className="space-y-3">
      {/* Budget Configuration Bar */}
      <div className={`p-3 px-4 rounded-xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
        isOverBudget
          ? 'bg-red-50/90 border-red-300 text-red-900 shadow-sm'
          : 'bg-white border-slate-200 text-slate-800 shadow-xs'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg font-bold ${
            isOverBudget
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-slate-100 text-slate-700'
          }`}>
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Orçamento Máximo Estipulado
              </span>
              {isOverBudget && (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-red-600 text-white">
                  <AlertTriangle className="w-3 h-3" /> Limite Excedido!
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <p className={`text-lg font-black font-mono tracking-tight ${
                isOverBudget ? 'text-red-700' : 'text-slate-900'
              }`}>
                {maxBudget > 0
                  ? `R$ ${maxBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : 'Sem limite definido'}
              </p>
              {hasBudgetLimit && !isOverBudget && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  R$ {remainingBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} restantes
                </span>
              )}
              {isOverBudget && (
                <span className="text-xs font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-md border border-red-300">
                  + R$ {overBudgetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} acima da meta
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Input & Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {isEditingBudget ? (
            <form onSubmit={handleSaveBudget} className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                <input
                  type="text"
                  autoFocus
                  value={tempBudgetInput}
                  onChange={(e) => setTempBudgetInput(e.target.value)}
                  placeholder="Ex: 300,00"
                  className="w-28 pl-8 pr-2.5 py-1.5 text-xs font-mono font-bold border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTempBudgetInput(String(maxBudget || ''));
                  setIsEditingBudget(false);
                }}
                className="px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-200 rounded-lg transition"
              >
                Cancelar
              </button>
            </form>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => {
                  setTempBudgetInput(maxBudget ? String(maxBudget) : '');
                  setIsEditingBudget(true);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 border border-slate-200 shadow-2xs"
                title="Digitar outro valor de orçamento"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-500" />
                <span>Alterar Limite</span>
              </button>

              {/* Quick Presets */}
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => handleApplyPreset(200)}
                  className={`px-2 py-1 rounded border transition ${
                    maxBudget === 200
                      ? 'bg-red-700 text-white border-red-700 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  R$ 200
                </button>
                <button
                  onClick={() => handleApplyPreset(250)}
                  className={`px-2 py-1 rounded border transition ${
                    maxBudget === 250
                      ? 'bg-red-700 text-white border-red-700 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  R$ 250
                </button>
                <button
                  onClick={() => handleApplyPreset(300)}
                  className={`px-2 py-1 rounded border transition ${
                    maxBudget === 300
                      ? 'bg-red-700 text-white border-red-700 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  R$ 300
                </button>
                <button
                  onClick={() => handleApplyPreset(350)}
                  className={`px-2 py-1 rounded border transition ${
                    maxBudget === 350
                      ? 'bg-red-700 text-white border-red-700 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  R$ 350
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Estimado */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs uppercase font-bold text-slate-400">
              <span>Total Estimado</span>
              <span className="text-[10px] text-slate-400 font-normal">({totalItems} itens)</span>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              R$ {totalEstimated.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-500">
              Restante a pegar: <span className="font-semibold text-slate-700">R$ {remainingCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:scale-105 transition-transform">
            <Calculator className="w-6 h-6" />
          </div>
        </div>

        {/* Selecionados / No Carrinho - DYNAMIC COLOR ON EXCEEDING BUDGET */}
        <div className={`p-4 rounded-xl shadow-sm border transition-all duration-300 flex items-center justify-between relative overflow-hidden group ${
          isOverBudget
            ? 'bg-red-50/70 border-red-400 ring-2 ring-red-500/30'
            : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <p className={`text-xs uppercase font-bold ${
                isOverBudget ? 'text-red-600' : 'text-slate-400'
              }`}>
                Total no Carrinho
              </p>
              {isOverBudget && (
                <span className="p-0.5 rounded-full bg-red-600 text-white animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                </span>
              )}
            </div>

            {/* Price with Alert Tone (Red / Orange-Red) when exceeding budget */}
            <p className={`text-2xl font-black tracking-tight transition-colors duration-300 ${
              isOverBudget
                ? 'text-red-600 font-black drop-shadow-xs'
                : 'text-emerald-600'
            }`}>
              R$ {totalCart.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>

            {/* Subtext with feedback */}
            {isOverBudget ? (
              <p className="text-[11px] font-bold text-red-700 flex items-center gap-1">
                <span>⚠️ Ultrapassou em R$ {overBudgetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </p>
            ) : hasBudgetLimit ? (
              <p className="text-[11px] text-slate-500">
                {checkedCount === 0
                  ? `Limite de R$ ${maxBudget.toFixed(2).replace('.', ',')}`
                  : `${checkedCount} no carrinho (${budgetUsagePercent}% do teto)`}
              </p>
            ) : (
              <p className="text-[11px] text-slate-500">
                {checkedCount === 0 ? 'Nenhum item marcado' : `${checkedCount} no carrinho de compras`}
              </p>
            )}

            {/* Mini budget usage bar inside card */}
            {hasBudgetLimit && (
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverBudget ? 'bg-red-600' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (totalCart / maxBudget) * 100)}%` }}
                />
              </div>
            )}
          </div>

          <div className={`p-3 rounded-xl transition-transform group-hover:scale-105 ${
            isOverBudget
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-emerald-50 text-emerald-600'
          }`}>
            {isOverBudget ? <AlertTriangle className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
          </div>
        </div>

        {/* Progresso de Compra */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Progresso na Loja</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-blue-600 tracking-tight">
                  {checkedCount} <span className="text-sm font-semibold text-slate-400">/ {totalItems}</span>
                </p>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  {percentComplete}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
            <motion.div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Economia Estimada Atacarejo */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs uppercase font-bold text-amber-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Economia Estimada</span>
            </div>
            <p className="text-2xl font-black text-amber-600 tracking-tight">
              ~ R$ {totalSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-500">
              vs. Supermercados convencionais
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition-transform">
            <PiggyBank className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Warning Alert Banner when Over Budget */}
      {isOverBudget && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-600 text-white p-3 px-4 rounded-xl shadow-md flex items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-yellow-300 shrink-0" />
            <div>
              <span className="font-extrabold text-yellow-200">Atenção ao Orçamento:</span> O valor total das compras no carrinho atingiu{' '}
              <strong className="underline">R$ {totalCart.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>, ultrapassando seu teto estipulado de{' '}
              <strong>R$ {maxBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> em{' '}
              <strong className="bg-red-800 px-1.5 py-0.5 rounded text-yellow-300 font-mono">
                R$ {overBudgetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </strong>.
            </div>
          </div>
          <button
            onClick={() => handleApplyPreset(Math.ceil(totalCart / 10) * 10)}
            className="shrink-0 px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white rounded font-bold text-[11px] border border-red-400 transition"
          >
            Ajustar Teto
          </button>
        </motion.div>
      )}

      {/* Clube Stok CPF Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-3 px-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-yellow-400 text-slate-900 rounded-lg font-bold flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-yellow-300">Dica Stok Pelotas:</span> Informe seu <span className="underline font-semibold">CPF no caixa</span> para liberar os descontos automáticos do Clube Stok em marcas selecionadas.
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer bg-red-800/80 px-3 py-1.5 rounded-lg border border-red-500/40 hover:bg-red-800 transition select-none shrink-0 self-start sm:self-auto">
          <input
            type="checkbox"
            checked={hasCpfClub}
            onChange={(e) => setHasCpfClub(e.target.checked)}
            className="w-4 h-4 rounded text-yellow-400 focus:ring-yellow-400 border-red-400 cursor-pointer"
          />
          <span className="font-semibold text-xs text-white">Ativar Desconto Clube Stok (+3,5%)</span>
        </label>
      </div>
    </div>
  );
}
