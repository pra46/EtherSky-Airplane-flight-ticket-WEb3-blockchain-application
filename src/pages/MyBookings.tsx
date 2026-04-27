import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { web3Service } from '../services/web3Service';
import { FLIGHTS } from '../data/flights';
import { formatDate, formatAddress } from '../lib/utils';
import { Ticket, Plane, Loader2, Wallet, Trash2, Activity, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const MyBookings: React.FC = () => {
  const { address, connect } = useWeb3();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [address]);

  const fetchBookings = async () => {
    if (!address) return;
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await web3Service.getUserBookings(address);
      setBookings(data);
    } catch (err: any) {
      console.error(err);
      setFetchError(err.message || "Failed to fetch bookings. Ensure you are on the correct network.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setSuccessMessage(null);
    fetchBookings();
  };

  const handleCancel = async (id: number) => {
    setCancellingId(id);
    setSuccessMessage(null);
    try {
      await web3Service.refundBooking(id);
      setSuccessMessage("Refund processed successfully! The flight has been removed from your active ledger.");
      await fetchBookings();
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  };

  if (!address) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center">
        <div className="w-24 h-24 bg-white border border-slate-200 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-slate-200/50">
          <Wallet className="w-10 h-10 text-indigo-600" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Wallet Authentication Required</h2>
        <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">
          Securely sign in with your Web3 wallet to verify and manage your verified flight records on the blockchain.
        </p>
        <button 
          onClick={connect}
          className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-2xl shadow-indigo-200"
        >
          Connect MetaMask
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <div className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-2">Verified Ledger</div>
          <h1 className="text-5xl font-black text-slate-900 mb-3 tracking-tighter">My Reservations</h1>
          <p className="text-slate-400 font-medium italic">Immutable flight records secured on the Ethereum blockchain.</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
        >
          <Activity className={cn("w-4 h-4", isLoading && "animate-pulse")} />
          Sync Chain State
        </button>
      </div>

      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2"
        >
          <Activity className="w-4 h-4" />
          {successMessage}
        </motion.div>
      )}

      {isLoading ? (
        <div className="py-32 flex flex-col items-center gap-6">
          <div className="relative">
             <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
             <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full" />
          </div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing With Network...</p>
        </div>
      ) : fetchError ? (
        <div className="bg-red-50 rounded-[3rem] p-24 text-center border border-red-100 shadow-sm">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-2xl font-black text-red-800 mb-3">Connection Error</h3>
          <p className="text-red-400 mb-10 font-medium max-w-sm mx-auto">{fetchError}</p>
          <button 
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-xl font-black text-sm hover:bg-red-700 transition-all active:scale-95 shadow-sm"
          >
            Retry Connection
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Ticket className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-3">No Active Bookings</h3>
          <p className="text-slate-400 mb-10 font-medium">Your flight manifest is currently empty. Ready for takeoff?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-black text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-sm"
            >
              Explore Routes
              <Plane className="w-4 h-4" />
            </a>
            <button 
              onClick={handleRefresh}
              className="text-slate-400 font-bold text-xs hover:text-indigo-600 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            show: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="space-y-8"
        >
          {bookings.map((booking) => {
            const flight = FLIGHTS.find(f => f.id === booking.flightId);
            const fromLabel = flight?.from.split('(')[0] || `Unknown Flight (ID: ${booking.flightId})`;
            const fromCode = flight?.from.split('(')[1]?.replace(')', '') || 'UNK';
            const toLabel = flight?.to.split('(')[0] || 'Unknown Destination';
            const toCode = flight?.to.split('(')[1]?.replace(')', '') || 'UNK';

            return (
              <motion.div 
                key={booking.id}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  show: { opacity: 1, x: 0 }
                }}
                className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all relative overflow-hidden group"
              >
                <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-1.5 mb-6">
                        <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm border border-indigo-100">NFT Receipt #{booking.id}</span>
                        {booking.isSimulated ? (
                          <span className="text-[10px] font-black text-orange-500 flex items-center gap-1 uppercase tracking-tighter ml-auto italic">
                             Demo Simulation (Local)
                          </span>
                        ) : (
                          <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1 uppercase tracking-tighter ml-auto italic">
                             Mainnet Verified
                          </span>
                        )}
                     </div>

                    <div className="flex items-center justify-between mb-8">
                       <div>
                          <div className="text-3xl font-black text-slate-800 leading-none mb-2">{fromLabel}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{fromCode}</div>
                       </div>
                       <div className="flex flex-col items-center flex-1 px-10">
                          <Plane className="w-5 h-5 text-indigo-500 rotate-45 mb-1" />
                          <div className="w-full h-px bg-slate-100 relative" />
                       </div>
                       <div className="text-right">
                          <div className="text-3xl font-black text-slate-800 leading-none mb-2">{toLabel}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{toCode}</div>
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-10 items-end">
                       <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Reservation Date</p>
                         <p className="text-sm font-black text-slate-700">{formatDate(booking.timestamp)}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Electronic Seats</p>
                         <p className="text-sm font-black text-slate-700">{booking.seatCount} x Economy</p>
                       </div>
                       <div className="ml-auto">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-right">Value</p>
                         <p className="text-xl font-black text-indigo-600">{booking.price} <span className="text-sm opacity-50">ETH</span></p>
                       </div>
                    </div>
                  </div>

                  <div className="shrink-0 lg:border-l lg:border-slate-50 lg:pl-12 flex flex-col items-center gap-4">
                     <div className="w-24 h-24 bg-slate-50 rounded-3xl p-4 flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-105 transition-transform">
                        <img 
                          src={flight?.image || "https://picsum.photos/seed/flight/200/200"} 
                          alt={flight?.airline} 
                          className="w-full h-full object-cover rounded-2xl shadow-sm"
                        />
                     </div>
                     <button 
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 disabled:opacity-50"
                      >
                        {cancellingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        Refund & Cancel NFT
                      </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
