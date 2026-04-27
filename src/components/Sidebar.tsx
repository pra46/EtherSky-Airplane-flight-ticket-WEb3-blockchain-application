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
        <Link
          to="/bookings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all",
            location.pathname === '/bookings' ? "text-indigo-700 bg-indigo-50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          )}
        >
          <Wallet className="w-5 h-5" />
          Wallet History
        </Link>
      </nav>

      <div className="mt-auto space-y-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Recent Activity</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-700 leading-none">Ticket Minted</p>
                <p className="text-[9px] text-slate-400 mt-0.5">2m ago • Block #4582</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-700 leading-none">Refund Processed</p>
                <p className="text-[9px] text-slate-400 mt-0.5">15m ago • Hash ox3a... </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <Activity className="w-3 h-3 text-indigo-400" />
            Network Status
          </div>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-2.5 h-2.5 rounded-full",
              address ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)] animate-pulse" : "bg-slate-600"
            )} />
            <span className="text-[11px] font-black text-white uppercase tracking-tight">
              {address ? "Mainnet Active" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
