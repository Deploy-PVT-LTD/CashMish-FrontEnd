import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Smartphone, ShieldCheck, Zap, Heart } from 'lucide-react';
import Swal from 'sweetalert2';
import { BASE_URL } from '../lib/api';
import logo from '../assets/deploy-logo.png';
import logogoogle from '../assets/google.png';

const LoginCard = () => {
  const [view, setView] = useState('signin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Catch pending files from assessment
  const pendingFiles = location.state?.files || [];

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });

  const proceedToNextStep = () => {
    if (pendingFiles.length > 0) {
      navigate('/userdata', { state: { files: pendingFiles } });
    } else {
      navigate('/');
    }
  };

  const handleGoogleLogin = () => {
    const receiveMessage = (event) => {
      if (event.origin !== BASE_URL) return;
      const { token, user } = event.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        window.removeEventListener("message", receiveMessage);
        proceedToNextStep();
      }
    };
    window.addEventListener("message", receiveMessage);
    window.open(`${BASE_URL}/api/auth/google`, 'google-login', `width=500,height=600`);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signInData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        proceedToNextStep();
      } else {
        Swal.fire({
          icon: "error",
          title: data.message || "Login failed",
          text: "Please check your credentials",
          background: '#fff',
          customClass: { popup: 'rounded-[2rem]' }
        });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Network Error", background: '#fff', customClass: { popup: 'rounded-[2rem]' } });
    } finally { setLoading(false); }
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
        Swal.fire({ icon: "error", title: "Signup Failed", text: data.message || "Something went wrong", background: '#fff', customClass: { popup: 'rounded-[2rem]' } });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Network Error", background: '#fff', customClass: { popup: 'rounded-[2rem]' } });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans selection:bg-green-100 selection:text-green-900 overflow-hidden relative">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-600/5 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4"></div>

      {/* Assessment Status Indicator */}
      {pendingFiles.length > 0 && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-green-100 px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-in slide-in-from-top-4 duration-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
            {pendingFiles.length} Photos Ready for Assessment
          </span>
        </div>
      )}

      <div className="max-w-[800px] w-full min-h-[400px] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row relative z-10 border border-gray-100">

        {/* LEFT: Hero/Sidebar */}
        <div className="w-full md:w-[40%] bg-gray-900 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px]"></div>

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 group mb-8">
              <div className="bg-green-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-green-600/20">
                <Smartphone className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black text-white uppercase tracking-tighter">
                Cash<span className="text-green-500">Mish</span>
              </span>
            </Link>

            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                {view === 'signin' ? "Welcome \nBack." : "Start your \nJourney."}
              </h2>
              <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-[200px]">
                {view === 'signin' ? "Good to see you again! Log in to continue." : "Join the smartest way to sell tech."}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <ShieldCheck className="text-green-500" size={20} />
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">100% Secure Access</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <Zap className="text-green-500" size={20} />
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Instant Valuations</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Form Section */}
        <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex gap-8">
              <button
                onClick={() => setView('signin')}
                className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${view === 'signin' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600 cursor-pointer'}`}
              >
                Sign In
                {view === 'signin' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-green-600"></div>}
              </button>
              <button
                onClick={() => setView('signup')}
                className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${view === 'signup' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600 cursor-pointer'}`}
              >
                Create Account
                {view === 'signup' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-green-600"></div>}
              </button>
            </div>
          </div>

          <form onSubmit={view === 'signin' ? handleSignIn : handleSignUp} className="space-y-6">
            {view === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" size={20} />
                  <input
                    type="text" placeholder="John Doe" required
                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-sm"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" size={20} />
                <input
                  type="email" placeholder="hello@cashmish.com" required
                  className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-sm"
                  value={view === 'signin' ? signInData.email : signUpData.email}
                  onChange={(e) => view === 'signin'
                    ? setSignInData({ ...signInData, email: e.target.value })
                    : setSignUpData({ ...signUpData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" size={20} />
                <input
                  type="password" placeholder="••••••••" required
                  className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-sm"
                  value={view === 'signin' ? signInData.password : signUpData.password}
                  onChange={(e) => view === 'signin'
                    ? setSignInData({ ...signInData, password: e.target.value })
                    : setSignUpData({ ...signUpData, password: e.target.value })}
                />
              </div>
            </div>

            {view === 'signin' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-[11px] font-black text-green-600 uppercase tracking-widest hover:text-green-700 cursor-pointer transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-green-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Processing...' : (view === 'signin' ? 'Sign In Now' : 'Create Account')}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Alternative</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="flex-1 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <img src={logogoogle} alt="Google" className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Google Login</span>
            </button>
          </div>

          <p className="mt-6 text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] text-center leading-relaxed">
            By continuing, you agree to CashMish's <br />
            <Link to="/terms" className="text-gray-900 hover:text-green-600">Terms of Service</Link> & <Link to="/privacy" className="text-gray-900 hover:text-green-600">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;