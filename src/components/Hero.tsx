import React from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onSearch: (from: string, to: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');

  return (
    <div className="relative h-[500px] flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=2000")',
        }}>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-indigo-900/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tighter">
            Your Journey, <br /> Securely on the <span className="text-indigo-400 underline decoration-indigo-500/30">Blockchain.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-indigo-100/70 mb-10 max-w-lg font-medium">
            Experience the future of travel. Book global flights with ETH and store your tickets as verified blockchain transactions.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-2 rounded-[2.5rem] shadow-2xl flex flex-wrap gap-2 border border-white/20">
            <div className="flex-1 min-w-[200px] flex items-center gap-3 px-6 py-4 border-r border-slate-100">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <div className="text-left flex-1">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Departure</p>
                <input type="text" value={from}onChange={(e) => setFrom(e.target.value)}placeholder="Where from?" 
                className="w-full text-sm font-bold text-slate-800 focus:outline-none placeholder:text-slate-300"/>
              </div>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-3 px-6 py-4 border-r border-slate-100">
              <Search className="w-5 h-5 text-indigo-500" />
              <div className="text-left flex-1">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Destination</p>
                <input 
                  type="text" 
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Where to?" 
                  className="w-full text-sm font-bold text-slate-800 focus:outline-none placeholder:text-slate-300"
                />
              </div>
            </div>
            <button 
              onClick={() => onSearch(from, to)}
              className="bg-indigo-600 text-white px-10 py-4 rounded-[1.8rem] font-black text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100"
            >
              Search Flights
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
