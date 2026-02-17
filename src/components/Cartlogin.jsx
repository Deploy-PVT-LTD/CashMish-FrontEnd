import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation add kiya
import { ShoppingCart, Shield, CheckCircle } from 'lucide-react';
import logogoogle from '../assets/google.png';
import Header from './header';

const CartLogin = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Location hook for state
  
  // 🔥 Pichle page se aayi hui images ko save karke rakhein
  const pendingFiles = location.state?.files || [];

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
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
  }, []);

  const handleGoogleLogin = () => {
    const receiveMessage = (event) => {
      if (event.origin !== "https://cashmish-backend.onrender.com") return;
      const { token, user } = event.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        window.removeEventListener("message", receiveMessage);
        
        // ✅ Login ke baad images ko userdata par bhej rahe hain
        navigate('/userdata', { state: { files: pendingFiles } });
      }
    };
    window.addEventListener("message", receiveMessage);
    window.open('https://cashmish-backend.onrender.com/api/auth/google', 'google-login', `width=500,height=600`);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://cashmish-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // ✅ Yahan bhi files forward karni hain
        navigate('/userdata', { state: { files: pendingFiles } });
      } else { 
        alert(data.message); 
      }
    } catch (err) { 
      alert('Network error'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Login Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
              <p className="text-gray-600 text-sm">Sign in to continue with your purchase</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input type="email" name="email" value={loginForm.email} onChange={handleLoginChange} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl" placeholder="Email Address" required />
              <input type="password" name="password" value={loginForm.password} onChange={handleLoginChange} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl" placeholder="Password" required />
              <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">
                {loading ? 'WAIT...' : 'Sign In'}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">Or continue with</span></div>
            </div>

            <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition font-semibold">
              <img src={logogoogle} alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Cart Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-5">
              <ShoppingCart className="w-7 h-7 text-green-600" /> Your Cart
            </h2>
            {cartData.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.description}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs font-semibold">
                  <span>Storage: {item.storage}</span>
                  <span>Condition: {item.condition}</span>
                </div>
                {/* Visual indicator that images are attached */}
                {pendingFiles.length > 0 && (
                  <div className="mt-3 text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle size={14} /> {pendingFiles.length} photos attached
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartLogin;