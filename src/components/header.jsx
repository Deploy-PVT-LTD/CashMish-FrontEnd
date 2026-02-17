import { Menu, X, ShoppingBag, LogOut, Wallet } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/deploy-logo.png";
import { useWallet } from '../components/Walletcontext';
import WalletModal from '../components/Walletmodal';
import Swal from 'sweetalert2';

function Header({ simple = false }) {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const navigate = useNavigate();

  const walletContext = useWallet() || {}; 
  const { 
    walletBalance = 0, 
    fetchAndUpdateBalance = async () => {}, 
    pendingOrders = [], 
    resetWallet = () => {} 
  } = walletContext;

  const updateCartCount = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Logic for logged in users cart if needed
      setCartItemCount(0); 
    } else {
      const guestOrders = JSON.parse(localStorage.getItem('myGuestOrders') || '[]');
      setCartItemCount(guestOrders.length);
    }
  }, []);

  const handleWalletClick = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      if (typeof fetchAndUpdateBalance === 'function') {
        await fetchAndUpdateBalance();
      }

      if ((pendingOrders && pendingOrders.length > 0) || walletBalance > 0) {
        setWalletModalOpen(true);
      } else {
        Swal.fire({
          title: 'Wallet is Empty',
          text: 'You have no balance or pending actions. Accept a bid first!',
          icon: 'info',
          confirmButtonColor: '#166534'
        });
      }
    } catch (error) {
      console.error("Wallet Error:", error);
    }
  }, [fetchAndUpdateBalance, pendingOrders, walletBalance, navigate]);

  useEffect(() => {
    const handleOpenWalletEvent = () => {
      handleWalletClick();
    };
    window.addEventListener('openWallet', handleOpenWalletEvent);
    return () => window.removeEventListener('openWallet', handleOpenWalletEvent);
  }, [handleWalletClick]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    updateCartCount();

    if (token && typeof fetchAndUpdateBalance === 'function') {
      fetchAndUpdateBalance();
    }

    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, [fetchAndUpdateBalance, updateCartCount]);

  const handleLogout = () => {
    localStorage.clear();
    if (typeof resetWallet === 'function') {
      resetWallet();
    }
    setIsLoggedIn(false);
    setOpen(false); 
    navigate("/");
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center flex-shrink-0">
              <a href="/" className="flex items-center gap-2 group">
                <img src={logo} alt="Logo" className="w-10 h-10 group-hover:scale-105 transition-transform" />
                <span className="text-xl font-bold text-gray-900 tracking-tight">CashMish</span>
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-sm font-medium text-gray-600 hover:text-green-800">Home</a>
              <a href="/Howitworks" className="text-sm font-medium text-gray-600 hover:text-green-800">How It Works</a>
              <a href="/contact" className="text-sm font-medium text-gray-600 hover:text-green-800">Contact Us</a>

              {!simple && (
                <div className="flex items-center gap-4 ml-4">
                  {isLoggedIn && (
                    <>
                      <button
                        onClick={handleWalletClick}
                        className="cursor-pointer flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-full border border-gray-100 transition-all relative"
                      >
                        <Wallet size={22} className="text-gray-600" />
                        {pendingOrders?.length > 0 && (
                          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                        )}
                        <span className="bg-green-600 text-white text-[14px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          ${walletBalance || 0}
                        </span>
                      </button>

                      {/* Desktop Cart - Only for Logged In */}
                      <a href="/cart" className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                        <ShoppingBag size={22} />
                      </a>

                      <button onClick={handleLogout} className="cursor-pointer flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
                        <LogOut size={16} /> Logout
                      </button>
                    </>
                  )}

                  {!isLoggedIn && (
                    <a href="/login" className="bg-green-800 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition-all shadow-md">
                      Sign Up
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Header Icons & Toggle */}
            <div className="md:hidden flex items-center gap-3">
              {isLoggedIn && (
                <button onClick={handleWalletClick} className="flex items-center gap-1.5 relative">
                  <Wallet size={24} className="text-gray-600" />
                  {pendingOrders?.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                  )}
                  <span className="bg-green-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                    ${walletBalance || 0}
                  </span>
                </button>
              )}
              <button onClick={() => setOpen(!open)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                {open ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>

          {/* MOBILE MENU CONTENT */}
          {open && (
            <div className="md:hidden border-t border-gray-100 pb-4 bg-white animate-in slide-in-from-top duration-300">
              <div className="flex flex-col space-y-4 pt-4">
                <a href="/" onClick={() => setOpen(false)} className="text-base font-medium text-gray-600 px-2">Home</a>
                <a href="/Howitworks" onClick={() => setOpen(false)} className="text-base font-medium text-gray-600 px-2">How It Works</a>
                <a href="/contact" onClick={() => setOpen(false)} className="text-base font-medium text-gray-600 px-2">Contact Us</a>
                
                <div className="flex items-center justify-between border-t border-gray-50 pt-4 px-2">
                  {/* Cart logic: Only show if isLoggedIn is true */}
                  {isLoggedIn ? (
                    <>
                      <a href="/cart" onClick={() => setOpen(false)} className="flex items-center gap-2 text-gray-600 font-medium">
                        <ShoppingBag size={20} /> Cart 
                      </a>
                      <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-semibold">
                        <LogOut size={20} /> Logout
                      </button>
                    </>
                  ) : (
                    <a href="/login" onClick={() => setOpen(false)} className="bg-green-800 text-white w-full py-2 rounded-full text-center font-semibold">
                      Sign Up
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </>
  );
}

export default Header;