import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { PlayCircle, Settings, TrendingUp, AlertTriangle, PieChart, Activity } from 'lucide-react';
import { runBacktest } from '../services/financeEngine';
import { BacktestResult, BacktestConfig, Asset } from '../types';

interface Props {
  selectedTickers: string[];
  optimizedPath: string[] | undefined;
  allAssets: Asset[];
}

const BacktestPanel: React.FC<Props> = ({ selectedTickers, optimizedPath, allAssets }) => {
  const [config, setConfig] = useState<BacktestConfig>({
    strategy: 'EQUAL_WEIGHT',
    periodDays: 90,
    initialCapital: 10000
  });
  
  const [targetAssets, setTargetAssets] = useState<string[]>(selectedTickers);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (config.strategy === 'FLOYD_WARSHALL_OPTIMIZED' && optimizedPath && optimizedPath.length > 0) {
      setTargetAssets(optimizedPath);
    } else {
      setTargetAssets(selectedTickers);
    }
  }, [config.strategy, selectedTickers, optimizedPath]);

  const handleRun = async () => {
    setIsRunning(true);
    // Simulating calculation delay
    setTimeout(async () => {
      const res = await runBacktest(targetAssets, config, allAssets);
      setResult(res);
      setIsRunning(false);
    }, 1000);
  };

  useEffect(() => {
    if (!result || !chartRef.current) return;

    const data = result.equityCurve;
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const width = chartRef.current.clientWidth;
    const height = chartRef.current.clientHeight;
    const margin = { top: 20, right: 20, bottom: 30, left: 60 };

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.date)) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([
        d3.min(data, d => Math.min(d.value, d.benchmarkValue))!, 
        d3.max(data, d => Math.max(d.value, d.benchmarkValue))!
      ])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line<any>()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    const benchmarkLine = d3.line<any>()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.benchmarkValue))
      .curve(d3.curveMonotoneX);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr("color", "#94a3b8");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d => `$${(d.valueOf() / 1000).toFixed(1)}k`))
      .attr("color", "#94a3b8");

    svg.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ""));

    const path = svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#10b981") 
      .attr("stroke-width", 2.5)
      .attr("d", line);

    const totalLength = path.node()!.getTotalLength();
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#64748b")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4,4")
      .attr("d", benchmarkLine);

    // Legend
    svg.append("circle").attr("cx", width - 150).attr("cy", 20).attr("r", 4).style("fill", "#10b981");
    svg.append("text").attr("x", width - 140).attr("y", 20).text("Estrategia").style("font-size", "11px").attr("alignment-baseline","middle").attr("fill", "#cbd5e1");
    svg.append("circle").attr("cx", width - 150).attr("cy", 35).attr("r", 4).style("fill", "#64748b");
    svg.append("text").attr("x", width - 140).attr("y", 35).text("Benchmark (5% Anual)").style("font-size", "11px").attr("alignment-baseline","middle").attr("fill", "#cbd5e1");

  }, [result]);

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold">Configuración de Backtesting</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Activos Objetivo</label>
            <select 
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-200"
              value={config.strategy}
              onChange={(e) => setConfig({...config, strategy: e.target.value as any})}
            >
              <option value="EQUAL_WEIGHT">Selección Actual ({selectedTickers.length})</option>
              {optimizedPath && optimizedPath.length > 0 && (
                <option value="FLOYD_WARSHALL_OPTIMIZED">Ruta Floyd-Warshall ({optimizedPath.length})</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Periodo Histórico</label>
            <select 
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-200"
              value={config.periodDays}
              onChange={(e) => setConfig({...config, periodDays: parseInt(e.target.value)})}
            >
              <option value={30}>1 Mes (Corto Plazo)</option>
              <option value={90}>3 Meses (Mediano Plazo)</option>
              <option value={180}>6 Meses (Largo Plazo)</option>
              <option value={365}>1 Año (Ciclo Completo)</option>
            </select>
          </div>

          <div>
             <label className="block text-xs font-bold text-slate-400 mb-1">Capital Inicial ($)</label>
             <input 
               type="number" 
               className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-200"
               value={config.initialCapital}
               onChange={(e) => setConfig({...config, initialCapital: parseInt(e.target.value)})}
             />
          </div>

          <button 
            onClick={handleRun}
            disabled={isRunning || targetAssets.length === 0}
            className="h-[38px] bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white font-bold rounded flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20"
          >
            {isRunning ? <Activity className="animate-spin w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
            Iniciar Simulación
          </button>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {targetAssets.map(t => (
            <span key={t} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 font-mono">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Results */}
      {result ? (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden animate-in slide-in-from-bottom-4">
          
          {/* Metrics */}
          <div className="col-span-1 space-y-4">
            <div className={`p-4 rounded-xl border ${result.totalReturnPct >= 0 ? 'bg-green-950/20 border-green-900' : 'bg-red-950/20 border-red-900'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-bold">Retorno Total</span>
                <TrendingUp className={`w-4 h-4 ${result.totalReturnPct >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <div className={`text-3xl font-bold font-mono ${result.totalReturnPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {result.totalReturnPct > 0 ? '+' : ''}{result.totalReturnPct.toFixed(2)}%
              </div>
              <div className="text-sm text-slate-500 mt-1">
                ${(result.finalBalance - config.initialCapital).toFixed(2)} Ganancia/Pérdida
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-slate-400 text-xs font-bold block mb-1">Ratio de Sharpe</span>
                <div className="text-xl font-mono text-white">{result.sharpeRatio.toFixed(2)}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-slate-400 text-xs font-bold block mb-1">Volatilidad (Anual)</span>
                <div className="text-xl font-mono text-white">{result.volatility.toFixed(2)}%</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
               <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-bold">Caída Máxima (Drawdown)</span>
                <AlertTriangle className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl font-mono text-orange-400">-{result.maxDrawdown.toFixed(2)}%</div>
              <div className="text-xs text-slate-500 mt-1">Caída de pico a valle</div>
            </div>
          </div>

          {/* Chart */}
          <div className="col-span-1 lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Curva de Equidad vs Benchmark
            </h3>
            <div className="flex-1 relative">
               <svg ref={chartRef} className="w-full h-full absolute inset-0"></svg>
            </div>
          </div>

        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl">
          <div className="text-center">
            <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Configura e inicia la simulación para ver resultados.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BacktestPanel;