import React, { useState } from 'react';
import { GODAVARI_STATS } from '../constants';
import { CloudRain, Thermometer, Layers, Mountain, Maximize2 } from 'lucide-react';
import ImageModal from '../components/ImageModal';

const StudyArea: React.FC = () => {
  const [modalImage, setModalImage] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      <div className="border-b border-slate-800 pb-8">
        <div className="inline-block px-3 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            Basin Overview
        </div>
        <h2 className="text-4xl font-bold text-white font-serif">Godavari River Basin</h2>
        <p className="text-slate-400 mt-4 text-lg max-w-3xl">
          One of the main river basins of India, covering approximately 312,812 km² across multiple states. Its heterogeneity makes it the perfect candidate for Grid-wise analysis.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {GODAVARI_STATS.map((stat, index) => (
          <div key={index} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all hover:-translate-y-1 group">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider group-hover:text-cyan-400 transition-colors">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-200 mt-2 group-hover:text-white shadow-cyan-500/50">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Descriptive Sections */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <CloudRain size={24} />
              <h3 className="text-xl font-bold text-slate-200">Climate & Rainfall</h3>
            </div>
            <p className="text-slate-400 leading-relaxed">
              The basin is dominated by the south-west monsoon. Approximately <strong className="text-white">80%</strong> of rainfall occurs from June to September. 
              The winter season contributes only 4% of annual rainfall.
            </p>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-lg">
             <div className="flex items-center gap-3 mb-4 text-amber-500">
              <Layers size={24} />
              <h3 className="text-xl font-bold text-slate-200">Geology & Land Use</h3>
            </div>
             <ul className="space-y-3 text-slate-400">
                <li className="flex gap-2"><span className="text-amber-500/50">•</span> <span><strong>Upper Reaches:</strong> Deccan basalt traps (water retentive).</span></li>
                <li className="flex gap-2"><span className="text-amber-500/50">•</span> <span><strong>Middle Reaches:</strong> Peninsular granites and Gondwanas.</span></li>
                <li className="flex gap-2"><span className="text-amber-500/50">•</span> <span><strong>Land Use:</strong> Croplands (68%) and deciduous forest (26%).</span></li>
            </ul>
          </div>
        </div>

        {/* Map Container */}
        <div 
          className="bg-slate-800/30 rounded-2xl flex flex-col items-center justify-center min-h-[350px] border border-slate-700 relative overflow-hidden group cursor-zoom-in hover:border-cyan-500/40 transition-colors"
          onClick={() => setModalImage(`${import.meta.env.BASE_URL}assets/study-area.png`)}
        >
           <img 
             src={`${import.meta.env.BASE_URL}assets/study-area.png`} 
             alt="Godavari Basin Map"
             className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700 group-hover:scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
           
           {/* Visual Nudge Overlay */}
           <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur p-2 rounded-lg text-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity shadow-lg border border-slate-700/50">
              <Maximize2 size={20} />
           </div>

           <div className="relative z-10 text-center p-8 pointer-events-none">
             <div className="w-16 h-16 bg-slate-900/80 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-600 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:border-cyan-500/50 transition-colors">
                <Mountain className="text-cyan-500" size={32} />
             </div>
             <h4 className="font-bold text-xl text-white mb-2">Godavari Basin Map</h4>
             <p className="text-slate-400 text-sm max-w-xs mx-auto">
               Visualization of Digital Elevation Model (DEM) and Land Use patterns across the region.
             </p>
             <div className="mt-4 inline-flex items-center text-xs text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                Click to expand
             </div>
           </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-950/50 to-slate-900/50 border border-blue-900/30 p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl"></div>
        <h3 className="font-bold text-blue-300 mb-3 flex items-center text-lg relative z-10">
            <Thermometer className="mr-2" size={20} /> 
            Simulation Data Source
        </h3>
        <p className="text-slate-400 leading-relaxed relative z-10 max-w-4xl">
          The study utilizes daily runoff data simulated by the <strong>Variable Infiltration Capacity (VIC)</strong> model framework. 
          Input data includes daily gridded climate forcing data (CHIRPS) and IMD temperature data at 0.05° resolution.
        </p>
      </div>

      {/* Image Modal */}
      {modalImage && (
        <ImageModal 
          src={modalImage} 
          alt="Study Area Detail" 
          onClose={() => setModalImage(null)} 
        />
      )}
    </div>
  );
};

export default StudyArea;