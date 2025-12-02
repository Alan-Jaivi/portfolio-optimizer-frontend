import { Asset, AssetData, Edge, OptimizationResult, BacktestResult, BacktestConfig } from '../types';

// ==========================================
// CONFIGURACIÓN DE INTEGRACIÓN BACKEND (Python/FastAPI)
// ==========================================
// Establecer en FALSE para intentar usar el Backend Python real

const USE_MOCK_DATA = false;
const API_URL = "https://portfolio-optimizer-api.fly.dev/api";

//const USE_MOCK_DATA = false; 
//const API_URL = "http://localhost:8000/api"; 

// ==========================================
// DATOS SIMULADOS (Simulando Base de Datos)
// ==========================================
const MOCK_DB_ASSETS: Asset[] = [
  // Norteamérica
  { ticker: 'AAPL', name: 'Apple Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 185.50, change: 1.2 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', region: 'Norteamérica', sector: 'Tecnología', price: 420.10, change: 0.8 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 175.00, change: -0.5 },
  { ticker: 'AMZN', name: 'Amazon.com', region: 'Norteamérica', sector: 'Consumo', price: 180.20, change: 1.1 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', region: 'Norteamérica', sector: 'Semiconductores', price: 950.00, change: 3.5 },
  { ticker: 'JPM', name: 'JPMorgan Chase', region: 'Norteamérica', sector: 'Finanzas', price: 195.00, change: 0.2 },
  { ticker: 'TSLA', name: 'Tesla Inc.', region: 'Norteamérica', sector: 'Automotriz', price: 175.50, change: -2.1 },

  // Latinoamérica
  { ticker: 'BAP', name: 'Credicorp Ltd.', region: 'Latinoamérica', sector: 'Finanzas', price: 160.20, change: -0.5 },
  { ticker: 'SCCO', name: 'Southern Copper', region: 'Latinoamérica', sector: 'Minería', price: 105.50, change: 1.8 },
  { ticker: 'BVN', name: 'Buenaventura', region: 'Latinoamérica', sector: 'Minería', price: 15.20, change: -0.3 },
  { ticker: 'IFS', name: 'Intercorp Financial', region: 'Latinoamérica', sector: 'Finanzas', price: 22.10, change: 0.0 },
  { ticker: 'PETR4.SA', name: 'Petrobras', region: 'Latinoamérica', sector: 'Energía', price: 35.80, change: -1.2 },
  { ticker: 'VALE3.SA', name: 'Vale S.A.', region: 'Latinoamérica', sector: 'Minería', price: 62.40, change: 0.5 },
  { ticker: 'ITUB4.SA', name: 'Itaú Unibanco', region: 'Latinoamérica', sector: 'Finanzas', price: 32.10, change: 0.9 },
  { ticker: 'GFNORTEO', name: 'Grupo Banorte', region: 'Latinoamérica', sector: 'Finanzas', price: 155.30, change: 0.5 },
  { ticker: 'WALMEX', name: 'Walmart de México', region: 'Latinoamérica', sector: 'Consumo', price: 65.20, change: -0.1 },
  { ticker: 'AMX', name: 'América Móvil', region: 'Latinoamérica', sector: 'Telecom', price: 18.50, change: 0.2 },

  // Europa
  { ticker: 'SAP.DE', name: 'SAP SE', region: 'Europa', sector: 'Tecnología', price: 175.40, change: 0.9 },
  { ticker: 'AIR.PA', name: 'Airbus SE', region: 'Europa', sector: 'Industria', price: 140.20, change: 0.3 },
  { ticker: 'MC.PA', name: 'LVMH', region: 'Europa', sector: 'Consumo Lujo', price: 820.00, change: -1.0 },
  { ticker: 'SIE.DE', name: 'Siemens AG', region: 'Europa', sector: 'Industria', price: 165.30, change: 0.4 },
  { ticker: 'ASML.AS', name: 'ASML Holding', region: 'Europa', sector: 'Tecnología', price: 880.00, change: 2.1 },

  // Asia Pacífico
  { ticker: '7203.T', name: 'Toyota Motor', region: 'Asia Pacífico', sector: 'Automotriz', price: 3450.00, change: -0.2 },
  { ticker: '005930.KS', name: 'Samsung Elec.', region: 'Asia Pacífico', sector: 'Tecnología', price: 78000.00, change: 1.5 },
  { ticker: 'SONY', name: 'Sony Group', region: 'Asia Pacífico', sector: 'Tecnología', price: 85.00, change: 0.1 },
  { ticker: 'TSM', name: 'Taiwan Semi.', region: 'Asia Pacífico', sector: 'Semiconductores', price: 140.00, change: 2.5 },
  { ticker: 'BABA', name: 'Alibaba Group', region: 'Asia Pacífico', sector: 'Consumo', price: 72.00, change: -0.8 },
];

export const fetchAvailableAssets = async (): Promise<Asset[]> => {
  if (!USE_MOCK_DATA) {
    try {
      const response = await fetch(`${API_URL}/assets`);
      if (!response.ok) throw new Error('Backend offline');
      const data = await response.json();
      return data.assets; 
    } catch (e) {
      console.error("Error al conectar con el backend:", e);
      throw e; // ← No usar fallback: debe fallar si hay error
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_DB_ASSETS), 600);
  });
};

