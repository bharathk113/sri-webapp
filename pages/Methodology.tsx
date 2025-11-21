import React from 'react';
import { ArrowDown, Database, Calculator, Search, CheckSquare } from 'lucide-react';
import { SEVERITY_TABLE } from '../constants';

const Methodology: React.FC = () => {
  return (
    <div className="space-y-16">
      <div className="border-b border-slate-800 pb-8">
        <div className="inline-block px-3 py-1 rounded border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">
            Workflow
        </div>
        <h2 className="text-4xl font-bold text-white font-serif">Methodology Comparison</h2>
        <p className="text-slate-400 mt-4 text-lg">
            Contrasting the traditional <span className="text-slate-200 font-semibold">Areal approach</span> with the proposed <span className="text-cyan-400 font-semibold">Grid-wise fitting</span>.
        </p>
      </div>

      {/* Workflow Diagram (Interactive CSS Grid) */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Areal Approach Column */}
        <div className="space-y-6 relative">
            <div className="absolute inset-0 bg-slate-900/20 rounded-3xl -z-10" />
            <div className="bg-slate-800 p-4 rounded-xl text-center font-bold text-slate-400 uppercase tracking-wider text-sm border border-slate-700 shadow-lg">
                Traditional Approach (Areal)
            </div>
            
            <div className="space-y-4 px-4">
                <StepCard icon={Database} text="Calculate year-wise spatial average of accumulated runoff" />
                <Arrow />
                <StepCard icon={Calculator} text="Calculate L-moments for the entire basin average" />
                <Arrow />
                <StepCard icon={Search} text="Fit ONE distribution to the entire basin" highlight color="amber" />
                <Arrow />
                <StepCard icon={CheckSquare} text="Calculate Z-scores for all grids using this single distribution" />
            </div>
        </div>

        {/* Grid-wise Approach Column */}
        <div className="space-y-6 relative">
             <div className="absolute inset-0 bg-cyan-950/10 rounded-3xl -z-10" />
            <div className="bg-cyan-900/30 p-4 rounded-xl text-center font-bold text-cyan-400 uppercase tracking-wider text-sm border border-cyan-800 shadow-lg shadow-cyan-900/20">
                Proposed Approach (Grid-wise)
            </div>
            
            <div className="space-y-4 px-4">
                <StepCard icon={Database} text="For EACH GRID, calculate L-moments" />
                <Arrow />
                <StepCard icon={Search} text="Identify discordant grids in neighborhood (5x5)" />
                <Arrow />
                <StepCard icon={Calculator} text="Use L-moment ratio diagrams to identify BEST distribution for EACH grid" highlight color="cyan" />
                <Arrow />
                <StepCard icon={CheckSquare} text="Calculate Z-scores for each grid using its specific distribution" />
            </div>
        </div>
      </div>

      {/* Severity Table */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6 text-slate-200">SRI Classification Criteria</h3>
        <div className="overflow-hidden rounded-xl border border-slate-800 shadow-2xl bg-slate-900">
            <table className="w-full text-sm text-left text-slate-400">
                <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
                    <tr>
                        <th className="px-8 py-5 font-bold tracking-wider">Z-Score Range</th>
                        <th className="px-8 py-5 font-bold tracking-wider">Interpretation</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {SEVERITY_TABLE.map((row, idx) => (
                        <tr key={idx} className="bg-slate-900 hover:bg-slate-800/80 transition-colors">
                            <td className="px-8 py-4 font-mono font-medium text-slate-300">{row.score}</td>
                            <td className="px-8 py-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                                    row.interpretation.includes("wet") ? "bg-blue-500/10 text-blue-300 border-blue-500/20" :
                                    row.interpretation.includes("dry") ? "bg-red-500/10 text-red-300 border-red-500/20" :
                                    "bg-slate-700/30 text-slate-300 border-slate-600/30"
                                }`}>
                                    {row.interpretation.includes("wet") && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2" />}
                                    {row.interpretation.includes("dry") && <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-2" />}
                                    {row.interpretation}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

const StepCard: React.FC<{text: string, highlight?: boolean, color?: 'amber' | 'cyan', icon: any}> = ({ text, highlight, color = 'amber', icon: Icon }) => (
    <div className={`p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] flex items-start gap-4 ${
        highlight 
            ? (color === 'cyan' 
                ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
                : 'bg-amber-950/40 border-amber-500/50 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.15)]')
            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
    }`}>
        <div className={`p-2 rounded-lg shrink-0 ${
             highlight 
             ? (color === 'cyan' ? 'bg-cyan-900/50 text-cyan-400' : 'bg-amber-900/50 text-amber-400')
             : 'bg-slate-800 text-slate-500'
        }`}>
            <Icon size={18} />
        </div>
        <p className="text-sm font-medium leading-relaxed pt-1">{text}</p>
    </div>
);

const Arrow = () => (
    <div className="flex justify-center text-slate-700 py-1">
        <ArrowDown size={24} />
    </div>
);

export default Methodology;