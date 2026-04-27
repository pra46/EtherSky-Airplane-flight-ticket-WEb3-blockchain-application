import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { web3Service } from '../services/web3Service';
import { FLIGHTS } from '../data/flights';
import { formatDate, formatAddress } from '../lib/utils';
import { Ticket, Plane, Loader2, Wallet, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export const MyBookings: React.FC = () => {
  const { address, connect } = useWeb3();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [address]);

  const fetchBookings = async () => {
    if (!address) return;
    setIsLoading(true);
    try {
      const data = await web3Service.getUserBookings(address);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    setCancellingId(id);
    try {
      await web3Service.cancelBooking(id);
      await fetchBookings();
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  };

  if (!address) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Wallet className="w-10 h-10 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Connect Your Wallet</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Sign in with MetaMask to view and manage your blockchain flight bookings.
        </p>
        <button 
          onClick={connect}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100"
        >
          Connect MetaMask
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-500 font-medium">Your verified flight records on the blockchain</p>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Fetching Blockchain Data...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-gray-200">
          <Ticket className="w-16 h-16 text-gray-200 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-500 mb-8">Ready for your next adventure?</p>
          <a href="/" className="text-indigo-600 font-bold hover:underline">Browse Featured Flights</a>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const flight = FLIGHTS.find(f => f.id === booking.flightId);
            return (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-12 bg-indigo-50/20 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50/40 transition-colors" />

                <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                  <div className="w-24 h-24 rounded-3xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <img 
                      src={flight?.image || "https://picsum.photos/seed/flight/200/200"} 
                      alt={flight?.airline} 
                      className="w-16 h-16 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Flight</p>
                      <h4 className="font-bold text-gray-900">{flight?.from} → {flight?.to}</h4>
                      <p className="text-sm text-gray-500 uppercase font-medium">{flight?.airline}</p>
                    </div>
                    
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date Booked</p>
                      <h4 className="font-bold text-gray-900">{formatDate(booking.timestamp)}</h4>
                      <p className="text-xs font-mono text-indigo-400">ID: #{booking.id}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                      <div className="flex items-center gap-1.5 text-green-600">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-bold uppercase tracking-wider">Blockchain Verified</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{booking.seatCount} Seat{booking.seatCount > 1 ? 's' : ''} • {booking.price} ETH</p>
                    </div>

                    <div className="flex items-center justify-end">
                      <button 
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="p-3 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all disabled:opacity-50"
                        title="Cancel Booking"
                      >
                        {cancellingId === booking.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
