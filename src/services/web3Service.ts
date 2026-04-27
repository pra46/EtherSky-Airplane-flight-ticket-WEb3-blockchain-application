import { ethers } from 'ethers';
import FlightBookingABI from '../contracts/FlightBooking.json';

// Use a placeholder address for demonstration. 
// In a real deployment, this would be the address of your deployed contract.
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  private isSimulationMode: boolean = false;

  async connectWallet() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error("MetaMask is not installed. Please install it to use this app.");
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      this.signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, FlightBookingABI, this.signer);
      
      // Verification: Check if contract exists at address
      const code = await this.provider.getCode(CONTRACT_ADDRESS);
      if (code === '0x' || code === '0x0') {
        console.warn(`No contract found at ${CONTRACT_ADDRESS}. Enabling Simulation Mode for demo.`);
        this.isSimulationMode = true;
      } else {
        this.isSimulationMode = false;
      }
      
      return await this.signer.getAddress();
    } catch (error) {
      console.error("Wallet connection error:", error);
      throw error;
    }
  }

  async disconnect() {
    this.signer = null;
    this.contract = null;
    this.provider = null;
    this.isSimulationMode = false;
  }

  async getAddress() {
    if (!this.signer) return null;
    return await this.signer.getAddress();
  }

  async bookFlight(flightId: number, seatCount: number, priceInEth: string) {
    if (!this.signer) throw new Error("Wallet not connected");

    if (this.isSimulationMode) {
      console.log("Simulating booking (Contract not deployed on this network)");
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return "0x" + Math.random().toString(16).slice(2, 66); // Fake hash
    }

    if (!this.contract) throw new Error("Contract not initialized");

    const price = ethers.parseEther(priceInEth);
    const totalPrice = price * BigInt(seatCount);

    try {
      const tx = await this.contract.bookFlight(flightId, seatCount, {
        value: totalPrice
      });
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Booking transaction error:", error);
      throw error;
    }
  }

  private async ensureContract() {
    if (!this.signer) {
      await this.connectWallet();
    }
  }

  async getUserBookings(address: string) {
    try {
      await this.ensureContract();
      
      const localKey = `bookings_${address.toLowerCase()}`;
      const localBookings = JSON.parse(localStorage.getItem(localKey) || '[]');

      if (this.isSimulationMode || !this.contract) {
        return localBookings.map((b: any) => ({ 
          ...b, 
          timestamp: new Date(b.timestamp), 
          isSimulated: true 
        })).sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime());
      }

      try {
        const checksummedAddress = ethers.getAddress(address);
        const bookingIds = await this.contract.getUserBookings(checksummedAddress);
        
        const chainBookings = await Promise.all(
          bookingIds.map(async (id: any) => {
            try {
              const details = await this.contract!.getBookingDetails(id);
              return {
                id: Number(details.id),
                user: details.user,
                flightId: Number(details.flightId),
                price: ethers.formatEther(details.price),
                timestamp: new Date(Number(details.timestamp) * 1000),
                seatCount: Number(details.seatCount),
                exists: details.exists
              };
            } catch (err) {
              return null;
            }
          })
        );
        
        const validChainBookings = chainBookings.filter((b): b is any => b !== null && b.exists);
        
        // SYNC
        const allBookings = [...validChainBookings];
        localBookings.forEach((lb: any) => {
          if (!allBookings.some(ab => ab.id === lb.id || (ab.flightId === lb.flightId && Math.abs(ab.timestamp.getTime() - new Date(lb.timestamp).getTime()) < 60000))) {
            allBookings.push({
              ...lb,
              timestamp: new Date(lb.timestamp),
              isSimulated: true
            });
          }
        });

        return allBookings.sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime());
      } catch (blockchainError: any) {
        // Quietly failover to local storage for "0x" errors or other common connection issues
        if (blockchainError.code === 'BAD_DATA' || blockchainError.message?.includes('0x')) {
          this.isSimulationMode = true; 
        }
        return localBookings.map((b: any) => ({ ...b, timestamp: new Date(b.timestamp), isSimulated: true }));
      }
    } catch (error) {
      console.error("Critical error in getUserBookings:", error);
      return [];
    }
  }


  // Helper to save a successful booking locally in case chain isn't readable later
  saveLocalBooking(address: string, flightId: number, seatCount: number, price: string) {
    const localKey = `bookings_${address.toLowerCase()}`;
    const localBookings = JSON.parse(localStorage.getItem(localKey) || '[]');
    
    const newBooking = {
      id: Math.floor(Math.random() * 1000000), // Temporary ID for simulation
      flightId,
      seatCount,
      price,
      timestamp: new Date().toISOString(),
      exists: true,
      isSimulated: true
    };
    
    localBookings.push(newBooking);
    localStorage.setItem(localKey, JSON.stringify(localBookings));
  }

  async cancelBooking(bookingId: number) {
    return this.refundBooking(bookingId);
  }

  async refundBooking(bookingId: number) {
    if (!this.signer) throw new Error("Wallet not connected");

    if (this.isSimulationMode) {
      console.log("Simulating refund & cancellation...");
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const address = await this.signer.getAddress();
      this.removeLocalBooking(address, bookingId);
      return "0x" + Math.random().toString(16).slice(2, 66);
    }

    if (!this.contract) throw new Error("Contract not initialized");

    try {
      // In this contract, cancelBooking handles the logic for freeing the seat and returning ETH
      const tx = await this.contract.cancelBooking(bookingId);
      await tx.wait();
      
      // Also cleanup local if it was a hybrid record
      const address = await this.signer.getAddress();
      this.removeLocalBooking(address, bookingId);
      
      return tx.hash;
    } catch (error) {
      console.error("Refund/Cancellation error:", error);
      throw error;
    }
  }

  private removeLocalBooking(address: string, bookingId: number) {
    const localKey = `bookings_${address.toLowerCase()}`;
    const localBookings = JSON.parse(localStorage.getItem(localKey) || '[]');
    const filtered = localBookings.filter((b: any) => b.id !== bookingId);
    localStorage.setItem(localKey, JSON.stringify(filtered));
  }
}

export const web3Service = new Web3Service();
