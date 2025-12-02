import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Search, Download, RefreshCw, BarChart2, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Award } from 'lucide-react';
import { generateHistory, getTopAssets } from '../services/financeEngine';
import { Asset } from '../types';

interface Props {
  allAssets: Asset[];
}

const MarketAnalysisPanel: React.FC<Props> = ({ allAssets }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<Asset | null>(null);
  
  // Default first two assets for comparison
  const [compareA, setCompareA] = useState<string>('');
  const [compareB, setCompareB] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  
  const chartRef = useRef<SVGSVGElement>(null);

  // Top Lists Memoized
  const topByPrice = useMemo(() => getTopAssets(allAssets, 'price', 5), [allAssets]);
  const topByGain = useMemo(() => getTopAssets(allAssets, 'change', 5), [allAssets]);

  // Default selection effect
  useEffect(() => {
    if (allAssets.length > 0 && !compareA) {
      setCompareA(allAssets[0].ticker);
      setCompareB(allAssets[1]?.ticker || allAssets[0].ticker);
    }
  }, [allAssets, compareA]);

  const filteredAssets = allAssets.filter(a => 
    a.ticker.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    setIsDownloading(true);
    // ------------------------------------------------------------------
    // INTEGRACIÓN BACKEND: POST /api/download_data
    // ------------------------------------------------------------------
    // Ejecuta el script `scripts/download_data.py` en el servidor
    // para actualizar precios vía Yahoo Finance.
    setTimeout(() => setIsDownloading(false), 2000);
  };

  useEffect(() => {
    if (!chartRef.current || !compareA || !compareB) return;
    
    // Find asset info
    const assetA = allAssets.find(a => a.ticker === compareA);
    const assetB = allAssets.find(a => a.ticker === compareB);

    // Generate histories based on their current price
    const histA = generateHistory(assetA?.price || 100, 30);
    const histB = generateHistory(assetB?.price || 100, 30);

    // Normalize data (percentage change from start)
    const dataA = histA.map(d => ({ ...d, val: (d.price - histA[0].price)/histA[0].price }));
    const dataB = histB.map(d => ({ ...d, val: (d.price - histB[0].price)/histB[0].price }));
    
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const width = chartRef.current.clientWidth;
    const height = chartRef.current.clientHeight;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const x = d3.scaleTime()
      .domain(d3.extent(histA, d => new Date(d.date)) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([
        Math.min(d3.min(dataA, d => d.val)!, d3.min(dataB, d => d.val)!),
        Math.max(d3.max(dataA, d => d.val)!, d3.max(dataB, d => d.val)!)
      ])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line<any>()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.val))
      .curve(d3.curveMonotoneX);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr("color", "#64748b");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d => `${(d.valueOf() * 100).toFixed(0)}%`))
      .attr("color", "#64748b");

    // Line A
    svg.append("path")
      .datum(dataA)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6") 
      .attr("stroke-width", 2)
      .attr("d", line);

    // Line B
    svg.append("path")
      .datum(dataB)
      .attr("fill", "none")
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 2)
      .attr("d", line);
      
  }, [compareA, compareB, allAssets]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
      
      {/* Sidebar: Top Assets & Ingest */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 overflow-y-auto pr-2">
        {/* Sync Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-400" /> Ingesta de Datos
            </h3>
            <span className="text-[10px] text-green-500 bg-green-900/20 px-2 py-0.5 rounded border border-green-900">Online</span>
          </div>
          <p className="text-slate-400 text-xs mb-3 leading-relaxed">
            Conexión con <code>scripts/download_data.py</code> para Yahoo Finance.
          </p>
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-blue-200 text-xs rounded border border-slate-700 flex items-center justify-center gap-2 transition-all"
          >
            {isDownloading ? <RefreshCw className="animate-spin w-3 h-3" /> : <Download className="w-3 h-3" />}
            {isDownloading ? 'Sincronizando...' : 'Actualizar Precios'}
          </button>
        </div>

        {/* Top Price */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-yellow-500" /> Top 5 Más Valiosos
          </h3>
          <div className="space-y-2">
            {topByPrice.map((a, i) => (
              <div key={a.ticker} className="flex justify-between items-center text-xs p-2 bg-slate-950/50 rounded border border-slate-800/50 hover:border-slate-700">
                <span className="font-mono text-slate-400 font-bold w-6">{i+1}</span>
                <span className="font-bold text-slate-200 flex-1">{a.ticker}</span>
                <span className="text-yellow-100/80 font-mono">${a.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Gainers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-green-500" /> Top 5 Ganadores
          </h3>
          <div className="space-y-2">
            {topByGain.map((a, i) => (
              <div key={a.ticker} className="flex justify-between items-center text-xs p-2 bg-slate-950/50 rounded border border-slate-800/50 hover:border-slate-700">
                <span className="font-mono text-slate-400 font-bold w-6">{i+1}</span>
                <span className="font-bold text-slate-200 flex-1">{a.ticker}</span>
                <span className="text-green-400 font-mono flex items-center gap-1">
                   <ArrowUpRight className="w-3 h-3" /> {a.change.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Search & Compare */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
        
        {/* Search Detail Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 min-h-[200px]">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-blue-400" /> Buscador de Precios y Detalles
          </h3>
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Buscar ticker para ver detalles (ej. AAPL, BAP)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchTerm && (
              <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-700 rounded-lg mt-1 z-20 max-h-60 overflow-y-auto shadow-2xl">
                {filteredAssets.map(asset => (
                  <div 
                    key={asset.ticker}
                    onClick={() => { setSearchResult(asset); setSearchTerm(''); }}
                    className="p-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center border-b border-slate-700/50 last:border-0"
                  >
                    <div>
                        <span className="font-bold text-white block">{asset.ticker}</span>
                        <span className="text-slate-400 text-xs">{asset.name}</span>
                    </div>
                    <span className="font-mono text-slate-300">${asset.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {searchResult ? (
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 animate-in fade-in flex flex-col md:flex-row justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-4xl font-bold text-white tracking-tight">{searchResult.ticker}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${searchResult.change >= 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {searchResult.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {searchResult.change}%
                    </span>
                </div>
                <p className="text-lg text-slate-400 mb-4">{searchResult.name}</p>
                
                <div className="flex gap-3">
                    <span className="px-3 py-1 bg-slate-900 rounded-full text-xs text-slate-400 border border-slate-800">{searchResult.region}</span>
                    <span className="px-3 py-1 bg-slate-900 rounded-full text-xs text-slate-400 border border-slate-800">{searchResult.sector}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-slate-500 text-sm block mb-1">Precio Actual</span>
                <div className="text-5xl font-mono font-bold text-white">${searchResult.price.toFixed(2)}</div>
                <div className="text-xs text-slate-500 mt-2">Datos simulados desde Parquet</div>
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-lg">
              Selecciona un activo para ver su ficha técnica completa
            </div>
          )}
        </div>

        {/* Comparator */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col flex-1 min-h-[400px]">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
            <BarChart2 className="w-5 h-5 text-blue-400" /> Comparador de Activos (Correlación Visual)
          </h3>
          
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="text-xs text-blue-400 font-bold mb-1 block">Activo A (Azul)</label>
              <select 
                value={compareA} 
                onChange={(e) => setCompareA(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {allAssets.map(a => <option key={a.ticker} value={a.ticker}>{a.ticker}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-red-400 font-bold mb-1 block">Activo B (Rojo)</label>
              <select 
                value={compareB} 
                onChange={(e) => setCompareB(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-200 focus:outline-none focus:border-red-500"
              >
                {allAssets.map(a => <option key={a.ticker} value={a.ticker}>{a.ticker}</option>)}
              </select>
            </div>
          </div>

          <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 relative min-h-[250px]">
            <svg ref={chartRef} className="absolute inset-0 w-full h-full"></svg>
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-500 px-2">
            <span>Inicio del Periodo (-30d)</span>
            <span>Hoy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysisPanel;