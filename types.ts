export interface Asset {
  ticker: string;
  name: string;
  region: 'Norteamérica' | 'Latinoamérica' | 'Europa' | 'Asia Pacífico' | 'Mercados Emergentes';
  sector: string;
  price: number;
  change: number;
}

export interface HistoricalDataPoint {
  date: string;
  price: number;
}

export interface AssetData {
  asset: Asset;
  history: HistoricalDataPoint[];
}

export interface Edge {
  source: string;
  target: string;
  weight: number; // Covarianza
}

export interface OptimizationResult {
  path: string[];
  totalRisk: number;
}

export interface BacktestConfig {
  strategy: 'EQUAL_WEIGHT' | 'FLOYD_WARSHALL_OPTIMIZED';
  periodDays: number;
  initialCapital: number;
}

export interface BacktestResult {
  totalReturnPct: number;
  finalBalance: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  equityCurve: { date: string; value: number; benchmarkValue: number }[];
}

export enum ViewState {
  GRAPH = 'GRAPH',
  MATRIX = 'MATRIX',
  OPTIMIZATION = 'OPTIMIZATION',
  BACKTEST = 'BACKTEST',
  MARKET_DATA = 'MARKET_DATA'
}