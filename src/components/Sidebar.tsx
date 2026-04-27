import React from 'react';
import { Plane, Search, Ticket, Wallet, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useWeb3 } from '../context/Web3Context';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { address } = useWeb3();

  const navItems = [
    { name: 'Search Flights', path: '/', icon: Search },
    { name: 'My Bookings', path: '/bookings', icon: Ticket },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col p-6 h-screen sticky top-0">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
          <Plane className="w-6 h-6 text-white rotate-45" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">EtherSky</span>
      </div>
      
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all",
                isActive 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-lg transition-all text-left">
          <Wallet className="w-5 h-5" />
          Wallet History
        </button>
      </nav>

      <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Activity className="w-3 h-3" />
          Network Status
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            address ? "bg-green-500" : "bg-slate-300"
          )} />
          <span className="text-xs font-bold text-slate-700">
            {address ? "Mainnet Connected" : "Not Connected"}
          </span>
        </div>
      </div>
    </aside>
  );
};
