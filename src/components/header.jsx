import { Menu, X, ShoppingBag, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/deploy-logo.png";

function Header({ simple = false }) {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();

  // Check login status and cart count on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    updateCartCount();
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('userCart') || '[]');
    setCartItemCount(cart.length);
  };

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    if (userId) {
      // Save current cart to user-specific storage
      const currentCart = JSON.parse(localStorage.getItem('userCart') || '[]');
      localStorage.setItem(`userCart_${userId}`, JSON.stringify(currentCart));
    }
    
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Clear current cart (will show empty or guest cart)
    localStorage.setItem('userCart', '[]');
    
    setIsLoggedIn(false);
    setCartItemCount(0);
    setOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/Howitworks" },
    { name: "Contact Us", href: "/contact" },
    { name: "About Us", href: "/About" },
  ];

  return (
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
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </a>
            ))}

            {!simple && (
              <div className="flex items-center gap-4 ml-4">
                {/* Cart Icon */}
                <a href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <ShoppingBag size={22} />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      {cartItemCount}
                    </span>
                  )}
                </a>

                {/* Login/Logout Toggle */}
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
                    className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    Sign Up
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Mobile Right Icons */}
          <div className="md:hidden flex items-center gap-4">
            {!simple && (
              <a href="/cart" className="relative p-1 text-gray-600">
                <ShoppingBag size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </a>
            )}
            
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-4 mt-2 bg-white rounded-lg shadow-md border-t border-gray-100 animate-in slide-in-from-top duration-300">
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
                      className="block w-full bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-bold shadow-sm"
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
  );
}

export default Header;