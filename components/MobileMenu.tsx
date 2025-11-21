import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden bg-slate-950 border-b border-slate-800 text-white sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="flex justify-between items-center p-4">
            <span className="font-bold font-serif text-cyan-400">SRI Grid-Wise</span>
            <button onClick={toggle} className="p-2 text-slate-400 hover:text-white">
                {isOpen ? <X /> : <Menu />}
            </button>
        </div>
        
        {isOpen && (
            <div className="bg-slate-900 absolute w-full border-b border-slate-800 shadow-2xl">
                <nav className="flex flex-col p-4 space-y-2">
                    <Link to="/" onClick={toggle} className="p-3 rounded-md text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">Overview</Link>
                    <Link to="/study-area" onClick={toggle} className="p-3 rounded-md text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">Study Area</Link>
                    <Link to="/methodology" onClick={toggle} className="p-3 rounded-md text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">Methodology</Link>
                    <Link to="/results" onClick={toggle} className="p-3 rounded-md text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">Results</Link>
                    <a 
                        href="https://doi.org/10.1016/j.scitotenv.2024.174472"
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 text-cyan-400 font-semibold mt-2 border-t border-slate-700 block text-center"
                    >
                        Read Paper
                    </a>
                </nav>
            </div>
        )}
    </div>
  );
};

export default MobileMenu;