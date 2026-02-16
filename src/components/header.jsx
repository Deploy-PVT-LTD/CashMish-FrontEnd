import { Menu, X, ShoppingBag, LogOut, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/deploy-logo.png";
import { useWallet } from '../components/Walletcontext';
import WalletModal from '../components/Walletmodal';

function Header({ simple = false }) {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const navigate = useNavigate();

  const { walletBalance, hasEverHadBalance, hasPendingAction } = useWallet();

  const updateCartCount = (event) => {
    if (event && event.detail !== undefined) {
      setCartItemCount(event.detail);
      return;
    }
    const token = localStorage.getItem("token");
    if (token) {
      setCartItemCount(0);
    } else {
      const guestOrders = JSON.parse(localStorage.getItem('myGuestOrders') || '[]');
      setCartItemCount(guestOrders.length);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    updateCartCount();

    window.addEventListener('cartUpdated', updateCartCount);
    const handleOpenWallet = () => setWalletModalOpen(true);
    window.addEventListener('openWallet', handleOpenWallet);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('openWallet', handleOpenWallet);
    };
  }, []);

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id || user.id;
    if (userId) {
      const currentCart = JSON.parse(localStorage.getItem('userCart') || '[]');
      localStorage.setItem(`userCart_${userId}`, JSON.stringify(currentCart));
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.setItem('userCart', '[]');
    setIsLoggedIn(false);
    setCartItemCount(0);
    setOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/Howitworks" },
    { name: "Contact Us", href: "/contact" },
    { name: "About Us", href: "/About" },
  ];

  // Wallet icon SIRF tab dikhao jab:
  // 1. User logged in ho, AND
  // 2. User ne kabhi balance receive kiya ho ya pending action ho
  const showWalletIcon = isLoggedIn && (walletBalance > 0 || hasEverHadBalance || hasPendingAction);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <a href="/" className="flex items-center gap-2 group">
                <img
                  src={logo}
                  alt="CashMish Logo"
                  className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
                />
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  CashMish
                </span>
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-green-800 transition-colors"
                >
                  {link.name}
                </a>
              ))}

              {!simple && (
                <div className="flex items-center gap-4 ml-4">

                  {/* Wallet Icon + Balance — only for logged-in users with balance/pending */}
                  {showWalletIcon && (
                    <button
                      onClick={() => setWalletModalOpen(true)}
                      className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-full transition-all group cursor-pointer border border-transparent hover:border-gray-100"
                    >
                      <div className="relative">
                        <Wallet size={22} className="text-gray-600 group-hover:text-green-600 transition-colors" />
                        {/* Orange dot for pending action */}
                        {hasPendingAction && walletBalance === 0 && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      {walletBalance > 0 && (
                        <span className="bg-green-500 text-white text-[14px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          ${walletBalance.toFixed(0)}
                        </span>
                      )}
                      {hasPendingAction && walletBalance === 0 && (
                        <span className="text-orange-600 text-[11px] font-black">
                          Action!
                        </span>
                      )}
                    </button>
                  )}

                  {/* Cart Icon */}
                  <a href="/cart" className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
                    <ShoppingBag size={22} />
                    {cartItemCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                        {cartItemCount}
                      </span>
                    )}
                  </a>

                  {/* Login/Logout */}
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  ) : (
                    <a
                      href="/login"
                      className="bg-green-800 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-700 shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                      Sign Up
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Right Icons */}
            <div className="md:hidden flex items-center gap-3">
              {!simple && (
                <>
                  {/* Mobile Wallet Icon — only for logged-in users */}
                  {showWalletIcon && (
                    <button
                      onClick={() => setWalletModalOpen(true)}
                      className="flex items-center gap-1.5 p-1 text-gray-600"
                    >
                      <div className="relative">
                        <Wallet size={24} />
                        {hasPendingAction && walletBalance === 0 && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      {walletBalance > 0 && (
                        <span className="bg-green-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                          ${walletBalance.toFixed(0)}
                        </span>
                      )}
                    </button>
                  )}

                  {/* Mobile Cart Icon */}
                  <a href="/cart" className="relative p-1 text-gray-600">
                    <ShoppingBag size={24} />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {cartItemCount}
                      </span>
                    )}
                  </a>
                </>
              )}

              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {open ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {open && (
            <div className="md:hidden pb-4 mt-2 bg-white rounded-lg shadow-md border-t border-gray-100">
              <div className="flex flex-col space-y-3 px-4 pt-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
                    onClick={() => setOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}

                {!simple && (
                  <div className="pt-2">
                    {isLoggedIn ? (
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-bold"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    ) : (
                      <a
                        href="/login"
                        className="block w-full bg-green-800 text-white px-4 py-3 rounded-lg text-center font-bold shadow-sm"
                        onClick={() => setOpen(false)}
                      >
                        Get Started
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Wallet Modal */}
      <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </>
  );
}

export default Header;