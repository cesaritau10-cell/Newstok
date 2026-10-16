'use client';

import React from 'react';
import {
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  CreditCard,
  Truck,
  CheckCircle2,
  Phone,
  Tag,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { STOK_PELOTAS_STORE_INFO } from '@/data/shoppingItems';

export function StoreGuideTab() {
  return (
    <div className="space-y-6">
      {/* Store Hero Card */}
      <div className="bg-gradient-to-br from-red-700 via-red-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-red-800/40 relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>Guia Oficial do Comprador Inteligente</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Stok Center Pelotas
          </h2>
          <p className="text-sm sm:text-base text-red-100 leading-relaxed">
            O atacarejo da rede Comercial Zaffari em Pelotas que combina preços baixos no varejo com descontos progressivos em caixas fechadas e fardos para famílias e comerciantes locais.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-red-600/40 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Localização:</p>
                <p className="text-red-200">{STOK_PELOTAS_STORE_INFO.mainAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Horário de Funcionamento:</p>
                <p className="text-red-200">{STOK_PELOTAS_STORE_INFO.openingHours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Golden Rules for Saving at Stok Center */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Percent className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-800 text-base">
            Como Economizar até 30% a mais na sua Compra
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <span className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center text-xs font-mono">1</span>
              <span>Compre em Volume / Embalagem Econômica</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              No Stok Center, itens como leite (caixa com 12L), sucos em pó (display de 20 un) e massas (fardos com 5 ou 10 pcts) possuem preço diferenciado de atacado destacado na etiqueta amarela.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <span className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center text-xs font-mono">2</span>
              <span>Sempre Informe seu CPF no Início do Caixa</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              O Clube Stok não requer anuidade nem cartão próprio para descontos diários. Ao digitar o CPF, o sistema abate instantaneamente de 3% a 15% em centenas de marcas parceiras.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <span className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center text-xs font-mono">3</span>
              <span>Priorize as Grandes Marcas Gaúchas</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Marcas locais do Rio Grande do Sul (arroz Emoções/Namorado, massas Isabela/Orquídea, laticínios Piá/Elegê) chegam ao Stok Pelotas com menor custo logístico e preços muito mais agressivos.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <span className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center text-xs font-mono">4</span>
              <span>Atenção aos Dias de Promoção Setorial</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Planeje suas compras para quarta ou quinta-feira para pegar os caminhões frescos de carnes e hortifruti, ou aproveite o sábado para estocar mercearia e produtos de limpeza pesada.
            </p>
          </div>
        </div>
      </div>

      {/* Deals Calendar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-800 text-base">
            Calendário de Ofertas da Semana no Stok Pelotas
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STOK_PELOTAS_STORE_INFO.dealsCalendar.map((deal, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full inline-block mb-1">
                  {deal.day}
                </span>
                <h4 className="font-bold text-sm text-slate-800">{deal.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{deal.desc}</p>
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Preço Especial
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment methods */}
      <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-800 text-yellow-400 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Formas de Pagamento no Caixa</h4>
            <p className="text-xs text-slate-400">
              Pix com QR Code dinâmico no caixa, Dinheiro, Cartão Stok Center (até 40 dias sem juros), Visa, Mastercard, Elo, Banricompras, VR, Sodexo, Ticket e Alelo.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 font-mono">
            Pelotas • RS
          </span>
        </div>
      </div>
    </div>
  );
}
