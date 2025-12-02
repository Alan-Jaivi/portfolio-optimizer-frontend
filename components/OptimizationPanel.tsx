import React, { useMemo } from 'react';
import { OptimizationResult } from '../types';
import { ArrowRight, TrendingUp, ShieldCheck, Activity, Layers } from 'lucide-react';
import { calculateCorrelation, generateHistory } from '../services/financeEngine';

interface Props {
  result: OptimizationResult | null;
  onRun: () => void;
  isCalculating: boolean;
}

const OptimizationPanel: React.FC<Props> = ({ result, onRun, isCalculating }) => {
  
  // Calcular correlaciones internas para el análisis de diversificación
  // Esto simula la llamada a `analyze_diversification` del script Python
  const diversificationAnalysis = useMemo(() => {
    if (!result || result.path.length < 2) return null;

    const pairs: {a: string, b: string, corr: number}[] = [];
    const pathAssets = result.path;

    for (let i = 0; i < pathAssets.length; i++) {
        for (let j = i + 1; j < pathAssets.length; j++) {
            // Generamos historia simulada (en prod vendría del backend)
            const histA = generateHistory(100).map(d => d.price);
            const histB = generateHistory(100).map(d => d.price);
            const corr = calculateCorrelation(histA, histB);
            pairs.push({ a: pathAssets[i], b: pathAssets[j], corr });
        }
    }
    return pairs;
  }, [result]);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Optimización de Portafolio</h2>
        <p className="text-slate-400">
          Ejecuta el algoritmo <strong>Floyd-Warshall</strong> ($O(V^3)$) para encontrar la ruta de mínima covarianza acumulada (menor riesgo sistémico) a través del grafo global.
        </p>
      </div>

      <button
        onClick={onRun}
        disabled={isCalculating}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 mb-8 shadow-lg shadow-blue-900/20"
      >
        {isCalculating ? (
          <>
            <Activity className="animate-spin" /> Procesando Matriz en Backend...
          </>
        ) : (
          <>
            <TrendingUp /> Ejecutar Algoritmo de Optimización
          </>
        )}
      </button>

      {result && result.path.length > 0 ? (
        <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          
          {/* Ruta Visual */}
          <div>
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <ShieldCheck className="text-green-500" />
                Ruta de Diversificación Óptima
            </h3>
            <div className="bg-slate-950 rounded-lg p-6 border border-slate-800">
                <div className="flex flex-wrap items-center gap-3">
                {result.path.map((ticker, index) => (
                    <React.Fragment key={ticker}>
                    <div className="bg-slate-800 px-4 py-2 rounded border border-slate-700 font-mono text-blue-200 font-bold shadow-sm">
                        {ticker}
                    </div>
                    {index < result.path.length - 1 && (
                        <ArrowRight className="text-slate-600 w-5 h-5" />
                    )}
                    </React.Fragment>
                ))}
                </div>
            </div>
          </div>

          {/* Estadísticas Generales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <span className="text-xs text-slate-500 uppercase font-bold">Riesgo Total de la Ruta</span>
              <div className="text-2xl font-mono text-white mt-1">{result.totalRisk.toFixed(4)}</div>
            </div>
             <div className="bg-slate-800/50 p-4 rounded-lg">
              <span className="text-xs text-slate-500 uppercase font-bold">Activos en Portafolio</span>
              <div className="text-2xl font-mono text-white mt-1">{result.path.length}</div>
            </div>
          </div>

          {/* Análisis de Diversificación (Nuevo) */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
            <h3 className="text-md font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <Layers className="text-purple-400 w-4 h-4" /> 
                Análisis de Diversificación (Correlación)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
                Integración con <code>src/portfolio/selector.py</code>. Pares con correlación &lt; 0.3 indican excelente diversificación.
            </p>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="text-slate-400 border-b border-slate-800">
                        <tr>
                            <th className="pb-2">Par de Activos</th>
                            <th className="pb-2">Correlación</th>
                            <th className="pb-2">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-300">
                        {diversificationAnalysis?.slice(0, 5).map((pair, idx) => (
                            <tr key={idx} className="border-b border-slate-800/50 last:border-0">
                                <td className="py-2 font-mono">{pair.a} ↔ {pair.b}</td>
                                <td className="py-2">{pair.corr.toFixed(2)}</td>
                                <td className="py-2">
                                    {Math.abs(pair.corr) < 0.3 ? (
                                        <span className="text-green-400 font-bold">Alta Diversificación</span>
                                    ) : Math.abs(pair.corr) > 0.7 ? (
                                        <span className="text-red-400">Riesgo Concentrado</span>
                                    ) : (
                                        <span className="text-yellow-500">Moderada</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {diversificationAnalysis && diversificationAnalysis.length > 5 && (
                    <p className="text-[10px] text-slate-600 mt-2 text-center italic">Mostrando primeros 5 pares...</p>
                )}
            </div>
          </div>
          
          <div className="p-4 border border-blue-900/50 bg-blue-950/20 rounded text-sm text-blue-200">
            <strong>Interpretación:</strong> Esta secuencia optimizada conecta regiones (ej. LatAm → Asia) minimizando la volatilidad conjunta. Usar esta lista para Backtesting.
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-lg">
          Sin resultados de optimización aún.
        </div>
      )}
    </div>
  );
};

export default OptimizationPanel;