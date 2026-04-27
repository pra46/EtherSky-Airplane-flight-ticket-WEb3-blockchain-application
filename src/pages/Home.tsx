import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { FlightCard } from '../components/FlightCard';
import { BookingModal } from '../components/BookingModal';
import { FLIGHTS } from '../data/flights';
import { Flight } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Home: React.FC = () => {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  return (
    <div className="flex flex-col min-h-full">
      <div className="p-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Available Flights</h1>
            <p className="text-sm text-slate-400 font-medium mt-1 uppercase tracking-widest">Real-time Blockchain Reservations</p>
          </div>
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {['All', 'Economy', 'Business'].map((tab) => (
              <button 
                key={tab}
                className={cn(
                  "px-4 py-1.5 rounded-xl text-xs font-bold transition-all",
                  tab === 'All' ? "bg-white shadow-sm border border-slate-200 text-indigo-600" : "text-slate-500 hover:text-slate-800"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FLIGHTS.map((flight) => (
            <FlightCard 
              key={flight.id} 
              flight={flight} 
              onBook={(f) => setSelectedFlight(f)}
            />
          ))}
        </div>
      </div>

      <BookingModal 
        flight={selectedFlight} 
        onClose={() => setSelectedFlight(null)}
        onSuccess={() => console.log("Success!")}
      />

      {/* Theme-style Bottom Search Bar */}
      <footer className="mt-auto p-8 bg-white border-t border-slate-200 sticky bottom-0 z-30">
        <div className="max-w-5xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl flex flex-wrap p-2 shadow-inner">
          <div className="flex-1 min-w-[150px] px-6 py-3 border-r border-slate-200/50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Departure</div>
            <div className="text-sm font-black text-slate-800">London (LHR)</div>
          </div>
          <div className="flex-1 min-w-[150px] px-6 py-3 border-r border-slate-200/50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Destination</div>
            <div className="text-sm font-black text-slate-800">New York (JFK)</div>
          </div>
          <div className="flex-1 min-w-[150px] px-6 py-3 border-r border-slate-200/50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</div>
            <div className="text-sm font-black text-slate-800">June 12, 2026</div>
          </div>
          <button className="bg-indigo-600 text-white px-10 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
            Update Search
          </button>
        </div>
      </footer>
    </div>
  );
};
