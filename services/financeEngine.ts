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
  // --- MEGA-CAP TECH ---
  { ticker: 'AAPL', name: 'Apple Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 192.50, change: 1.2 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', region: 'Norteamérica', sector: 'Tecnología', price: 425.00, change: 0.8 },
  { ticker: 'GOOGL', name: 'Alphabet Inc. A', region: 'Norteamérica', sector: 'Tecnología', price: 178.00, change: -0.5 },
  { ticker: 'GOOG', name: 'Alphabet Inc. C', region: 'Norteamérica', sector: 'Tecnología', price: 179.50, change: -0.4 },
  { ticker: 'AMZN', name: 'Amazon.com', region: 'Norteamérica', sector: 'Consumo', price: 185.20, change: 1.5 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', region: 'Norteamérica', sector: 'Semiconductores', price: 135.00, change: 3.2 }, // Post-split price approx
  { ticker: 'META', name: 'Meta Platforms', region: 'Norteamérica', sector: 'Tecnología', price: 505.00, change: 2.1 },
  { ticker: 'TSLA', name: 'Tesla Inc.', region: 'Norteamérica', sector: 'Automotriz', price: 178.50, change: -1.5 },
  { ticker: 'BRK-B', name: 'Berkshire Hathaway', region: 'Norteamérica', sector: 'Finanzas', price: 410.00, change: 0.5 },
  { ticker: 'JPM', name: 'JPMorgan Chase', region: 'Norteamérica', sector: 'Finanzas', price: 205.00, change: 0.9 },
  { ticker: 'V', name: 'Visa Inc.', region: 'Norteamérica', sector: 'Finanzas', price: 275.00, change: 0.3 },
  { ticker: 'JNJ', name: 'Johnson & Johnson', region: 'Norteamérica', sector: 'Salud', price: 148.00, change: -0.2 },
  { ticker: 'XOM', name: 'Exxon Mobil', region: 'Norteamérica', sector: 'Energía', price: 115.00, change: 1.1 },
  { ticker: 'WMT', name: 'Walmart Inc.', region: 'Norteamérica', sector: 'Consumo', price: 68.00, change: 0.4 },
  { ticker: 'UNH', name: 'UnitedHealth', region: 'Norteamérica', sector: 'Salud', price: 490.00, change: -1.0 },
  { ticker: 'MA', name: 'Mastercard', region: 'Norteamérica', sector: 'Finanzas', price: 450.00, change: 0.6 },
  { ticker: 'PG', name: 'Procter & Gamble', region: 'Norteamérica', sector: 'Consumo', price: 168.00, change: 0.2 },
  { ticker: 'HD', name: 'Home Depot', region: 'Norteamérica', sector: 'Consumo', price: 345.00, change: -0.8 },
  { ticker: 'CVX', name: 'Chevron Corp.', region: 'Norteamérica', sector: 'Energía', price: 158.00, change: 0.9 },
  { ticker: 'KO', name: 'Coca-Cola', region: 'Norteamérica', sector: 'Consumo', price: 63.50, change: 0.1 },
  { ticker: 'PEP', name: 'PepsiCo', region: 'Norteamérica', sector: 'Consumo', price: 165.00, change: -0.3 },
  { ticker: 'MRK', name: 'Merck & Co.', region: 'Norteamérica', sector: 'Salud', price: 130.00, change: 0.5 },
  { ticker: 'ABBV', name: 'AbbVie Inc.', region: 'Norteamérica', sector: 'Salud', price: 172.00, change: 0.7 },
  { ticker: 'BAC', name: 'Bank of America', region: 'Norteamérica', sector: 'Finanzas', price: 39.50, change: 1.2 },
  { ticker: 'AVGO', name: 'Broadcom Inc.', region: 'Norteamérica', sector: 'Semiconductores', price: 1400.00, change: 2.5 },
  { ticker: 'COST', name: 'Costco', region: 'Norteamérica', sector: 'Consumo', price: 850.00, change: 1.8 },
  { ticker: 'DIS', name: 'Walt Disney', region: 'Norteamérica', sector: 'Medios', price: 102.00, change: -0.5 },
  { ticker: 'MCD', name: 'McDonald\'s', region: 'Norteamérica', sector: 'Consumo', price: 260.00, change: -0.2 },
  { ticker: 'ADBE', name: 'Adobe Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 460.00, change: 1.4 },
  { ticker: 'CRM', name: 'Salesforce', region: 'Norteamérica', sector: 'Tecnología', price: 265.00, change: 1.1 },

  // --- SEMICONDUCTOR & HARDWARE ---
  { ticker: 'INTC', name: 'Intel Corp.', region: 'Norteamérica', sector: 'Semiconductores', price: 30.50, change: -1.2 },
  { ticker: 'AMD', name: 'AMD', region: 'Norteamérica', sector: 'Semiconductores', price: 160.00, change: 2.8 },
  { ticker: 'QCOM', name: 'Qualcomm', region: 'Norteamérica', sector: 'Semiconductores', price: 210.00, change: 1.5 },
  { ticker: 'TXN', name: 'Texas Instruments', region: 'Norteamérica', sector: 'Semiconductores', price: 195.00, change: 0.4 },
  { ticker: 'MU', name: 'Micron Tech', region: 'Norteamérica', sector: 'Semiconductores', price: 130.00, change: 3.5 },
  { ticker: 'AMAT', name: 'Applied Materials', region: 'Norteamérica', sector: 'Semiconductores', price: 235.00, change: 2.1 },
  { ticker: 'KLAC', name: 'KLA Corp.', region: 'Norteamérica', sector: 'Semiconductores', price: 820.00, change: 1.9 },
  { ticker: 'LRCX', name: 'Lam Research', region: 'Norteamérica', sector: 'Semiconductores', price: 950.00, change: 2.3 },
  { ticker: 'ASML', name: 'ASML Holding (ADR)', region: 'Norteamérica', sector: 'Semiconductores', price: 980.00, change: 2.0 },
  { ticker: 'SNPS', name: 'Synopsys', region: 'Norteamérica', sector: 'Tecnología', price: 580.00, change: 1.2 },
  { ticker: 'CDNS', name: 'Cadence Design', region: 'Norteamérica', sector: 'Tecnología', price: 310.00, change: 1.4 },
  { ticker: 'MRVL', name: 'Marvell Tech', region: 'Norteamérica', sector: 'Semiconductores', price: 72.00, change: 1.8 },

  // --- FINANCIAL SERVICES ---
  { ticker: 'GS', name: 'Goldman Sachs', region: 'Norteamérica', sector: 'Finanzas', price: 460.00, change: 1.3 },
  { ticker: 'MS', name: 'Morgan Stanley', region: 'Norteamérica', sector: 'Finanzas', price: 98.00, change: 0.8 },
  { ticker: 'SCHW', name: 'Charles Schwab', region: 'Norteamérica', sector: 'Finanzas', price: 75.00, change: 0.5 },
  { ticker: 'BLK', name: 'BlackRock', region: 'Norteamérica', sector: 'Finanzas', price: 790.00, change: 1.1 },
  { ticker: 'C', name: 'Citigroup', region: 'Norteamérica', sector: 'Finanzas', price: 62.00, change: 0.9 },
  { ticker: 'AXP', name: 'American Express', region: 'Norteamérica', sector: 'Finanzas', price: 235.00, change: 1.4 },
  { ticker: 'SPGI', name: 'S&P Global', region: 'Norteamérica', sector: 'Finanzas', price: 440.00, change: 0.7 },
  { ticker: 'MCO', name: 'Moody\'s', region: 'Norteamérica', sector: 'Finanzas', price: 410.00, change: 0.6 },
  { ticker: 'ICE', name: 'Intercontinental', region: 'Norteamérica', sector: 'Finanzas', price: 138.00, change: 0.4 },
  { ticker: 'CME', name: 'CME Group', region: 'Norteamérica', sector: 'Finanzas', price: 215.00, change: -0.2 },
  { ticker: 'MSCI', name: 'MSCI Inc.', region: 'Norteamérica', sector: 'Finanzas', price: 490.00, change: 1.2 },
  { ticker: 'FIS', name: 'Fidelity National', region: 'Norteamérica', sector: 'Finanzas', price: 78.00, change: 0.3 },
  { ticker: 'FISV', name: 'Fiserv', region: 'Norteamérica', sector: 'Finanzas', price: 155.00, change: 0.8 },
  { ticker: 'GPN', name: 'Global Payments', region: 'Norteamérica', sector: 'Finanzas', price: 105.00, change: -0.5 },
  { ticker: 'SQ', name: 'Block Inc.', region: 'Norteamérica', sector: 'Finanzas', price: 65.00, change: -1.8 },
  { ticker: 'PYPL', name: 'PayPal', region: 'Norteamérica', sector: 'Finanzas', price: 62.50, change: -1.2 },
  { ticker: 'COF', name: 'Capital One', region: 'Norteamérica', sector: 'Finanzas', price: 140.00, change: 1.0 },
  { ticker: 'USB', name: 'U.S. Bancorp', region: 'Norteamérica', sector: 'Finanzas', price: 42.00, change: 0.5 },
  { ticker: 'PNC', name: 'PNC Financial', region: 'Norteamérica', sector: 'Finanzas', price: 155.00, change: 0.7 },
  { ticker: 'TROW', name: 'T. Rowe Price', region: 'Norteamérica', sector: 'Finanzas', price: 115.00, change: 0.2 },
  { ticker: 'AMTD', name: 'TD Ameritrade', region: 'Norteamérica', sector: 'Finanzas', price: 45.00, change: 0.0 }, // Historical/Acquired
  { ticker: 'ETFC', name: 'E*Trade', region: 'Norteamérica', sector: 'Finanzas', price: 52.00, change: 0.0 }, // Historical/Acquired

  // --- HEALTHCARE & BIOTECH ---
  { ticker: 'PFE', name: 'Pfizer', region: 'Norteamérica', sector: 'Salud', price: 28.50, change: -0.8 },
  { ticker: 'ABT', name: 'Abbott Labs', region: 'Norteamérica', sector: 'Salud', price: 105.00, change: 0.2 },
  { ticker: 'TMO', name: 'Thermo Fisher', region: 'Norteamérica', sector: 'Salud', price: 580.00, change: 0.6 },
  { ticker: 'DHR', name: 'Danaher', region: 'Norteamérica', sector: 'Salud', price: 260.00, change: 0.4 },
  { ticker: 'LLY', name: 'Eli Lilly', region: 'Norteamérica', sector: 'Salud', price: 890.00, change: 2.5 },
  { ticker: 'BMY', name: 'Bristol-Myers', region: 'Norteamérica', sector: 'Salud', price: 45.00, change: -0.5 },
  { ticker: 'AMGN', name: 'Amgen', region: 'Norteamérica', sector: 'Salud', price: 310.00, change: 0.8 },
  { ticker: 'GILD', name: 'Gilead Sciences', region: 'Norteamérica', sector: 'Salud', price: 68.00, change: -0.3 },
  { ticker: 'REGN', name: 'Regeneron', region: 'Norteamérica', sector: 'Salud', price: 980.00, change: 1.5 },
  { ticker: 'VRTX', name: 'Vertex Pharma', region: 'Norteamérica', sector: 'Salud', price: 460.00, change: 1.1 },
  { ticker: 'BIIB', name: 'Biogen', region: 'Norteamérica', sector: 'Salud', price: 220.00, change: -1.0 },
  { ticker: 'ILMN', name: 'Illumina', region: 'Norteamérica', sector: 'Salud', price: 115.00, change: -2.5 },
  { ticker: 'DXCM', name: 'DexCom', region: 'Norteamérica', sector: 'Salud', price: 120.00, change: 1.8 },
  { ticker: 'ISRG', name: 'Intuitive Surgical', region: 'Norteamérica', sector: 'Salud', price: 430.00, change: 1.2 },
  { ticker: 'ZTS', name: 'Zoetis', region: 'Norteamérica', sector: 'Salud', price: 175.00, change: 0.5 },
  { ticker: 'MRNA', name: 'Moderna', region: 'Norteamérica', sector: 'Salud', price: 145.00, change: 3.5 },
  { ticker: 'BNTX', name: 'BioNTech', region: 'Norteamérica', sector: 'Salud', price: 95.00, change: 2.8 },
  { ticker: 'CVS', name: 'CVS Health', region: 'Norteamérica', sector: 'Salud', price: 58.00, change: -0.6 },
  { ticker: 'CI', name: 'Cigna', region: 'Norteamérica', sector: 'Salud', price: 340.00, change: 0.9 },
  { ticker: 'HUM', name: 'Humana', region: 'Norteamérica', sector: 'Salud', price: 320.00, change: -1.5 },
  { ticker: 'ANTM', name: 'Anthem (Elevance)', region: 'Norteamérica', sector: 'Salud', price: 530.00, change: 0.7 },

  // --- CONSUMER & RETAIL ---
  { ticker: 'NKE', name: 'Nike', region: 'Norteamérica', sector: 'Consumo', price: 94.00, change: -0.4 },
  { ticker: 'SBUX', name: 'Starbucks', region: 'Norteamérica', sector: 'Consumo', price: 88.00, change: 0.2 },
  { ticker: 'TGT', name: 'Target', region: 'Norteamérica', sector: 'Consumo', price: 145.00, change: -0.8 },
  { ticker: 'LOW', name: 'Lowe\'s', region: 'Norteamérica', sector: 'Consumo', price: 225.00, change: 0.6 },
  { ticker: 'YUM', name: 'Yum! Brands', region: 'Norteamérica', sector: 'Consumo', price: 138.00, change: 0.3 },
  { ticker: 'CMG', name: 'Chipotle', region: 'Norteamérica', sector: 'Consumo', price: 3100.00, change: 1.5 },
  { ticker: 'DPZ', name: 'Domino\'s Pizza', region: 'Norteamérica', sector: 'Consumo', price: 510.00, change: 0.8 },
  { ticker: 'CL', name: 'Colgate-Palmolive', region: 'Norteamérica', sector: 'Consumo', price: 92.00, change: 0.4 },
  { ticker: 'KMB', name: 'Kimberly-Clark', region: 'Norteamérica', sector: 'Consumo', price: 135.00, change: 0.1 },
  { ticker: 'MDLZ', name: 'Mondelez', region: 'Norteamérica', sector: 'Consumo', price: 68.00, change: 0.5 },
  { ticker: 'KHC', name: 'Kraft Heinz', region: 'Norteamérica', sector: 'Consumo', price: 36.00, change: -0.2 },
  { ticker: 'GIS', name: 'General Mills', region: 'Norteamérica', sector: 'Consumo', price: 72.00, change: 0.3 },
  { ticker: 'CAG', name: 'Conagra', region: 'Norteamérica', sector: 'Consumo', price: 29.00, change: -0.5 },
  { ticker: 'MKC', name: 'McCormick', region: 'Norteamérica', sector: 'Consumo', price: 78.00, change: 0.4 },
  { ticker: 'TSN', name: 'Tyson Foods', region: 'Norteamérica', sector: 'Consumo', price: 58.00, change: 0.2 },
  { ticker: 'SJM', name: 'J.M. Smucker', region: 'Norteamérica', sector: 'Consumo', price: 115.00, change: 0.1 },
  { ticker: 'HSY', name: 'Hershey', region: 'Norteamérica', sector: 'Consumo', price: 195.00, change: 0.6 },

  // --- INDUSTRIALS & ENERGY ---
  { ticker: 'BA', name: 'Boeing', region: 'Norteamérica', sector: 'Industria', price: 175.00, change: -1.5 },
  { ticker: 'CAT', name: 'Caterpillar', region: 'Norteamérica', sector: 'Industria', price: 340.00, change: 1.2 },
  { ticker: 'DE', name: 'Deere & Co.', region: 'Norteamérica', sector: 'Industria', price: 390.00, change: 0.8 },
  { ticker: 'GE', name: 'General Electric', region: 'Norteamérica', sector: 'Industria', price: 165.00, change: 2.1 },
  { ticker: 'HON', name: 'Honeywell', region: 'Norteamérica', sector: 'Industria', price: 205.00, change: 0.4 },
  { ticker: 'LMT', name: 'Lockheed Martin', region: 'Norteamérica', sector: 'Defensa', price: 465.00, change: 0.9 },
  { ticker: 'RTX', name: 'Raytheon', region: 'Norteamérica', sector: 'Defensa', price: 102.00, change: 0.5 },
  { ticker: 'GD', name: 'General Dynamics', region: 'Norteamérica', sector: 'Defensa', price: 295.00, change: 0.6 },
  { ticker: 'NOC', name: 'Northrop Grumman', region: 'Norteamérica', sector: 'Defensa', price: 480.00, change: 0.7 },
  { ticker: 'UPS', name: 'UPS', region: 'Norteamérica', sector: 'Logística', price: 145.00, change: -0.3 },
  { ticker: 'FDX', name: 'FedEx', region: 'Norteamérica', sector: 'Logística', price: 280.00, change: 0.2 },
  { ticker: 'CSX', name: 'CSX Corp.', region: 'Norteamérica', sector: 'Transporte', price: 34.00, change: 0.5 },
  { ticker: 'NSC', name: 'Norfolk Southern', region: 'Norteamérica', sector: 'Transporte', price: 230.00, change: -0.4 },
  { ticker: 'UNP', name: 'Union Pacific', region: 'Norteamérica', sector: 'Transporte', price: 240.00, change: 0.6 },
  { ticker: 'COP', name: 'ConocoPhillips', region: 'Norteamérica', sector: 'Energía', price: 125.00, change: 1.1 },
  { ticker: 'EOG', name: 'EOG Resources', region: 'Norteamérica', sector: 'Energía', price: 130.00, change: 0.9 },
  { ticker: 'SLB', name: 'Schlumberger', region: 'Norteamérica', sector: 'Energía', price: 48.00, change: 1.5 },
  { ticker: 'HAL', name: 'Halliburton', region: 'Norteamérica', sector: 'Energía', price: 36.00, change: 1.2 },
  { ticker: 'MPC', name: 'Marathon Petro', region: 'Norteamérica', sector: 'Energía', price: 185.00, change: 2.0 },
  { ticker: 'VLO', name: 'Valero Energy', region: 'Norteamérica', sector: 'Energía', price: 160.00, change: 1.8 },
  { ticker: 'PSX', name: 'Phillips 66', region: 'Norteamérica', sector: 'Energía', price: 145.00, change: 1.4 },
  { ticker: 'OXY', name: 'Occidental Petro', region: 'Norteamérica', sector: 'Energía', price: 65.00, change: 0.7 },
  { ticker: 'DVN', name: 'Devon Energy', region: 'Norteamérica', sector: 'Energía', price: 48.00, change: 0.5 },

  // --- TECHNOLOGY GROWTH ---
  { ticker: 'NFLX', name: 'Netflix', region: 'Norteamérica', sector: 'Tecnología', price: 620.00, change: 2.5 },
  { ticker: 'NOW', name: 'ServiceNow', region: 'Norteamérica', sector: 'Tecnología', price: 740.00, change: 1.8 },
  { ticker: 'TEAM', name: 'Atlassian', region: 'Norteamérica', sector: 'Tecnología', price: 185.00, change: -1.2 },
  { ticker: 'DOCU', name: 'DocuSign', region: 'Norteamérica', sector: 'Tecnología', price: 58.00, change: -0.5 },
  { ticker: 'ZM', name: 'Zoom', region: 'Norteamérica', sector: 'Tecnología', price: 64.00, change: -1.5 },
  { ticker: 'ROKU', name: 'Roku', region: 'Norteamérica', sector: 'Tecnología', price: 60.00, change: 2.2 },
  { ticker: 'PTON', name: 'Peloton', region: 'Norteamérica', sector: 'Consumo', price: 3.50, change: -4.0 },
  { ticker: 'DKNG', name: 'DraftKings', region: 'Norteamérica', sector: 'Consumo', price: 42.00, change: 3.5 },
  { ticker: 'SHOP', name: 'Shopify', region: 'Norteamérica', sector: 'Tecnología', price: 72.00, change: 2.1 },
  { ticker: 'COIN', name: 'Coinbase', region: 'Norteamérica', sector: 'Finanzas', price: 240.00, change: 5.5 },
  { ticker: 'UBER', name: 'Uber', region: 'Norteamérica', sector: 'Tecnología', price: 75.00, change: 1.6 },
  { ticker: 'LYFT', name: 'Lyft', region: 'Norteamérica', sector: 'Tecnología', price: 18.00, change: 0.8 },
  { ticker: 'ABNB', name: 'Airbnb', region: 'Norteamérica', sector: 'Consumo', price: 155.00, change: 1.2 },
  { ticker: 'DASH', name: 'DoorDash', region: 'Norteamérica', sector: 'Consumo', price: 115.00, change: 1.5 },
  { ticker: 'SNAP', name: 'Snap Inc.', region: 'Norteamérica', sector: 'Tecnología', price: 15.00, change: -2.0 },
  { ticker: 'TWTR', name: 'Twitter (X)', region: 'Norteamérica', sector: 'Tecnología', price: 54.20, change: 0.0 }, // Delisted
  { ticker: 'PINS', name: 'Pinterest', region: 'Norteamérica', sector: 'Tecnología', price: 42.00, change: 1.8 },
  { ticker: 'SPOT', name: 'Spotify', region: 'Norteamérica', sector: 'Tecnología', price: 310.00, change: 2.4 },
  { ticker: 'FTNT', name: 'Fortinet', region: 'Norteamérica', sector: 'Ciberseguridad', price: 62.00, change: 0.9 },
  { ticker: 'PANW', name: 'Palo Alto', region: 'Norteamérica', sector: 'Ciberseguridad', price: 315.00, change: 1.7 },
  { ticker: 'CRWD', name: 'CrowdStrike', region: 'Norteamérica', sector: 'Ciberseguridad', price: 350.00, change: 2.2 },
  { ticker: 'ZS', name: 'Zscaler', region: 'Norteamérica', sector: 'Ciberseguridad', price: 180.00, change: 1.5 },
  { ticker: 'OKTA', name: 'Okta', region: 'Norteamérica', sector: 'Ciberseguridad', price: 95.00, change: -0.8 },
  { ticker: 'NET', name: 'Cloudflare', region: 'Norteamérica', sector: 'Tecnología', price: 92.00, change: 1.3 },
  { ticker: 'DDOG', name: 'Datadog', region: 'Norteamérica', sector: 'Tecnología', price: 125.00, change: 1.9 },

  // --- REAL ESTATE & UTILITIES ---
  { ticker: 'PLD', name: 'Prologis', region: 'Norteamérica', sector: 'Inmobiliaria', price: 112.00, change: 0.5 },
  { ticker: 'AMT', name: 'American Tower', region: 'Norteamérica', sector: 'Inmobiliaria', price: 195.00, change: 0.2 },
  { ticker: 'CCI', name: 'Crown Castle', region: 'Norteamérica', sector: 'Inmobiliaria', price: 105.00, change: -0.3 },
  { ticker: 'EQIX', name: 'Equinix', region: 'Norteamérica', sector: 'Inmobiliaria', price: 780.00, change: 0.8 },
  { ticker: 'DLR', name: 'Digital Realty', region: 'Norteamérica', sector: 'Inmobiliaria', price: 145.00, change: 0.4 },
  { ticker: 'PSA', name: 'Public Storage', region: 'Norteamérica', sector: 'Inmobiliaria', price: 285.00, change: 0.1 },
  { ticker: 'O', name: 'Realty Income', region: 'Norteamérica', sector: 'Inmobiliaria', price: 54.00, change: -0.2 },
  { ticker: 'VTR', name: 'Ventas', region: 'Norteamérica', sector: 'Inmobiliaria', price: 48.00, change: 0.3 },
  { ticker: 'WELL', name: 'Welltower', region: 'Norteamérica', sector: 'Inmobiliaria', price: 98.00, change: 0.6 },
  { ticker: 'AVB', name: 'AvalonBay', region: 'Norteamérica', sector: 'Inmobiliaria', price: 198.00, change: 0.2 },
  { ticker: 'EQR', name: 'Equity Residential', region: 'Norteamérica', sector: 'Inmobiliaria', price: 68.00, change: 0.4 },
  { ticker: 'ESS', name: 'Essex Property', region: 'Norteamérica', sector: 'Inmobiliaria', price: 245.00, change: 0.5 },
  { ticker: 'NEE', name: 'NextEra Energy', region: 'Norteamérica', sector: 'Utilities', price: 74.00, change: 0.9 },
  { ticker: 'DUK', name: 'Duke Energy', region: 'Norteamérica', sector: 'Utilities', price: 102.00, change: 0.1 },
  { ticker: 'SO', name: 'Southern Co', region: 'Norteamérica', sector: 'Utilities', price: 78.00, change: 0.2 },
  { ticker: 'D', name: 'Dominion Energy', region: 'Norteamérica', sector: 'Utilities', price: 52.00, change: -0.4 },
  { ticker: 'EXC', name: 'Exelon', region: 'Norteamérica', sector: 'Utilities', price: 38.00, change: 0.3 },
  { ticker: 'AEP', name: 'American Elec.', region: 'Norteamérica', sector: 'Utilities', price: 88.00, change: 0.5 },
  { ticker: 'XEL', name: 'Xcel Energy', region: 'Norteamérica', sector: 'Utilities', price: 55.00, change: 0.2 },
  { ticker: 'WEC', name: 'WEC Energy', region: 'Norteamérica', sector: 'Utilities', price: 82.00, change: 0.1 },

  // --- ETFS S&P 500 SECTORIALES ---
  { ticker: 'XLK', name: 'Tech Select Sector', region: 'Norteamérica', sector: 'ETF', price: 215.00, change: 1.2 },
  { ticker: 'XLF', name: 'Financial Select', region: 'Norteamérica', sector: 'ETF', price: 42.00, change: 0.8 },
  { ticker: 'XLV', name: 'Health Care Select', region: 'Norteamérica', sector: 'ETF', price: 145.00, change: -0.2 },
  { ticker: 'XLI', name: 'Industrial Select', region: 'Norteamérica', sector: 'ETF', price: 125.00, change: 0.6 },
  { ticker: 'XLP', name: 'Consumer Staples', region: 'Norteamérica', sector: 'ETF', price: 78.00, change: 0.1 },
  { ticker: 'XLY', name: 'Consum Discret', region: 'Norteamérica', sector: 'ETF', price: 185.00, change: 0.9 },
  { ticker: 'XLE', name: 'Energy Select', region: 'Norteamérica', sector: 'ETF', price: 92.00, change: 1.1 },
  { ticker: 'XLU', name: 'Utilities Select', region: 'Norteamérica', sector: 'ETF', price: 65.00, change: 0.3 },
  { ticker: 'XLB', name: 'Materials Select', region: 'Norteamérica', sector: 'ETF', price: 90.00, change: 0.5 },
  { ticker: 'XLC', name: 'Comm Services', region: 'Norteamérica', sector: 'ETF', price: 85.00, change: 1.4 },
  { ticker: 'XLRE', name: 'Real Estate Select', region: 'Norteamérica', sector: 'ETF', price: 38.00, change: 0.2 },
  { ticker: 'SPY', name: 'SPDR S&P 500', region: 'Norteamérica', sector: 'ETF', price: 525.00, change: 0.8 },
  { ticker: 'IVV', name: 'iShares Core S&P', region: 'Norteamérica', sector: 'ETF', price: 528.00, change: 0.8 },
  { ticker: 'VOO', name: 'Vanguard S&P 500', region: 'Norteamérica', sector: 'ETF', price: 485.00, change: 0.8 },
  { ticker: 'QQQ', name: 'Invesco QQQ', region: 'Norteamérica', sector: 'ETF', price: 450.00, change: 1.3 },

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

 // --- ALEMANIA (XETRA) ---
  { ticker: 'SAP.DE', name: 'SAP SE', region: 'Europa', sector: 'Tecnología', price: 178.50, change: 1.2 },
  { ticker: 'SIE.DE', name: 'Siemens AG', region: 'Europa', sector: 'Industria', price: 172.00, change: 0.8 },
  { ticker: 'DAI.DE', name: 'Mercedes-Benz Group', region: 'Europa', sector: 'Automotriz', price: 74.50, change: -0.5 },
  { ticker: 'BMW.DE', name: 'BMW AG', region: 'Europa', sector: 'Automotriz', price: 108.20, change: 0.3 },
  { ticker: 'BAS.DE', name: 'BASF SE', region: 'Europa', sector: 'Materiales', price: 48.90, change: -1.1 },
  { ticker: 'ALV.DE', name: 'Allianz SE', region: 'Europa', sector: 'Finanzas', price: 265.00, change: 0.6 },
  { ticker: 'MUV2.DE', name: 'Munich Re', region: 'Europa', sector: 'Finanzas', price: 430.50, change: 0.4 },
  { ticker: 'VOW3.DE', name: 'Volkswagen AG', region: 'Europa', sector: 'Automotriz', price: 118.00, change: -1.5 },
  { ticker: 'DBK.DE', name: 'Deutsche Bank', region: 'Europa', sector: 'Finanzas', price: 15.40, change: 2.1 },
  { ticker: 'DTE.DE', name: 'Deutsche Telekom', region: 'Europa', sector: 'Telecom', price: 22.80, change: 0.1 },
  { ticker: 'BAYN.DE', name: 'Bayer AG', region: 'Europa', sector: 'Salud', price: 26.50, change: -2.3 },
  { ticker: 'LIN.DE', name: 'Linde plc', region: 'Europa', sector: 'Materiales', price: 420.00, change: 1.5 },
  { ticker: 'MRK.DE', name: 'Merck KGaA', region: 'Europa', sector: 'Salud', price: 155.00, change: 0.9 },
  { ticker: 'RWE.DE', name: 'RWE AG', region: 'Europa', sector: 'Energía', price: 33.20, change: -0.8 },
  { ticker: 'ENR.DE', name: 'Siemens Energy', region: 'Europa', sector: 'Energía', price: 24.50, change: 3.2 },
  { ticker: 'HEI.DE', name: 'Heidelberg Mat.', region: 'Europa', sector: 'Materiales', price: 95.40, change: 1.1 },
  { ticker: 'FRE.DE', name: 'Fresenius SE', region: 'Europa', sector: 'Salud', price: 28.10, change: 0.2 },
  { ticker: 'FME.DE', name: 'Fresenius Med.', region: 'Europa', sector: 'Salud', price: 38.50, change: -0.4 },
  { ticker: 'DPW.DE', name: 'DHL Group', region: 'Europa', sector: 'Logística', price: 39.80, change: -0.7 },
  { ticker: 'VNA.DE', name: 'Vonovia SE', region: 'Europa', sector: 'Inmobiliaria', price: 28.90, change: 2.5 },
  { ticker: 'EOAN.DE', name: 'E.ON SE', region: 'Europa', sector: 'Utilities', price: 12.60, change: 0.5 },
  { ticker: 'IFX.DE', name: 'Infineon Tech.', region: 'Europa', sector: 'Tecnología', price: 36.40, change: 1.8 },
  { ticker: 'CON.DE', name: 'Continental AG', region: 'Europa', sector: 'Automotriz', price: 62.50, change: -1.2 },
  { ticker: 'HEN3.DE', name: 'Henkel AG', region: 'Europa', sector: 'Consumo', price: 78.20, change: 0.3 },
  { ticker: 'ADS.DE', name: 'Adidas AG', region: 'Europa', sector: 'Consumo', price: 225.00, change: 1.4 },

  // --- FRANCIA (EURONEXT PARIS) ---
  { ticker: 'AIR.PA', name: 'Airbus SE', region: 'Europa', sector: 'Industria', price: 158.50, change: 0.9 },
  { ticker: 'OR.PA', name: 'L\'Oréal', region: 'Europa', sector: 'Consumo', price: 445.00, change: 1.1 },
  { ticker: 'MC.PA', name: 'LVMH', region: 'Europa', sector: 'Lujo', price: 825.00, change: -0.5 },
  { ticker: 'SAN.PA', name: 'Sanofi', region: 'Europa', sector: 'Salud', price: 92.40, change: 0.2 },
  { ticker: 'BNP.PA', name: 'BNP Paribas', region: 'Europa', sector: 'Finanzas', price: 65.80, change: 1.5 },
  { ticker: 'ENGI.PA', name: 'Engie SA', region: 'Europa', sector: 'Utilities', price: 15.20, change: -0.3 },
  { ticker: 'CAP.PA', name: 'Capgemini', region: 'Europa', sector: 'Tecnología', price: 210.00, change: 2.2 },
  { ticker: 'RI.PA', name: 'Pernod Ricard', region: 'Europa', sector: 'Consumo', price: 145.00, change: -0.8 },
  { ticker: 'STLAP.PA', name: 'Stellantis NV', region: 'Europa', sector: 'Automotriz', price: 20.50, change: -1.9 },
  { ticker: 'TTE.PA', name: 'TotalEnergies', region: 'Europa', sector: 'Energía', price: 68.50, change: 1.3 },
  { ticker: 'AI.PA', name: 'Air Liquide', region: 'Europa', sector: 'Materiales', price: 185.00, change: 0.8 },
  { ticker: 'DG.PA', name: 'Vinci SA', region: 'Europa', sector: 'Industria', price: 115.00, change: 0.5 },
  { ticker: 'BN.PA', name: 'Danone', region: 'Europa', sector: 'Consumo', price: 61.20, change: -0.2 },
  { ticker: 'CS.PA', name: 'AXA SA', region: 'Europa', sector: 'Finanzas', price: 34.50, change: 1.0 },
  { ticker: 'KER.PA', name: 'Kering', region: 'Europa', sector: 'Lujo', price: 360.00, change: -2.5 },
  { ticker: 'ML.PA', name: 'Michelin', region: 'Europa', sector: 'Automotriz', price: 36.80, change: 0.4 },
  { ticker: 'HO.PA', name: 'Thales', region: 'Europa', sector: 'Defensa', price: 152.00, change: 1.7 },
  { ticker: 'SU.PA', name: 'Schneider Elec.', region: 'Europa', sector: 'Industria', price: 218.00, change: 1.4 },
  { ticker: 'SW.PA', name: 'Sodexo', region: 'Europa', sector: 'Servicios', price: 82.50, change: 0.1 },
  { ticker: 'CA.PA', name: 'Carrefour', region: 'Europa', sector: 'Retail', price: 14.80, change: -0.6 },
  { ticker: 'AC.PA', name: 'Accor', region: 'Europa', sector: 'Turismo', price: 42.00, change: 1.9 },
  { ticker: 'LR.PA', name: 'Legrand', region: 'Europa', sector: 'Industria', price: 98.50, change: 0.7 },
  { ticker: 'MT.PA', name: 'ArcelorMittal', region: 'Europa', sector: 'Materiales', price: 24.50, change: -1.1 },
  { ticker: 'ORA.PA', name: 'Orange', region: 'Europa', sector: 'Telecom', price: 10.80, change: 0.3 },
  { ticker: 'VIV.PA', name: 'Vivendi', region: 'Europa', sector: 'Medios', price: 10.20, change: 0.0 },

  // --- REINO UNIDO (LSE) ---
  { ticker: 'HSBA.L', name: 'HSBC Holdings', region: 'Europa', sector: 'Finanzas', price: 680.00, change: 0.5 },
  { ticker: 'BP.L', name: 'BP p.l.c.', region: 'Europa', sector: 'Energía', price: 485.00, change: -0.8 },
  { ticker: 'SHEL.L', name: 'Shell plc', region: 'Europa', sector: 'Energía', price: 2850.00, change: 0.4 },
  { ticker: 'GSK.L', name: 'GSK plc', region: 'Europa', sector: 'Salud', price: 1650.00, change: -0.2 },
  { ticker: 'ULVR.L', name: 'Unilever plc', region: 'Europa', sector: 'Consumo', price: 4100.00, change: 0.6 },
  { ticker: 'AZN.L', name: 'AstraZeneca', region: 'Europa', sector: 'Salud', price: 12400.00, change: 1.1 },
  { ticker: 'DGE.L', name: 'Diageo plc', region: 'Europa', sector: 'Consumo', price: 2800.00, change: -1.0 },
  { ticker: 'BATS.L', name: 'British Am. Tob.', region: 'Europa', sector: 'Consumo', price: 2450.00, change: 1.5 },
  { ticker: 'RIO.L', name: 'Rio Tinto', region: 'Europa', sector: 'Materiales', price: 5200.00, change: -0.5 },
  { ticker: 'AAL.L', name: 'Anglo American', region: 'Europa', sector: 'Materiales', price: 2650.00, change: 2.1 },
  { ticker: 'LSE.L', name: 'LSE Group', region: 'Europa', sector: 'Finanzas', price: 9200.00, change: 0.8 },
  { ticker: 'PRU.L', name: 'Prudential plc', region: 'Europa', sector: 'Finanzas', price: 750.00, change: 1.2 },
  { ticker: 'VOD.L', name: 'Vodafone Group', region: 'Europa', sector: 'Telecom', price: 72.00, change: -0.4 },
  { ticker: 'CCH.L', name: 'Coca-Cola HBC', region: 'Europa', sector: 'Consumo', price: 2600.00, change: 0.3 },
  { ticker: 'IMB.L', name: 'Imperial Brands', region: 'Europa', sector: 'Consumo', price: 1950.00, change: 0.9 },
  { ticker: 'REL.L', name: 'RELX plc', region: 'Europa', sector: 'Servicios', price: 3400.00, change: 0.7 },
  { ticker: 'CRH.L', name: 'CRH plc', region: 'Europa', sector: 'Materiales', price: 6100.00, change: 1.8 },
  { ticker: 'SSE.L', name: 'SSE plc', region: 'Europa', sector: 'Utilities', price: 1750.00, change: -0.1 },
  { ticker: 'NXT.L', name: 'Next plc', region: 'Europa', sector: 'Retail', price: 9200.00, change: 1.4 },
  { ticker: 'SGRO.L', name: 'Segro plc', region: 'Europa', sector: 'Inmobiliaria', price: 880.00, change: 2.0 },
  { ticker: 'LGEN.L', name: 'Legal & General', region: 'Europa', sector: 'Finanzas', price: 245.00, change: 0.5 },
  { ticker: 'BA.L', name: 'BAE Systems', region: 'Europa', sector: 'Defensa', price: 1350.00, change: 2.5 },
  { ticker: 'AV.L', name: 'Aviva plc', region: 'Europa', sector: 'Finanzas', price: 480.00, change: 0.2 },
  { ticker: 'NWG.L', name: 'NatWest Group', region: 'Europa', sector: 'Finanzas', price: 310.00, change: 1.1 },
  { ticker: 'STAN.L', name: 'Standard Chart.', region: 'Europa', sector: 'Finanzas', price: 720.00, change: -0.6 },

  // --- HOLANDA (EURONEXT AMSTERDAM) ---
  { ticker: 'ASML.AS', name: 'ASML Holding', region: 'Europa', sector: 'Tecnología', price: 890.00, change: 2.5 },
  { ticker: 'UNA.AS', name: 'Unilever', region: 'Europa', sector: 'Consumo', price: 48.50, change: 0.4 },
  { ticker: 'INGA.AS', name: 'ING Groep', region: 'Europa', sector: 'Finanzas', price: 16.20, change: 1.3 },
  { ticker: 'PHIA.AS', name: 'Philips', region: 'Europa', sector: 'Salud', price: 24.50, change: -1.8 },
  { ticker: 'AD.AS', name: 'Ahold Delhaize', region: 'Europa', sector: 'Retail', price: 28.90, change: 0.2 },
  { ticker: 'MT.AS', name: 'ArcelorMittal', region: 'Europa', sector: 'Materiales', price: 24.50, change: -0.9 },
  { ticker: 'SHELL.AS', name: 'Shell plc', region: 'Europa', sector: 'Energía', price: 33.40, change: 0.5 },
  { ticker: 'HEIA.AS', name: 'Heineken', region: 'Europa', sector: 'Consumo', price: 88.00, change: -0.3 },
  { ticker: 'NN.AS', name: 'NN Group', region: 'Europa', sector: 'Finanzas', price: 44.50, change: 0.8 },
  { ticker: 'KPN.AS', name: 'KPN NV', region: 'Europa', sector: 'Telecom', price: 3.50, change: 0.1 },
  { ticker: 'REN.AS', name: 'RELX', region: 'Europa', sector: 'Servicios', price: 42.00, change: 0.6 },
  { ticker: 'AALB.AS', name: 'Aalberts', region: 'Europa', sector: 'Industria', price: 42.50, change: 1.1 },
  { ticker: 'AKZA.AS', name: 'Akzo Nobel', region: 'Europa', sector: 'Materiales', price: 65.00, change: -0.5 },
  { ticker: 'DSY.AS', name: 'DSM-Firmenich', region: 'Europa', sector: 'Materiales', price: 98.00, change: 0.7 },
  { ticker: 'GLPG.AS', name: 'Galapagos', region: 'Europa', sector: 'Salud', price: 28.00, change: -2.1 },
  { ticker: 'IMCD.AS', name: 'IMCD NV', region: 'Europa', sector: 'Materiales', price: 145.00, change: 1.4 },
  { ticker: 'RAND.AS', name: 'Randstad', region: 'Europa', sector: 'Servicios', price: 48.50, change: -0.4 },
  { ticker: 'TKWY.AS', name: 'Just Eat Takeaway', region: 'Europa', sector: 'Tecnología', price: 12.50, change: -3.5 },
  { ticker: 'WKL.AS', name: 'Wolters Kluwer', region: 'Europa', sector: 'Servicios', price: 152.00, change: 0.9 },
  { ticker: 'FLOW.AS', name: 'Flow Traders', region: 'Europa', sector: 'Finanzas', price: 18.20, change: 1.8 },

  // --- ESPAÑA (BME) ---
  { ticker: 'SAN.MC', name: 'Banco Santander', region: 'Europa', sector: 'Finanzas', price: 4.80, change: 0.5 },
  { ticker: 'TEF.MC', name: 'Telefónica', region: 'Europa', sector: 'Telecom', price: 4.10, change: -0.2 },
  { ticker: 'BBVA.MC', name: 'BBVA', region: 'Europa', sector: 'Finanzas', price: 10.50, change: 1.2 },
  { ticker: 'IBE.MC', name: 'Iberdrola', region: 'Europa', sector: 'Utilities', price: 11.80, change: 0.4 },
  { ticker: 'REP.MC', name: 'Repsol', region: 'Europa', sector: 'Energía', price: 15.40, change: -0.8 },
  { ticker: 'ITX.MC', name: 'Inditex', region: 'Europa', sector: 'Retail', price: 45.00, change: 1.1 },
  { ticker: 'FER.MC', name: 'Ferrovial', region: 'Europa', sector: 'Infraestructura', price: 36.50, change: 0.7 },
  { ticker: 'ENG.MC', name: 'Enagás', region: 'Europa', sector: 'Energía', price: 13.50, change: -0.5 },
  { ticker: 'AENA.MC', name: 'Aena', region: 'Europa', sector: 'Infraestructura', price: 180.00, change: 1.5 },
  { ticker: 'MAP.MC', name: 'Mapfre', region: 'Europa', sector: 'Finanzas', price: 2.30, change: 0.1 },
  { ticker: 'GRF.MC', name: 'Grifols', region: 'Europa', sector: 'Salud', price: 8.50, change: -4.2 },
  { ticker: 'ACS.MC', name: 'ACS', region: 'Europa', sector: 'Construcción', price: 39.00, change: 0.6 },
  { ticker: 'ANA.MC', name: 'Acciona', region: 'Europa', sector: 'Energía', price: 110.00, change: -1.0 },
  { ticker: 'CABK.MC', name: 'CaixaBank', region: 'Europa', sector: 'Finanzas', price: 5.20, change: 0.8 },
  { ticker: 'ELE.MC', name: 'Endesa', region: 'Europa', sector: 'Utilities', price: 18.50, change: 0.3 },
  { ticker: 'IAG.MC', name: 'IAG', region: 'Europa', sector: 'Turismo', price: 2.10, change: 2.5 },
  { ticker: 'LOG.MC', name: 'Logista', region: 'Europa', sector: 'Logística', price: 26.50, change: 0.4 },
  { ticker: 'MEL.MC', name: 'Meliá Hotels', region: 'Europa', sector: 'Turismo', price: 7.80, change: 1.8 },
  { ticker: 'NTGY.MC', name: 'Naturgy', region: 'Europa', sector: 'Energía', price: 22.00, change: -0.2 },
  { ticker: 'VIS.MC', name: 'Viscofan', region: 'Europa', sector: 'Consumo', price: 62.00, change: 0.0 },

  // --- ITALIA (BIT) ---
  { ticker: 'ENEL.MI', name: 'Enel SpA', region: 'Europa', sector: 'Utilities', price: 6.50, change: 0.2 },
  { ticker: 'ISP.MI', name: 'Intesa Sanpaolo', region: 'Europa', sector: 'Finanzas', price: 3.50, change: 1.1 },
  { ticker: 'UCG.MI', name: 'UniCredit', region: 'Europa', sector: 'Finanzas', price: 35.00, change: 2.3 },
  { ticker: 'STM.MI', name: 'STMicroelec.', region: 'Europa', sector: 'Tecnología', price: 38.50, change: -1.5 },
  { ticker: 'DIA.MI', name: 'DiaSorin', region: 'Europa', sector: 'Salud', price: 95.00, change: 0.5 },
  { ticker: 'CPR.MI', name: 'Campari', region: 'Europa', sector: 'Consumo', price: 9.20, change: -0.8 },
  { ticker: 'RACE.MI', name: 'Ferrari', region: 'Europa', sector: 'Automotriz', price: 395.00, change: 1.5 },
  { ticker: 'MONC.MI', name: 'Moncler', region: 'Europa', sector: 'Lujo', price: 65.00, change: 0.7 },
  { ticker: 'TIT.MI', name: 'Telecom Italia', region: 'Europa', sector: 'Telecom', price: 0.25, change: -0.5 },
  { ticker: 'SPM.MI', name: 'Saipem', region: 'Europa', sector: 'Energía', price: 2.10, change: 3.2 },
  { ticker: 'ATL.MI', name: 'Atlantia', region: 'Europa', sector: 'Infraestructura', price: 22.50, change: 0.0 }, // Delisted in reality, kept as mock
  { ticker: 'AZM.MI', name: 'Azimut Holding', region: 'Europa', sector: 'Finanzas', price: 24.50, change: 1.2 },
  { ticker: 'BGN.MI', name: 'Banca Generali', region: 'Europa', sector: 'Finanzas', price: 38.00, change: 0.4 },
  { ticker: 'BAMI.MI', name: 'Banco BPM', region: 'Europa', sector: 'Finanzas', price: 6.20, change: 1.5 },
  { ticker: 'BMED.MI', name: 'Banca Mediolanum', region: 'Europa', sector: 'Finanzas', price: 10.50, change: 0.9 },

  // --- SUIZA (SIX) ---
  { ticker: 'NESN.SW', name: 'Nestlé', region: 'Europa', sector: 'Consumo', price: 92.50, change: -0.4 },
  { ticker: 'ROG.SW', name: 'Roche Holding', region: 'Europa', sector: 'Salud', price: 225.00, change: -1.1 },
  { ticker: 'NOVN.SW', name: 'Novartis', region: 'Europa', sector: 'Salud', price: 95.00, change: 0.5 },
  { ticker: 'ABBN.SW', name: 'ABB Ltd', region: 'Europa', sector: 'Industria', price: 48.00, change: 1.2 },
  { ticker: 'UBSG.SW', name: 'UBS Group', region: 'Europa', sector: 'Finanzas', price: 28.50, change: 1.5 },
  { ticker: 'ZURN.SW', name: 'Zurich Ins.', region: 'Europa', sector: 'Finanzas', price: 485.00, change: 0.8 },
  { ticker: 'CSGN.SW', name: 'Credit Suisse', region: 'Europa', sector: 'Finanzas', price: 0.80, change: 0.0 }, // Historical
  { ticker: 'LONN.SW', name: 'Lonza Group', region: 'Europa', sector: 'Salud', price: 520.00, change: 2.1 },
  { ticker: 'GIVN.SW', name: 'Givaudan', region: 'Europa', sector: 'Materiales', price: 4100.00, change: -0.5 },
  { ticker: 'SIKA.SW', name: 'Sika AG', region: 'Europa', sector: 'Materiales', price: 265.00, change: 1.4 },
  { ticker: 'SREN.SW', name: 'Swiss Re', region: 'Europa', sector: 'Finanzas', price: 115.00, change: 0.6 },
  { ticker: 'SCMN.SW', name: 'Swisscom', region: 'Europa', sector: 'Telecom', price: 510.00, change: 0.2 },
  { ticker: 'GEBN.SW', name: 'Geberit', region: 'Europa', sector: 'Industria', price: 540.00, change: -0.9 },
  { ticker: 'KNIN.SW', name: 'Kuehne + Nagel', region: 'Europa', sector: 'Logística', price: 255.00, change: 0.3 },
  { ticker: 'TEMN.SW', name: 'Temenos', region: 'Europa', sector: 'Tecnología', price: 62.00, change: -2.5 },

  // --- PAÍSES NÓRDICOS ---
  { ticker: 'NOVO-B.CO', name: 'Novo Nordisk', region: 'Europa', sector: 'Salud', price: 920.00, change: 2.8 },
  { ticker: 'VWS.CO', name: 'Vestas Wind', region: 'Europa', sector: 'Energía', price: 185.00, change: 1.5 },
  { ticker: 'ORSTED.CO', name: 'Ørsted', region: 'Europa', sector: 'Energía', price: 380.00, change: -1.2 },
  { ticker: 'CARL-B.CO', name: 'Carlsberg', region: 'Europa', sector: 'Consumo', price: 950.00, change: 0.4 },
  { ticker: 'DSV.CO', name: 'DSV A/S', region: 'Europa', sector: 'Logística', price: 1100.00, change: 1.1 },
  { ticker: 'VOLV-B.ST', name: 'Volvo AB', region: 'Europa', sector: 'Industria', price: 285.00, change: -0.5 },
  { ticker: 'ERIC-B.ST', name: 'Ericsson', region: 'Europa', sector: 'Tecnología', price: 65.00, change: 0.2 },
  { ticker: 'SHB-A.ST', name: 'Handelsbanken', region: 'Europa', sector: 'Finanzas', price: 105.00, change: 0.8 },
  { ticker: 'SWED-A.ST', name: 'Swedbank', region: 'Europa', sector: 'Finanzas', price: 210.00, change: 1.0 },
  { ticker: 'SEB-A.ST', name: 'SEB AB', region: 'Europa', sector: 'Finanzas', price: 145.00, change: 0.7 },
  { ticker: 'ATCO-A.ST', name: 'Atlas Copco', region: 'Europa', sector: 'Industria', price: 185.00, change: 1.3 },
  { ticker: 'SCV-B.ST', name: 'Sandvik', region: 'Europa', sector: 'Industria', price: 230.00, change: 0.4 },
  { ticker: 'TEL2-B.ST', name: 'Tele2 AB', region: 'Europa', sector: 'Telecom', price: 95.00, change: -0.1 },
  { ticker: 'HEXA-B.ST', name: 'Hexagon AB', region: 'Europa', sector: 'Tecnología', price: 115.00, change: 2.1 },
  { ticker: 'ELUX-B.ST', name: 'Electrolux', region: 'Europa', sector: 'Consumo', price: 98.00, change: -1.5 },
  { ticker: 'NDA-FI.HE', name: 'Nordea Bank', region: 'Europa', sector: 'Finanzas', price: 11.50, change: 1.2 },
  { ticker: 'NOKIA.HE', name: 'Nokia', region: 'Europa', sector: 'Tecnología', price: 3.40, change: 0.5 },
  { ticker: 'UPM.HE', name: 'UPM-Kymmene', region: 'Europa', sector: 'Materiales', price: 32.00, change: 0.8 },
  { ticker: 'FORTUM.HE', name: 'Fortum', region: 'Europa', sector: 'Utilities', price: 12.80, change: -0.2 },
  { ticker: 'SAMPO.HE', name: 'Sampo', region: 'Europa', sector: 'Finanzas', price: 42.00, change: 0.6 },
  { ticker: 'DNB.OL', name: 'DNB ASA', region: 'Europa', sector: 'Finanzas', price: 210.00, change: 0.9 },
  { ticker: 'EQNR.OL', name: 'Equinor', region: 'Europa', sector: 'Energía', price: 310.00, change: -1.4 },
  { ticker: 'TEL.OL', name: 'Telenor', region: 'Europa', sector: 'Telecom', price: 125.00, change: 0.1 },
  { ticker: 'YAR.OL', name: 'Yara Intl', region: 'Europa', sector: 'Materiales', price: 340.00, change: -0.8 },
  { ticker: 'NHY.OL', name: 'Norsk Hydro', region: 'Europa', sector: 'Materiales', price: 65.00, change: 1.5 },

  // --- ETFs EUROPEOS ---
  { ticker: 'VGK', name: 'Vanguard Europe', region: 'Europa', sector: 'ETF', price: 68.50, change: 0.4 },
  { ticker: 'IEV', name: 'iShares Europe', region: 'Europa', sector: 'ETF', price: 54.20, change: 0.3 },
  { ticker: 'FEZ', name: 'SPDR Euro Stoxx 50', region: 'Europa', sector: 'ETF', price: 48.90, change: 0.6 },
  { ticker: 'EZU', name: 'iShares Eurozone', region: 'Europa', sector: 'ETF', price: 45.50, change: 0.5 },
  { ticker: 'HEDJ', name: 'WisdomTree Europe', region: 'Europa', sector: 'ETF', price: 82.00, change: 0.8 },
  { ticker: 'EPOL', name: 'iShares Poland', region: 'Europa', sector: 'ETF', price: 18.50, change: 1.2 },
  { ticker: 'EIRL', name: 'iShares Ireland', region: 'Europa', sector: 'ETF', price: 52.00, change: -0.2 },
  { ticker: 'EWU', name: 'iShares UK', region: 'Europa', sector: 'ETF', price: 34.50, change: 0.1 },
  { ticker: 'EWG', name: 'iShares Germany', region: 'Europa', sector: 'ETF', price: 32.00, change: 0.4 },
  { ticker: 'EWQ', name: 'iShares France', region: 'Europa', sector: 'ETF', price: 38.50, change: 0.2 },
  { ticker: 'EWI', name: 'iShares Italy', region: 'Europa', sector: 'ETF', price: 32.50, change: 0.9 },
  { ticker: 'EWP', name: 'iShares Spain', region: 'Europa', sector: 'ETF', price: 28.00, change: 0.3 },
  { ticker: 'EWN', name: 'iShares Neth.', region: 'Europa', sector: 'ETF', price: 42.00, change: 0.6 },
  { ticker: 'EWD', name: 'iShares Sweden', region: 'Europa', sector: 'ETF', price: 40.50, change: 0.1 },
  { ticker: 'EDEN', name: 'iShares Denmark', region: 'Europa', sector: 'ETF', price: 85.00, change: 1.5 },
  { ticker: 'EWO', name: 'iShares Austria', region: 'Europa', sector: 'ETF', price: 22.00, change: -0.4 },
  { ticker: 'EWL', name: 'iShares Switz.', region: 'Europa', sector: 'ETF', price: 51.00, change: 0.2 },
  { ticker: 'NORW', name: 'Global X Norway', region: 'Europa', sector: 'ETF', price: 14.50, change: -0.6 },
  { ticker: 'GREK', name: 'Global X Greece', region: 'Europa', sector: 'ETF', price: 34.00, change: 1.8 },
  { ticker: 'FLFR', name: 'Franklin France', region: 'Europa', sector: 'ETF', price: 29.50, change: 0.2 },
  { ticker: 'FLGR', name: 'Franklin Germany', region: 'Europa', sector: 'ETF', price: 26.00, change: 0.4 },
  { ticker: 'FLIT', name: 'Franklin Italy', region: 'Europa', sector: 'ETF', price: 24.50, change: 0.9 },
  { ticker: 'FLSP', name: 'Franklin Spain', region: 'Europa', sector: 'ETF', price: 22.00, change: 0.3 },
  { ticker: 'FLGB', name: 'Franklin UK', region: 'Europa', sector: 'ETF', price: 25.50, change: 0.1 },
  { ticker: 'FLEE', name: 'Franklin Europe', region: 'Europa', sector: 'ETF', price: 28.00, change: 0.4 },


//////////////////////777
////////////////////////

  // Asia Pacífico
 // --- JAPÓN (TOKYO EXCHANGE) ---
  { ticker: '7203.T', name: 'Toyota Motor', region: 'Asia Pacífico', sector: 'Automotriz', price: 3450.00, change: -0.2 },
  { ticker: '6758.T', name: 'Sony Group', region: 'Asia Pacífico', sector: 'Tecnología', price: 13200.00, change: 1.5 },
  { ticker: '8306.T', name: 'Mitsubishi UFJ', region: 'Asia Pacífico', sector: 'Finanzas', price: 1560.00, change: 0.8 },
  { ticker: '9433.T', name: 'KDDI Corp', region: 'Asia Pacífico', sector: 'Telecom', price: 4500.00, change: 0.1 },
  { ticker: '9434.T', name: 'SoftBank Corp', region: 'Asia Pacífico', sector: 'Telecom', price: 1850.00, change: -0.5 },
  { ticker: '8802.T', name: 'Mitsubishi Estate', region: 'Asia Pacífico', sector: 'Inmobiliaria', price: 2800.00, change: 0.3 },
  { ticker: '4502.T', name: 'Takeda Pharma', region: 'Asia Pacífico', sector: 'Salud', price: 4200.00, change: -1.1 },
  { ticker: '4503.T', name: 'Astellas Pharma', region: 'Asia Pacífico', sector: 'Salud', price: 1650.00, change: 0.4 },
  { ticker: '6501.T', name: 'Hitachi Ltd', region: 'Asia Pacífico', sector: 'Industria', price: 14500.00, change: 2.1 },
  { ticker: '7733.T', name: 'Olympus Corp', region: 'Asia Pacífico', sector: 'Salud', price: 2450.00, change: -0.8 },
  { ticker: '6902.T', name: 'Denso Corp', region: 'Asia Pacífico', sector: 'Automotriz', price: 2850.00, change: 1.2 },
  { ticker: '7751.T', name: 'Canon Inc', region: 'Asia Pacífico', sector: 'Tecnología', price: 4600.00, change: 0.6 },
  { ticker: '8035.T', name: 'Tokyo Electron', region: 'Asia Pacífico', sector: 'Semiconductores', price: 38500.00, change: 3.5 },
  { ticker: '7267.T', name: 'Honda Motor', region: 'Asia Pacífico', sector: 'Automotriz', price: 1820.00, change: -0.3 },
  { ticker: '4063.T', name: 'Shin-Etsu Chem', region: 'Asia Pacífico', sector: 'Materiales', price: 6500.00, change: 1.8 },
  { ticker: '9984.T', name: 'SoftBank Group', region: 'Asia Pacífico', sector: 'Finanzas', price: 9200.00, change: -2.1 },
  { ticker: '8766.T', name: 'Tokio Marine', region: 'Asia Pacífico', sector: 'Finanzas', price: 5400.00, change: 0.9 },
  { ticker: '8411.T', name: 'Mizuho Financial', region: 'Asia Pacífico', sector: 'Finanzas', price: 3200.00, change: 1.1 },
  { ticker: '4452.T', name: 'Kao Corp', region: 'Asia Pacífico', sector: 'Consumo', price: 5800.00, change: -0.4 },
  { ticker: '4519.T', name: 'Chugai Pharma', region: 'Asia Pacífico', sector: 'Salud', price: 5200.00, change: 0.2 },
  { ticker: '6098.T', name: 'Recruit Holdings', region: 'Asia Pacífico', sector: 'Servicios', price: 7800.00, change: 1.5 },
  { ticker: '6857.T', name: 'Advantest', region: 'Asia Pacífico', sector: 'Semiconductores', price: 5800.00, change: 2.8 },
  { ticker: '7974.T', name: 'Nintendo', region: 'Asia Pacífico', sector: 'Consumo', price: 8500.00, change: 1.3 },
  { ticker: '4568.T', name: 'Daiichi Sankyo', region: 'Asia Pacífico', sector: 'Salud', price: 5400.00, change: -0.2 },
  { ticker: '8058.T', name: 'Mitsubishi Corp', region: 'Asia Pacífico', sector: 'Industria', price: 3450.00, change: 1.0 },
  { ticker: '8031.T', name: 'Mitsui & Co', region: 'Asia Pacífico', sector: 'Industria', price: 7200.00, change: 0.7 },
  { ticker: '8801.T', name: 'Mitsui Fudosan', region: 'Asia Pacífico', sector: 'Inmobiliaria', price: 1550.00, change: -0.6 },
  { ticker: '9020.T', name: 'East Japan Rail', region: 'Asia Pacífico', sector: 'Transporte', price: 2950.00, change: 0.5 },
  { ticker: '9022.T', name: 'Central Japan Rail', region: 'Asia Pacífico', sector: 'Transporte', price: 3500.00, change: 0.3 },
  { ticker: '9432.T', name: 'NTT Corp', region: 'Asia Pacífico', sector: 'Telecom', price: 180.00, change: 0.1 },
  { ticker: '6752.T', name: 'Panasonic', region: 'Asia Pacífico', sector: 'Electrónica', price: 1420.00, change: -0.9 },
  { ticker: '6770.T', name: 'Alps Alpine', region: 'Asia Pacífico', sector: 'Electrónica', price: 1100.00, change: 0.2 },
  { ticker: '7011.T', name: 'Mitsubishi Heavy', region: 'Asia Pacífico', sector: 'Industria', price: 1350.00, change: 1.6 },
  { ticker: '7741.T', name: 'HOYA Corp', region: 'Asia Pacífico', sector: 'Salud', price: 18500.00, change: 0.8 },
  { ticker: '7816.T', name: 'Snow Peak', region: 'Asia Pacífico', sector: 'Consumo', price: 1250.00, change: -1.5 },
  { ticker: '4901.T', name: 'Fujifilm', region: 'Asia Pacífico', sector: 'Tecnología', price: 3400.00, change: 0.5 },
  { ticker: '3402.T', name: 'Toray Industries', region: 'Asia Pacífico', sector: 'Materiales', price: 750.00, change: -0.3 },
  { ticker: '3405.T', name: 'Kuraray', region: 'Asia Pacífico', sector: 'Materiales', price: 1650.00, change: 0.4 },
  { ticker: '3407.T', name: 'Asahi Kasei', region: 'Asia Pacífico', sector: 'Materiales', price: 1100.00, change: 0.1 },
  
  // --- CHINA A-SHARES (SHENZHEN/SHANGHAI) ---
  { ticker: '000858.SZ', name: 'Wuliangye Yibin', region: 'Asia Pacífico', sector: 'Consumo', price: 145.00, change: 0.5 },
  { ticker: '000333.SZ', name: 'Midea Group', region: 'Asia Pacífico', sector: 'Consumo', price: 65.00, change: 1.2 },
  { ticker: '000001.SZ', name: 'Ping An Bank', region: 'Asia Pacífico', sector: 'Finanzas', price: 10.50, change: -0.3 },
  { ticker: '000002.SZ', name: 'China Vanke', region: 'Asia Pacífico', sector: 'Inmobiliaria', price: 8.20, change: -2.5 },
  { ticker: '000063.SZ', name: 'ZTE Corp', region: 'Asia Pacífico', sector: 'Tecnología', price: 28.50, change: 1.8 },
  { ticker: '000725.SZ', name: 'BOE Technology', region: 'Asia Pacífico', sector: 'Tecnología', price: 4.20, change: 0.0 },
  { ticker: '000651.SZ', name: 'Gree Electric', region: 'Asia Pacífico', sector: 'Consumo', price: 38.00, change: 0.6 },
  { ticker: '000538.SZ', name: 'Yunnan Baiyao', region: 'Asia Pacífico', sector: 'Salud', price: 52.00, change: -0.4 },
  { ticker: '000568.SZ', name: 'Luzhou Laojiao', region: 'Asia Pacífico', sector: 'Consumo', price: 180.00, change: 0.9 },
  { ticker: '000792.SZ', name: 'Tibet Rhodiola', region: 'Asia Pacífico', sector: 'Salud', price: 45.00, change: 2.1 },
  { ticker: '600036.SS', name: 'China Merch Bank', region: 'Asia Pacífico', sector: 'Finanzas', price: 32.00, change: 0.8 },
  { ticker: '600519.SS', name: 'Kweichow Moutai', region: 'Asia Pacífico', sector: 'Consumo', price: 1700.00, change: 1.5 },
  { ticker: '601318.SS', name: 'Ping An Ins', region: 'Asia Pacífico', sector: 'Finanzas', price: 42.00, change: 1.1 },
  { ticker: '601288.SS', name: 'Ag Bank of China', region: 'Asia Pacífico', sector: 'Finanzas', price: 3.80, change: 0.2 },
  { ticker: '601398.SS', name: 'ICBC', region: 'Asia Pacífico', sector: 'Finanzas', price: 5.20, change: 0.3 },
  { ticker: '601857.SS', name: 'PetroChina', region: 'Asia Pacífico', sector: 'Energía', price: 9.50, change: -0.5 },
  { ticker: '601088.SS', name: 'China Shenhua', region: 'Asia Pacífico', sector: 'Energía', price: 38.00, change: 1.2 },
  { ticker: '601628.SS', name: 'China Life Ins', region: 'Asia Pacífico', sector: 'Finanzas', price: 32.00, change: 0.6 },
  { ticker: '601766.SS', name: 'CRRC Corp', region: 'Asia Pacífico', sector: 'Industria', price: 6.50, change: 0.4 },
  { ticker: '601988.SS', name: 'Bank of China', region: 'Asia Pacífico', sector: 'Finanzas', price: 4.50, change: 0.1 },
  { ticker: '601818.SS', name: 'Everbright Bank', region: 'Asia Pacífico', sector: 'Finanzas', price: 3.10, change: 0.0 },
  { ticker: '601328.SS', name: 'Bank of Comms', region: 'Asia Pacífico', sector: 'Finanzas', price: 6.80, change: 0.2 },
  { ticker: '601998.SS', name: 'CITIC Bank', region: 'Asia Pacífico', sector: 'Finanzas', price: 6.20, change: -0.1 },
  { ticker: '601939.SS', name: 'CCB', region: 'Asia Pacífico', sector: 'Finanzas', price: 6.90, change: 0.4 },
  { ticker: '601601.SS', name: 'China Pac Ins', region: 'Asia Pacífico', sector: 'Finanzas', price: 28.00, change: 0.7 },
  { ticker: '601688.SS', name: 'Huatai Sec', region: 'Asia Pacífico', sector: 'Finanzas', price: 14.00, change: 1.3 },
  { ticker: '600887.SS', name: 'Inner Mongolia Yili', region: 'Asia Pacífico', sector: 'Consumo', price: 28.50, change: -0.8 },
  { ticker: '600900.SS', name: 'Yangtze Power', region: 'Asia Pacífico', sector: 'Utilities', price: 24.00, change: 0.3 },
  { ticker: '600030.SS', name: 'CITIC Sec', region: 'Asia Pacífico', sector: 'Finanzas', price: 21.00, change: 0.9 },
  { ticker: '600104.SS', name: 'SAIC Motor', region: 'Asia Pacífico', sector: 'Automotriz', price: 14.50, change: -1.2 },

  // --- HONG KONG ---
  { ticker: '0700.HK', name: 'Tencent', region: 'Asia Pacífico', sector: 'Tecnología', price: 380.00, change: 2.5 },
  { ticker: '0941.HK', name: 'China Mobile', region: 'Asia Pacífico', sector: 'Telecom', price: 68.00, change: 0.4 },
  { ticker: '0005.HK', name: 'HSBC Holdings', region: 'Asia Pacífico', sector: 'Finanzas', price: 62.00, change: 0.8 },
  { ticker: '1299.HK', name: 'AIA Group', region: 'Asia Pacífico', sector: 'Finanzas', price: 58.00, change: -0.5 },
  { ticker: '0388.HK', name: 'HKEX', region: 'Asia Pacífico', sector: 'Finanzas', price: 260.00, change: 1.2 },
  { ticker: '3988.HK', name: 'Bank of China', region: 'Asia Pacífico', sector: 'Finanzas', price: 3.20, change: 0.1 },
  { ticker: '1398.HK', name: 'ICBC', region: 'Asia Pacífico', sector: 'Finanzas', price: 4.10, change: 0.2 },
  { ticker: '2318.HK', name: 'Ping An Ins', region: 'Asia Pacífico', sector: 'Finanzas', price: 35.00, change: 0.9 },
  { ticker: '2628.HK', name: 'China Life', region: 'Asia Pacífico', sector: 'Finanzas', price: 10.50, change: 0.3 },
  { ticker: '0939.HK', name: 'CCB', region: 'Asia Pacífico', sector: 'Finanzas', price: 5.40, change: 0.4 },
  { ticker: '0883.HK', name: 'CNOOC', region: 'Asia Pacífico', sector: 'Energía', price: 18.20, change: 1.5 },
  { ticker: '1088.HK', name: 'China Shenhua', region: 'Asia Pacífico', sector: 'Energía', price: 28.50, change: 0.8 },
  { ticker: '0857.HK', name: 'PetroChina', region: 'Asia Pacífico', sector: 'Energía', price: 6.80, change: -0.2 },
  { ticker: '0914.HK', name: 'Anhui Conch', region: 'Asia Pacífico', sector: 'Materiales', price: 18.50, change: -1.1 },
  { ticker: '0001.HK', name: 'CK Hutchison', region: 'Asia Pacífico', sector: 'Industria', price: 38.00, change: 0.2 },
  { ticker: '0002.HK', name: 'CLP Holdings', region: 'Asia Pacífico', sector: 'Utilities', price: 65.00, change: 0.5 },
  { ticker: '0003.HK', name: 'HK & China Gas', region: 'Asia Pacífico', sector: 'Utilities', price: 5.80, change: 0.1 },
  { ticker: '0011.HK', name: 'Hang Seng Bank', region: 'Asia Pacífico', sector: 'Finanzas', price: 98.00, change: 0.6 },
  { ticker: '0016.HK', name: 'Sun Hung Kai', region: 'Asia Pacífico', sector: 'Inmobiliaria', price: 75.00, change: -0.4 },
  { ticker: '0017.HK', name: 'New World Dev', region: 'Asia Pacífico', sector: 'Inmobiliaria', price: 8.50, change: -2.0 },
  { ticker: '0019.HK', name: 'Swire Pacific', region: 'Asia Pacífico', sector: 'Industria', price: 65.00, change: 1.1 },
  { ticker: '0027.HK', name: 'Galaxy Ent', region: 'Asia Pacífico', sector: 'Consumo', price: 36.00, change: 2.2 },
  { ticker: '0066.HK', name: 'MTR Corp', region: 'Asia Pacífico', sector: 'Transporte', price: 26.00, change: 0.3 },
  { ticker: '0083.HK', name: 'Sino Land', region: 'Asia Pacífico', sector: 'Inmobiliaria', price: 8.20, change: 0.0 },
  { ticker: '0101.HK', name: 'Hang Lung Prop', region: 'Asia Pacífico', sector: 'Inmobiliaria', price: 8.80, change: -0.5 },

  // --- TAIWAN ---
  { ticker: '2330.TW', name: 'TSMC', region: 'Asia Pacífico', sector: 'Semiconductores', price: 820.00, change: 3.2 },
  { ticker: '2454.TW', name: 'MediaTek', region: 'Asia Pacífico', sector: 'Semiconductores', price: 1150.00, change: 2.5 },
  { ticker: '2317.TW', name: 'Hon Hai (Foxconn)', region: 'Asia Pacífico', sector: 'Tecnología', price: 155.00, change: 1.8 },
  { ticker: '2882.TW', name: 'Cathay Financial', region: 'Asia Pacífico', sector: 'Finanzas', price: 52.00, change: 0.9 },
  { ticker: '2881.TW', name: 'Fubon Financial', region: 'Asia Pacífico', sector: 'Finanzas', price: 72.00, change: 1.1 },
  { ticker: '1301.TW', name: 'Formosa Plastics', region: 'Asia Pacífico', sector: 'Materiales', price: 68.00, change: -0.5 },
  { ticker: '1303.TW', name: 'Nan Ya Plastics', region: 'Asia Pacífico', sector: 'Materiales', price: 55.00, change: -0.2 },
  { ticker: '2002.TW', name: 'China Steel', region: 'Asia Pacífico', sector: 'Materiales', price: 24.50, change: 0.3 },
  { ticker: '2409.TW', name: 'AU Optronics', region: 'Asia Pacífico', sector: 'Tecnología', price: 18.20, change: -1.5 },
  { ticker: '3008.TW', name: 'Largan Precision', region: 'Asia Pacífico', sector: 'Tecnología', price: 2450.00, change: 0.8 },
  { ticker: '2303.TW', name: 'UMC', region: 'Asia Pacífico', sector: 'Semiconductores', price: 52.00, change: 1.2 },
  { ticker: '2308.TW', name: 'Delta Electronics', region: 'Asia Pacífico', sector: 'Tecnología', price: 340.00, change: 2.1 },
  { ticker: '2324.TW', name: 'Compal Elec', region: 'Asia Pacífico', sector: 'Tecnología', price: 38.00, change: 0.4 },
  { ticker: '2357.TW', name: 'Asustek', region: 'Asia Pacífico', sector: 'Tecnología', price: 480.00, change: 1.5 },
  { ticker: '2382.TW', name: 'Quanta Computer', region: 'Asia Pacífico', sector: 'Tecnología', price: 260.00, change: 2.8 },
  { ticker: '2412.TW', name: 'Chunghwa Telecom', region: 'Asia Pacífico', sector: 'Telecom', price: 125.00, change: 0.2 },
  { ticker: '2474.TW', name: 'Catcher Tech', region: 'Asia Pacífico', sector: 'Tecnología', price: 180.00, change: -0.8 },
  { ticker: '2498.TW', name: 'HTC Corp', region: 'Asia Pacífico', sector: 'Tecnología', price: 45.00, change: -2.5 },
  { ticker: '2886.TW', name: 'Mega Financial', region: 'Asia Pacífico', sector: 'Finanzas', price: 42.00, change: 0.6 },
  { ticker: '2891.TW', name: 'CTBC Financial', region: 'Asia Pacífico', sector: 'Finanzas', price: 32.00, change: 0.8 },

  // --- COREA DEL SUR (KRX) ---
  { ticker: '005930.KS', name: 'Samsung Elec', region: 'Asia Pacífico', sector: 'Tecnología', price: 78500.00, change: 1.5 },
  { ticker: '000660.KS', name: 'SK Hynix', region: 'Asia Pacífico', sector: 'Semiconductores', price: 182000.00, change: 3.8 },
  { ticker: '051910.KS', name: 'LG Chem', region: 'Asia Pacífico', sector: 'Materiales', price: 420000.00, change: -1.2 },
  { ticker: '035420.KS', name: 'Naver Corp', region: 'Asia Pacífico', sector: 'Tecnología', price: 185000.00, change: 0.5 },
  { ticker: '068270.KS', name: 'Celltrion', region: 'Asia Pacífico', sector: 'Salud', price: 192000.00, change: 2.1 },
  { ticker: '105560.KS', name: 'KB Financial', region: 'Asia Pacífico', sector: 'Finanzas', price: 72000.00, change: 1.8 },
  { ticker: '032830.KS', name: 'Samsung Life', region: 'Asia Pacífico', sector: 'Finanzas', price: 85000.00, change: 0.4 },
  { ticker: '055550.KS', name: 'Shinhan Financial', region: 'Asia Pacífico', sector: 'Finanzas', price: 48000.00, change: 1.2 },
  { ticker: '086790.KS', name: 'Hana Financial', region: 'Asia Pacífico', sector: 'Finanzas', price: 58000.00, change: 0.9 },
  { ticker: '028260.KS', name: 'Samsung C&T', region: 'Asia Pacífico', sector: 'Industria', price: 145000.00, change: -0.3 },
  { ticker: '000270.KS', name: 'Kia Corp', region: 'Asia Pacífico', sector: 'Automotriz', price: 125000.00, change: 2.5 },
  { ticker: '003550.KS', name: 'LG Corp', region: 'Asia Pacífico', sector: 'Industria', price: 92000.00, change: 0.6 },
  { ticker: '003490.KS', name: 'Korean Air', region: 'Asia Pacífico', sector: 'Transporte', price: 22000.00, change: 1.1 },
  { ticker: '009150.KS', name: 'Samsung Electro', region: 'Asia Pacífico', sector: 'Tecnología', price: 155000.00, change: 1.4 },
  { ticker: '009540.KS', name: 'Hyundai Heavy', region: 'Asia Pacífico', sector: 'Industria', price: 128000.00, change: 0.8 },
  { ticker: '012330.KS', name: 'Hyundai Mobis', region: 'Asia Pacífico', sector: 'Automotriz', price: 245000.00, change: 0.5 },
  { ticker: '015760.KS', name: 'KEPCO', region: 'Asia Pacífico', sector: 'Utilities', price: 19500.00, change: -0.8 },
  { ticker: '017670.KS', name: 'SK Telecom', region: 'Asia Pacífico', sector: 'Telecom', price: 52000.00, change: 0.2 },
  { ticker: '018260.KS', name: 'Samsung SDS', region: 'Asia Pacífico', sector: 'Tecnología', price: 162000.00, change: 1.0 },
  { ticker: '034020.KS', name: 'Doosan Infracore', region: 'Asia Pacífico', sector: 'Industria', price: 8500.00, change: -1.5 },

  // --- INDIA (NSE/BSE) ---
  { ticker: 'RELIANCE.NS', name: 'Reliance Ind', region: 'Asia Pacífico', sector: 'Energía', price: 2950.00, change: 1.5 },
  { ticker: 'TCS.NS', name: 'TCS', region: 'Asia Pacífico', sector: 'Tecnología', price: 3950.00, change: 0.8 },
  { ticker: 'HDFCBANK.NS', name: 'HDFC Bank', region: 'Asia Pacífico', sector: 'Finanzas', price: 1520.00, change: -0.4 },
  { ticker: 'INFY.NS', name: 'Infosys', region: 'Asia Pacífico', sector: 'Tecnología', price: 1480.00, change: 0.5 },
  { ticker: 'HINDUNILVR.NS', name: 'Hindustan Unilever', region: 'Asia Pacífico', sector: 'Consumo', price: 2450.00, change: -0.2 },
  { ticker: 'ICICIBANK.NS', name: 'ICICI Bank', region: 'Asia Pacífico', sector: 'Finanzas', price: 1120.00, change: 1.1 },
  { ticker: 'KOTAKBANK.NS', name: 'Kotak Bank', region: 'Asia Pacífico', sector: 'Finanzas', price: 1780.00, change: 0.3 },
  { ticker: 'BAJFINANCE.NS', name: 'Bajaj Finance', region: 'Asia Pacífico', sector: 'Finanzas', price: 7200.00, change: 2.1 },
  { ticker: 'BHARTIARTL.NS', name: 'Bharti Airtel', region: 'Asia Pacífico', sector: 'Telecom', price: 1250.00, change: 1.5 },
  { ticker: 'ITC.NS', name: 'ITC Ltd', region: 'Asia Pacífico', sector: 'Consumo', price: 435.00, change: 0.6 },
  { ticker: 'LT.NS', name: 'Larsen & Toubro', region: 'Asia Pacífico', sector: 'Industria', price: 3650.00, change: 1.8 },
  { ticker: 'AXISBANK.NS', name: 'Axis Bank', region: 'Asia Pacífico', sector: 'Finanzas', price: 1080.00, change: 0.9 },
  { ticker: 'SBIN.NS', name: 'SBI', region: 'Asia Pacífico', sector: 'Finanzas', price: 780.00, change: 1.2 },
  { ticker: 'ASIANPAINT.NS', name: 'Asian Paints', region: 'Asia Pacífico', sector: 'Materiales', price: 2950.00, change: -0.5 },
  { ticker: 'MARUTI.NS', name: 'Maruti Suzuki', region: 'Asia Pacífico', sector: 'Automotriz', price: 12500.00, change: 0.4 },
  { ticker: 'SUNPHARMA.NS', name: 'Sun Pharma', region: 'Asia Pacífico', sector: 'Salud', price: 1550.00, change: 0.7 },
  { ticker: 'TITAN.NS', name: 'Titan Company', region: 'Asia Pacífico', sector: 'Consumo', price: 3450.00, change: -1.1 },
  { ticker: 'WIPRO.NS', name: 'Wipro', region: 'Asia Pacífico', sector: 'Tecnología', price: 480.00, change: 0.2 },
  { ticker: 'ULTRACEMCO.NS', name: 'UltraTech Cement', region: 'Asia Pacífico', sector: 'Materiales', price: 9800.00, change: 1.3 },
  { ticker: 'NTPC.NS', name: 'NTPC', region: 'Asia Pacífico', sector: 'Utilities', price: 360.00, change: 0.8 },
  { ticker: 'ONGC.NS', name: 'ONGC', region: 'Asia Pacífico', sector: 'Energía', price: 280.00, change: 1.5 },
  { ticker: 'POWERGRID.NS', name: 'Power Grid', region: 'Asia Pacífico', sector: 'Utilities', price: 290.00, change: 0.5 },
  { ticker: 'M&M.NS', name: 'Mahindra', region: 'Asia Pacífico', sector: 'Automotriz', price: 2150.00, change: 2.2 },
  { ticker: 'HCLTECH.NS', name: 'HCL Tech', region: 'Asia Pacífico', sector: 'Tecnología', price: 1350.00, change: 0.6 },
  { ticker: 'ADANIPORTS.NS', name: 'Adani Ports', region: 'Asia Pacífico', sector: 'Industria', price: 1320.00, change: 1.8 },

  // --- AUSTRALIA (ASX) ---
  { ticker: 'BHP.AX', name: 'BHP Group', region: 'Asia Pacífico', sector: 'Materiales', price: 44.50, change: -0.5 },
  { ticker: 'CBA.AX', name: 'CommBank', region: 'Asia Pacífico', sector: 'Finanzas', price: 118.00, change: 0.8 },
  { ticker: 'CSL.AX', name: 'CSL Ltd', region: 'Asia Pacífico', sector: 'Salud', price: 290.00, change: 0.2 },
  { ticker: 'WBC.AX', name: 'Westpac', region: 'Asia Pacífico', sector: 'Finanzas', price: 26.50, change: 0.5 },
  { ticker: 'NAB.AX', name: 'NAB', region: 'Asia Pacífico', sector: 'Finanzas', price: 34.00, change: 0.6 },
  { ticker: 'ANZ.AX', name: 'ANZ Group', region: 'Asia Pacífico', sector: 'Finanzas', price: 28.50, change: 0.4 },
  { ticker: 'WES.AX', name: 'Wesfarmers', region: 'Asia Pacífico', sector: 'Consumo', price: 68.00, change: 0.3 },
  { ticker: 'WOW.AX', name: 'Woolworths', region: 'Asia Pacífico', sector: 'Consumo', price: 32.50, change: -0.2 },
  { ticker: 'TLS.AX', name: 'Telstra', region: 'Asia Pacífico', sector: 'Telecom', price: 3.80, change: 0.1 },
  { ticker: 'FMG.AX', name: 'Fortescue', region: 'Asia Pacífico', sector: 'Materiales', price: 25.00, change: -1.2 },
  { ticker: 'RIO.AX', name: 'Rio Tinto', region: 'Asia Pacífico', sector: 'Materiales', price: 128.00, change: -0.8 },
  { ticker: 'MQG.AX', name: 'Macquarie Group', region: 'Asia Pacífico', sector: 'Finanzas', price: 195.00, change: 1.5 },
  { ticker: 'GMG.AX', name: 'Goodman Group', region: 'Asia Pacífico', sector: 'Inmobiliaria', price: 34.00, change: 0.9 },
  { ticker: 'COH.AX', name: 'Cochlear', region: 'Asia Pacífico', sector: 'Salud', price: 320.00, change: 0.5 },
  { ticker: 'XRO.AX', name: 'Xero Ltd', region: 'Asia Pacífico', sector: 'Tecnología', price: 135.00, change: 2.1 },
  { ticker: 'ALL.AX', name: 'Aristocrat', region: 'Asia Pacífico', sector: 'Consumo', price: 42.00, change: 0.6 },
  { ticker: 'AMC.AX', name: 'Amcor', region: 'Asia Pacífico', sector: 'Materiales', price: 15.50, change: 0.2 },
  { ticker: 'BXB.AX', name: 'Brambles', region: 'Asia Pacífico', sector: 'Industria', price: 14.80, change: 0.3 },
  { ticker: 'CPU.AX', name: 'Computershare', region: 'Asia Pacífico', sector: 'Tecnología', price: 26.00, change: 0.4 },
  { ticker: 'RMD.AX', name: 'ResMed', region: 'Asia Pacífico', sector: 'Salud', price: 32.00, change: 0.8 },

  // --- ETFs ASIA-PACÍFICO ---
  { ticker: 'VPL', name: 'Vanguard Pacific', region: 'Asia Pacífico', sector: 'ETF', price: 72.50, change: 0.5 },
  { ticker: 'AAXJ', name: 'iShares Asia ex-JP', region: 'Asia Pacífico', sector: 'ETF', price: 68.00, change: 0.8 },
  { ticker: 'GMF', name: 'SPDR Emg Asia', region: 'Asia Pacífico', sector: 'ETF', price: 105.00, change: 0.6 },
  { ticker: 'EPI', name: 'WisdomTree India', region: 'Asia Pacífico', sector: 'ETF', price: 45.00, change: 1.2 },
  { ticker: 'EWT', name: 'iShares Taiwan', region: 'Asia Pacífico', sector: 'ETF', price: 52.00, change: 1.5 },
  { ticker: 'EWY', name: 'iShares S. Korea', region: 'Asia Pacífico', sector: 'ETF', price: 64.00, change: 0.9 },
  { ticker: 'EWJ', name: 'iShares Japan', region: 'Asia Pacífico', sector: 'ETF', price: 72.00, change: 0.4 },
  { ticker: 'FXI', name: 'iShares China Large', region: 'Asia Pacífico', sector: 'ETF', price: 26.50, change: 0.2 },
  { ticker: 'MCHI', name: 'iShares MSCI China', region: 'Asia Pacífico', sector: 'ETF', price: 42.00, change: 0.3 },
  { ticker: 'ASHR', name: 'Xtrackers CSI 300', region: 'Asia Pacífico', sector: 'ETF', price: 24.50, change: 0.1 },
  { ticker: 'KWEB', name: 'KraneShares Inet', region: 'Asia Pacífico', sector: 'ETF', price: 28.00, change: 1.8 },
  { ticker: 'CQQQ', name: 'Invesco China Tech', region: 'Asia Pacífico', sector: 'ETF', price: 34.00, change: 2.1 },
  { ticker: 'INDA', name: 'iShares MSCI India', region: 'Asia Pacífico', sector: 'ETF', price: 54.00, change: 1.1 },
  { ticker: 'EPHE', name: 'iShares Philippines', region: 'Asia Pacífico', sector: 'ETF', price: 28.00, change: -0.5 },
  { ticker: 'THD', name: 'iShares Thailand', region: 'Asia Pacífico', sector: 'ETF', price: 62.00, change: 0.2 },
  { ticker: 'EIDO', name: 'iShares Indonesia', region: 'Asia Pacífico', sector: 'ETF', price: 21.00, change: 0.4 },
  { ticker: 'EWA', name: 'iShares Australia', region: 'Asia Pacífico', sector: 'ETF', price: 25.50, change: 0.6 },
  { ticker: 'EWH', name: 'iShares Hong Kong', region: 'Asia Pacífico', sector: 'ETF', price: 20.00, change: 0.3 },
  { ticker: 'EWSS', name: 'iShares Singapore', region: 'Asia Pacífico', sector: 'ETF', price: 18.50, change: 0.2 },
  { ticker: 'AAXJ', name: 'iShares Asia', region: 'Asia Pacífico', sector: 'ETF', price: 68.50, change: 0.8 },




  { ticker: 'EEM', name: 'iShares MSCI Emerging Markets ETF', region: 'Mercados Emergentes', sector: 'ETF', price: 41.22, change: -0.3 },
{ ticker: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', region: 'Mercados Emergentes', sector: 'ETF', price: 43.87, change: 0.15 },
{ ticker: 'EMXC', name: 'iShares MSCI Emerging Markets ex China ETF', region: 'Mercados Emergentes', sector: 'ETF', price: 55.71, change: 0.32 },
{ ticker: 'SCHE', name: 'Schwab Emerging Markets Equity ETF', region: 'Mercados Emergentes', sector: 'ETF', price: 26.44, change: -0.12 },
{ ticker: 'IEMG', name: 'iShares Core MSCI Emerging Markets ETF', region: 'Mercados Emergentes', sector: 'ETF', price: 58.93, change: 0.09 },

// India
{ ticker: 'RELIANCE.NS', name: 'Reliance Industries', region: 'Mercados Emergentes', sector: 'Energía / Petroquímica', price: 123.55, change: -0.2 },
{ ticker: 'TCS.NS', name: 'Tata Consultancy Services', region: 'Mercados Emergentes', sector: 'Tecnología', price: 44.30, change: 0.18 },
{ ticker: 'INFY', name: 'Infosys Ltd', region: 'Mercados Emergentes', sector: 'Tecnología', price: 17.22, change: -0.05 },
{ ticker: 'HDB', name: 'HDFC Bank', region: 'Mercados Emergentes', sector: 'Finanzas', price: 58.11, change: 0.21 },
{ ticker: 'WIT', name: 'Wipro Ltd', region: 'Mercados Emergentes', sector: 'Tecnología', price: 5.09, change: 0.03 },

// China
{ ticker: 'BABA', name: 'Alibaba Group', region: 'Mercados Emergentes', sector: 'Tecnología / E-commerce', price: 73.10, change: -0.50 },
{ ticker: 'JD', name: 'JD.com', region: 'Mercados Emergentes', sector: 'Tecnología / E-commerce', price: 24.91, change: -0.12 },
{ ticker: 'PDD', name: 'Pinduoduo', region: 'Mercados Emergentes', sector: 'Tecnología / E-commerce', price: 132.33, change: 0.80 },
{ ticker: 'TCEHY', name: 'Tencent Holdings', region: 'Mercados Emergentes', sector: 'Tecnología', price: 42.88, change: 0.15 },
{ ticker: 'NIO', name: 'NIO Inc', region: 'Mercados Emergentes', sector: 'Vehículos Eléctricos', price: 6.25, change: -0.10 },

// Brasil
{ ticker: 'VALE', name: 'Vale S.A.', region: 'Mercados Emergentes', sector: 'Minería', price: 12.77, change: -0.05 },
{ ticker: 'PBR', name: 'Petrobras', region: 'Mercados Emergentes', sector: 'Energía – Petróleo', price: 16.10, change: 0.12 },
{ ticker: 'ABEV', name: 'Ambev S.A.', region: 'Mercados Emergentes', sector: 'Consumo – Bebidas', price: 2.91, change: -0.01 },
{ ticker: 'ITUB', name: 'Itaú Unibanco', region: 'Mercados Emergentes', sector: 'Finanzas – Banca', price: 6.38, change: 0.04 },
{ ticker: 'GGB', name: 'Gerdau S.A.', region: 'Mercados Emergentes', sector: 'Acero / Materiales', price: 4.95, change: -0.06 },

// Sudáfrica
{ ticker: 'SBSW', name: 'Sibanye Stillwater', region: 'Mercados Emergentes', sector: 'Minería – Metales preciosos', price: 4.22, change: -0.11 },
{ ticker: 'NPSNY', name: 'Naspers Ltd', region: 'Mercados Emergentes', sector: 'Tecnología / Medios', price: 35.40, change: 0.22 },
{ ticker: 'ANGPY', name: 'Anglo American Platinum', region: 'Mercados Emergentes', sector: 'Minería', price: 42.13, change: 0.10 },
{ ticker: 'SOL', name: 'Sasol Ltd', region: 'Mercados Emergentes', sector: 'Energía – Petroquímica', price: 9.81, change: -0.02 },

// Arabia Saudita
{ ticker: '2222.SR', name: 'Saudi Aramco', region: 'Mercados Emergentes', sector: 'Energía – Petróleo', price: 8.70, change: 0.01 },
{ ticker: '1180.SR', name: 'Al Rajhi Bank', region: 'Mercados Emergentes', sector: 'Finanzas', price: 16.95, change: -0.08 },
{ ticker: '2010.SR', name: 'Sabic', region: 'Mercados Emergentes', sector: 'Materiales – Petroquímica', price: 25.10, change: 0.12 },
    // --- ETFS EMERGENTES GLOBALES ---
  { ticker: 'VWO', name: 'Vanguard Emerging Mkts', region: 'Mercados Emergentes', sector: 'ETF', price: 42.50, change: 0.8 },
  { ticker: 'EEM', name: 'iShares MSCI Emerging', region: 'Mercados Emergentes', sector: 'ETF', price: 41.20, change: 0.6 },
  { ticker: 'IEMG', name: 'iShares Core MSCI EM', region: 'Mercados Emergentes', sector: 'ETF', price: 52.00, change: 0.7 },
  { ticker: 'SPEM', name: 'SPDR Portfolio EM', region: 'Mercados Emergentes', sector: 'ETF', price: 36.50, change: 0.5 },
  { ticker: 'FRDM', name: 'Freedom 100 EM', region: 'Mercados Emergentes', sector: 'ETF', price: 32.80, change: 1.2 },
  { ticker: 'DEM', name: 'WisdomTree EM High Div', region: 'Mercados Emergentes', sector: 'ETF', price: 38.00, change: -0.2 },
  { ticker: 'DVYE', name: 'iShares EM Dividend', region: 'Mercados Emergentes', sector: 'ETF', price: 28.50, change: -0.4 },
  { ticker: 'EEMV', name: 'iShares EM Min Vol', region: 'Mercados Emergentes', sector: 'ETF', price: 56.00, change: 0.1 },
  { ticker: 'SCHE', name: 'Schwab Emerging Mkts', region: 'Mercados Emergentes', sector: 'ETF', price: 26.50, change: 0.6 },
  { ticker: 'XSOE', name: 'WisdomTree EM ex-SOE', region: 'Mercados Emergentes', sector: 'ETF', price: 29.00, change: 1.5 },
  { ticker: 'EMCR', name: 'Xtrackers MSCI EM ESG', region: 'Mercados Emergentes', sector: 'ETF', price: 24.50, change: 0.9 },
  { ticker: 'EMSA', name: 'Global X Next EM', region: 'Mercados Emergentes', sector: 'ETF', price: 22.00, change: 1.1 },
  { ticker: 'FM', name: 'iShares Frontier Mkts', region: 'Mercados Emergentes', sector: 'ETF', price: 28.00, change: -0.5 },
  { ticker: 'BIKR', name: 'SPDR S&P BRIC 40', region: 'Mercados Emergentes', sector: 'ETF', price: 34.00, change: 0.3 },
  { ticker: 'BKF', name: 'iShares MSCI BRIC', region: 'Mercados Emergentes', sector: 'ETF', price: 38.50, change: 0.4 },
  { ticker: 'ADRE', name: 'Invesco BLDRS EM 50', region: 'Mercados Emergentes', sector: 'ETF', price: 42.00, change: 0.8 },
  { ticker: 'PIE', name: 'Invesco DWA EM Momentum', region: 'Mercados Emergentes', sector: 'ETF', price: 18.50, change: 1.4 },
  { ticker: 'DBEM', name: 'Xtrackers MSCI EM Hedged', region: 'Mercados Emergentes', sector: 'ETF', price: 25.00, change: 0.2 },
  { ticker: 'EMXC', name: 'iShares EM ex-China', region: 'Mercados Emergentes', sector: 'ETF', price: 58.00, change: 1.2 },
  { ticker: 'EEMA', name: 'iShares MSCI EM Asia', region: 'Mercados Emergentes', sector: 'ETF', price: 72.00, change: 0.9 },
  { ticker: 'EMIF', name: 'iShares EM Infra', region: 'Mercados Emergentes', sector: 'ETF', price: 22.50, change: 0.1 },
  { ticker: 'EMFT', name: 'iShares EM Financials', region: 'Mercados Emergentes', sector: 'ETF', price: 18.00, change: 0.5 },
  { ticker: 'EMRE', name: 'iShares EM Real Estate', region: 'Mercados Emergentes', sector: 'ETF', price: 26.00, change: -0.8 },
  { ticker: 'EMAG', name: 'VanEck EM Agg Bond', region: 'Mercados Emergentes', sector: 'ETF', price: 19.50, change: 0.2 },
  { ticker: 'EMB', name: 'iShares J.P. Morgan EM Bond', region: 'Mercados Emergentes', sector: 'ETF', price: 88.00, change: -0.1 },
  { ticker: 'EMHY', name: 'iShares EM High Yield', region: 'Mercados Emergentes', sector: 'ETF', price: 36.00, change: 0.3 },
  { ticker: 'EMCD', name: 'WisdomTree EM Corp Bond', region: 'Mercados Emergentes', sector: 'ETF', price: 28.00, change: 0.0 },
  { ticker: 'EMGD', name: 'WisdomTree EM Growth', region: 'Mercados Emergentes', sector: 'ETF', price: 24.00, change: 0.7 },
  { ticker: 'EMQQ', name: 'EM Internet & Ecommerce', region: 'Mercados Emergentes', sector: 'ETF', price: 32.00, change: 2.5 },
  { ticker: 'KEMQ', name: 'KraneShares EM Consumer', region: 'Mercados Emergentes', sector: 'ETF', price: 16.50, change: 1.8 },
  { ticker: 'EMCH', name: 'iShares MSCI China', region: 'Mercados Emergentes', sector: 'ETF', price: 42.00, change: 0.5 },

  // --- ETFS ESPECÍFICOS POR PAÍS ---
  { ticker: 'TUR', name: 'iShares MSCI Turkey', region: 'Mercados Emergentes', sector: 'ETF', price: 38.00, change: 1.5 },
  { ticker: 'EGPT', name: 'VanEck Egypt', region: 'Mercados Emergentes', sector: 'ETF', price: 22.00, change: -1.2 },
  { ticker: 'ARGT', name: 'Global X Argentina', region: 'Mercados Emergentes', sector: 'ETF', price: 54.00, change: 2.8 },
  { ticker: 'EPHE', name: 'iShares Philippines', region: 'Mercados Emergentes', sector: 'ETF', price: 28.50, change: -0.5 },
  { ticker: 'THD', name: 'iShares Thailand', region: 'Mercados Emergentes', sector: 'ETF', price: 62.00, change: 0.3 },
  { ticker: 'EIDO', name: 'iShares Indonesia', region: 'Mercados Emergentes', sector: 'ETF', price: 21.50, change: 0.4 },
  { ticker: 'EWM', name: 'iShares Malaysia', region: 'Mercados Emergentes', sector: 'ETF', price: 20.00, change: 0.2 },
  { ticker: 'EWS', name: 'iShares Singapore', region: 'Mercados Emergentes', sector: 'ETF', price: 18.50, change: 0.1 },
  { ticker: 'FLKR', name: 'Franklin FTSE S. Korea', region: 'Mercados Emergentes', sector: 'ETF', price: 22.00, change: 0.9 },
  { ticker: 'FLTW', name: 'Franklin FTSE Taiwan', region: 'Mercados Emergentes', sector: 'ETF', price: 34.00, change: 1.2 },
  { ticker: 'FLJP', name: 'Franklin FTSE Japan', region: 'Mercados Emergentes', sector: 'ETF', price: 32.00, change: 0.5 },
  { ticker: 'FLCH', name: 'Franklin FTSE China', region: 'Mercados Emergentes', sector: 'ETF', price: 18.00, change: 0.6 },
  { ticker: 'FLEH', name: 'Franklin FTSE Europe', region: 'Mercados Emergentes', sector: 'ETF', price: 24.00, change: 0.3 },
  { ticker: 'FLBR', name: 'Franklin FTSE Brazil', region: 'Mercados Emergentes', sector: 'ETF', price: 19.50, change: 1.1 },
  { ticker: 'FLMX', name: 'Franklin FTSE Mexico', region: 'Mercados Emergentes', sector: 'ETF', price: 28.00, change: 0.8 },
  { ticker: 'FLIN', name: 'Franklin FTSE India', region: 'Mercados Emergentes', sector: 'ETF', price: 36.00, change: 1.3 },
  { ticker: 'FLSA', name: 'Franklin FTSE Saudi', region: 'Mercados Emergentes', sector: 'ETF', price: 28.00, change: 0.4 },
  { ticker: 'FLZA', name: 'Franklin FTSE S. Africa', region: 'Mercados Emergentes', sector: 'ETF', price: 22.00, change: 0.7 },
  { ticker: 'QAT', name: 'iShares MSCI Qatar', region: 'Mercados Emergentes', sector: 'ETF', price: 18.00, change: -0.2 },
  { ticker: 'KSA', name: 'iShares Saudi Arabia', region: 'Mercados Emergentes', sector: 'ETF', price: 42.00, change: 0.5 },
  { ticker: 'UAE', name: 'iShares MSCI UAE', region: 'Mercados Emergentes', sector: 'ETF', price: 16.00, change: 0.3 },
  { ticker: 'EIS', name: 'iShares Israel', region: 'Mercados Emergentes', sector: 'ETF', price: 54.00, change: -1.5 },
  { ticker: 'ECH', name: 'iShares Chile', region: 'Mercados Emergentes', sector: 'ETF', price: 26.00, change: 0.2 },
  { ticker: 'EPU', name: 'iShares Peru', region: 'Mercados Emergentes', sector: 'ETF', price: 28.00, change: 1.0 },
  { ticker: 'EWW', name: 'iShares Mexico', region: 'Mercados Emergentes', sector: 'ETF', price: 62.00, change: 0.8 },
  { ticker: 'EWZ', name: 'iShares Brazil', region: 'Mercados Emergentes', sector: 'ETF', price: 32.00, change: 1.4 },
  { ticker: 'EWC', name: 'iShares Canada', region: 'Mercados Emergentes', sector: 'ETF', price: 36.00, change: 0.5 },
  { ticker: 'EWA', name: 'iShares Australia', region: 'Mercados Emergentes', sector: 'ETF', price: 24.00, change: 0.6 },
  { ticker: 'EWN', name: 'iShares Netherlands', region: 'Mercados Emergentes', sector: 'ETF', price: 42.00, change: 0.4 },
  { ticker: 'EWP', name: 'iShares Spain', region: 'Mercados Emergentes', sector: 'ETF', price: 28.00, change: 0.3 },
  { ticker: 'EWQ', name: 'iShares France', region: 'Mercados Emergentes', sector: 'ETF', price: 38.00, change: 0.2 },
  { ticker: 'EWG', name: 'iShares Germany', region: 'Mercados Emergentes', sector: 'ETF', price: 31.00, change: 0.5 },
  { ticker: 'EWU', name: 'iShares UK', region: 'Mercados Emergentes', sector: 'ETF', price: 33.00, change: 0.1 },
  { ticker: 'EWI', name: 'iShares Italy', region: 'Mercados Emergentes', sector: 'ETF', price: 32.00, change: 0.9 },
  { ticker: 'EWL', name: 'iShares Switzerland', region: 'Mercados Emergentes', sector: 'ETF', price: 51.00, change: 0.2 },
  { ticker: 'EWD', name: 'iShares Sweden', region: 'Mercados Emergentes', sector: 'ETF', price: 40.00, change: 0.1 },
  { ticker: 'EWK', name: 'iShares Belgium', region: 'Mercados Emergentes', sector: 'ETF', price: 18.00, change: 0.3 },
  { ticker: 'EWO', name: 'iShares Austria', region: 'Mercados Emergentes', sector: 'ETF', price: 22.00, change: -0.4 },
  { ticker: 'EWR', name: 'iShares MSCI Singapore', region: 'Mercados Emergentes', sector: 'ETF', price: 18.50, change: 0.2 }, 
  { ticker: 'EWT', name: 'iShares Taiwan', region: 'Mercados Emergentes', sector: 'ETF', price: 52.00, change: 1.5 },
  { ticker: 'EWY', name: 'iShares S. Korea', region: 'Mercados Emergentes', sector: 'ETF', price: 64.00, change: 0.9 },

  // --- MERCADOS FRONTERA & TEMÁTICOS (ARK/FACTOR) ---
  { ticker: 'FRN', name: 'Invesco Frontier Mkts', region: 'Mercados Emergentes', sector: 'ETF', price: 20.00, change: -0.2 },
  { ticker: 'AKRE', name: 'Akre Focus Fund', region: 'Mercados Emergentes', sector: 'Fondo', price: 54.00, change: 0.5 },
  { ticker: 'VFMO', name: 'Vanguard Momentum', region: 'Mercados Emergentes', sector: 'ETF Factor', price: 115.00, change: 1.2 },
  { ticker: 'VFVA', name: 'Vanguard Value', region: 'Mercados Emergentes', sector: 'ETF Factor', price: 98.00, change: 0.8 },
  { ticker: 'VFMF', name: 'Vanguard Multifactor', region: 'Mercados Emergentes', sector: 'ETF Factor', price: 102.00, change: 0.9 },
  { ticker: 'VFQY', name: 'Vanguard Quality', region: 'Mercados Emergentes', sector: 'ETF Factor', price: 110.00, change: 1.1 },
  { ticker: 'VFLQ', name: 'Vanguard Liquidity', region: 'Mercados Emergentes', sector: 'ETF Factor', price: 95.00, change: 0.3 },
  { ticker: 'VFMV', name: 'Vanguard Min Vol', region: 'Mercados Emergentes', sector: 'ETF Factor', price: 99.00, change: 0.1 },
  { ticker: 'ARKG', name: 'ARK Genomic Revolution', region: 'Mercados Emergentes', sector: 'Temático', price: 28.00, change: 2.5 },
  { ticker: 'ARKK', name: 'ARK Innovation', region: 'Mercados Emergentes', sector: 'Temático', price: 45.00, change: 3.1 },
  { ticker: 'ARKQ', name: 'ARK Autonomous Tech', region: 'Mercados Emergentes', sector: 'Temático', price: 52.00, change: 1.8 },
  { ticker: 'ARKW', name: 'ARK Next Gen Internet', region: 'Mercados Emergentes', sector: 'Temático', price: 78.00, change: 2.2 },
  { ticker: 'ARKX', name: 'ARK Space Exploration', region: 'Mercados Emergentes', sector: 'Temático', price: 14.00, change: 0.5 },
  { ticker: 'PRNT', name: '3D Printing ETF', region: 'Mercados Emergentes', sector: 'Temático', price: 22.00, change: 1.2 },
  { ticker: 'IZRL', name: 'ARK Israel Tech', region: 'Mercados Emergentes', sector: 'Temático', price: 18.00, change: -0.5 },
  { ticker: 'ESPO', name: 'VanEck Video Gaming', region: 'Mercados Emergentes', sector: 'Temático', price: 65.00, change: 1.5 },
  { ticker: 'HERO', name: 'Global X Video Games', region: 'Mercados Emergentes', sector: 'Temático', price: 28.00, change: 1.2 },
  { ticker: 'NERD', name: 'Roundhill Esports', region: 'Mercados Emergentes', sector: 'Temático', price: 16.00, change: 0.8 },
  { ticker: 'BETZ', name: 'Roundhill Sports Betting', region: 'Mercados Emergentes', sector: 'Temático', price: 14.50, change: 1.8 },
  { ticker: 'CLSE', name: 'Convergence Long/Short', region: 'Mercados Emergentes', sector: 'ETF', price: 26.00, change: 0.1 },
  { ticker: 'DWAQ', name: 'Invesco NASDAQ Mom', region: 'Mercados Emergentes', sector: 'ETF Factor', price: 120.00, change: 1.5 },
  { ticker: 'DWAS', name: 'Invesco SmallCap Mom', region: 'Mercados Emergentes', sector: 'ETF Factor', price: 85.00, change: 1.2 },
  { ticker: 'PDP', name: 'Invesco Momentum', region: 'Mercados Emergentes', sector: 'ETF Factor', price: 88.00, change: 0.9 },
  { ticker: 'PIO', name: 'Invesco Global Water', region: 'Mercados Emergentes', sector: 'Temático', price: 38.00, change: 0.6 },
  { ticker: 'PBD', name: 'Invesco Clean Energy', region: 'Mercados Emergentes', sector: 'Temático', price: 18.00, change: 1.1 },
  { ticker: 'PBE', name: 'Invesco Biotech', region: 'Mercados Emergentes', sector: 'Temático', price: 68.00, change: 0.5 },
  { ticker: 'PBJ', name: 'Invesco Food & Bev', region: 'Mercados Emergentes', sector: 'Temático', price: 48.00, change: 0.2 },
  { ticker: 'PBS', name: 'Invesco Media', region: 'Mercados Emergentes', sector: 'Temático', price: 52.00, change: -0.4 },
  { ticker: 'PJP', name: 'Invesco Pharma', region: 'Mercados Emergentes', sector: 'Temático', price: 82.00, change: 0.3 },
  { ticker: 'PPA', name: 'Invesco Aerospace', region: 'Mercados Emergentes', sector: 'Temático', price: 98.00, change: 1.2 },
  { ticker: 'PRN', name: 'Invesco Industrials', region: 'Mercados Emergentes', sector: 'ETF Factor', price: 105.00, change: 0.8 },
  { ticker: 'PSI', name: 'Invesco Semiconductors', region: 'Mercados Emergentes', sector: 'Temático', price: 145.00, change: 2.5 },
  { ticker: 'PSJ', name: 'Invesco Software', region: 'Mercados Emergentes', sector: 'Temático', price: 125.00, change: 1.8 },
  { ticker: 'PSK', name: 'Invesco Insurance', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 92.00, change: 0.4 },
  { ticker: 'PSTL', name: 'Invesco Steel', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 58.00, change: 1.1 },
  { ticker: 'PTF', name: 'Invesco Tech Mom', region: 'Mercados Emergentes', sector: 'ETF Factor', price: 180.00, change: 2.1 },
  { ticker: 'PUI', name: 'Invesco Utilities', region: 'Mercados Emergentes', sector: 'ETF Factor', price: 34.00, change: 0.2 },
  { ticker: 'PUW', name: 'Invesco Progressive Energy', region: 'Mercados Emergentes', sector: 'Temático', price: 28.00, change: 1.5 },
  { ticker: 'PWB', name: 'Invesco Large Growth', region: 'Mercados Emergentes', sector: 'ETF Factor', price: 85.00, change: 1.3 },
  { ticker: 'PWC', name: 'Invesco Large Value', region: 'Mercados Emergentes', sector: 'ETF Factor', price: 78.00, change: 0.6 },
  { ticker: 'PWV', name: 'Invesco Large Value Agg', region: 'Mercados Emergentes', sector: 'ETF Factor', price: 56.00, change: 0.5 },
  { ticker: 'PXJ', name: 'Invesco Oil Services', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 22.00, change: 1.8 },
  { ticker: 'PXQ', name: 'Invesco Networking', region: 'Mercados Emergentes', sector: 'Temático', price: 68.00, change: 1.2 },
  { ticker: 'PYZ', name: 'Invesco Basic Materials', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 84.00, change: 0.7 },
  { ticker: 'PZT', name: 'Invesco Biotech Genome', region: 'Mercados Emergentes', sector: 'Temático', price: 65.00, change: 0.9 },
  { ticker: 'PZW', name: 'Invesco Media Dynamic', region: 'Mercados Emergentes', sector: 'Temático', price: 42.00, change: -0.2 },

  // --- ETFS SECTORIALES (MAYORÍA US/GLOBAL) ---
  { ticker: 'XLE', name: 'Energy Select Sector', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 92.00, change: 1.1 },
  { ticker: 'XLF', name: 'Financial Select Sector', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 42.00, change: 0.8 },
  { ticker: 'XLK', name: 'Tech Select Sector', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 215.00, change: 1.2 },
  { ticker: 'XLV', name: 'Health Care Select', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 145.00, change: -0.2 },
  { ticker: 'XLI', name: 'Industrial Select', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 125.00, change: 0.6 },
  { ticker: 'XLP', name: 'Consumer Staples', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 78.00, change: 0.1 },
  { ticker: 'XLY', name: 'Consum Discret', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 185.00, change: 0.9 },
  { ticker: 'XLU', name: 'Utilities Select', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 65.00, change: 0.3 },
  { ticker: 'XLB', name: 'Materials Select', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 90.00, change: 0.5 },
  { ticker: 'XLC', name: 'Comm Services', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 85.00, change: 1.4 },
  { ticker: 'XLRE', name: 'Real Estate Select', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 38.00, change: 0.2 },
  { ticker: 'IYE', name: 'iShares US Energy', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 48.00, change: 1.0 },
  { ticker: 'IYF', name: 'iShares US Financials', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 82.00, change: 0.7 },
  { ticker: 'IYW', name: 'iShares US Tech', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 135.00, change: 1.5 },
  { ticker: 'IYH', name: 'iShares US Healthcare', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 285.00, change: -0.1 },
  { ticker: 'IYJ', name: 'iShares US Industrials', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 115.00, change: 0.5 },
  { ticker: 'IYK', name: 'iShares US Staples', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 125.00, change: 0.2 },
  { ticker: 'IYC', name: 'iShares US Discret', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 88.00, change: 0.8 },
  { ticker: 'IDU', name: 'iShares US Utilities', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 92.00, change: 0.3 },
  { ticker: 'IYM', name: 'iShares US Materials', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 105.00, change: 0.6 },
  { ticker: 'IYZ', name: 'iShares US Telecom', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 28.00, change: 0.4 },
  { ticker: 'IYR', name: 'iShares US Real Estate', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 86.00, change: 0.2 },
  { ticker: 'VDE', name: 'Vanguard Energy', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 125.00, change: 1.1 },
  { ticker: 'VFH', name: 'Vanguard Financials', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 98.00, change: 0.7 },
  { ticker: 'VGT', name: 'Vanguard Info Tech', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 540.00, change: 1.3 },
  { ticker: 'VHT', name: 'Vanguard Healthcare', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 265.00, change: -0.1 },
  { ticker: 'VIS', name: 'Vanguard Industrials', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 225.00, change: 0.6 },
  { ticker: 'VDC', name: 'Vanguard Staples', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 205.00, change: 0.2 },
  { ticker: 'VCR', name: 'Vanguard Discret', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 310.00, change: 0.9 },
  { ticker: 'VPU', name: 'Vanguard Utilities', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 145.00, change: 0.3 },
  { ticker: 'VAW', name: 'Vanguard Materials', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 195.00, change: 0.5 },
  { ticker: 'VOX', name: 'Vanguard Comm Svcs', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 115.00, change: 1.2 },
  { ticker: 'VNQ', name: 'Vanguard Real Estate', region: 'Mercados Emergentes', sector: 'ETF Sector', price: 84.00, change: 0.2 },
  { ticker: 'ICLN', name: 'iShares Global Clean Energy', region: 'Mercados Emergentes', sector: 'Energía Limpia', price: 14.50, change: 1.5 },
  { ticker: 'TAN', name: 'Invesco Solar', region: 'Mercados Emergentes', sector: 'Energía Limpia', price: 42.00, change: 2.1 },
  { ticker: 'PBW', name: 'Invesco WilderHill Clean', region: 'Mercados Emergentes', sector: 'Energía Limpia', price: 22.00, change: 1.8 },
  { ticker: 'LIT', name: 'Global X Lithium', region: 'Mercados Emergentes', sector: 'Materiales', price: 45.00, change: 1.2 },
  { ticker: 'BOTZ', name: 'Global X Robotics', region: 'Mercados Emergentes', sector: 'Tecnología', price: 32.00, change: 1.5 },
  { ticker: 'SKYY', name: 'First Trust Cloud', region: 'Mercados Emergentes', sector: 'Tecnología', price: 92.00, change: 1.4 },
  { ticker: 'HACK', name: 'ETFMG Cyber Security', region: 'Mercados Emergentes', sector: 'Ciberseguridad', price: 62.00, change: 1.1 },
  { ticker: 'MJ', name: 'ETFMG Alternative Harvest', region: 'Mercados Emergentes', sector: 'Cannabis', price: 3.50, change: 2.5 },
  { ticker: 'YOLO', name: 'AdvisorShares Pure Cannabis', region: 'Mercados Emergentes', sector: 'Cannabis', price: 2.80, change: 3.1 },
  { ticker: 'MSOS', name: 'AdvisorShares US Cannabis', region: 'Mercados Emergentes', sector: 'Cannabis', price: 7.20, change: 4.5 },
  { ticker: 'POTX', name: 'Global X Cannabis', region: 'Mercados Emergentes', sector: 'Cannabis', price: 6.50, change: 2.8 },
  { ticker: 'TOKE', name: 'Cambria Cannabis', region: 'Mercados Emergentes', sector: 'Cannabis', price: 5.40, change: 1.5 },
  { ticker: 'CNBS', name: 'Amplify Seymour Cannabis', region: 'Mercados Emergentes', sector: 'Cannabis', price: 4.20, change: 2.0 },
  { ticker: 'THCX', name: 'AXS Cannabis', region: 'Mercados Emergentes', sector: 'Cannabis', price: 18.00, change: 2.2 },
  { ticker: 'MJUS', name: 'ETFMG US Alt Harvest', region: 'Mercados Emergentes', sector: 'Cannabis', price: 2.10, change: 3.0 },

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
