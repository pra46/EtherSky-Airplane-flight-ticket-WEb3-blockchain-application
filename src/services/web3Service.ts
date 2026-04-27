import { ethers } from 'ethers';
import FlightBookingABI from '../contracts/FlightBooking.json';

// Use a placeholder address for demonstration. 
// In a real deployment, this would be the address of your deployed contract.
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  async connectWallet() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error("MetaMask is not installed. Please install it to use this app.");
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, FlightBookingABI, this.signer);
      
      const address = await this.signer.getAddress();
      return address;
    } catch (error) {
      console.error("Wallet connection error:", error);
      throw error;
    }
  }

  async getAddress() {
    if (!this.signer) return null;
    return await this.signer.getAddress();
  }

  async bookFlight(flightId: number, seatCount: number, priceInEth: string) {
    if (!this.contract) throw new Error("Wallet not connected");

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

  async getUserBookings(address: string) {
    if (!this.contract) return [];

    try {
      const bookingIds = await this.contract.getUserBookings(address);
      const bookings = await Promise.all(
        bookingIds.map(async (id: any) => {
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
        })
      );
      return bookings.filter(b => b.exists);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      return [];
    }
  }

  async cancelBooking(bookingId: number) {
    if (!this.contract) throw new Error("Wallet not connected");

    try {
      const tx = await this.contract.cancelBooking(bookingId);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Cancellation error:", error);
      throw error;
    }
  }
}

export const web3Service = new Web3Service();
