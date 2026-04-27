import React, { useState } from 'react';
import { X, Calendar, Ticket, ChevronRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Flight } from '../types';
import { useWeb3 } from '../context/Web3Context';
import { web3Service } from '../services/web3Service';

interface BookingModalProps {
  flight: Flight | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ flight, onClose, onSuccess }) => {
  const { address, connect } = useWeb3();
  const [seatCount, setSeatCount] = useState(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [txHash, setTxHash] = useState('');

  if (!flight) return null;

  const totalPrice = (Number(flight.price) * seatCount).toFixed(3);

  const handleBooking = async () => {
    if (!address) {
      await connect();
      return;
    }

    setStatus('loading');
    setErrorMsg('');
    try {
      const hash = await web3Service.bookFlight(flight.id, seatCount, flight.price);
      setTxHash(hash);
      
      // Save locally as a secondary ledger for instant UI feedback
      if (address) {
        web3Service.saveLocalBooking(address, flight.id, seatCount, flight.price);
      }
      
      setStatus('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'Transaction failed. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm"
          onClick={onClose}/>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 text-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-indigo-400 uppercase tracking-widest">Confirm Transaction</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                title="Close">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            {status === 'success' ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Booking Verified!</h3>
                <p className="text-slate-400 mb-6 text-sm">Your reservation is now anchored on the Ethereum mainnet.</p>
                <a 
                  href={`https://etherscan.io/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/5 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-all border border-white/10"
                >
                  View on Explorer <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Flight Summary */}
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Electronic Ticket</p>
                      <h4 className="text-xl font-black text-white leading-tight">{flight.from.split('(')[0]} → {flight.to.split('(')[0]}</h4>
                    </div>
                    <div className="bg-indigo-500 px-3 py-1 rounded-lg text-[10px] font-black text-white shadow-sm">
                      {flight.airline.toUpperCase()}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>Blockchain Verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Ticket className="w-3 h-3" />
                      <span>Smart Contract Validated</span>
                    </div>
                  </div>
                </div>

                {/* Seat Selector */}
                <div className="flex items-center justify-between px-2">
                  <span className="font-bold text-slate-400 text-sm italic uppercase tracking-widest">Quantity</span>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-xl transition-all">
                      -
                    </button>
                    <span className="text-xl font-black w-4 text-center">{seatCount}</span>
                    <button 
                      onClick={() => setSeatCount(Math.min(flight.seatsAvailable, seatCount + 1))}
                      className="w-10 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-400 flex items-center 
                      justify-center font-bold text-xl text-white transition-all shadow-lg shadow-indigo-500/20">
                      +
                    </button>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Transaction Value</span>
                      <span className="text-3xl font-black text-white">{(Number(totalPrice) + 0.001).toFixed(3)} <span className="text-indigo-400">ETH</span></span>
                    </div>
                    <div className="text-right text-[10px] font-bold text-slate-500 leading-tight">
                      Incl. 0.001 ETH<br />Surcharge
                    </div>
                  </div>
                </div>

                {status === 'error' && (
                  <div className="bg-red-500/10 p-4 rounded-xl flex gap-3 border border-red-500/20">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-xs text-red-400 font-medium">{errorMsg}</p>
                  </div>
                )}

                <button 
                  onClick={handleBooking}
                  disabled={status === 'loading'}
                  className="w-full bg-indigo-500 text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-indigo-400 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-500/30 active:scale-95 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-5 h-5" />
                      <span>{address ? 'Authorize & Book' : 'Connect Wallet'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
