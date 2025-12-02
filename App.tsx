import React, { useState, useEffect } from 'react';
import { Share2, Grid, Activity, Box, BarChart, FileText, Database } from 'lucide-react';
import { Asset, AssetData, ViewState, OptimizationResult } from './types';
import { fetchAvailableAssets, generateHistory, buildGraph, runFloydWarshall } from './services/financeEngine';
import AssetSelector from './components/AssetSelector';
import CovarianceMatrix from './components/CovarianceMatrix';
import NetworkGraph from './components/NetworkGraph';
import OptimizationPanel from './components/OptimizationPanel';
import BacktestPanel from './components/BacktestPanel';
import MarketAnalysisPanel from './components/MarketAnalysisPanel';

const App: React.FC = () => {
  // Global Asset State (Loaded from Backend / Parquet)
  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [isAssetsLoading, setIsAssetsLoading] = useState(true);

  // User Selection State
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  
  // View and Process State
  const [view, setView] = useState<ViewState>(ViewState.GRAPH);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [graphData, setGraphData] = useState<{nodes: string[], edges: any[], matrix: number[][]} | null>(null);

  // 1. Initial Data Load
  // Calls `fetchAvailableAssets` which bridges to `src/api.py` -> `/api/assets`
  useEffect(() => {
    const loadAssets = async () => {
      setIsAssetsLoading(true);
      try {
        const assets = await fetchAvailableAssets();
        setAllAssets(assets);
        // Default selection for immediate visual feedback
        setSelectedTickers(['AAPL', 'MSFT', 'BAP', 'SAP.DE', '005930.KS']);
      } catch (error) {
        console.error("Error loading assets:", error);
      } finally {
        setIsAssetsLoading(false);
      }
    };
    loadAssets();
  }, []);

  // 2. Rebuild Graph on Selection Change
  // Calls `buildGraph` which bridges to `src/api.py` -> `/api/graph` (compute_covariance_matrix)
  useEffect(() => {
    const updateGraph = async () => {
      if (selectedTickers.length === 0 || allAssets.length === 0) {
        setGraphData(null);
        return;
      }

      // In a real app, `generateHistory` would fetch actual time-series from the backend for the selected assets
      const activeAssetsData: AssetData[] = allAssets
        .filter(a => selectedTickers.includes(a.ticker))
        .map(asset => ({
          asset,
          history: generateHistory(asset.price) 
        }));

      const data = await buildGraph(activeAssetsData);
      setGraphData(data);
    };

    updateGraph();
  }, [selectedTickers, allAssets]);

  const toggleAsset = (ticker: string) => {
    setSelectedTickers(prev => 
      prev.includes(ticker) 
        ? prev.filter(t => t !== ticker)
        : [...prev, ticker]
    );
    setOptimizationResult(null); // Reset optimization on graph change
  };

  const handleOptimization = async () => {
    if (!graphData) return;
    setIsCalculating(true);
    
    // Simulate computational delay or Network RTT to Python Backend
    // Calls `runFloydWarshall` -> `src/api.py` -> `/api/optimize`
    setTimeout(async () => {
      const result = await runFloydWarshall(graphData.matrix, graphData.nodes);
      setOptimizationResult(result);
      setIsCalculating(false);
    }, 800);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <AssetSelector 
        assets={allAssets}
        selectedTickers={selectedTickers} 
        onToggle={toggleAsset} 
        isLoading={isAssetsLoading}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-red-600 to-red-800 p-2 rounded-lg shadow-lg shadow-red-900/20">
                <Box className="w-5 h-5 text-white" />
             </div>
             <div>
               <h1 className="text-lg font-bold tracking-tight">Portfolio Optimizer</h1>
               <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                 <Database className="w-3 h-3" /> MOTOR DE DATOS: {isAssetsLoading ? 'OFFLINE' : 'ONLINE (PARQUET)'}
               </div>
             </div>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 overflow-x-auto">
            <button 
              onClick={() => setView(ViewState.GRAPH)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${view === ViewState.GRAPH ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Share2 className="w-4 h-4" /> Grafo
            </button>
            <button 
              onClick={() => setView(ViewState.MATRIX)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${view === ViewState.MATRIX ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Grid className="w-4 h-4" /> Matriz
            </button>
            <button 
              onClick={() => setView(ViewState.OPTIMIZATION)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${view === ViewState.OPTIMIZATION ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Activity className="w-4 h-4" /> Optimizador
            </button>
            <div className="w-px bg-slate-700 mx-1 h-6 self-center"></div>
             <button 
              onClick={() => setView(ViewState.BACKTEST)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${view === ViewState.BACKTEST ? 'bg-purple-900/50 text-purple-200 border border-purple-700/50' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <BarChart className="w-4 h-4" /> Backtesting
            </button>
             <button 
              onClick={() => setView(ViewState.MARKET_DATA)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${view === ViewState.MARKET_DATA ? 'bg-blue-900/50 text-blue-200 border border-blue-700/50' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <FileText className="w-4 h-4" /> Mercado
            </button>
          </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 p-6 overflow-hidden relative">
          
          {view === ViewState.GRAPH && (
            <div className="h-full flex flex-col animate-in fade-in duration-300">
               <div className="mb-4 flex items-center justify-between">
                 <h2 className="text-xl font-semibold">Topología de Red de Mercado</h2>
                 <span className="text-sm text-slate-400 px-3 py-1 bg-slate-900 rounded border border-slate-800">
                   {graphData ? `${graphData.nodes.length} Nodos Activos • ${graphData.edges.length} Aristas` : 'Seleccione activos...'}
                 </span>
               </div>
               <div className="flex-1 border border-slate-800 rounded-xl shadow-2xl shadow-black overflow-hidden relative bg-slate-950">
                 {graphData && graphData.nodes.length > 0 ? (
                   <NetworkGraph 
                      nodes={graphData.nodes} 
                      edges={graphData.edges} 
                      highlightPath={optimizationResult?.path}
                   />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                     <p>Seleccione activos de la barra lateral para construir el grafo.</p>
                   </div>
                 )}
                 {optimizationResult && (
                    <div className="absolute bottom-6 left-6 bg-slate-900/90 border border-green-500/30 p-4 rounded-lg backdrop-blur shadow-xl">
                      <div className="text-xs text-green-400 font-bold uppercase mb-1">Ruta Óptima Hallada</div>
                      <div className="text-sm font-mono text-white">
                        {optimizationResult.path.join(' → ')}
                      </div>
                    </div>
                 )}
               </div>
            </div>
          )}

          {view === ViewState.MATRIX && graphData && (
            <div className="h-full animate-in fade-in duration-300">
               <CovarianceMatrix nodes={graphData.nodes} matrix={graphData.matrix} />
            </div>
          )}

          {view === ViewState.OPTIMIZATION && (
            <div className="h-full animate-in fade-in duration-300">
              <OptimizationPanel 
                result={optimizationResult} 
                onRun={handleOptimization}
                isCalculating={isCalculating}
              />
            </div>
          )}

          {view === ViewState.BACKTEST && (
            <div className="h-full animate-in fade-in duration-300">
              <BacktestPanel 
                selectedTickers={selectedTickers}
                optimizedPath={optimizationResult?.path}
                allAssets={allAssets}
              />
            </div>
          )}

          {view === ViewState.MARKET_DATA && (
             <div className="h-full animate-in fade-in duration-300">
               <MarketAnalysisPanel allAssets={allAssets} />
             </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;