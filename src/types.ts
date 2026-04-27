export interface Flight {
  id: number;
  airline: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: string; // in ETH as string
  seatsAvailable: number;
  image: string;
}

export interface Booking {
  id: number;
  flightId: number;
  userAddress: string;
  price: string;
  timestamp: Date;
  seatCount: number;
  exists: boolean;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
}
