import React from 'react';
import { Wallet, User, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { formatAddress } from '../lib/utils';

export const Header: React.FC = () => {
  const { address, connect, isConnecting } = useWeb3();
  const location = useLocation();

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="hover:text-indigo-600 cursor-pointer transition-colors">Dashboard</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        <span className="font-bold text-slate-800">
          {location.pathname === '/' ? 'Flight Search' : 'My Bookings'}
        </span>
      </div>
      
      <div className="flex items-center gap-6">
        {address && (
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Wallet Balance</span>
            <span className="text-sm font-bold text-indigo-600 font-mono">CONNECTED</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all hidden sm:block">
            <Bell className="w-5 h-5" />
          </button>
          
          {address ? (
            <div className="h-10 pl-3 pr-1 py-1 bg-slate-100 rounded-full border border-slate-200 flex items-center gap-3">
              <span className="text-sm font-mono font-bold text-slate-600">{formatAddress(address)}</span>
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-sm flex items-center justify-center text-white">
                <User className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
