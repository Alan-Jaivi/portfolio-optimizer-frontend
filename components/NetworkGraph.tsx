import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Edge } from '../types';

interface Props {
  nodes: string[];
  edges: Edge[];
  highlightPath?: string[];
}

const NetworkGraph: React.FC<Props> = ({ nodes, edges, highlightPath = [] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Prepare data
    const graphNodes = nodes.map(id => ({ id }));
    const graphLinks = edges.map(e => ({ ...e })); // Copy to avoid mutation issues

    // Simulation
    const simulation = d3.forceSimulation(graphNodes as any)
      .force("link", d3.forceLink(graphLinks).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40));

    const svg = d3.select(svgRef.current);

    // Define Arrow Marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#64748b");

    // Draw Links
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graphLinks)
      .enter().append("line")
      .attr("stroke-width", d => Math.min(Math.sqrt(d.weight) / 10, 3)) // Scale down thick weights
      .attr("stroke", d => {
        // Highlight logic
        if (highlightPath.length > 1) {
          const src = (d.source as any).id || d.source;
          const tgt = (d.target as any).id || d.target;
          
          const srcIdx = highlightPath.indexOf(src);
          const tgtIdx = highlightPath.indexOf(tgt);
          
          // Check if this link connects two consecutive nodes in the path
          if (srcIdx !== -1 && tgtIdx !== -1 && Math.abs(srcIdx - tgtIdx) === 1) {
            return "#3b82f6"; // Blue 500
          }
        }
        return "#334155"; // Slate 700
      })
      .attr("opacity", 0.6);

    // Draw Nodes
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graphNodes)
      .enter().append("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Node Circles
    node.append("circle")
      .attr("r", 20)
      .attr("fill", d => highlightPath.includes(d.id) ? "#3b82f6" : "#1e293b")
      .attr("stroke", d => highlightPath.includes(d.id) ? "#60a5fa" : "#475569")
      .attr("stroke-width", 2)
      .attr("class", "transition-all duration-300");

    // Node Labels
    node.append("text")
      .text(d => d.id)
      .attr("x", 0)
      .attr("y", 4)
      .attr("text-anchor", "middle")
      .attr("fill", "#e2e8f0")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, edges, highlightPath]);

  return (
    <div className="w-full h-full bg-slate-950 rounded-xl overflow-hidden relative">
      <svg ref={svgRef} className="w-full h-full" style={{ minHeight: '500px' }}></svg>
      <div className="absolute top-4 right-4 bg-slate-900/80 p-3 rounded-lg border border-slate-700 backdrop-blur-sm">
        <h4 className="text-xs font-bold text-slate-300 uppercase mb-2">Leyenda</h4>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-600"></div>
          <span className="text-xs text-slate-400">Nodo de Activo</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-600 border border-blue-400"></div>
          <span className="text-xs text-slate-400">Ruta Optimizada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-[2px] bg-slate-600"></div>
          <span className="text-xs text-slate-400">Enlace de Covarianza</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;