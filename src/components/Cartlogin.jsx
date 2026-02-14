import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Shield, CheckCircle } from 'lucide-react';
import logogoogle from '../assets/google.png';
import Header from './header';

// Import your existing Header component


const CartLogin = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    // Get device details from localStorage
    const deviceDetails = {
      brand: localStorage.getItem('selectedBrand') || 'N/A',
      model: localStorage.getItem('selectedModel') || 'N/A',
      mobileId: localStorage.getItem('selectedMobileId') || '',
      storage: localStorage.getItem('selectedStorage') || '128GB',
      condition: localStorage.getItem('selectedCondition') || 'Fair',
      screen: localStorage.getItem('screenCondition') || 'perfect',
      body: localStorage.getItem('bodyCondition') || 'perfect',
      battery: localStorage.getItem('batteryCondition') || 'good'
    };

    // Create cart item from device details
    if (deviceDetails.brand !== 'N/A' && deviceDetails.model !== 'N/A') {
      setCartData([{
        name: `${deviceDetails.brand} ${deviceDetails.model}`,
        quantity: 1,
        description: `${deviceDetails.storage} | ${deviceDetails.condition} Condition`,
        storage: deviceDetails.storage,
        condition: deviceDetails.condition,
        screenCondition: deviceDetails.screen,
        bodyCondition: deviceDetails.body,
        batteryCondition: deviceDetails.battery,
        mobileId: deviceDetails.mobileId
      }]);
    }

    // Load Google Sign-In script
    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleGoogleLogin = () => {
    const receiveMessage = (event) => {
      if (event.origin !== "http://localhost:5000") return;
      const { token, user } = event.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        window.removeEventListener("message", receiveMessage);
        // Redirect to userdata form page after Google login
        navigate('/userdata');
      }
    };
    window.addEventListener("message", receiveMessage);
    window.open('http://localhost:5000/api/auth/google', 'google-login', `width=500,height=600`);
  };

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to userdata form page after login
        navigate('/userdata');
      } else { 
        alert(data.message); 
      }
    } catch (err) { 
      alert('Network error'); 
    } finally { 
      setLoading(false); 
    }
  };

  const calculateTotal = () => {
    // For now, return estimated price or placeholder
    return '0.00'; // You can add price calculation logic here based on device condition
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header - Import and call your header component here */}
      <Header />
      
      {/* Temporary header placeholder - Replace with your actual header */}
      {/* <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">CashMish</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition">Home</a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition">How It Works</a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition">Contact Us</a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition">About Us</a>
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cartData.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartData.length}
                  </span>
                )}
              </div>
              <button className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition shadow-md">
                Sign Up
              </button>
            </nav>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Login Section - LEFT SIDE */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
                <p className="text-gray-600 text-sm">Sign in to continue with your purchase</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                    <span className="ml-2 text-gray-700">Remember me</span>
                  </label>
                  <a href="#" className="text-green-600 hover:text-green-700 font-semibold">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold text-base hover:from-green-700 hover:to-emerald-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'WAIT...' : 'Sign In'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              {/* Google Login Only */}
              <button 
                onClick={handleGoogleLogin}
                type="button" 
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition font-semibold text-gray-700"
              >
                <img src={logogoogle} alt="Google" className="w-5 h-5 object-contain" />
                <span>Continue with Google</span>
              </button>

              {/* Signup Link */}
              <div className="text-center mt-5 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="text-gray-700 text-sm">
                  Don't have an account yet?{' '}
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-green-600 hover:text-green-700 font-bold hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-5 flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Instant Quote</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Section - RIGHT SIDE */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <ShoppingCart className="w-7 h-7 text-green-600" />
                  Your Cart
                </h2>
                {cartData.length > 0 && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {cartData.length} {cartData.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>

              {cartData.length > 0 ? (
                <div className="space-y-3">
                  {cartData.map((item, index) => (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3 flex-1">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-md"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="text-base font-bold text-gray-900 mb-1">
                              {item.name || 'Device'}
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                            
                            {/* Device Details */}
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="text-xs">
                                <span className="text-gray-500">Storage:</span>
                                <span className="ml-1 font-semibold text-gray-700">{item.storage}</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-gray-500">Condition:</span>
                                <span className="ml-1 font-semibold text-gray-700">{item.condition}</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-gray-500">Screen:</span>
                                <span className="ml-1 font-semibold text-gray-700">{item.screenCondition}</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-gray-500">Body:</span>
                                <span className="ml-1 font-semibold text-gray-700">{item.bodyCondition}</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-gray-500">Battery:</span>
                                <span className="ml-1 font-semibold text-gray-700">{item.batteryCondition}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Estimated Price Section */}
                  {/* <div className="border-t-2 border-gray-200 pt-3 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Estimated Value:</span>
                      <span className="text-xl font-bold text-green-600">Get Quote</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Login to see estimated price</p>
                  </div> */}

                  {/* Security Badge */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mt-3 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900 text-sm">Secure Transaction</p>
                      <p className="text-xs text-green-700">100% secure payment guaranteed</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-3" />
                  <p className="text-lg text-gray-500 font-medium">No device selected</p>
                  <p className="text-gray-400 text-sm mt-1">Please select a device first</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartLogin;