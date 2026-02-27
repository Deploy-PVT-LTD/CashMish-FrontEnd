import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, CheckCircle, User } from 'lucide-react';
import logogoogle from '../assets/google.png';
import Header from '../components/layout/header';
import { BASE_URL } from '../lib/api';
import Swal from 'sweetalert2';

const CartLogin = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('signin');
  const navigate = useNavigate();
  const location = useLocation();

  const pendingFiles = location.state?.files || [];

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });

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
      if (event.origin !== BASE_URL) return;
      const { token, user } = event.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        window.removeEventListener("message", receiveMessage);
        navigate('/userdata', { state: { files: pendingFiles } });
      }
    };
    window.addEventListener("message", receiveMessage);
    window.open(`${BASE_URL}/api/auth/google`, 'google-login', `width=500,height=600`);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...signUpData, role: 'user' }),
      });
      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "Registration Successful!",
          text: "Please sign in now.",
          icon: "success",
          background: '#fff',
          customClass: { popup: 'rounded-[2rem]' }
        });
        setView('signin');
      } else {
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: data.message || "Something went wrong",
          background: '#fff',
          customClass: { popup: 'rounded-[2rem]' }
        });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Network Error", background: '#fff', customClass: { popup: 'rounded-[2rem]' } });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Header />

      {/* items-start — card upar se aligned rahe, jump na kare */}
      <div className="flex-1 flex items-start justify-center px-4 pt-8 pb-10 mt-16 sm:mt-20">
        <div className="w-full max-w-5xl">
          {/* items-start taake dono cards top se aligned hon, height change pe right card niche na jaye */}
          <div className="grid lg:grid-cols-2 gap-6 items-start">

            {/* Login / Signup Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">

              {/* Tab Switcher */}
              <div className="flex border-b border-gray-200 mb-5">
                <button
                  onClick={() => setView('signin')}
                  className={`pb-3 mr-6 text-sm font-bold uppercase tracking-wide transition-all relative cursor-pointer ${view === 'signin' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Sign In
                  {view === 'signin' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-green-600"></div>}
                </button>
                <button
                  onClick={() => setView('signup')}
                  className={`pb-3 text-sm font-bold uppercase tracking-wide transition-all relative cursor-pointer ${view === 'signup' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Create Account
                  {view === 'signup' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-green-600"></div>}
                </button>
              </div>

              {/* Heading */}
              <div className="text-center mb-5">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {view === 'signin' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {view === 'signin' ? 'Sign in to continue with your purchase' : 'Register to continue with your purchase'}
                </p>
              </div>

              {/* Sign In Form */}
              {view === 'signin' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                    placeholder="Email Address"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                    placeholder="Password"
                    required
                  />
                  {/* Invisible placeholder field — signup ke naam wale field ki jagah reserve krta h taake height match kare */}
                  <div className="w-full py-2.5 opacity-0 pointer-events-none border-2 border-transparent rounded-xl">
                    &nbsp;
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold cursor-pointer hover:bg-green-700 transition"
                  >
                    {loading ? 'WAIT...' : 'Sign In'}
                  </button>
                </form>
              )}

              {/* Sign Up Form */}
              {view === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold cursor-pointer hover:bg-green-700 transition"
                  >
                    {loading ? 'WAIT...' : 'Create Account'}
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Button */}
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition font-semibold"
              >
                <img src={logogoogle} alt="Google" className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Cart Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-5">
                <ShoppingCart className="w-7 h-7 text-green-600" /> Your Cart
              </h2>

              {cartData.length > 0 ? (
                cartData.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs font-semibold text-gray-600">
                      <span>Storage: {item.storage}</span>
                      <span>Condition: {item.condition}</span>
                      <span>Screen: {item.screenCondition}</span>
                      <span>Body: {item.bodyCondition}</span>
                      <span>Battery: {item.batteryCondition}</span>
                    </div>
                    {pendingFiles.length > 0 && (
                      <div className="mt-3 text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle size={14} /> {pendingFiles.length} photos attached
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center mt-10">No items in cart.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CartLogin;