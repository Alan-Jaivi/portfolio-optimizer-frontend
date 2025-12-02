import React, { useState, useMemo } from 'react';
import { PlusCircle, CheckCircle, Globe, Search, Database } from 'lucide-react';
import { Asset } from '../types';

interface Props {
  assets: Asset[];
  selectedTickers: string[];
  onToggle: (ticker: string) => void;
  isLoading?: boolean;
}

const AssetSelector: React.FC<Props> = ({ assets, selectedTickers, onToggle, isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de Filtrado
  const filteredAssets = useMemo(() => {
    if (!searchTerm) return assets;
    const lowerTerm = searchTerm.toLowerCase();
    return assets.filter(
      a => a.ticker.toLowerCase().includes(lowerTerm) || a.name.toLowerCase().includes(lowerTerm)
    );
  }, [assets, searchTerm]);

  // Lógica de Agrupación
  const regions = useMemo(() => {
    const groups: { [key: string]: Asset[] } = {};
    filteredAssets.forEach(asset => {
      if (!groups[asset.region]) groups[asset.region] = [];
      groups[asset.region].push(asset);
    });
    return groups;
  }, [filteredAssets]);

  const regionOrder = ['Norteamérica', 'Latinoamérica', 'Europa', 'Asia Pacífico', 'Mercados Emergentes'];

  return (
    <div className="bg-slate-900 border-r border-slate-800 w-80 flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" />
          Activos Globales
        </h2>
        <div className="flex items-center gap-2 mt-2">
           <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
           <span className="text-xs text-slate-400">
             {isLoading ? 'Sincronizando...' : `${assets.length} Activos Disponibles`}
           </span>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/50">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Buscar ticker o nombre..." 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 placeholder-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading && assets.length === 0 ? (
          <div className="text-center py-10 text-slate-500 flex flex-col items-center">
            <Database className="w-8 h-8 mb-2 animate-bounce opacity-50" />
            <p className="text-sm">Cargando base de datos...</p>
          </div>
        ) : Object.keys(regions).length === 0 ? (
           <div className="text-center py-8 text-slate-500">
             <p className="text-sm">No se encontraron activos.</p>
           </div>
        ) : (
          regionOrder.map((region) => {
            const regionAssets = regions[region];
            if (!regionAssets) return null;
            
            return (
              <div key={region}>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 sticky top-0 bg-slate-900 py-1 z-10 backdrop-blur-sm">
                  {region} <span className="text-slate-600 font-normal">({regionAssets.length})</span>
                </h3>
                <div className="space-y-2">
                  {regionAssets.map((asset) => {
                    const isSelected = selectedTickers.includes(asset.ticker);
                    return (
                      <button
                        key={asset.ticker}
                        onClick={() => onToggle(asset.ticker)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group ${
                          isSelected 
                            ? 'bg-blue-600/10 border-blue-500/50 text-blue-100' 
                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div className="text-left overflow-hidden">
                          <div className="font-bold flex items-center gap-2">
                            {asset.ticker}
                            {isSelected && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1 rounded">ON</span>}
                          </div>
                          <div className="text-xs opacity-70 truncate max-w-[160px] group-hover:opacity-100 transition-opacity">
                            {asset.name}
                          </div>
                        </div>
                        {isSelected ? (
                          <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                        ) : (
                          <PlusCircle className="w-5 h-5 opacity-0 group-hover:opacity-50 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AssetSelector;