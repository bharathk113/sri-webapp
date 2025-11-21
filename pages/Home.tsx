import React, { useEffect, useRef, useState } from 'react';
import { PAPER_INFO } from '../constants';
import { ArrowRight, AlertTriangle, CheckCircle, Activity, BarChart2, RefreshCw, Trophy, MousePointer2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Background Animation Component ---
const ProbabilityWaves: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      if (canvas) {
        width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
        height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    const waves = [
      { y: height * 0.5, length: 0.005, amplitude: 80, speed: 0.01, color: 'rgba(34, 211, 238, 0.05)' }, // Cyan very transparent
      { y: height * 0.5, length: 0.008, amplitude: 60, speed: 0.02, color: 'rgba(34, 211, 238, 0.1)' },
      { y: height * 0.55, length: 0.004, amplitude: 100, speed: 0.005, color: 'rgba(56, 189, 248, 0.05)' }, // Light blue
    ];

    let increment = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      increment += 0.01;

      // Draw Grid Lines (Scientific feel)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for(let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for(let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Draw Waves (Probability Distributions)
      waves.forEach(wave => {
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        for (let i = 0; i < width; i++) {
          // Simulating probability curves
          let y = wave.y + Math.sin(i * wave.length + increment * wave.speed * 100) * wave.amplitude * Math.sin(increment);
          // Add a Gaussian-like bump that moves
          const bump = Math.exp(-Math.pow((i - (width/2 + Math.sin(increment)*200)) / 100, 2)) * 150;
          
          ctx.lineTo(i, y - bump * Math.sin(increment * 0.5));
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      animationFrameId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

// --- Interactive Game Component ---

type DistType = 'normal' | 'gamma' | 'gev';

const DATASETS = [
  { id: 1, name: "Grid A (Plains)", optimal: 'normal' as DistType, dataDesc: "Symmetric" },
  { id: 2, name: "Grid B (Hills)", optimal: 'gamma' as DistType, dataDesc: "Right Skewed" },
  { id: 3, name: "Grid C (Steep)", optimal: 'gev' as DistType, dataDesc: "Extreme Tail" },
];

const DistributionGame: React.FC = () => {
  const [gameMode, setGameMode] = useState<'start' | 'areal' | 'gridwise' | 'victory'>('start');
  const [arealSelection, setArealSelection] = useState<DistType | null>(null);
  const [gridSelections, setGridSelections] = useState<{ [key: number]: DistType | null }>({ 1: null, 2: null, 3: null });
  const [activeGrid, setActiveGrid] = useState<number | null>(null);

  // Helper to get path d string for SVG
  const getCurvePath = (type: DistType | null, width: number, height: number) => {
    if (!type) return "";
    let points = [];
    for (let x = 0; x <= width; x += 5) {
      let y = height;
      const normX = (x / width) * 6 - 3; // -3 to 3
      
      if (type === 'normal') {
         // Bell curve centered
         const val = Math.exp(-0.5 * Math.pow(normX, 2));
         y = height - (val * height * 0.8);
      } else if (type === 'gamma') {
         // Skewed left/center
         const shiftX = normX + 3; // 0 to 6
         if (shiftX > 0) {
            const val = (Math.pow(shiftX, 2) * Math.exp(-shiftX)) * 1.5;
            y = height - (val * height * 0.8);
         }
      } else if (type === 'gev') {
         // Sharp peak, heavy tail
         const shiftX = normX + 1.5; 
         const val = Math.exp(-(Math.exp(-shiftX) + shiftX + 1)); // Gumbel-ish
         y = height - (val * height * 0.9);
      }
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  };

  // Background Histogram Bars (static visual)
  const HistogramBars: React.FC<{ type: DistType }> = ({ type }) => {
      // Generate bars that vaguely resemble the distribution
      const bars = [];
      const count = 20;
      for(let i=0; i<count; i++) {
          let heightPct = 0;
          const xPos = (i / count) * 6 - 3;
          
          if(type === 'normal') heightPct = Math.exp(-0.5 * Math.pow(xPos, 2));
          else if(type === 'gamma') {
             const sx = xPos + 3;
             heightPct = sx > 0 ? (Math.pow(sx, 2) * Math.exp(-sx)) * 1.5 : 0;
          }
          else if(type === 'gev') {
              const sx = xPos + 1.5;
              heightPct = Math.exp(-(Math.exp(-sx) + sx + 1));
          }

          // Add some random noise to data
          heightPct = Math.max(0.05, heightPct + (Math.random() * 0.1 - 0.05));
          
          bars.push(
              <div key={i} className="bg-slate-700/50 w-1.5 rounded-t-sm mx-[1px]" style={{ height: `${heightPct * 80}%` }} />
          );
      }
      return <div className="absolute inset-0 flex items-end justify-center px-4 pb-0 opacity-50">{bars}</div>;
  };

  // Logic to determine fit status
  const getFitStatus = (gridId: number, selection: DistType | null) => {
     if (!selection) return 'none';
     const optimal = DATASETS.find(d => d.id === gridId)?.optimal;
     return selection === optimal ? 'good' : 'bad';
  };

  // Scoring
  const arealError = arealSelection ? DATASETS.filter(d => d.optimal !== arealSelection).length : 3;
  const gridError = DATASETS.filter(d => d.optimal !== gridSelections[d.id]).length;
  
  useEffect(() => {
      if (gameMode === 'gridwise' && gridError === 0) {
          setTimeout(() => setGameMode('victory'), 1000);
      }
  }, [gridSelections, gameMode, gridError]);

  const reset = () => {
    setGameMode('start');
    setArealSelection(null);
    setGridSelections({1: null, 2: null, 3: null});
    setActiveGrid(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
        
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Activity className="text-cyan-400" />
                    Fit the Curve Challenge
                </h3>
                <p className="text-slate-400 text-sm">Can you find the right probability distribution for the data?</p>
            </div>
            <div className="text-right">
                {gameMode === 'areal' && (
                    <div className={`px-3 py-1 rounded font-bold text-sm ${arealError > 1 ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                        Total Error: {arealSelection ? (arealError > 1 ? 'HIGH' : 'MED') : '---'}
                    </div>
                )}
                {gameMode === 'gridwise' && (
                    <div className={`px-3 py-1 rounded font-bold text-sm ${gridError === 0 ? 'bg-green-900/50 text-green-400' : 'bg-blue-900/50 text-blue-400'}`}>
                        Remaining Mismatches: {gridError}
                    </div>
                )}
            </div>
        </div>

        {/* --- START SCREEN --- */}
        {gameMode === 'start' && (
             <div className="text-center py-12 space-y-6">
                 <p className="text-lg text-slate-300 max-w-lg mx-auto">
                     In hydrological modeling, different regions behave differently. 
                     <br/>See if a <span className="text-red-400 font-bold">"One Size Fits All"</span> approach works.
                 </p>
                 <button 
                    onClick={() => setGameMode('areal')}
                    className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all"
                >
                    Start Experiment
                 </button>
             </div>
        )}

        {/* --- AREAL MODE --- */}
        {gameMode === 'areal' && (
            <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-4">
                    <p className="text-slate-300 mb-4"><span className="text-red-400 font-bold uppercase text-xs tracking-wider border border-red-500/30 bg-red-500/10 px-2 py-1 rounded mr-2">Areal Approach</span> Select ONE distribution for the entire basin:</p>
                    <div className="flex justify-center gap-4">
                        {['normal', 'gamma', 'gev'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setArealSelection(type as DistType)}
                                className={`px-4 py-2 rounded-lg border capitalize transition-all ${
                                    arealSelection === type 
                                    ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                }`}
                            >
                                {type === 'gev' ? 'GEV' : type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {DATASETS.map((grid) => (
                        <div key={grid.id} className="relative bg-slate-950/50 rounded-xl border border-slate-800 h-40 overflow-hidden group">
                            <div className="absolute top-2 left-3 z-10 text-xs font-bold text-slate-500">{grid.name}</div>
                            <HistogramBars type={grid.optimal} />
                            {arealSelection && (
                                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path 
                                        d={getCurvePath(arealSelection, 100, 100)} 
                                        fill="none" 
                                        stroke={getFitStatus(grid.id, arealSelection) === 'good' ? '#4ade80' : '#f87171'} 
                                        strokeWidth="3"
                                        className="drop-shadow-md"
                                    />
                                </svg>
                            )}
                            {arealSelection && (
                                <div className={`absolute bottom-2 right-2 text-xs font-bold px-2 py-1 rounded ${
                                    getFitStatus(grid.id, arealSelection) === 'good' ? 'bg-green-900/80 text-green-400' : 'bg-red-900/80 text-red-400'
                                }`}>
                                    {getFitStatus(grid.id, arealSelection) === 'good' ? 'Good Fit' : 'Poor Fit'}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {arealSelection && (
                    <div className="text-center pt-4 animate-fade-in-up">
                        <p className="text-slate-400 text-sm mb-4">
                            Notice how the curve fits one dataset but fails the others? <br/>
                            This leads to <strong>miscalculation of drought events</strong>.
                        </p>
                        <button 
                            onClick={() => setGameMode('gridwise')}
                            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold text-sm flex items-center mx-auto gap-2"
                        >
                            Try Grid-Wise Approach <ArrowRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        )}

        {/* --- GRIDWISE MODE --- */}
        {(gameMode === 'gridwise' || gameMode === 'victory') && (
             <div className="space-y-6 animate-fade-in">
                 <div className="text-center mb-4">
                    <p className="text-slate-300 mb-2"><span className="text-cyan-400 font-bold uppercase text-xs tracking-wider border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 rounded mr-2">Grid-wise Approach</span> Click a grid, then select the best distribution for it:</p>
                    
                    <div className={`flex justify-center gap-4 transition-opacity ${activeGrid ? 'opacity-100 pointer-events-auto' : 'opacity-30 pointer-events-none'}`}>
                        {['normal', 'gamma', 'gev'].map((type) => (
                            <button
                                key={type}
                                onClick={() => activeGrid && setGridSelections(prev => ({...prev, [activeGrid]: type as DistType}))}
                                className="px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-800 text-slate-300 hover:bg-cyan-900 hover:text-cyan-300 text-sm capitalize"
                            >
                                {type === 'gev' ? 'GEV' : type}
                            </button>
                        ))}
                    </div>
                    {!activeGrid && gameMode !== 'victory' && <p className="text-xs text-cyan-400 mt-2 animate-pulse"><MousePointer2 size={12} className="inline mr-1"/>Select a grid below to configure</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {DATASETS.map((grid) => (
                        <div 
                            key={grid.id} 
                            onClick={() => setActiveGrid(grid.id)}
                            className={`relative rounded-xl h-40 overflow-hidden cursor-pointer transition-all ${
                                activeGrid === grid.id 
                                ? 'ring-2 ring-cyan-400 bg-slate-800' 
                                : 'bg-slate-950/50 border border-slate-800 hover:border-slate-600'
                            }`}
                        >
                            <div className="absolute top-2 left-3 z-10 text-xs font-bold text-slate-500 flex justify-between w-full pr-6">
                                {grid.name}
                                {gridSelections[grid.id] && (
                                    <span className="uppercase text-[10px] bg-slate-900 px-1.5 rounded text-slate-400">
                                        {gridSelections[grid.id]}
                                    </span>
                                )}
                            </div>
                            <HistogramBars type={grid.optimal} />
                            {gridSelections[grid.id] && (
                                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path 
                                        d={getCurvePath(gridSelections[grid.id], 100, 100)} 
                                        fill="none" 
                                        stroke={getFitStatus(grid.id, gridSelections[grid.id]) === 'good' ? '#4ade80' : '#f87171'} 
                                        strokeWidth="3"
                                        className="drop-shadow-md"
                                    />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
             </div>
        )}

        {/* --- VICTORY SCREEN --- */}
        {gameMode === 'victory' && (
             <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in text-center p-8">
                 <div className="bg-cyan-500/20 p-4 rounded-full mb-4 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                    <Trophy size={48} className="text-cyan-400" />
                 </div>
                 <h3 className="text-3xl font-bold text-white mb-2">Perfect Fit!</h3>
                 <p className="text-slate-300 max-w-md mb-8">
                     By fitting a unique distribution to each grid, you accurately captured the physical processes of every region. This is the power of the <strong className="text-cyan-400">Grid-wise approach</strong>.
                 </p>
                 <button 
                    onClick={reset}
                    className="flex items-center gap-2 px-6 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                 >
                    <RefreshCw size={16} /> Replay Challenge
                 </button>
             </div>
        )}

    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div className="relative min-h-full">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 bg-slate-950">
        <ProbabilityWaves />
        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950 pointer-events-none" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-16 pt-10 pb-20">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 py-16 animate-fade-in-up">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium tracking-wide shadow-[0_0_10px_rgba(34,211,238,0.1)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
            Science of the Total Environment 946 (2024)
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white font-serif leading-tight tracking-tight drop-shadow-2xl">
            A Grid-Wise Approach for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
              Accurate SRI Computation
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing hydrological drought monitoring in the Godavari Basin by dynamically fitting probability distributions to individual grid cells.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <Link to="/methodology" className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-900/20 flex items-center overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">Explore Methodology</span>
              <ArrowRight size={20} className="ml-2 relative group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href={PAPER_INFO.doi} target="_blank" rel="noreferrer" className="px-8 py-4 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl font-medium transition-all flex items-center">
              View DOI
            </a>
          </div>
        </section>

        {/* Interactive Game Section */}
        <section>
          <DistributionGame />
        </section>

        {/* The Core Problem & Solution */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-red-900/30 shadow-xl hover:border-red-900/50 transition-colors">
            <div className="flex items-center mb-6 text-red-400">
              <div className="p-3 bg-red-950/50 rounded-lg mr-4 border border-red-900/30">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-2xl font-bold font-serif text-slate-100">The Problem</h3>
            </div>
            <p className="text-slate-400 leading-relaxed text-lg">
              Traditional <strong className="text-red-300">"Areal" approaches</strong> fit a single probability distribution for an entire basin. 
              In heterogeneous regions like Godavari, this masks local variations, causing extreme dry or wet events to be <span className="underline decoration-red-500/50 underline-offset-4">misrepresented as "normal"</span>.
            </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-cyan-900/30 shadow-xl hover:border-cyan-900/50 transition-colors">
            <div className="flex items-center mb-6 text-cyan-400">
              <div className="p-3 bg-cyan-950/50 rounded-lg mr-4 border border-cyan-900/30">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-2xl font-bold font-serif text-slate-100">The Solution</h3>
            </div>
            <p className="text-slate-400 leading-relaxed text-lg">
              A <strong className="text-cyan-300">Grid-Wise approach</strong> that dynamically fits the best probability distribution to each 0.05° grid cell. 
              This method captures local runoff characteristics, yielding <span className="underline decoration-cyan-500/50 underline-offset-4">significantly higher accuracy</span> in detecting extremes.
            </p>
          </div>
        </section>

        {/* Abstract Highlights */}
        <section className="bg-slate-900/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-8">
            <Activity className="text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Research Highlights</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
             <ul className="space-y-4">
              {[
                "SRI is a critical indicator for evaluating hydrological drought.",
                "Study compares traditional 'Areal' fitting vs. novel 'Grid-wise' fitting.",
                "Conducted in the Godavari Basin, India, using VIC model simulated runoff."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start text-slate-300 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2.5 mr-4 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(34,211,238,0.5)]"></span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-4">
              {[
                "Analysis spans 1981-2019 with retrospective runoff conditions.",
                "Results show the Areal approach misrepresents extreme events significantly.",
                "Grid-wise approach proves essential for accurate extreme event characterization."
              ].map((item, idx) => (
                <li key={idx + 3} className="flex items-start text-slate-300 group">
                   <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2.5 mr-4 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(34,211,238,0.5)]"></span>
                   <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Stat bar */}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-slate-800">
             <div className="text-center">
                <div className="text-3xl font-bold text-white">0.05°</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Resolution</div>
             </div>
             <div className="text-center border-l border-slate-800">
                <div className="text-3xl font-bold text-white">38</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Years of Data</div>
             </div>
             <div className="text-center border-l border-slate-800">
                <div className="text-3xl font-bold text-white">VIC</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Model Used</div>
             </div>
          </div>
        </section>

        <footer className="pt-12 text-center">
          <p className="text-slate-600 text-sm">Based on the research by <span className="text-slate-400">{PAPER_INFO.authors}</span>.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;