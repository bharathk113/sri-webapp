import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { MATRIX_COLUMNS, MATRIX_DATA, F1_LOW_RUNOFF, F1_MED_RUNOFF, F1_HIGH_RUNOFF } from '../constants';
import { Info } from 'lucide-react';

const Results: React.FC = () => {
  let textClass = 'text-slate-700'; // Defined to fix unused variable error if it arises in loops, though utilized below inside map.

  return (
    <div className="space-y-12 pb-12">
       <div className="border-b border-slate-800 pb-8">
        <div className="inline-block px-3 py-1 rounded border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-wider mb-3">
            Analysis
        </div>
        <h2 className="text-4xl font-bold text-white font-serif">Results & Analysis</h2>
        <p className="text-slate-400 mt-4 text-lg max-w-4xl">
            Quantitative comparison demonstrating the superiority of the Grid-wise approach using difference matrices and F1 scores. The data highlights how traditional methods consistently <span className="text-slate-200">underestimate extreme events</span>.
        </p>
      </div>

      {/* Heatmap Matrix Section */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl overflow-x-auto relative">
        {/* Glossy effect */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-slate-800/10 to-transparent pointer-events-none rounded-3xl"></div>
        
        <div className="mb-8 relative z-10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Difference Matrix <span className="text-xs font-normal text-slate-500 px-2 py-1 bg-slate-800 rounded-full border border-slate-700">Grid-wise vs Areal</span>
            </h3>
            <p className="text-sm text-slate-400 mt-2 max-w-3xl">
                Visualizing misclassification. Rows represent the Grid-wise method (Truth), and columns represent the Areal method.
                Values on the diagonal represent agreement. <span className="text-cyan-400">Off-diagonal values represent misrepresentation.</span>
            </p>
        </div>
        
        <div className="min-w-[900px] relative z-10">
            {/* Header Row */}
            <div className="grid grid-cols-10 gap-1.5 mb-1.5">
                <div className="flex items-end justify-end px-3 pb-2 text-xs font-bold text-slate-500 tracking-wider uppercase">
                   Grid-wise \ Areal
                </div>
                {MATRIX_COLUMNS.map((col, i) => (
                    <div key={i} className="text-[10px] font-bold uppercase tracking-wide text-center text-slate-400 break-words px-1 flex items-end justify-center pb-2 bg-slate-800/50 rounded-t-lg border-b border-slate-700/50">
                        {col}
                    </div>
                ))}
            </div>

            {/* Data Rows */}
            {MATRIX_DATA.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-10 gap-1.5 mb-1.5 h-12">
                    {/* Row Label */}
                    <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 flex items-center justify-end px-3 bg-slate-800/50 rounded-l-lg border-r border-slate-700/50">
                        {row.label}
                    </div>
                    
                    {/* Cells */}
                    {row.values.map((val, colIndex) => {
                        // Determine background intensity based on value for DARK THEME
                        let bgClass = 'bg-slate-900 border border-slate-800';
                        textClass = 'text-slate-700';
                        
                        if (val > 0) {
                            textClass = 'text-slate-200 font-bold';
                            // Cyan based heatmap for dark theme
                            if (val < 50) bgClass = 'bg-cyan-950/30 border border-cyan-900/30 text-cyan-200';
                            else if (val < 100) bgClass = 'bg-cyan-900/40 border border-cyan-800/40 text-cyan-100';
                            else if (val < 500) bgClass = 'bg-cyan-800/60 border border-cyan-700/50 text-white';
                            else if (val < 1000) bgClass = 'bg-cyan-700/80 border border-cyan-600/50 text-white shadow-[0_0_10px_rgba(34,211,238,0.2)]';
                            else if (val < 5000) bgClass = 'bg-cyan-600 border border-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]';
                            else bgClass = 'bg-cyan-500 border border-cyan-400 text-white shadow-[0_0_20px_rgba(34,211,238,0.6)]';
                        }

                        return (
                            <div key={colIndex} className={`${bgClass} ${textClass} flex items-center justify-center text-xs transition-all hover:scale-105 rounded relative group cursor-default`}>
                                {val > 0 ? val : <span className="text-slate-800">·</span>}
                                {val > 0 && (
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-[10px] p-2 rounded-lg border border-slate-700 shadow-xl z-20 whitespace-nowrap">
                                        <span className="font-bold text-cyan-400">{val}</span> Grids<br/>
                                        <span className="text-slate-400">Truth:</span> {row.label}<br/>
                                        <span className="text-slate-400">Model:</span> {MATRIX_COLUMNS[colIndex]}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
        
        <div className="mt-6 p-4 bg-amber-950/20 border border-amber-900/30 rounded-xl text-sm text-amber-200/80 flex gap-3 items-start">
            <Info className="shrink-0 mt-0.5 text-amber-500" size={18} />
            <p>
                <strong className="text-amber-400">Interpretation:</strong> The values spread to the right of the diagonal (towards 'Normal') in the dry rows indicate that the Areal method frequently classifies extreme dry events as less severe or normal. 
                For example, in the <strong>&gt;100 Dry</strong> row, while 44 grids agree, <strong className="text-white underline decoration-red-500 decoration-2">107 grids</strong> are misclassified as Normal.
            </p>
        </div>
      </div>

      {/* F1 Score Analysis Charts */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="mb-8 border-b border-slate-800 pb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Agreement Comparison (F1 Score)</h3>
            <p className="text-slate-400">
                Higher F1 score indicates better agreement. <span className="text-red-400">Low scores at high return periods (&gt;100)</span> indicate significant disagreement, proving the Areal method fails to capture extremes.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <F1Chart title="(a) Low Runoff" data={F1_LOW_RUNOFF} />
            <F1Chart title="(b) Medium Runoff" data={F1_MED_RUNOFF} />
            <F1Chart title="(c) High Runoff" data={F1_HIGH_RUNOFF} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
             <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-cyan-600 rounded shadow-[0_0_10px_rgba(8,145,178,0.5)]"></div> 
                <span className="text-slate-300">Dry Events</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-slate-600 rounded"></div> 
                <span className="text-slate-300">Wet Events</span>
             </div>
        </div>
      </div>

      {/* Visual Comparison Placeholder */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-6">Visual Comparison (Wet vs Dry Years)</h3>
        <div className="grid md:grid-cols-2 gap-8">
             {/* Updated to use HTML img tag for robust path resolution */}
             <div className="aspect-video bg-slate-950 rounded-xl relative group overflow-hidden border border-slate-800 hover:border-red-900/50 transition-colors">
                <img 
                  src={`${import.meta.env.BASE_URL}assets/comparison-areal.png`}
                  alt="Traditional Areal Approach"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-12">
                   <span className="text-red-400 font-bold text-sm uppercase tracking-wider block mb-1">Traditional</span>
                    <span className="text-white font-bold">Areal Approach</span>
                    <p className="text-slate-400 text-xs mt-1">Smoothed, general, misses pockets of drought.</p>
                </div>
             </div>
             
             {/* Updated to use HTML img tag for robust path resolution */}
             <div className="aspect-video bg-slate-950 rounded-xl relative group overflow-hidden border border-slate-800 hover:border-cyan-900/50 transition-colors">
                <img 
                  src={`${import.meta.env.BASE_URL}assets/comparison-gridwise.png`}
                  alt="Proposed Grid-wise Approach"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-12">
                    <span className="text-cyan-400 font-bold text-sm uppercase tracking-wider block mb-1">Proposed</span>
                    <span className="text-white font-bold">Grid-wise Approach</span>
                     <p className="text-slate-400 text-xs mt-1">Detailed, precise, identifies extreme localities.</p>
                </div>
             </div>
        </div>
        <p className="text-xs text-slate-600 mt-4 text-center">
            * Visualization of SRI results.
        </p>
      </div>
    </div>
  );
};

const F1Chart: React.FC<{ title: string, data: any[] }> = ({ title, data }) => (
    <div className="bg-slate-950/50 p-4 pt-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
        <h4 className="text-sm font-bold text-center mb-6 text-slate-300 uppercase tracking-wide">{title}</h4>
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis 
                        dataKey="returnPeriod" 
                        tick={{fontSize: 10, fill: '#94a3b8'}} 
                        axisLine={{ stroke: '#334155' }}
                        tickLine={{ stroke: '#334155' }}
                    />
                    <YAxis 
                        tick={{fontSize: 10, fill: '#94a3b8'}} 
                        domain={[0, 1]} 
                        axisLine={{ stroke: '#334155' }}
                        tickLine={{ stroke: '#334155' }}
                    />
                    <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px', borderRadius: '8px', color: '#f8fafc' }}
                        itemStyle={{ color: '#e2e8f0' }}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar dataKey="dry" name="Dry" fill="#0891b2" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="wet" name="Wet" fill="#475569" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default Results;