import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, BarChart2, FileText, GitBranch } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Overview', icon: Home },
    { path: '/study-area', label: 'Study Area', icon: Map },
    { path: '/methodology', label: 'Methodology', icon: GitBranch },
    { path: '/results', label: 'Results & Analysis', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 h-screen sticky top-0 hidden md:flex flex-col shadow-2xl z-50">
      <div className="p-6 border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <h1 className="text-xl font-bold font-serif text-cyan-400 tracking-tight">SRI Grid-Wise</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">Scientific Visualization</p>
      </div>
      
      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <item.icon size={18} className={`mr-3 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="font-medium tracking-wide text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-slate-800 bg-slate-950/50">
        <a 
          href="https://doi.org/10.1016/j.scitotenv.2024.174472" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-2.5 px-4 bg-slate-900 hover:bg-cyan-900/20 border border-slate-700 hover:border-cyan-800 rounded-lg text-xs text-slate-400 hover:text-cyan-400 transition-all group"
        >
          <FileText size={14} className="mr-2 group-hover:scale-110 transition-transform" />
          Read Paper
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;