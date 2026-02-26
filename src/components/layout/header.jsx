import { Menu, X, ShoppingBag, LogOut, Wallet, ChevronDown, Link2, Rocket, ExternalLink } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/deploy-logo.png";
import { useWallet } from '../../contexts/Walletcontext';
import WalletModal from '../ui/Walletmodal';
import Swal from 'sweetalert2';
import cashmishlogo from "../../assets/cashmish-logo.svg"

function Header({ simple = false }) {
  const [open, setOpen] = useState(false);
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  // Smart Header Visibility Logic
  useEffect(() => {
    let internalLastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 10;

      if (currentScrollY < 50) {
        setHeaderVisible(true);
      } else if (Math.abs(currentScrollY - internalLastScrollY) > scrollThreshold) {
        if (currentScrollY > internalLastScrollY) {
          setHeaderVisible(false);
        } else {
          setHeaderVisible(true);
        }
      }

      internalLastScrollY = currentScrollY;
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const walletContext = useWallet() || {};
  const {
    walletBalance = 0,
    fetchAndUpdateBalance = async () => { },
    pendingOrders = [],
    resetWallet = () => { }
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

      setWalletModalOpen(true);
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
    Swal.fire({
      title: 'Logout?',
      text: "Are you sure you want to sign out?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
      background: '#fff',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl px-6 py-3 font-bold uppercase tracking-widest text-xs',
        cancelButton: 'rounded-xl px-6 py-3 font-bold uppercase tracking-widest text-xs'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        if (typeof resetWallet === 'function') {
          resetWallet();
        }
        setIsLoggedIn(false);
        setOpen(false);
        navigate("/");

        Swal.fire({
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#fff',
          customClass: {
            popup: 'rounded-[2rem]'
          }
        });
      }
    });
  };

  const menuCategories = {
    quickLinks: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'FAQs', path: '/faqs' },
      { name: 'Reviews', path: '/reviews' },
      { name: 'Blogs', path: '/blogs' }
    ],
    services: [
      { name: 'Sell Mobile', path: '/sell-mobile' },
      { name: 'Instant Quote', path: '/instant-quote' },
      { name: 'Free Pickup', path: '/free-pickup' }
    ]
  };

  return (
    <>
      <header className={`bg-white/90 backdrop-blur-md border-b border-gray-100 fixed top-0 left-0 w-full z-50 transition-all duration-300 transform ${headerVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <div className="flex items-center flex-shrink-0">
              <a href="/" className="flex items-center gap-2 group">
                <img src={cashmishlogo} alt="Logo" className="w-45 h-35" />
                {/* <span className="text-xl font-bold text-gray-900 tracking-tight">CashMish</span> */}
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <a href="/" className="text-sm font-semibold text-gray-600 hover:text-green-800 transition-colors relative group py-2">
                Sell Your Device
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </a>

              <a href="/Howitworks" className="text-sm font-semibold text-gray-600 hover:text-green-800 transition-colors relative group py-2">
                How It Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </a>

              <a href="/contact" className="text-sm font-semibold text-gray-600 hover:text-green-800 transition-colors relative group py-2">
                Support
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </a>

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
                    <a href="/login" className="bg-green-800 text-white px-8 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition-all shadow-md">
                      Login
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

                {/* Mobile Categories */}
                <div className="space-y-4 pt-2">
                  <div className="border-t border-gray-50 pt-4 px-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Quick Links</p>
                    <div className="grid grid-cols-2 gap-3">
                      {menuCategories.quickLinks.map((link) => (
                        <a key={link.name} href={link.path} onClick={() => setOpen(false)} className="text-sm font-bold text-gray-600 hover:text-green-600">{link.name}</a>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-4 px-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Our Services</p>
                    <div className="grid grid-cols-2 gap-3">
                      {menuCategories.services.map((link) => (
                        <a key={link.name} href={link.path} onClick={() => setOpen(false)} className="text-sm font-bold text-gray-600 hover:text-green-600">{link.name}</a>
                      ))}
                    </div>
                  </div>
                </div>

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