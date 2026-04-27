import React from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { motion } from 'motion/react';

export const Hero: React.FC = () => {
  return (
    <div className="relative h-[600px] flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=2000")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-indigo-900/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
          >
            Your Journey, <br /> Securely on the <span className="text-indigo-400">Blockchain.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-indigo-100 mb-10 max-w-lg"
          >
            Experience the future of travel. Book global flights with ETH and store your tickets as verified blockchain transactions.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-2 rounded-2xl shadow-2xl flex flex-wrap gap-2"
          >
            <div className="flex-1 min-w-[200px] flex items-center gap-3 px-4 py-3 border-r border-gray-100">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Departure</p>
                <input 
                  type="text" 
                  placeholder="Where from?" 
                  className="w-full text-sm font-medium focus:outline-none placeholder:text-gray-300"
                />
              </div>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-3 px-4 py-3 border-r border-gray-100">
              <Search className="w-5 h-5 text-indigo-500" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Destination</p>
                <input 
                  type="text" 
                  placeholder="Where to?" 
                  className="w-full text-sm font-medium focus:outline-none placeholder:text-gray-300"
                />
              </div>
            </div>
            <div className="flex-1 min-w-[150px] flex items-center gap-3 px-4 py-3 border-r border-gray-100">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Date</p>
                <input 
                  type="date" 
                  className="w-full text-sm font-medium focus:outline-none"
                />
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200">
              Search Flights
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
