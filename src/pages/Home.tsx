import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { FlightCard } from '../components/FlightCard';
import { BookingModal } from '../components/BookingModal';
import { FLIGHTS } from '../data/flights';
import { Flight } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Search } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'time'>('price');

  const filteredFlights = FLIGHTS
    .filter(flight => {
      const matchesFrom = searchFrom === '' || flight.from.toLowerCase().includes(searchFrom.toLowerCase());
      const matchesTo = searchTo === '' || flight.to.toLowerCase().includes(searchTo.toLowerCase());
      
      if (activeTab === 'Economy') return matchesFrom && matchesTo && Number(flight.price) <= 0.07;
      if (activeTab === 'Business') return matchesFrom && matchesTo && Number(flight.price) > 0.07;
      
      return matchesFrom && matchesTo;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return Number(a.price) - Number(b.price);
      if (sortBy === 'duration') return a.duration.localeCompare(b.duration);
      return a.departureTime.localeCompare(b.departureTime);
    });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-full"
    >
      <Hero 
        onSearch={(from, to) => {
          setSearchFrom(from);
          setSearchTo(to);
          document.getElementById('flights-list')?.scrollIntoView({ behavior: 'smooth' });
        }} 
      />
      
      <div id="flights-list" className="p-8 flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Available Flights</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em] bg-indigo-50 px-2 py-0.5 rounded">Live Feed</span>
              <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">
                {filteredFlights.length} routes matching criteria
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 focus:outline-none shadow-sm"
            >
              <option value="price">Sort by Price</option>
              <option value="duration">Sort by Duration</option>
              <option value="time">Sort by Departure</option>
            </select>

            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              {['All', 'Economy', 'Business'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-xs font-bold transition-all",
                    activeTab === tab ? "bg-white shadow-sm border border-slate-200 text-indigo-600" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredFlights.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredFlights.map((flight) => (
              <motion.div key={flight.id} variants={item}>
                <FlightCard 
                  flight={flight} 
                  onBook={(f) => setSelectedFlight(f)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-4">No Routes Found</p>
            <button 
              onClick={() => { setSearchFrom(''); setSearchTo(''); setActiveTab('All'); }}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-xs shadow-lg shadow-indigo-100 active:scale-95"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}
      </div>

      <BookingModal 
        flight={selectedFlight} 
        onClose={() => setSelectedFlight(null)}
        onSuccess={() => navigate('/bookings')}
      />

      {/* Theme-style Bottom Search Bar */}
      <footer className="mt-auto p-8 bg-white border-t border-slate-200 sticky bottom-0 z-30">
        <div className="max-w-5xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl flex flex-wrap p-2 shadow-inner">
          <div className="flex-1 min-w-[150px] px-6 py-3 border-r border-slate-200/50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Departure</div>
            <input 
              type="text"
              value={searchFrom}
              onChange={(e) => setSearchFrom(e.target.value)}
              placeholder="London (LHR)"
              className="text-sm font-black text-slate-800 bg-transparent w-full focus:outline-none placeholder:text-slate-300"
            />
          </div>
          <div className="flex-1 min-w-[150px] px-6 py-3 border-r border-slate-200/50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Destination</div>
            <input 
              type="text"
              value={searchTo}
              onChange={(e) => setSearchTo(e.target.value)}
              placeholder="New York (JFK)"
              className="text-sm font-black text-slate-800 bg-transparent w-full focus:outline-none placeholder:text-slate-300"
            />
          </div>
          <div className="flex-1 min-w-[150px] px-6 py-3 border-r border-slate-200/50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</div>
            <div className="text-sm font-black text-slate-800">June 12, 2026</div>
          </div>
          <button 
            className="bg-indigo-600 text-white px-10 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            Update Search
          </button>
        </div>
      </footer>
    </motion.div>
  );
};