// ==========================================
// NUEVO: FUNCIONES DE ANÁLISIS DE MERCADO
// ==========================================

export const getTopAssets = (assets: Asset[], criteria: 'price' | 'change', limit: number = 10): Asset[] => {
  if (!USE_MOCK_DATA) {
    // ---------------------------------------------------------
    // INTEGRACIÓN BACKEND: GET /api/stats/top?criteria=...
    // ---------------------------------------------------------
    // Python usando Pandas:
    // df.sort_values(by='price', ascending=False).head(10)
  }
  
  const sorted = [...assets].sort((a, b) => {
    if (criteria === 'price') return b.price - a.price;
    if (criteria === 'change') return b.change - a.change;
    return 0;
  });
  return sorted.slice(0, limit);
};

// ==========================================
// MOTOR MATEMÁTICO
// ==========================================

// Simular Movimiento Browniano para datos históricos
// NOTA: En producción, estos datos vienen de `data/raw/prices.parquet` vía API
export const generateHistory = (startPrice: number, days: number = 30): { date: string; price: number }[] => {
  if (!USE_MOCK_DATA) {
     // ---------------------------------------------------------
     // INTEGRACIÓN BACKEND: GET /api/history/{ticker}
     // ---------------------------------------------------------
     // El backend leería el DataFrame de Pandas cargado desde Parquet
     // y retornaría la serie de tiempo real.
  }

  let currentPrice = startPrice;
  const history = [];
  const today = new Date();
  const volatility = 0.025; // 2.5% volatilidad diaria

  for (let i = days; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    // Random Walk
    const change = 1 + (Math.random() * (volatility * 2) - volatility);
    currentPrice = currentPrice * change;
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.abs(parseFloat(currentPrice.toFixed(2)))
    });
  }
  return history;
};

// Retornos Logarítmicos
const calculateLogReturns = (prices: number[]): number[] => {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const logReturn = Math.log(prices[i] / prices[i - 1]);
    returns.push(logReturn);
  }
  return returns;
};

// Cálculo de Covarianza
// NOTA: Corresponde a `src/data/processor.py` -> `compute_covariance_matrix`
export const calculateCovariance = (dataA: number[], dataB: number[]): number => {
  const returnsA = calculateLogReturns(dataA);
  const returnsB = calculateLogReturns(dataB);
  
  if (returnsA.length !== returnsB.length) return 0;
  
  const n = returnsA.length;
  const meanA = returnsA.reduce((a, b) => a + b, 0) / n;
  const meanB = returnsB.reduce((a, b) => a + b, 0) / n;
  
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += (returnsA[i] - meanA) * (returnsB[i] - meanB);
  }
  
  // Escalado para mejor visualización en pesos del grafo
  return (sum / (n - 1)) * 10000; 
};

// Cálculo de Correlación (Normalizado entre -1 y 1)
// NOTA: Usado para el análisis de diversificación
export const calculateCorrelation = (dataA: number[], dataB: number[]): number => {
  const returnsA = calculateLogReturns(dataA);
  const returnsB = calculateLogReturns(dataB);
  if (returnsA.length !== returnsB.length) return 0;

  const n = returnsA.length;
  // Medias
  const meanA = returnsA.reduce((a, b) => a + b, 0) / n;
  const meanB = returnsB.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let denA = 0;
  let denB = 0;

  for(let i=0; i<n; i++) {
      num += (returnsA[i] - meanA) * (returnsB[i] - meanB);
      denA += Math.pow(returnsA[i] - meanA, 2);
      denB += Math.pow(returnsB[i] - meanB, 2);
  }

  if (denA === 0 || denB === 0) return 0;
  return num / Math.sqrt(denA * denB);
};

// ==========================================
// ALGORITMOS
// ==========================================

export const buildGraph = async (assets: AssetData[]): Promise<{ nodes: string[], edges: Edge[], matrix: number[][] }> => {
  if (!USE_MOCK_DATA) {
    // ---------------------------------------------------------
    // INTEGRACIÓN BACKEND: POST /api/graph
    // ---------------------------------------------------------
    // 1. Envía la lista de tickers seleccionados.
    // 2. Backend ejecuta `src/data/processor.py` -> `compute_covariance_matrix(numpy_array)`.
    // 3. Retorna la matriz calculada con NumPy (mucho más rápido para grandes datasets).
  }

  // Lógica JS Local
  const nodes = assets.map(a => a.asset.ticker);
  const edges: Edge[] = [];
  const size = assets.length;
  const matrix: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i === j) {
        matrix[i][j] = Infinity; 
        continue;
      }
      const priceA = assets[i].history.map(h => h.price);
      const priceB = assets[j].history.map(h => h.price);
      const cov = Math.abs(calculateCovariance(priceA, priceB));
      
      matrix[i][j] = parseFloat(cov.toFixed(4));
      
      edges.push({
        source: nodes[i],
        target: nodes[j],
        weight: parseFloat(cov.toFixed(4))
      });
    }
  }
  return { nodes, edges, matrix };
};

