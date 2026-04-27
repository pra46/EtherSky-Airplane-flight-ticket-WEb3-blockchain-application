import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { MyBookings } from './pages/MyBookings';

export default function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 italic selection:text-indigo-900">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/bookings" element={<MyBookings />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </Web3Provider>
  );
}
