'use client';

import React from 'react';
import { ShoppingCart, Terminal, PlayCircle, MapPin, Store, Camera } from 'lucide-react';

interface NavbarProps {
  activeTab: 'lista' | 'ocr' | 'python' | 'simulador' | 'guia';
  setActiveTab: (tab: 'lista' | 'ocr' | 'python' | 'simulador' | 'guia') => void;
  checkedCount: number;
  totalCount: number;
}

export function Navbar({ activeTab, setActiveTab, checkedCount, totalCount }: NavbarProps) {
  return (
    <header className="bg-red-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('lista')}>
            <div className="w-10 h-10 rounded-xl bg-red-800 flex items-center justify-center border border-red-500/50 shadow-inner">
              <ShoppingCart className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-xl tracking-tight leading-tight">
                  Stok Center Pelotas
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-400 text-slate-900 uppercase tracking-wide">
                  Atacarejo
                </span>
              </div>
              <p className="text-xs text-red-200 hidden sm:block">
                Gestor Inteligente de Compras & Automação Web Python
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('lista')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 font-semibold ${
                activeTab === 'lista'
                  ? 'bg-red-900 text-white shadow-sm ring-1 ring-white/20'
                  : 'bg-red-800/40 text-red-100 hover:bg-red-800 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-yellow-300" />
              <span>Lista</span>
              {totalCount > 0 && (
                <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-red-950 text-yellow-300 font-mono">
                  {checkedCount}/{totalCount}
                </span>
              )}
            </button>

            {/* Nova Aba de Leitura de Foto / OCR IA */}
            <button
              onClick={() => setActiveTab('ocr')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 font-semibold ${
                activeTab === 'ocr'
                  ? 'bg-red-900 text-white shadow-sm ring-1 ring-white/20'
                  : 'bg-red-800/40 text-red-100 hover:bg-red-800 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Ler Foto / OCR</span>
              <span className="sm:hidden">OCR</span>
            </button>

            <button
              onClick={() => setActiveTab('python')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 font-semibold ${
                activeTab === 'python'
                  ? 'bg-red-900 text-white shadow-sm ring-1 ring-white/20'
                  : 'bg-red-800/40 text-red-100 hover:bg-red-800 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Script Python</span>
              <span className="md:hidden">Python</span>
            </button>

            <button
              onClick={() => setActiveTab('simulador')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 font-semibold ${
                activeTab === 'simulador'
                  ? 'bg-red-900 text-white shadow-sm ring-1 ring-white/20'
                  : 'bg-red-800/40 text-red-100 hover:bg-red-800 hover:text-white'
              }`}
            >
              <PlayCircle className="w-4 h-4 text-cyan-300" />
              <span className="hidden sm:inline">Simulador</span>
              <span className="sm:hidden">Robô</span>
            </button>

            <button
              onClick={() => setActiveTab('guia')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 font-semibold ${
                activeTab === 'guia'
                  ? 'bg-red-900 text-white shadow-sm ring-1 ring-white/20'
                  : 'bg-red-800/40 text-red-100 hover:bg-red-800 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4 text-amber-300" />
              <span className="hidden lg:inline">Guia Pelotas</span>
              <span className="lg:hidden"><Store className="w-4 h-4" /></span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
