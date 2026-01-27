import { Smartphone } from "lucide-react";

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              <a href="/">CashMish</a>
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </a>
            <a href="/Howitworks" className="text-gray-600 hover:text-gray-900">
              How It Works
            </a>
            <a href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </a>
            <a
              href="/login"
              className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu button if needed */}
          {/* <button className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            Menu
          </button> */}
        </div>
      </nav>
    </header>
  );
}

export default Header;