// Implementación del Algoritmo Floyd-Warshall
export const runFloydWarshall = async (matrix: number[][], nodes: string[]): Promise<OptimizationResult> => {
  if (!USE_MOCK_DATA) {
    // ---------------------------------------------------------
    // INTEGRACIÓN BACKEND: POST /api/optimize
    // ---------------------------------------------------------
    // 1. Backend recibe la matriz o usa la cacheada en memoria.
    // 2. Ejecuta `src/algorithms/floyd_warshall.py` -> `floyd_warshall_optimized`.
    // 3. Usa @jit (Numba) para aceleración a código máquina.
  }

  // Implementación Local JS O(V^3)
  const n = matrix.length;
  const dist: number[][] = Array(n).fill(0).map((_, i) => [...matrix[i]]);
  const next: (number | null)[][] = Array(n).fill(0).map(() => Array(n).fill(null));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] !== Infinity) {
        next[i][j] = j;
      }
    }
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }

  let minRisk = Infinity;
  let startNode = 0;
  let endNode = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && dist[i][j] < minRisk) {
        minRisk = dist[i][j];
        startNode = i;
        endNode = j;
      }
    }
  }

  if (minRisk === Infinity) return { path: [], totalRisk: 0 };

  const pathIndices: number[] = [startNode];
  let current = startNode;
  while (current !== endNode) {
    const nxt = next[current][endNode];
    if (nxt === null) break;
    current = nxt;
    pathIndices.push(current);
  }

  return {
    path: pathIndices.map(idx => nodes[idx]),
    totalRisk: minRisk
  };
};

export const runBacktest = async (tickers: string[], config: BacktestConfig, allAssets: Asset[]): Promise<BacktestResult> => {
  // NOTA: Esta lógica también podría vivir en un endpoint Python `/api/backtest` usando librerías como `backtrader` o `zipline`.
  
  // 1. Obtener Historia
  const assetsWithHistory = tickers.map(t => {
    const assetInfo = allAssets.find(a => a.ticker === t);
    const basePrice = assetInfo ? assetInfo.price : 100;
    return {
      ticker: t,
      history: generateHistory(basePrice, config.periodDays)
    };
  });

  if (assetsWithHistory.length === 0) {
    return {
      totalReturnPct: 0,
      finalBalance: config.initialCapital,
      sharpeRatio: 0,
      maxDrawdown: 0,
      volatility: 0,
      equityCurve: []
    };
  }

  // 2. Simular Portafolio Equiponderado
  const initialWeight = 1 / tickers.length;
  // Calcular cuántas acciones podemos comprar el día 0
  const shares = assetsWithHistory.map(a => (config.initialCapital * initialWeight) / a.history[0].price);

  const equityCurve = [];
  let maxPeak = 0;
  let maxDrawdown = 0;

  for (let i = 0; i < config.periodDays; i++) {
    let dailyTotal = 0;
    assetsWithHistory.forEach((asset, idx) => {
      // Valor Actual = Precio en el día i * Acciones mantenidas
      dailyTotal += asset.history[i].price * shares[idx];
    });

    // Benchmark (Crecimiento lineal del 5% anual)
    const benchmarkVal = config.initialCapital * (1 + (0.05 / 365) * i);

    if (dailyTotal > maxPeak) maxPeak = dailyTotal;
    const drawdown = (maxPeak - dailyTotal) / maxPeak;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;

    equityCurve.push({
      date: assetsWithHistory[0].history[i].date,
      value: dailyTotal,
      benchmarkValue: benchmarkVal
    });
  }

  const finalBalance = equityCurve[equityCurve.length - 1].value;
  const totalReturnPct = ((finalBalance - config.initialCapital) / config.initialCapital) * 100;
  
  // Métricas de Riesgo
  const dailyReturns = [];
  for(let i=1; i<equityCurve.length; i++) {
    const r = (equityCurve[i].value - equityCurve[i-1].value) / equityCurve[i-1].value;
    dailyReturns.push(r);
  }
  
  const meanReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / dailyReturns.length;
  const stdDev = Math.sqrt(variance); 
  const annualizedVol = stdDev * Math.sqrt(252);
  const sharpeRatio = (meanReturn * 252) / (annualizedVol || 1); // Evitar div/0

  return {
    totalReturnPct,
    finalBalance,
    sharpeRatio,
    maxDrawdown: maxDrawdown * 100,
    volatility: annualizedVol * 100,
    equityCurve
  };
};