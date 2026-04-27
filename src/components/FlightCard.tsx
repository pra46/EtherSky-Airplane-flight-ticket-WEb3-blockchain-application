import React from 'react';
import { Plane, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Flight } from '../types';

interface FlightCardProps {
  flight: Flight;
  onBook: (flight: Flight) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, onBook }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col group h-full"
    >
      <div className="flex-1">
        <div className="flex items-center gap-6 mb-5">
          <div className="flex-1">
            <div className="text-2xl font-black text-slate-800 leading-none mb-1">{flight.from.split(' ')[0]}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{flight.from.split('(')[1]?.replace(')', '') || 'Origin'}</div>
          </div>
          
          <div className="flex flex-col items-center flex-1">
            <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1 italic">Non-stop</div>
            <div className="w-full h-px bg-slate-100 relative">
              <Plane className="w-4 h-4 text-slate-200 absolute -top-2 left-1/2 -translate-x-1/2 bg-white rotate-45" />
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-1">{flight.duration}</div>
          </div>

          <div className="flex-1 text-right">
            <div className="text-2xl font-black text-slate-800 leading-none mb-1">{flight.to.split(' ')[0]}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{flight.to.split('(')[1]?.replace(')', '') || 'Dest'}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 pl-1.5 pr-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
            <img src={flight.image} alt="" className="w-5 h-5 rounded-md object-cover" />
            <span className="text-[10px] font-bold text-slate-600 tracking-tight">{flight.airline}</span>
          </div>
          <span className="text-[10px] bg-indigo-50 px-2 py-1.5 rounded-lg text-indigo-600 font-bold uppercase tracking-tighter">Verified</span>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
        <div className="text-left">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Starting From</div>
          <div className="text-lg font-black text-slate-900 leading-none">{flight.price} <span className="text-indigo-600">ETH</span></div>
        </div>
        
        <button 
          onClick={() => onBook(flight)}
          className="bg-indigo-600 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 flex items-center gap-2"
        >
          Book Now
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};
