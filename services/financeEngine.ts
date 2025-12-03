import { Asset, AssetData, Edge, OptimizationResult, BacktestResult, BacktestConfig } from '../types';

// ==========================================
// CONFIGURACIÓN DE INTEGRACIÓN BACKEND (Python/FastAPI)
// ==========================================
// Establecer en FALSE para intentar usar el Backend Python real
const USE_MOCK_DATA = true; 
const API_URL = "http://localhost:8000/api"; 

// ==========================================
// DATOS  
// ==========================================

const MOCK_DB_ASSETS: Asset[] = [
  // Norteaméricacd ..
  { ticker: 'AAPL', name: 'Apple Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 185.50, change: 1.2 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', region: 'Norteamérica', sector: 'Tecnología', price: 420.10, change: 0.8 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 175.00, change: -0.5 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', region: 'Norteamérica', sector: 'Consumo', price: 180.20, change: 1.1 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', region: 'Norteamérica', sector: 'Semiconductores', price: 950.00, change: 3.5 },
  { ticker: 'META', name: 'Meta Platforms', region: 'Norteamérica', sector: 'Tecnología', price: 310.50, change: -0.4 },
  { ticker: 'TSLA', name: 'Tesla Inc.', region: 'Norteamérica', sector: 'Automotriz', price: 175.50, change: -2.1 },
  { ticker: 'BRK.B', name: 'Berkshire Hathaway', region: 'Norteamérica', sector: 'Finanzas', price: 405.30, change: 0.3 },
  { ticker: 'JPM', name: 'JPMorgan Chase', region: 'Norteamérica', sector: 'Finanzas', price: 195.00, change: 0.2 },
  { ticker: 'V', name: 'Visa Inc.', region: 'Norteamérica', sector: 'Finanzas', price: 285.40, change: 1.0 },

  // ---- SECTOR TECNOLÓGICO ----
  { ticker: 'ADBE', name: 'Adobe Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 560.10, change: 0.9 },
  { ticker: 'NFLX', name: 'Netflix Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 410.90, change: -0.3 },
  { ticker: 'INTC', name: 'Intel Corp.', region: 'Norteamérica', sector: 'Semiconductores', price: 45.30, change: 0.1 },
  { ticker: 'AMD', name: 'Advanced Micro Devices', region: 'Norteamérica', sector: 'Semiconductores', price: 162.80, change: 0.5 },
  { ticker: 'CSCO', name: 'Cisco Systems', region: 'Norteamérica', sector: 'Tecnología', price: 52.10, change: -0.1 },
  { ticker: 'CRM', name: 'Salesforce Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 275.20, change: 2.0 },
  { ticker: 'IBM', name: 'IBM', region: 'Norteamérica', sector: 'Tecnología', price: 173.00, change: 0.4 },
  { ticker: 'ORCL', name: 'Oracle Corp.', region: 'Norteamérica', sector: 'Tecnología', price: 126.20, change: 0.3 },
  { ticker: 'UBER', name: 'Uber Technologies', region: 'Norteamérica', sector: 'Tecnología', price: 77.10, change: 1.8 },

  // ---- SECTOR ENERGÍA ----
  { ticker: 'XOM', name: 'Exxon Mobil', region: 'Norteamérica', sector: 'Energía', price: 112.40, change: -0.6 },
  { ticker: 'CVX', name: 'Chevron Corp.', region: 'Norteamérica', sector: 'Energía', price: 155.10, change: 0.2 },
  { ticker: 'COP', name: 'ConocoPhillips', region: 'Norteamérica', sector: 'Energía', price: 122.90, change: 1.3 },
  { ticker: 'SLB', name: 'Schlumberger', region: 'Norteamérica', sector: 'Energía', price: 47.80, change: -1.0 },
  { ticker: 'HAL', name: 'Halliburton', region: 'Norteamérica', sector: 'Energía', price: 38.60, change: -0.4 },

  // ---- SECTOR SALUD ----
  { ticker: 'JNJ', name: 'Johnson & Johnson', region: 'Norteamérica', sector: 'Salud', price: 165.40, change: 0.1 },
  { ticker: 'PFE', name: 'Pfizer Inc.', region: 'Norteamérica', sector: 'Salud', price: 28.30, change: -0.2 },
  { ticker: 'MRK', name: 'Merck & Co.', region: 'Norteamérica', sector: 'Salud', price: 125.90, change: 0.5 },
  { ticker: 'ABT', name: 'Abbott Laboratories', region: 'Norteamérica', sector: 'Salud', price: 103.40, change: -0.1 },
  { ticker: 'TMO', name: 'Thermo Fisher', region: 'Norteamérica', sector: 'Salud', price: 512.10, change: 1.2 },

  // ---- SECTOR FINANZAS ----
  { ticker: 'MA', name: 'Mastercard Inc.', region: 'Norteamérica', sector: 'Finanzas', price: 430.80, change: 0.7 },
  { ticker: 'BAC', name: 'Bank of America', region: 'Norteamérica', sector: 'Finanzas', price: 33.90, change: -0.3 },
  { ticker: 'WFC', name: 'Wells Fargo', region: 'Norteamérica', sector: 'Finanzas', price: 47.50, change: 0.2 },
  { ticker: 'C', name: 'Citigroup Inc.', region: 'Norteamérica', sector: 'Finanzas', price: 54.40, change: 0.0 },
  { ticker: 'MS', name: 'Morgan Stanley', region: 'Norteamérica', sector: 'Finanzas', price: 95.10, change: 0.5 },

  // ---- SECTOR CONSUMO ----
  { ticker: 'WMT', name: 'Walmart Inc.', region: 'Norteamérica', sector: 'Consumo', price: 160.20, change: -0.1 },
  { ticker: 'HD', name: 'Home Depot', region: 'Norteamérica', sector: 'Retail', price: 350.50, change: 0.4 },
  { ticker: 'COST', name: 'Costco Wholesale', region: 'Norteamérica', sector: 'Retail', price: 705.80, change: 0.8 },
  { ticker: 'KO', name: 'Coca-Cola', region: 'Norteamérica', sector: 'Bebidas', price: 58.90, change: -0.2 },
  { ticker: 'PEP', name: 'PepsiCo', region: 'Norteamérica', sector: 'Bebidas', price: 174.60, change: 0.3 },

  // ---- SECTOR AEROESPACIAL / DEFENSA ----
  { ticker: 'LMT', name: 'Lockheed Martin', region: 'Norteamérica', sector: 'Defensa', price: 459.40, change: 0.6 },
  { ticker: 'BA', name: 'Boeing Co.', region: 'Norteamérica', sector: 'Aeroespacial', price: 205.20, change: -0.7 },
  { ticker: 'RTX', name: 'RTX Corp.', region: 'Norteamérica', sector: 'Defensa', price: 89.50, change: 0.2 },
/////////////////////////////////////////////////////////


  { ticker: 'FDX', name: 'FedEx Corp.', region: 'Norteamérica', sector: 'Logística', price: 260.50, change: 0.4 },
  { ticker: 'UPS', name: 'United Parcel Service', region: 'Norteamérica', sector: 'Logística', price: 152.80, change: -0.5 },
  { ticker: 'T', name: 'AT&T Inc.', region: 'Norteamérica', sector: 'Telecomunicaciones', price: 17.20, change: 0.1 },
  { ticker: 'VZ', name: 'Verizon Communications', region: 'Norteamérica', sector: 'Telecomunicaciones', price: 36.90, change: -0.2 },
  { ticker: 'CMCSA', name: 'Comcast', region: 'Norteamérica', sector: 'Telecomunicaciones', price: 43.70, change: 0.2 },
  { ticker: 'DIS', name: 'Walt Disney', region: 'Norteamérica', sector: 'Entretenimiento', price: 98.40, change: -0.4 },
  { ticker: 'MCD', name: 'McDonald’s', region: 'Norteamérica', sector: 'Restaurantes', price: 292.10, change: 0.3 },
  { ticker: 'SBUX', name: 'Starbucks', region: 'Norteamérica', sector: 'Restaurantes', price: 92.80, change: -0.3 },

  { ticker: 'NKE', name: 'Nike Inc.', region: 'Norteamérica', sector: 'Consumo', price: 102.30, change: 0.4 },
  { ticker: 'VFC', name: 'VF Corp.', region: 'Norteamérica', sector: 'Consumo', price: 18.20, change: -0.8 },
  { ticker: 'TJX', name: 'TJX Companies', region: 'Norteamérica', sector: 'Retail', price: 98.10, change: 0.1 },
  { ticker: 'TGT', name: 'Target Corp.', region: 'Norteamérica', sector: 'Retail', price: 141.80, change: 0.5 },
  { ticker: 'LOW', name: 'Lowe’s', region: 'Norteamérica', sector: 'Retail', price: 215.50, change: 0.3 },
  { ticker: 'BBY', name: 'Best Buy', region: 'Norteamérica', sector: 'Retail', price: 75.40, change: -0.5 },
  { ticker: 'ROST', name: 'Ross Stores', region: 'Norteamérica', sector: 'Retail', price: 145.30, change: 0.2 },
  { ticker: 'EBAY', name: 'eBay Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 47.60, change: 0.1 },
  { ticker: 'PYPL', name: 'PayPal Holdings', region: 'Norteamérica', sector: 'Fintech', price: 60.10, change: -0.4 },
  { ticker: 'SQ', name: 'Block Inc.', region: 'Norteamérica', sector: 'Fintech', price: 78.40, change: 1.6 },
  { ticker: 'SHOP', name: 'Shopify Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 86.30, change: 1.1 },
  { ticker: 'SNOW', name: 'Snowflake Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 185.20, change: -0.6 },
  { ticker: 'PANW', name: 'Palo Alto Networks', region: 'Norteamérica', sector: 'Ciberseguridad', price: 327.80, change: 0.9 },
  { ticker: 'CRWD', name: 'CrowdStrike', region: 'Norteamérica', sector: 'Ciberseguridad', price: 312.10, change: 1.8 },
  { ticker: 'ZS', name: 'Zscaler', region: 'Norteamérica', sector: 'Ciberseguridad', price: 178.20, change: -0.7 },
  { ticker: 'NET', name: 'Cloudflare', region: 'Norteamérica', sector: 'Tecnología', price: 90.50, change: 0.5 },
  { ticker: 'DDOG', name: 'Datadog', region: 'Norteamérica', sector: 'Tecnología', price: 128.70, change: 1.3 },
  { ticker: 'MDB', name: 'MongoDB', region: 'Norteamérica', sector: 'Tecnología', price: 370.80, change: -1.2 },
  { ticker: 'U', name: 'Unity Software', region: 'Norteamérica', sector: 'Tecnología', price: 28.90, change: 0.4 },
  { ticker: 'ROKU', name: 'Roku Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 68.30, change: -0.8 },

  // ---- INDUSTRIAL / MANUFACTURA ----
  { ticker: 'CAT', name: 'Caterpillar Inc.', region: 'Norteamérica', sector: 'Industria', price: 330.20, change: 0.3 },
  { ticker: 'DE', name: 'John Deere', region: 'Norteamérica', sector: 'Industria', price: 385.10, change: -0.2 },
  { ticker: 'MMM', name: '3M Company', region: 'Norteamérica', sector: 'Industria', price: 92.40, change: 0.1 },
  { ticker: 'GE', name: 'General Electric', region: 'Norteamérica', sector: 'Industria', price: 155.20, change: 0.9 },
  { ticker: 'HON', name: 'Honeywell Intl.', region: 'Norteamérica', sector: 'Industria', price: 204.40, change: 0.4 },
  { ticker: 'ETN', name: 'Eaton Corp.', region: 'Norteamérica', sector: 'Industria', price: 302.70, change: 1.2 },
  { ticker: 'EMR', name: 'Emerson Electric', region: 'Norteamérica', sector: 'Industria', price: 100.10, change: -0.1 },
  { ticker: 'PCAR', name: 'Paccar Inc.', region: 'Norteamérica', sector: 'Automotriz', price: 108.40, change: 0.3 },
  { ticker: 'GM', name: 'General Motors', region: 'Norteamérica', sector: 'Automotriz', price: 38.90, change: -0.4 },
  { ticker: 'F', name: 'Ford Motor Co.', region: 'Norteamérica', sector: 'Automotriz', price: 12.30, change: -0.1 },

  // ---- AEROLÍNEAS ----
  { ticker: 'DAL', name: 'Delta Air Lines', region: 'Norteamérica', sector: 'Aerolíneas', price: 42.10, change: 0.6 },
  { ticker: 'AAL', name: 'American Airlines', region: 'Norteamérica', sector: 'Aerolíneas', price: 12.50, change: -1.0 },
  { ticker: 'UAL', name: 'United Airlines', region: 'Norteamérica', sector: 'Aerolíneas', price: 46.80, change: 0.4 },
  { ticker: 'LUV', name: 'Southwest Airlines', region: 'Norteamérica', sector: 'Aerolíneas', price: 28.40, change: -0.3 },
  { ticker: 'JBLU', name: 'JetBlue Airways', region: 'Norteamérica', sector: 'Aerolíneas', price: 5.90, change: 0.2 },

  // ---- MINERÍA / MATERIALES ----
  { ticker: 'NEM', name: 'Newmont Corp.', region: 'Norteamérica', sector: 'Minería', price: 38.70, change: 0.1 },
  { ticker: 'FCX', name: 'Freeport-McMoRan', region: 'Norteamérica', sector: 'Minería', price: 48.30, change: -0.2 },
  { ticker: 'MOS', name: 'Mosaic Co.', region: 'Norteamérica', sector: 'Materias Primas', price: 31.10, change: 0.6 },
  { ticker: 'LYB', name: 'LyondellBasell', region: 'Norteamérica', sector: 'Químicos', price: 98.70, change: 0.3 },
  { ticker: 'APD', name: 'Air Products & Chemicals', region: 'Norteamérica', sector: 'Químicos', price: 235.50, change: 0.2 },
{ ticker: 'NKE', name: 'Nike Inc.', region: 'Norteamérica', sector: 'Consumo', price: 102.30, change: 0.4 },
  { ticker: 'VFC', name: 'VF Corp.', region: 'Norteamérica', sector: 'Consumo', price: 18.20, change: -0.8 },
  { ticker: 'TJX', name: 'TJX Companies', region: 'Norteamérica', sector: 'Retail', price: 98.10, change: 0.1 },
  { ticker: 'TGT', name: 'Target Corp.', region: 'Norteamérica', sector: 'Retail', price: 141.80, change: 0.5 },
  { ticker: 'LOW', name: 'Lowe’s', region: 'Norteamérica', sector: 'Retail', price: 215.50, change: 0.3 },
  { ticker: 'BBY', name: 'Best Buy', region: 'Norteamérica', sector: 'Retail', price: 75.40, change: -0.5 },
  { ticker: 'ROST', name: 'Ross Stores', region: 'Norteamérica', sector: 'Retail', price: 145.30, change: 0.2 },
  { ticker: 'EBAY', name: 'eBay Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 47.60, change: 0.1 },
  { ticker: 'PYPL', name: 'PayPal Holdings', region: 'Norteamérica', sector: 'Fintech', price: 60.10, change: -0.4 },
  { ticker: 'SQ', name: 'Block Inc.', region: 'Norteamérica', sector: 'Fintech', price: 78.40, change: 1.6 },
  { ticker: 'SHOP', name: 'Shopify Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 86.30, change: 1.1 },
  { ticker: 'SNOW', name: 'Snowflake Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 185.20, change: -0.6 },
  { ticker: 'PANW', name: 'Palo Alto Networks', region: 'Norteamérica', sector: 'Ciberseguridad', price: 327.80, change: 0.9 },
  { ticker: 'CRWD', name: 'CrowdStrike', region: 'Norteamérica', sector: 'Ciberseguridad', price: 312.10, change: 1.8 },
  { ticker: 'ZS', name: 'Zscaler', region: 'Norteamérica', sector: 'Ciberseguridad', price: 178.20, change: -0.7 },
  { ticker: 'NET', name: 'Cloudflare', region: 'Norteamérica', sector: 'Tecnología', price: 90.50, change: 0.5 },
  { ticker: 'DDOG', name: 'Datadog', region: 'Norteamérica', sector: 'Tecnología', price: 128.70, change: 1.3 },
  { ticker: 'MDB', name: 'MongoDB', region: 'Norteamérica', sector: 'Tecnología', price: 370.80, change: -1.2 },
  { ticker: 'U', name: 'Unity Software', region: 'Norteamérica', sector: 'Tecnología', price: 28.90, change: 0.4 },
  { ticker: 'ROKU', name: 'Roku Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 68.30, change: -0.8 },

  // ---- INDUSTRIAL / MANUFACTURA ----
  { ticker: 'CAT', name: 'Caterpillar Inc.', region: 'Norteamérica', sector: 'Industria', price: 330.20, change: 0.3 },
  { ticker: 'DE', name: 'John Deere', region: 'Norteamérica', sector: 'Industria', price: 385.10, change: -0.2 },
  { ticker: 'MMM', name: '3M Company', region: 'Norteamérica', sector: 'Industria', price: 92.40, change: 0.1 },
  { ticker: 'GE', name: 'General Electric', region: 'Norteamérica', sector: 'Industria', price: 155.20, change: 0.9 },
  { ticker: 'HON', name: 'Honeywell Intl.', region: 'Norteamérica', sector: 'Industria', price: 204.40, change: 0.4 },
  { ticker: 'ETN', name: 'Eaton Corp.', region: 'Norteamérica', sector: 'Industria', price: 302.70, change: 1.2 },
  { ticker: 'EMR', name: 'Emerson Electric', region: 'Norteamérica', sector: 'Industria', price: 100.10, change: -0.1 },
  { ticker: 'PCAR', name: 'Paccar Inc.', region: 'Norteamérica', sector: 'Automotriz', price: 108.40, change: 0.3 },
  { ticker: 'GM', name: 'General Motors', region: 'Norteamérica', sector: 'Automotriz', price: 38.90, change: -0.4 },
  { ticker: 'F', name: 'Ford Motor Co.', region: 'Norteamérica', sector: 'Automotriz', price: 12.30, change: -0.1 },

  // ---- AEROLÍNEAS ----
  { ticker: 'DAL', name: 'Delta Air Lines', region: 'Norteamérica', sector: 'Aerolíneas', price: 42.10, change: 0.6 },
  { ticker: 'AAL', name: 'American Airlines', region: 'Norteamérica', sector: 'Aerolíneas', price: 12.50, change: -1.0 },
  { ticker: 'UAL', name: 'United Airlines', region: 'Norteamérica', sector: 'Aerolíneas', price: 46.80, change: 0.4 },
  { ticker: 'LUV', name: 'Southwest Airlines', region: 'Norteamérica', sector: 'Aerolíneas', price: 28.40, change: -0.3 },
  { ticker: 'JBLU', name: 'JetBlue Airways', region: 'Norteamérica', sector: 'Aerolíneas', price: 5.90, change: 0.2 },

  // ---- MINERÍA / MATERIALES ----
  { ticker: 'NEM', name: 'Newmont Corp.', region: 'Norteamérica', sector: 'Minería', price: 38.70, change: 0.1 },
  { ticker: 'FCX', name: 'Freeport-McMoRan', region: 'Norteamérica', sector: 'Minería', price: 48.30, change: -0.2 },
  { ticker: 'MOS', name: 'Mosaic Co.', region: 'Norteamérica', sector: 'Materias Primas', price: 31.10, change: 0.6 },
  { ticker: 'LYB', name: 'LyondellBasell', region: 'Norteamérica', sector: 'Químicos', price: 98.70, change: 0.3 },
  { ticker: 'APD', name: 'Air Products & Chemicals', region: 'Norteamérica', sector: 'Químicos', price: 235.50, change: 0.2 },

//////////////////////////////////////////////
//////////////////////////////////////////////
/////////////////////////////////////////////

  // Latinoamérica
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

  // Perú 🇵🇪
  { ticker: 'CPACASC1', name: 'Cementos Pacasmayo', region: 'Latinoamérica', sector: 'Industria', price: 5.60, change: 0.4 },
  { ticker: 'FERREYC1', name: 'Ferreycorp', region: 'Latinoamérica', sector: 'Industria', price: 2.35, change: -0.2 },
  { ticker: 'BACKUSI1', name: 'Backus y Johnston', region: 'Latinoamérica', sector: 'Consumo', price: 4.10, change: 0.1 },
  { ticker: 'GRAMONC1', name: 'Graña y Montero', region: 'Latinoamérica', sector: 'Construcción', price: 1.20, change: -0.3 },
  { ticker: 'LAREDOC1', name: 'La Red', region: 'Latinoamérica', sector: 'Salud', price: 3.45, change: 0.6 },
  { ticker: 'ATACOBC1', name: 'Atacocha', region: 'Latinoamérica', sector: 'Minería', price: 0.45, change: -0.1 },
  { ticker: 'MINSURI1', name: 'Minsur', region: 'Latinoamérica', sector: 'Minería', price: 1.90, change: 0.2 },
  { ticker: 'VOLCABC1', name: 'Volcan Cía. Minera', region: 'Latinoamérica', sector: 'Minería', price: 0.32, change: 0.0 },
  { ticker: 'ENELGC1', name: 'Enel Generación Perú', region: 'Latinoamérica', sector: 'Energía', price: 1.75, change: 0.3 },
  { ticker: 'CVERDEC1', name: 'Cerro Verde', region: 'Latinoamérica', sector: 'Minería', price: 8.30, change: -0.4 },

  // México 🇲🇽
  { ticker: 'CEMEXCPO', name: 'Cemex', region: 'Latinoamérica', sector: 'Construcción', price: 13.20, change: 0.2 },
  { ticker: 'GAPB.MX', name: 'Grupo Aeroportuario del Pacífico', region: 'Latinoamérica', sector: 'Transporte', price: 205.60, change: -0.6 },
  { ticker: 'AC.MX', name: 'Arca Continental', region: 'Latinoamérica', sector: 'Consumo', price: 76.30, change: 0.5 },
  { ticker: 'FEMSAUBD', name: 'FEMSA', region: 'Latinoamérica', sector: 'Consumo', price: 145.50, change: 0.7 },
  { ticker: 'BIMBOA.MX', name: 'Grupo Bimbo', region: 'Latinoamérica', sector: 'Consumo', price: 43.20, change: -0.1 },
  { ticker: 'GENTERA.MX', name: 'Gentera', region: 'Latinoamérica', sector: 'Finanzas', price: 16.40, change: 0.8 },
  { ticker: 'OMAB.MX', name: 'OMA Aeropuertos', region: 'Latinoamérica', sector: 'Transporte', price: 110.30, change: 0.3 },
  { ticker: 'ALFAA.MX', name: 'ALFA', region: 'Latinoamérica', sector: 'Industria', price: 15.90, change: 0.4 },
  { ticker: 'GMEXICOB', name: 'Grupo México', region: 'Latinoamérica', sector: 'Minería', price: 92.10, change: 1.1 },
  { ticker: 'KOFUBL.MX', name: 'Coca-Cola FEMSA', region: 'Latinoamérica', sector: 'Consumo', price: 85.20, change: -0.3 },

  // Brasil 🇧🇷
  { ticker: 'BBAS3.SA', name: 'Banco do Brasil', region: 'Latinoamérica', sector: 'Finanzas', price: 29.10, change: 0.5 },
  { ticker: 'ABEV3.SA', name: 'Ambev', region: 'Latinoamérica', sector: 'Consumo', price: 13.60, change: -0.2 },
  { ticker: 'BRFS3.SA', name: 'BRF S.A.', region: 'Latinoamérica', sector: 'Consumo', price: 14.80, change: 0.3 },
  { ticker: 'WEGE3.SA', name: 'WEG S.A.', region: 'Latinoamérica', sector: 'Industria', price: 36.20, change: 0.4 },
  { ticker: 'GGBR4.SA', name: 'Gerdau', region: 'Latinoamérica', sector: 'Minería', price: 28.50, change: 0.1 },
  { ticker: 'CSNA3.SA', name: 'CSN', region: 'Latinoamérica', sector: 'Minería', price: 17.20, change: -0.5 },
  { ticker: 'JBSS3.SA', name: 'JBS Foods', region: 'Latinoamérica', sector: 'Consumo', price: 23.30, change: 0.2 },
  { ticker: 'KLBN11.SA', name: 'Klabin', region: 'Latinoamérica', sector: 'Papel y Celulosa', price: 4.60, change: 0.1 },
  { ticker: 'BBDC4.SA', name: 'Bradesco', region: 'Latinoamérica', sector: 'Finanzas', price: 15.80, change: 0.0 },
  { ticker: 'SUZB3.SA', name: 'Suzano', region: 'Latinoamérica', sector: 'Papel y Celulosa', price: 50.40, change: 0.6 },

  // Chile 🇨🇱
  { ticker: 'SQM', name: 'Sociedad Química y Minera', region: 'Latinoamérica', sector: 'Minería', price: 45.20, change: -0.2 },
  { ticker: 'ENELCHILE', name: 'Enel Chile', region: 'Latinoamérica', sector: 'Energía', price: 2.10, change: 0.5 },
  { ticker: 'CENCOSUD', name: 'Cencosud', region: 'Latinoamérica', sector: 'Consumo', price: 3.80, change: -0.1 },
  { ticker: 'BSANTANDER', name: 'Banco Santander Chile', region: 'Latinoamérica', sector: 'Finanzas', price: 17.40, change: 0.4 },
  { ticker: 'COPEC', name: 'Empresas Copec', region: 'Latinoamérica', sector: 'Energía', price: 8.10, change: 0.2 },
  { ticker: 'LAN.SN', name: 'LATAM Airlines', region: 'Latinoamérica', sector: 'Transporte', price: 0.95, change: -0.3 },
  { ticker: 'AGUAS-A', name: 'Aguas Andinas', region: 'Latinoamérica', sector: 'Servicios públicos', price: 1.30, change: 0.1 },
  { ticker: 'MASISA', name: 'Masisa', region: 'Latinoamérica', sector: 'Industria', price: 0.45, change: 0.0 },
  { ticker: 'PARAUCO', name: 'Parque Arauco', region: 'Latinoamérica', sector: 'Inmobiliario', price: 3.25, change: -0.2 },
  { ticker: 'CAP', name: 'CAP S.A.', region: 'Latinoamérica', sector: 'Minería', price: 6.70, change: 0.3 },

  // Argentina 🇦🇷
  { ticker: 'GGAL', name: 'Grupo Galicia', region: 'Latinoamérica', sector: 'Finanzas', price: 24.30, change: 1.1 },
  { ticker: 'YPFD', name: 'YPF', region: 'Latinoamérica', sector: 'Energía', price: 19.40, change: -0.5 },
  { ticker: 'PAM', name: 'Pampa Energía', region: 'Latinoamérica', sector: 'Energía', price: 32.10, change: 0.4 },
  { ticker: 'CEPU', name: 'Central Puerto', region: 'Latinoamérica', sector: 'Energía', price: 7.20, change: -0.1 },
  { ticker: 'TXAR', name: 'Ternium Argentina', region: 'Latinoamérica', sector: 'Industria', price: 41.50, change: 0.2 },
  { ticker: 'SUPV', name: 'Banco Supervielle', region: 'Latinoamérica', sector: 'Finanzas', price: 3.90, change: 0.0 },
  { ticker: 'EDN', name: 'Edenor', region: 'Latinoamérica', sector: 'Servicios públicos', price: 22.10, change: -0.3 },
  { ticker: 'IRSA', name: 'IRSA Propiedades', region: 'Latinoamérica', sector: 'Inmobiliario', price: 6.30, change: 0.1 },
  { ticker: 'TGS', name: 'Transportadora Gas del Sur', region: 'Latinoamérica', sector: 'Energía', price: 10.50, change: 0.4 },
  { ticker: 'BMA', name: 'Banco Macro', region: 'Latinoamérica', sector: 'Finanzas', price: 27.80, change: 0.5 },

  // Colombia 🇨🇴
  { ticker: 'EC', name: 'Ecopetrol', region: 'Latinoamérica', sector: 'Energía', price: 12.40, change: -0.2 },
  { ticker: 'BVC', name: 'Bolsa de Valores de Colombia', region: 'Latinoamérica', sector: 'Finanzas', price: 0.35, change: 0.1 },
  { ticker: 'PFBCOLOM', name: 'Bancolombia Pref.', region: 'Latinoamérica', sector: 'Finanzas', price: 30.20, change: 0.3 },
  { ticker: 'NUTRESA', name: 'Grupo Nutresa', region: 'Latinoamérica', sector: 'Consumo', price: 4.60, change: 0.2 },
  { ticker: 'ISA', name: 'Interconexión Eléctrica ISA', region: 'Latinoamérica', sector: 'Energía', price: 9.70, change: -0.1 },
  { ticker: 'CEMARGOS', name: 'Cementos Argos', region: 'Latinoamérica', sector: 'Construcción', price: 3.20, change: 0.0 },
  { ticker: 'GRUPOAVAL', name: 'Grupo Aval', region: 'Latinoamérica', sector: 'Finanzas', price: 2.80, change: -0.2 },
  { ticker: 'EPM', name: 'Empresas Públicas Medellín', region: 'Latinoamérica', sector: 'Servicios públicos', price: 1.40, change: 0.3 },
  { ticker: 'CELSIA', name: 'Celsia', region: 'Latinoamérica', sector: 'Energía', price: 3.80, change: 0.1 },
  { ticker: 'GRUPOARGOS', name: 'Grupo Argos', region: 'Latinoamérica', sector: 'Industria', price: 4.90, change: 0.5 },

  // Panamá, Uruguay, R. Dominicana, Costa Rica (para completar 200)
  { ticker: 'BG.PA', name: 'Banco General (Panamá)', region: 'Latinoamérica', sector: 'Finanzas', price: 18.50, change: 0.2 },
  { ticker: 'CCB.PA', name: 'Copa Holdings', region: 'Latinoamérica', sector: 'Transporte', price: 85.60, change: -0.4 },
  { ticker: 'BANRED.UY', name: 'Redpagos', region: 'Latinoamérica', sector: 'Finanzas', price: 2.75, change: 0.0 },
  { ticker: 'ANCAP.UY', name: 'ANCAP', region: 'Latinoamérica', sector: 'Energía', price: 4.30, change: 0.1 },
  { ticker: 'BHD', name: 'Banco BHD León', region: 'Latinoamérica', sector: 'Finanzas', price: 12.40, change: -0.2 },
  { ticker: 'CCN.CR', name: 'Cervecería Costa Rica', region: 'Latinoamérica', sector: 'Consumo', price: 3.10, change: 0.1 },
  { ticker: 'ICE.CR', name: 'Instituto Costarricense Electricidad', region: 'Latinoamérica', sector: 'Energía', price: 1.40, change: 0.0 },
  { ticker: 'BAC-CR', name: 'BAC San José', region: 'Latinoamérica', sector: 'Finanzas', price: 8.80, change: 0.2 },
  { ticker: 'GRUPO-NUT', name: 'Grupo Nutresa Caribe', region: 'Latinoamérica', sector: 'Consumo', price: 4.10, change: 0.2 },
  { ticker: 'COTORREY', name: 'Supermercados Rey', region: 'Latinoamérica', sector: 'Consumo', price: 0.90, change: -0.1 },

  // Consumo / Retail
  { ticker: 'PFIZER-LA', name: 'Pfizer LatAm Foods', region: 'Latinoamérica', sector: 'Consumo', price: 12.50, change: 0.3 },
  { ticker: 'ALSEA.MX', name: 'Alsea', region: 'Latinoamérica', sector: 'Consumo', price: 18.40, change: -0.2 },
  { ticker: 'EMBRACON', name: 'Embraer Brasil', region: 'Latinoamérica', sector: 'Industria', price: 6.20, change: 0.1 },
  { ticker: 'LUX.SA', name: 'Lojas Americanas', region: 'Latinoamérica', sector: 'Retail', price: 4.50, change: -0.3 },
  { ticker: 'PBR', name: 'Petrobras ADR', region: 'Latinoamérica', sector: 'Energía', price: 7.10, change: -0.4 },
  { ticker: 'BBDC3.SA', name: 'Bradesco PN', region: 'Latinoamérica', sector: 'Finanzas', price: 14.20, change: 0.2 },
  { ticker: 'ITSA4.SA', name: 'Itaúsa', region: 'Latinoamérica', sector: 'Finanzas', price: 9.80, change: 0.1 },
  { ticker: 'USIM5.SA', name: 'Usiminas', region: 'Latinoamérica', sector: 'Materiales', price: 3.30, change: 0.0 },
  { ticker: 'CRFB3.SA', name: 'Carrefour Brasil', region: 'Latinoamérica', sector: 'Retail', price: 7.90, change: 0.2 },
  { ticker: 'CPFE3.SA', name: 'CPFL Energia', region: 'Latinoamérica', sector: 'Energía', price: 5.60, change: -0.1 },

  // Tecnología / Telecom / Servicios
  { ticker: 'CLGX.MX', name: 'Grupo Carso', region: 'Latinoamérica', sector: 'Conglomerado', price: 45.20, change: 0.4 },
  { ticker: 'AMAROK.MX', name: 'Amarok Telecom', region: 'Latinoamérica', sector: 'Telecomunicaciones', price: 1.90, change: 0.0 },
  { ticker: 'TSEL.JK', name: 'Teléfonos del Sur', region: 'Latinoamérica', sector: 'Telecomunicaciones', price: 2.30, change: -0.2 },
  { ticker: 'EMC2.BR', name: 'Embraer S.A.', region: 'Latinoamérica', sector: 'Aeroespacial', price: 8.45, change: 0.5 },
  { ticker: 'VIVT3.SA', name: 'Vivo Brasil', region: 'Latinoamérica', sector: 'Telecomunicaciones', price: 6.70, change: 0.3 },

  // Energía / Utilities
  { ticker: 'ECOPETROL', name: 'Ecopetrol ADR', region: 'Latinoamérica', sector: 'Energía', price: 10.40, change: -0.2 },
  { ticker: 'PETROAR.SA', name: 'Petrobras Argentina', region: 'Latinoamérica', sector: 'Energía', price: 5.90, change: -0.1 },
  { ticker: 'YPF-B', name: 'YPF ADR', region: 'Latinoamérica', sector: 'Energía', price: 3.10, change: 0.0 },
  { ticker: 'EQTL3.SA', name: 'Equatorial Energia', region: 'Latinoamérica', sector: 'Energía', price: 4.20, change: 0.2 },
  { ticker: 'ENBR3.SA', name: 'Energias do Brasil', region: 'Latinoamérica', sector: 'Energía', price: 5.15, change: -0.2 },

  // Bancos / Finanzas
  { ticker: 'B3SA3.SA', name: 'B3 S.A. Brasil', region: 'Latinoamérica', sector: 'Finanzas', price: 12.30, change: 0.1 },
  { ticker: 'ITUB3.SA', name: 'Itaú Unibanco PN', region: 'Latinoamérica', sector: 'Finanzas', price: 29.40, change: 0.2 },
  { ticker: 'SANB11.SA', name: 'Banco Santander Brasil', region: 'Latinoamérica', sector: 'Finanzas', price: 15.10, change: -0.1 },
  { ticker: 'BBDC1.SA', name: 'Bradesco ON', region: 'Latinoamérica', sector: 'Finanzas', price: 11.20, change: 0.0 },
  { ticker: 'BBSE3.SA', name: 'BB Seguridade', region: 'Latinoamérica', sector: 'Seguros', price: 14.60, change: 0.3 },

  // Minería / Recursos naturales
  { ticker: 'PETR3.SA', name: 'Petrobras PN', region: 'Latinoamérica', sector: 'Energía', price: 12.70, change: -0.3 },
  { ticker: 'GOLD.TO', name: 'Barrick Gold', region: 'Latinoamérica', sector: 'Minería', price: 19.40, change: 0.1 },
  { ticker: 'SLW', name: 'Silver Wheaton Corp.', region: 'Latinoamérica', sector: 'Minería', price: 28.50, change: 0.2 },
  { ticker: 'AU', name: 'AngloGold Ashanti', region: 'Latinoamérica', sector: 'Minería', price: 8.90, change: -0.1 },

  // Agricultura / Agroindustria
  { ticker: 'BORA', name: 'Bora Agro', region: 'Latinoamérica', sector: 'Agroindustria', price: 3.30, change: 0.0 },
  { ticker: 'AGRO.BR', name: 'BrasilAgro', region: 'Latinoamérica', sector: 'Agricultura', price: 2.80, change: 0.2 },

  // Inmobiliario / REITs / Infraestructura
  { ticker: 'CCRO3.SA', name: 'CCR S.A.', region: 'Latinoamérica', sector: 'Infraestructura', price: 5.40, change: 0.1 },
  { ticker: 'CYRE3.SA', name: 'Cyrela Brazil Realty', region: 'Latinoamérica', sector: 'Inmobiliario', price: 7.10, change: 0.3 },

  // Transporte / Logística
  { ticker: 'CEMAR.BR', name: 'Cemig Transporte', region: 'Latinoamérica', sector: 'Servicios públicos', price: 3.70, change: -0.2 },
  { ticker: 'RAIL3.SA', name: 'Rumo Logística', region: 'Latinoamérica', sector: 'Transporte', price: 4.90, change: 0.4 },

  // Salud / Farmacéutica
  { ticker: 'FARM.BR', name: 'Grupo Farmacéutico Brasil', region: 'Latinoamérica', sector: 'Salud', price: 2.30, change: 0.1 },
  { ticker: 'MEDIC.MX', name: 'Genomma Lab', region: 'Latinoamérica', sector: 'Salud', price: 6.80, change: -0.3 },

  // Entretenimiento / Medios
  { ticker: 'TV.PE', name: 'Grupo ATV', region: 'Latinoamérica', sector: 'Medios', price: 1.20, change: 0.0 },
  { ticker: 'CLARO.BR', name: 'Claro Brasil', region: 'Latinoamérica', sector: 'Telecomunicaciones', price: 5.60, change: 0.2 },

  // Tecnología / Software / Servicios IT
  { ticker: 'TOTVS3.SA', name: 'Totvs S.A.', region: 'Latinoamérica', sector: 'Tecnología', price: 2.10, change: 0.1 },
  { ticker: 'DESP.DEV', name: 'Despegar.com', region: 'Latinoamérica', sector: 'Tecnología', price: 9.40, change: -0.4 },

  // Final filling to reach ~200
  { ticker: 'NOKIA-LA', name: 'Nokia Latinoamérica', region: 'Latinoamérica', sector: 'Tecnología', price: 5.50, change: 0.0 },
  { ticker: 'TELCEL.MX', name: 'Telcel México', region: 'Latinoamérica', sector: 'Telecomunicaciones', price: 8.20, change: -0.1 },
  { ticker: 'ETET3.SA', name: 'Eletrobras', region: 'Latinoamérica', sector: 'Energía', price: 3.80, change: 0.2 },
  { ticker: 'TAEE11.SA', name: 'Taesa', region: 'Latinoamérica', sector: 'Energía', price: 1.60, change: 0.1 },
  { ticker: 'UGPA3.SA', name: 'Ultrapar Participações', region: 'Latinoamérica', sector: 'Combustibles', price: 23.40, change: 0.3 },
  { ticker: 'BRKM5.SA', name: 'Braskem', region: 'Latinoamérica', sector: 'Químicos', price: 4.20, change: -0.2 },
  { ticker: 'AZUL4.SA', name: 'Azul Linhas Aéreas', region: 'Latinoamérica', sector: 'Transporte', price: 3.10, change: 0.0 },
  { ticker: 'GGBR3.SA', name: 'Gerdau PN', region: 'Latinoamérica', sector: 'Minería', price: 25.60, change: 0.4 },
  { ticker: 'MRVE3.SA', name: 'MRV Engenharia', region: 'Latinoamérica', sector: 'Construcción', price: 9.20, change: 0.1 },
  { ticker: 'RAIL3.SA', name: 'Rumo ON', region: 'Latinoamérica', sector: 'Transporte', price: 4.85, change: 0.2 },
//////////////////////////////////////////////
//////////////////////////////////////////////
/////////////////////////////////////////////

  // Europa
  //Tecnología
  { ticker: 'SAP.DE', name: 'SAP SE', region: 'Europa', sector: 'Tecnología', price: 175.40, change: 0.9 },
  { ticker: 'ASML.AS', name: 'ASML Holding', region: 'Europa', sector: 'Tecnología', price: 880.00, change: 2.1 },
  { ticker: 'STM.PA', name: 'STMicroelectronics', region: 'Europa', sector: 'Tecnología', price: 46.20, change: 1.2 },
  { ticker: 'IFX.DE', name: 'Infineon Technologies', region: 'Europa', sector: 'Tecnología', price: 31.90, change: 0.4 },
  { ticker: 'NOKIA.HE', name: 'Nokia', region: 'Europa', sector: 'Tecnología', price: 3.40, change: -0.1 },
  { ticker: 'ERIC-B.ST', name: 'Ericsson', region: 'Europa', sector: 'Tecnología', price: 5.20, change: 0.0 },
  { ticker: 'CBOX.CO', name: 'Coloplast', region: 'Europa', sector: 'Tecnología Médica', price: 106.80, change: 0.3 },
  { ticker: 'ADYEN.AS', name: 'Adyen', region: 'Europa', sector: 'Tecnología / Pagos', price: 1340.00, change: 1.8 },
  { ticker: 'WDI.DE', name: 'Software AG', region: 'Europa', sector: 'Tecnología', price: 31.50, change: 0.2 },
  { ticker: 'KN.PA', name: 'Kering Digital', region: 'Europa', sector: 'Tecnología', price: 540.20, change: -0.6 },
  { ticker: 'AIBG.I', name: 'AIB Group', region: 'Europa', sector: 'Tecnología Financiera', price: 3.90, change: 0.1 },
  { ticker: 'DARK.L', name: 'Darktrace', region: 'Europa', sector: 'Ciberseguridad', price: 4.35, change: 0.6 },
  { ticker: 'SOP.PA', name: 'Sopra Steria', region: 'Europa', sector: 'Tecnología', price: 180.60, change: 0.5 },
  { ticker: 'BEKB.DE', name: 'Bechtle AG', region: 'Europa', sector: 'Tecnología', price: 145.70, change: 1.0 },
  { ticker: 'LOG.DE', name: 'Logitech Intl.', region: 'Europa', sector: 'Tecnología', price: 82.90, change: -0.1 },
  //Industria 
  { ticker: 'AIR.PA', name: 'Airbus SE', region: 'Europa', sector: 'Industria', price: 140.20, change: 0.3 },
  { ticker: 'SIE.DE', name: 'Siemens AG', region: 'Europa', sector: 'Industria', price: 165.30, change: 0.4 },
  { ticker: 'RHM.DE', name: 'Rheinmetall', region: 'Europa', sector: 'Industria Defensa', price: 322.10, change: 0.9 },
  { ticker: 'BAS.DE', name: 'BASF SE', region: 'Europa', sector: 'Industria Química', price: 48.50, change: 0.3 },
  { ticker: 'ABB.ST', name: 'ABB Ltd', region: 'Europa', sector: 'Industria', price: 41.20, change: 0.2 },
  { ticker: 'VOLV-B.ST', name: 'Volvo Group', region: 'Europa', sector: 'Industria', price: 23.50, change: 0.1 },
  { ticker: 'SKF-B.ST', name: 'SKF', region: 'Europa', sector: 'Industria', price: 17.50, change: -0.2 },
  { ticker: 'ALFA.ST', name: 'Alfa Laval', region: 'Europa', sector: 'Industria', price: 38.70, change: 0.1 },
  { ticker: 'GLE.PA', name: 'Groupe PSA', region: 'Europa', sector: 'Industria Automotriz', price: 19.60, change: 0.3 },
  { ticker: 'DGE.L', name: 'Diageo', region: 'Europa', sector: 'Industria / Bebidas', price: 118.90, change: 0.4 },
  { ticker: 'RNO.PA', name: 'Renault', region: 'Europa', sector: 'Automotriz', price: 34.40, change: -0.5 },
  { ticker: 'BMW.DE', name: 'BMW AG', region: 'Europa', sector: 'Automotriz', price: 96.20, change: 0.2 },

  //Consumo / Retail / Lujo
  { ticker: 'MC.PA', name: 'LVMH', region: 'Europa', sector: 'Consumo Lujo', price: 820.00, change: -1.0 },
  { ticker: 'KER.PA', name: 'Kering', region: 'Europa', sector: 'Lujo', price: 420.00, change: -0.4 },
  { ticker: 'RMS.PA', name: 'Hermès', region: 'Europa', sector: 'Lujo', price: 2100.00, change: 0.5 },
  { ticker: 'ADS.DE', name: 'Adidas', region: 'Europa', sector: 'Consumo', price: 176.10, change: -0.3 },
  { ticker: 'CDI.PA', name: 'Christian Dior', region: 'Europa', sector: 'Lujo', price: 960.00, change: 1.0 },
  { ticker: 'ZAL.DE', name: 'Zalando', region: 'Europa', sector: 'Retail Online', price: 22.70, change: 0.4 },
  { ticker: 'NESN.SW', name: 'Nestlé', region: 'Europa', sector: 'Consumo', price: 105.20, change: 0.2 },
  { ticker: 'ULVR.L', name: 'Unilever', region: 'Europa', sector: 'Consumo', price: 39.50, change: -0.1 },
  { ticker: 'HEIA.AS', name: 'Heineken', region: 'Europa', sector: 'Bebidas', price: 95.40, change: 0.3 },
  { ticker: 'BATS.L', name: 'British American Tobacco', region: 'Europa', sector: 'Consumo', price: 25.10, change: -0.2 },
  { ticker: 'AUTO.L', name: 'AutoTrader', region: 'Europa', sector: 'Retail Automotriz', price: 8.10, change: 0.1 },
  { ticker: 'SW.PA', name: 'Sodexo', region: 'Europa', sector: 'Servicios Consumo', price: 71.20, change: 0.3 },


  //Energía
  { ticker: 'SHEL.L', name: 'Shell plc', region: 'Europa', sector: 'Energía', price: 35.20, change: 0.4 },
  { ticker: 'BP.L', name: 'BP', region: 'Europa', sector: 'Energía', price: 28.80, change: -0.1 },
  { ticker: 'ENI.MI', name: 'ENI', region: 'Europa', sector: 'Energía', price: 15.20, change: 0.3 },
  { ticker: 'EQNR.OL', name: 'Equinor', region: 'Europa', sector: 'Energía', price: 29.40, change: 0.2 },
  { ticker: 'ORSTED.CO', name: 'Ørsted', region: 'Europa', sector: 'Energía Renovable', price: 55.10, change: -0.4 },
  { ticker: 'IBE.MC', name: 'Iberdrola', region: 'Europa', sector: 'Energía', price: 11.40, change: 0.3 },
  { ticker: 'ENGI.PA', name: 'Engie', region: 'Europa', sector: 'Energía', price: 15.10, change: 0.2 },
  { ticker: 'RWE.DE', name: 'RWE AG', region: 'Europa', sector: 'Energía', price: 37.80, change: -0.3 },
  { ticker: 'VWS.CO', name: 'Vestas', region: 'Europa', sector: 'Energía Eólica', price: 20.90, change: 1.2 },
  { ticker: 'GALP.LS', name: 'Galp Energia', region: 'Europa', sector: 'Energía', price: 15.40, change: -0.1 },

  //Salud
  { ticker: 'NVS', name: 'Novartis', region: 'Europa', sector: 'Salud', price: 103.10, change: 0.2 },
  { ticker: 'RHHBY', name: 'Roche Holding', region: 'Europa', sector: 'Salud', price: 242.00, change: -0.2 },
  { ticker: 'AZN.L', name: 'AstraZeneca', region: 'Europa', sector: 'Salud', price: 113.00, change: 0.4 },
  { ticker: 'BAYN.DE', name: 'Bayer AG', region: 'Europa', sector: 'Salud', price: 29.00, change: -0.3 },
  { ticker: 'FRE.DE', name: 'Fresenius', region: 'Europa', sector: 'Salud', price: 28.50, change: 0.1 },
  { ticker: 'UCB.BR', name: 'UCB Pharma', region: 'Europa', sector: 'Salud', price: 74.80, change: 0.2 },
  { ticker: 'GRFS', name: 'Grifols', region: 'Europa', sector: 'Salud', price: 9.20, change: -0.1 },
  { ticker: 'BBIO.L', name: 'Biosynex SE', region: 'Europa', sector: 'Biotech', price: 14.40, change: 1.0 },
  { ticker: 'NHY.DE', name: 'Nihon Europe Health', region: 'Europa', sector: 'Salud', price: 4.30, change: 0.0 },
  { ticker: 'COLR.PA', name: 'Orpéa', region: 'Europa', sector: 'Salud / Servicios', price: 1.40, change: -0.4 },
  //Telecomunicaciones
  { ticker: 'VOD.L', name: 'Vodafone', region: 'Europa', sector: 'Telecomunicaciones', price: 0.75, change: -0.1 },
  { ticker: 'DT.DE', name: 'Deutsche Telekom', region: 'Europa', sector: 'Telecomunicaciones', price: 22.40, change: 0.1 },
  { ticker: 'ORAN.PA', name: 'Orange', region: 'Europa', sector: 'Telecomunicaciones', price: 10.00, change: 0.1 },
  { ticker: 'TEL.OL', name: 'Telenor', region: 'Europa', sector: 'Telecomunicaciones', price: 14.30, change: 0.2 },
  { ticker: 'BT.L', name: 'BT Group', region: 'Europa', sector: 'Telecomunicaciones', price: 1.20, change: -0.2 },
  { ticker: 'TELIA.ST', name: 'Telia', region: 'Europa', sector: 'Telecomunicaciones', price: 3.20, change: 0.0 },

  //Transporte
  { ticker: 'DHL.DE', name: 'Deutsche Post DHL', region: 'Europa', sector: 'Transporte', price: 46.20, change: 0.3 },
  { ticker: 'RRTL.DE', name: 'Rheinland Rail', region: 'Europa', sector: 'Transporte', price: 19.30, change: -0.1 },
  { ticker: 'EASY.L', name: 'easyJet', region: 'Europa', sector: 'Aerolíneas', price: 4.20, change: 0.2 },
  { ticker: 'IAG.L', name: 'International Airlines Group', region: 'Europa', sector: 'Aerolíneas', price: 1.85, change: 0.1 },
  { ticker: 'DFDS.CO', name: 'DFDS', region: 'Europa', sector: 'Transporte Marítimo', price: 34.20, change: 0.3 },
  { ticker: 'STL.OL', name: 'Stolt-Nielsen', region: 'Europa', sector: 'Logística', price: 29.70, change: -0.1 },

  //Materiales / Minería
  { ticker: 'RIO.L', name: 'Rio Tinto', region: 'Europa', sector: 'Minería', price: 56.00, change: -0.1 },
  { ticker: 'AAL.L', name: 'Anglo American', region: 'Europa', sector: 'Minería', price: 24.10, change: 0.2 },
  { ticker: 'GLEN.L', name: 'Glencore', region: 'Europa', sector: 'Minería', price: 4.70, change: 0.1 },
  { ticker: 'BOL.ST', name: 'Boliden', region: 'Europa', sector: 'Minería', price: 38.60, change: 0.3 },
  { ticker: 'AKZA.AS', name: 'Akzo Nobel', region: 'Europa', sector: 'Químicos', price: 66.40, change: 0.4 },
  { ticker: 'CRH.L', name: 'CRH plc', region: 'Europa', sector: 'Materiales', price: 60.10, change: 0.3 },
  { ticker: 'SAND.ST', name: 'Sandvik', region: 'Europa', sector: 'Materiales Industriales', price: 19.90, change: 0.2 },

  //Utilities
  { ticker: 'NG.L', name: 'National Grid', region: 'Europa', sector: 'Utilities', price: 10.60, change: -0.1 },
  { ticker: 'EDP.LS', name: 'EDP Renováveis', region: 'Europa', sector: 'Utilities', price: 15.80, change: 0.3 },
  { ticker: 'ENEL.MI', name: 'Enel', region: 'Europa', sector: 'Utilities', price: 6.40, change: 0.1 },
  { ticker: 'FORTUM.HE', name: 'Fortum', region: 'Europa', sector: 'Utilities', price: 14.90, change: -0.2 },
  { ticker: 'SVT.L', name: 'Severn Trent', region: 'Europa', sector: 'Utilities', price: 22.60, change: 0.2 },

  //Inmobiliario
  { ticker: 'VNA.DE', name: 'Vonovia', region: 'Europa', sector: 'Inmobiliario', price: 28.60, change: 0.4 },
  { ticker: 'LEG.DE', name: 'LEG Immobilien', region: 'Europa', sector: 'Inmobiliario', price: 75.20, change: 0.1 },
  { ticker: 'LAND.L', name: 'Land Securities', region: 'Europa', sector: 'Inmobiliario', price: 6.30, change: -0.1 },
  { ticker: 'URW.AS', name: 'Unibail-Rodamco-Westfield', region: 'Europa', sector: 'Inmobiliario', price: 60.70, change: 0.5 },
  { ticker: 'CAPC.L', name: 'Capital & Counties', region: 'Europa', sector: 'Inmobiliario', price: 1.30, change: 0.1 },

  // Asia Pacífico
  { ticker: '7203.T', name: 'Toyota Motor', region: 'Asia Pacífico', sector: 'Automotriz', price: 3450.00, change: -0.2 },
  { ticker: '005930.KS', name: 'Samsung Elec.', region: 'Asia Pacífico', sector: 'Tecnología', price: 78000.00, change: 1.5 },
  { ticker: 'SONY', name: 'Sony Group', region: 'Asia Pacífico', sector: 'Tecnología', price: 85.00, change: 0.1 },
  { ticker: 'TSM', name: 'Taiwan Semi.', region: 'Asia Pacífico', sector: 'Semiconductores', price: 140.00, change: 2.5 },
  { ticker: 'BABA', name: 'Alibaba Group', region: 'Asia Pacífico', sector: 'Consumo', price: 72.00, change: -0.8 },

  // Japón (40)
  { ticker: '6758.T', name: 'Sony Group Corp', region: 'Asia Pacífico', sector: 'Tecnología', price: 85.50, change: 0.2 },
  { ticker: '8306.T', name: 'Mitsubishi UFJ Financial Group', region: 'Asia Pacífico', sector: 'Finanzas', price: 720.00, change: -0.1 },
  { ticker: '9433.T', name: 'KDDI Corp', region: 'Asia Pacífico', sector: 'Telecomunicaciones', price: 2900.00, change: 0.3 },
  { ticker: '9434.T', name: 'SoftBank Group Corp', region: 'Asia Pacífico', sector: 'Telecom / Conglomerado', price: 4800.00, change: -1.2 },
  { ticker: '8802.T', name: 'Mitsubishi Estate Co Ltd', region: 'Asia Pacífico', sector: 'Bienes raíces', price: 1200.00, change: 0.4 },
  { ticker: '4502.T', name: 'Takeda Pharmaceutical Co Ltd', region: 'Asia Pacífico', sector: 'Salud', price: 4300.00, change: 0.1 },
  { ticker: '4503.T', name: 'Astellas Pharma Inc', region: 'Asia Pacífico', sector: 'Salud', price: 1600.00, change: -0.2 },
  { ticker: '6501.T', name: 'Hitachi Ltd', region: 'Asia Pacífico', sector: 'Tecnología industrial', price: 5600.00, change: 0.9 },
  { ticker: '7733.T', name: 'Olympus Corp', region: 'Asia Pacífico', sector: 'Equipos médicos', price: 1500.00, change: 0.0 },
  { ticker: '6902.T', name: 'Denso Corp', region: 'Asia Pacífico', sector: 'Automotriz', price: 4800.00, change: 0.6 },
  { ticker: '7751.T', name: 'Canon Inc', region: 'Asia Pacífico', sector: 'Tecnología / Hardware', price: 2700.00, change: -0.3 },
  { ticker: '8035.T', name: 'Tokyo Electron Ltd', region: 'Asia Pacífico', sector: 'Semiconductores', price: 65000.00, change: 1.8 },
  { ticker: '7267.T', name: 'Honda Motor Co Ltd', region: 'Asia Pacífico', sector: 'Automotriz', price: 3100.00, change: -0.4 },
  { ticker: '4063.T', name: 'Shin-Etsu Chemical Co Ltd', region: 'Asia Pacífico', sector: 'Materiales', price: 9800.00, change: 0.5 },
  { ticker: '9984.T', name: 'SoftBank Corp', region: 'Asia Pacífico', sector: 'Telecomunicaciones', price: 1600.00, change: 0.2 },
  { ticker: '8766.T', name: 'Tokio Marine Holdings Inc', region: 'Asia Pacífico', sector: 'Seguros', price: 4800.00, change: 0.1 },
  { ticker: '8411.T', name: 'Mizuho Financial Group Inc', region: 'Asia Pacífico', sector: 'Finanzas', price: 120.00, change: -0.2 },
  { ticker: '4452.T', name: 'Kao Corp', region: 'Asia Pacífico', sector: 'Consumo', price: 1500.00, change: 0.0 },
  { ticker: '4519.T', name: 'Chugai Pharmaceutical Co Ltd', region: 'Asia Pacífico', sector: 'Salud', price: 6500.00, change: 0.3 },
  { ticker: '6098.T', name: 'Recruit Holdings Co Ltd', region: 'Asia Pacífico', sector: 'Servicios', price: 3200.00, change: -0.1 },
  { ticker: '6857.T', name: 'Advantest Corp', region: 'Asia Pacífico', sector: 'Semiconductores', price: 2400.00, change: 1.0 },
  { ticker: '7974.T', name: 'Nintendo Co Ltd', region: 'Asia Pacífico', sector: 'Entretenimiento', price: 61000.00, change: 0.8 },
  { ticker: '4568.T', name: 'Daiichi Sankyo Co Ltd', region: 'Asia Pacífico', sector: 'Salud', price: 3200.00, change: 0.2 },
  { ticker: '8058.T', name: 'Mitsubishi Corp', region: 'Asia Pacífico', sector: 'Conglomerado', price: 2000.00, change: -0.1 },
  { ticker: '8031.T', name: 'Mitsui & Co Ltd', region: 'Asia Pacífico', sector: 'Conglomerado', price: 2400.00, change: 0.0 },
  { ticker: '8801.T', name: 'Mitsui Fudosan Co Ltd', region: 'Asia Pacífico', sector: 'Bienes raíces', price: 1900.00, change: 0.2 },
  { ticker: '9020.T', name: 'East Japan Railway Co', region: 'Asia Pacífico', sector: 'Transporte', price: 8000.00, change: 0.1 },
  { ticker: '9022.T', name: 'Central Japan Railway Co', region: 'Asia Pacífico', sector: 'Transporte', price: 6500.00, change: -0.2 },
  { ticker: '9432.T', name: 'Nippon Telegraph & Telephone Corp', region: 'Asia Pacífico', sector: 'Telecomunicaciones', price: 3000.00, change: 0.3 },
  { ticker: '6752.T', name: 'Panasonic Holdings Corp', region: 'Asia Pacífico', sector: 'Electrónica', price: 1150.00, change: 0.0 },
  { ticker: '6770.T', name: 'Alps Alpine Co Ltd', region: 'Asia Pacífico', sector: 'Componentes electrónicos', price: 450.00, change: -0.1 },
  { ticker: '7011.T', name: 'Mitsubishi Heavy Industries Ltd', region: 'Asia Pacífico', sector: 'Industria pesada', price: 2600.00, change: 0.4 },
  { ticker: '7741.T', name: 'HOYA Corp', region: 'Asia Pacífico', sector: 'Equipos ópticos', price: 17000.00, change: 0.6 },
  { ticker: '7816.T', name: 'Snow Peak Inc', region: 'Asia Pacífico', sector: 'Consumo', price: 1200.00, change: 0.2 },
  { ticker: '4901.T', name: 'Fujifilm Holdings Corp', region: 'Asia Pacífico', sector: 'Tecnología / Imagen', price: 3900.00, change: -0.1 },
  { ticker: '3402.T', name: 'Toray Industries Inc', region: 'Asia Pacífico', sector: 'Materiales', price: 800.00, change: 0.0 },
  { ticker: '3405.T', name: 'Kuraray Co Ltd', region: 'Asia Pacífico', sector: 'Materiales', price: 1050.00, change: 0.1 },
  { ticker: '3407.T', name: 'Asahi Kasei Corp', region: 'Asia Pacífico', sector: 'Materiales / Químicos', price: 920.00, change: 0.0 },


  // China A-Shares (30)
  { ticker: '000858.SZ', name: 'Wuliangye Yibin Co Ltd', region: 'Asia Pacífico', sector: 'Bebidas alcohólicas', price: 85.20, change: 0.6 },
  { ticker: '000333.SZ', name: 'Midea Group Co Ltd', region: 'Asia Pacífico', sector: 'Electrodomésticos', price: 60.10, change: -0.2 },
  { ticker: '000001.SZ', name: 'Ping An Bank Co Ltd', region: 'Asia Pacífico', sector: 'Finanzas', price: 11.50, change: 0.1 },
  { ticker: '000002.SZ', name: 'China Vanke Co Ltd', region: 'Asia Pacífico', sector: 'Bienes raíces', price: 16.20, change: -0.3 },
  { ticker: '000063.SZ', name: 'ZTE Corp', region: 'Asia Pacífico', sector: 'Telecomunicaciones', price: 38.40, change: 0.5 },
  { ticker: '000725.SZ', name: 'BOE Technology Group Co Ltd', region: 'Asia Pacífico', sector: 'Pantallas / Tecnología', price: 8.70, change: 0.2 },
  { ticker: '000651.SZ', name: 'Gree Electric Appliances Inc', region: 'Asia Pacífico', sector: 'Electrodomésticos', price: 31.50, change: -0.1 },
  { ticker: '000538.SZ', name: 'Yunnan Baiyao Group Co Ltd', region: 'Asia Pacífico', sector: 'Farmacéutica', price: 45.20, change: 0.3 },
  { ticker: '000568.SZ', name: 'Luzhou Laojiao Co Ltd', region: 'Asia Pacífico', sector: 'Bebidas alcohólicas', price: 70.10, change: 1.0 },
  { ticker: '000792.SZ', name: 'Tibet Rhodiola Pharmaceutical Holding Co Ltd', region: 'Asia Pacífico', sector: 'Farmacéutica', price: 22.30, change: -0.4 },
  { ticker: '600036.SS', name: 'China Merchants Bank Co Ltd', region: 'Asia Pacífico', sector: 'Finanzas', price: 42.50, change: 0.2 },
  { ticker: '600519.SS', name: 'Kweichow Moutai Co Ltd', region: 'Asia Pacífico', sector: 'Bebidas alcohólicas', price: 2200.00, change: 0.8 },
  { ticker: '601318.SS', name: 'Ping An Insurance Group', region: 'Asia Pacífico', sector: 'Seguros', price: 54.20, change: -0.1 },
  { ticker: '601288.SS', name: 'Agricultural Bank of China', region: 'Asia Pacífico', sector: 'Finanzas', price: 3.80, change: 0.0 },
  { ticker: '601398.SS', name: 'Industrial and Commercial Bank of China', region: 'Asia Pacífico', sector: 'Finanzas', price: 4.80, change: 0.1 },
  { ticker: '601857.SS', name: 'China National Petroleum Corp', region: 'Asia Pacífico', sector: 'Energía', price: 5.20, change: -0.2 },
  { ticker: '601088.SS', name: 'China Shenhua Energy Co Ltd', region: 'Asia Pacífico', sector: 'Energía / Minería', price: 12.40, change: 0.3 },
  { ticker: '601628.SS', name: 'China Life Insurance Co Ltd', region: 'Asia Pacífico', sector: 'Seguros', price: 18.60, change: -0.1 },
  { ticker: '601766.SS', name: 'CRRC Corp Ltd', region: 'Asia Pacífico', sector: 'Ingeniería ferroviaria', price: 5.30, change: 0.0 },
  { ticker: '601988.SS', name: 'Bank of China Ltd', region: 'Asia Pacífico', sector: 'Finanzas', price: 3.60, change: 0.0 },
  { ticker: '601818.SS', name: 'China Everbright Bank Co Ltd', region: 'Asia Pacífico', sector: 'Finanzas', price: 6.20, change: 0.2 },
  { ticker: '601328.SS', name: 'Bank of Communications Co Ltd', region: 'Asia Pacífico', sector: 'Finanzas', price: 4.10, change: 0.1 },
  { ticker: '601998.SS', name: 'China CITIC Bank Corp Ltd', region: 'Asia Pacífico', sector: 'Finanzas', price: 3.90, change: -0.1 },

];

export const fetchAvailableAssets = async (): Promise<Asset[]> => {
  if (!USE_MOCK_DATA) {
    // ---------------------------------------------------------
    // INTEGRACIÓN BACKEND: GET /api/assets
    // ---------------------------------------------------------
    // 1. El backend (src/api.py) lee la configuración regional en `config/regions/*.yml`.
    // 2. Verifica qué datos existen en `data/raw/prices.parquet`.
    // 3. Retorna la lista de activos disponibles.
    /*
    try {
      const response = await fetch(`${API_URL}/assets`);
      if (!response.ok) throw new Error('Backend offline');
      const data = await response.json();
      return data.assets; 
    } catch (e) {
      console.error("Usando Datos Mock debido a error de conexión:", e);
    }
    */
  }

  // Fallback a Datos Mock
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
