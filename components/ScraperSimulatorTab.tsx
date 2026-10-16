'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Terminal,
  Globe,
  CheckCircle,
  FileSpreadsheet,
  Download,
  AlertCircle,
  Sparkles,
  Search,
  ShoppingCart
} from 'lucide-react';
import { SAMPLE_SIMULATION_RESULTS } from '@/data/pythonScript';

export function ScraperSimulatorTab() {
  const [isRunning, setIsRunning] = useState(false);
  const [progressIdx, setProgressIdx] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState('https://www.stokonline.com.br');
  const [results, setResults] = useState<typeof SAMPLE_SIMULATION_RESULTS>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const startSimulation = () => {
    setIsRunning(true);
    setProgressIdx(0);
    setResults([]);
    setLogs([
      `[${new Date().toLocaleTimeString()}] 🚀 Inicializando Playwright Chromium Headless...`,
      `[${new Date().toLocaleTimeString()}] 🌐 Acessando https://www.stokonline.com.br...`,
      `[${new Date().toLocaleTimeString()}] 📍 Selecionando filial: 'Pelotas - Av. Fernando Osório / Pres. João Goulart'...`,
      `[${new Date().toLocaleTimeString()}] 🛒 Carregando lista de 21 produtos do atacarejo...`,
    ]);
    setCurrentUrl('https://www.stokonline.com.br');
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && progressIdx < SAMPLE_SIMULATION_RESULTS.length) {
      timer = setTimeout(() => {
        const currentItem = SAMPLE_SIMULATION_RESULTS[progressIdx];
        const now = new Date().toLocaleTimeString();

        setCurrentUrl(`https://www.stokonline.com.br/busca?q=${encodeURIComponent(currentItem.item)}`);

        setLogs((prev) => [
          ...prev,
          `[${now}] 🔍 (${progressIdx + 1}/${SAMPLE_SIMULATION_RESULTS.length}) Pesquisando '${currentItem.item}'...`,
          `[${now}]    ✅ Encontrado: "${currentItem.found}" | Preço: R$ ${currentItem.price.toFixed(2).replace('.', ',')} ${currentItem.promo ? '🔥 [OFERTA CLUBE STOK]' : ''}`,
        ]);

        setResults((prev) => [...prev, currentItem]);
        setProgressIdx((prev) => prev + 1);
      }, 700);
    } else if (isRunning && progressIdx >= SAMPLE_SIMULATION_RESULTS.length) {
      timer = setTimeout(() => {
        setIsRunning(false);
        const now = new Date().toLocaleTimeString();
        setLogs((prev) => [
          ...prev,
          `[${now}] ✨ Varredura completa de todos os 21 itens!`,
          `[${now}] 💾 Gerando relatório estruturado 'compras_stok_pelotas.csv'...`,
          `[${now}] 🏁 Concluído com sucesso sem falhas de conexão.`,
        ]);
        setCurrentUrl('https://www.stokonline.com.br/carrinho');
      }, 100);
    }

    return () => clearTimeout(timer);
  }, [isRunning, progressIdx]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const totalCalculated = results.reduce((acc, it) => acc + it.subtotal, 0);
  const totalTarget = results.reduce((acc, it) => acc + (it.target * it.qty), 0);
  const savings = Math.max(0, totalTarget - totalCalculated);

  const downloadResultsCsv = () => {
    if (results.length === 0) return;
    const header = "Item,Produto Encontrado,Marca,Qtd,Preco Unit (R$),Subtotal (R$),Status\n";
    const rows = results
      .map(
        (r) =>
          `"${r.item}","${r.found}","${r.brand}",${r.qty},${r.price.toFixed(2)},${r.subtotal.toFixed(2)},"${r.status}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'raspagem_stok_pelotas_resultado.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Simulador Interativo Playwright</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Execução Virtual do Scraper Stok Center Pelotas
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Veja em tempo real como o script Python interage com o portal oficial do Stok Center, pesquisando cada produto, identificando as marcas gaúchas e computando os subtotais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isRunning && progressIdx === 0 && (
            <button
              onClick={startSimulation}
              className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition flex items-center gap-2 shadow-lg shadow-red-600/30 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Iniciar Raspagem Agora</span>
            </button>
          )}

          {isRunning && (
            <div className="px-5 py-3 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-sm rounded-xl flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping inline-block"></span>
              <span>Raspando... ({progressIdx}/21)</span>
            </div>
          )}

          {!isRunning && progressIdx > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={startSimulation}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reiniciar</span>
              </button>
              <button
                onClick={downloadResultsCsv}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Baixar CSV Coletado</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Browser Mockup Window */}
      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
        {/* Browser Top Bar */}
        <div className="bg-slate-800/90 px-4 py-2.5 flex items-center justify-between border-b border-slate-700 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
            <span className="ml-2 text-slate-400 font-mono text-[11px] hidden sm:inline">
              Chromium Headless Emulation • Pelotas (RS)
            </span>
          </div>

          {/* Browser Address Bar */}
          <div className="bg-slate-950 text-slate-300 px-4 py-1 rounded-md font-mono text-xs flex-1 max-w-xl mx-4 flex items-center gap-2 border border-slate-800 overflow-hidden text-ellipsis whitespace-nowrap">
            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-400 select-none">https://</span>
            <span className="text-yellow-300 font-semibold">{currentUrl.replace('https://', '')}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[11px] font-mono">
              {isRunning ? 'Carregando DOM...' : progressIdx > 0 ? 'Concluído' : 'Aguardando'}
            </span>
          </div>
        </div>

        {/* Browser Content Area: Terminal & Realtime Data */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
          {/* Terminal Console */}
          <div className="lg:col-span-5 bg-slate-950 p-4 border-b lg:border-b-0 lg:border-r border-slate-800 font-mono text-xs overflow-y-auto max-h-[420px] custom-scrollbar flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-500 text-[11px] uppercase tracking-wider mb-2 pb-2 border-b border-slate-900">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Console stdout (Playwright Async)</span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px] leading-relaxed">
                {logs.length === 0 ? (
                  <p className="text-slate-600 italic">
                    Pressione &ldquo;Iniciar Raspagem Agora&rdquo; para simular o robô navegando e extraindo os dados.
                  </p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="animate-in fade-in duration-100">
                      {log}
                    </div>
                  ))
                )}
                <div ref={terminalEndRef} />
              </div>
            </div>

            {progressIdx > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-900 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Progresso: {progressIdx} de 21</span>
                <span className="text-yellow-400 font-bold">{Math.round((progressIdx / 21) * 100)}%</span>
              </div>
            )}
          </div>

          {/* Scraped Results Table */}
          <div className="lg:col-span-7 bg-white p-4 overflow-y-auto max-h-[420px] custom-scrollbar flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Dados Coletados da Loja Pelotas ({results.length} itens)
                  </h4>
                </div>
                {results.length > 0 && (
                  <div className="text-xs font-mono font-bold text-emerald-700">
                    Subtotal: R$ {totalCalculated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                )}
              </div>

              {results.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <Search className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">Nenhum dado raspado ainda.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {results.map((row, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs hover:bg-slate-100 transition animate-in slide-in-from-bottom-1 duration-150"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 truncate">{row.item}</span>
                          {row.promo && (
                            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                              OFERTA
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{row.found}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-slate-900">
                          R$ {row.subtotal.toFixed(2).replace('.', ',')}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {row.qty}x R$ {row.price.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary footer */}
            {results.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="text-slate-600">
                  Economia no Stok: <span className="font-bold text-emerald-600">R$ {savings.toFixed(2).replace('.', ',')}</span> abaixo da meta
                </div>
                <div className="font-bold text-slate-800 text-sm">
                  Total Final: <span className="text-red-700">R$ {totalCalculated.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
