import React from 'react';

interface Props {
  nodes: string[];
  matrix: number[][];
}

const CovarianceMatrix: React.FC<Props> = ({ nodes, matrix }) => {
  let maxVal = 0;
  // Ignore Infinity when calculating max for color scaling
  matrix.forEach(row => row.forEach(val => { 
    if(val !== Infinity && val > maxVal) maxVal = val; 
  }));

  const getColor = (value: number) => {
    if (value === Infinity || value === 0) return 'rgba(30, 41, 59, 0.5)'; // slate-800
    const intensity = Math.min(value / (maxVal * 0.8), 1);
    return `rgba(239, 68, 68, ${Math.max(intensity, 0.1)})`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-lg font-semibold">Matriz de Covarianza (Pesos)</h3>
        <p className="text-sm text-slate-400">
          Representa {'{w_ij}'} entre nodos. Alta intensidad = Alta Covarianza (Riesgo Sistémico).
        </p>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="inline-block min-w-full">
          <div className="flex">
            <div className="w-24 shrink-0"></div>
            {nodes.map(node => (
              <div key={node} className="w-20 shrink-0 text-center text-xs font-bold text-slate-400 p-2 rotate-0">
                {node}
              </div>
            ))}
          </div>
          
          {nodes.map((rowNode, i) => (
            <div key={rowNode} className="flex items-center">
              <div className="w-24 shrink-0 text-xs font-bold text-slate-400 p-2 text-right">
                {rowNode}
              </div>
              {matrix[i].map((val, j) => (
                <div
                  key={`${i}-${j}`}
                  className="w-20 h-10 shrink-0 flex items-center justify-center text-xs border border-slate-900/10 transition-colors hover:border-slate-500"
                  style={{ backgroundColor: getColor(val) }}
                  title={`${rowNode} - ${nodes[j]}: ${val === Infinity ? '∞' : val.toFixed(4)}`}
                >
                  {i === j ? '-' : val === Infinity ? '∞' : val.toFixed(2)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CovarianceMatrix;