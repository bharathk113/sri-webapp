import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MobileMenu from './components/MobileMenu';
import Home from './pages/Home';
import StudyArea from './pages/StudyArea';
import Methodology from './pages/Methodology';
import Results from './pages/Results';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-300">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
            <MobileMenu />
            <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto scroll-smooth">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/study-area" element={<StudyArea />} />
                    <Route path="/methodology" element={<Methodology />} />
                    <Route path="/results" element={<Results />} />
                </Routes>
            </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;