import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 1. useLocation add kiya
import SI from '../assets/signin.svg';
import SU from '../assets/signup.png';
import logo from '../assets/deploy-logo.png';
import logogoogle from '../assets/google.png';
import Swal from 'sweetalert2'; // Make sure Swal is imported


const LoginCard = () => {
  const [view, setView] = useState('signin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 2. Hook to catch state

  // 🔥 Pichle page se aayi hui images ko pakad ke rakhein
  const pendingFiles = location.state?.files || [];

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });

  // Common function to navigate after login/signup
  const proceedToNextStep = () => {
    // Agar images hain toh userdata par bhejo, warna home par
    if (pendingFiles.length > 0) {
      navigate('/userdata', { state: { files: pendingFiles } });
    } else {
      navigate('/');
    }
  };

  const handleGoogleLogin = () => {
    const receiveMessage = (event) => {
      if (event.origin !== "http://localhost:5000") return;
      const { token, user } = event.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        window.removeEventListener("message", receiveMessage);
        
        // ✅ Success: Forward with images
        proceedToNextStep();
      }
    };
    window.addEventListener("message", receiveMessage);
    window.open('http://localhost:5000/api/auth/google', 'google-login', `width=500,height=600`);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signInData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // ✅ Success: Forward with images
        proceedToNextStep();
      } else { 
        Swal.fire({
          icon: "error",
          title: data.message || "Login failed",
          text: "Please check your credentials",
        });
      }
    } catch (err) { 
      Swal.fire({ icon: "error", title: "Oops...", text: "Network Error" }); 
    } finally { setLoading(false); }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...signUpData, role: 'user' }),
      });
      const data = await response.json();
      if (response.ok) {
        // Option: Auto login after signup or just switch to signin
        Swal.fire("Registration Successful!", "Please sign in now.", "success");
        setView('signin');
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) { alert('Network error'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#212531] grid place-items-center p-4 font-['Poppins']">
      {/* Visual Indicator: Jab images carry ho rahi hon */}
      {pendingFiles.length > 0 && (
        <div className="fixed top-5 bg-blue-500 text-white px-4 py-2 rounded-full text-xs font-bold animate-bounce shadow-lg z-50">
          📸 {pendingFiles.length} Photos ready to be saved after login
        </div>
      )}

      <div className="flex flex-col md:flex-row w-full max-w-[800px] min-h-[500px] bg-[#1a1d26] rounded-2xl overflow-hidden shadow-xl border border-white/5">
        
        {/* Sidebar */}
        <div className="w-full md:w-[110px] bg-[#15181f] flex md:flex-col items-center py-6 md:py-10 border-b md:border-b-0 md:border-r border-white/5 relative">
          <img src={logo} alt="logo" className="h-10 md:h-12 lg:h-14 mb-6 md:mb-14 px-2 object-contain" />           
          
          <div className="flex md:flex-col gap-8 md:gap-12 w-full justify-center md:justify-start"> 
            <button 
              onClick={() => setView('signin')} 
              className={`flex flex-col items-center gap-2 w-full transition-all relative ${view === 'signin' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-400'}`}
            >
              {view === 'signin' && <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-12 bg-blue-500 rounded-r-lg" />}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
              <span className="text-[10px] font-bold tracking-widest uppercase">Sign In</span>
            </button>

            <button 
              onClick={() => setView('signup')} 
              className={`flex flex-col items-center gap-2 w-full transition-all relative ${view === 'signup' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-400'}`}
            >
              {view === 'signup' && <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-12 bg-blue-500 rounded-r-lg" />}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>
              <span className="text-[10px] font-bold tracking-widest uppercase">Sign Up</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="hidden md:flex flex-1 bg-blue-600 p-8 flex-col justify-center items-center text-white text-center rounded-xl">
          <h2 className="text-2xl font-bold mb-2">{view === 'signin' ? 'Welcome Back' : 'Join Us'}</h2>
          <img src={view === 'signin' ? SI : SU} className="w-48 h-48 object-contain mt-4" alt="hero" />
        </div>

        {/* Form Section */}
        <div className="flex-1 p-8">
          <h3 className="text-white text-xl font-bold mb-6">{view === 'signin' ? 'Sign In' : 'Sign Up'}</h3>
          
          <form onSubmit={view === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
            {view === 'signup' && (
              <input 
                type="text" placeholder="Full Name" required
                className="w-full h-11 bg-[#252a36] border border-white/10 rounded-lg px-4 text-white focus:outline-none focus:border-blue-500"
                value={signUpData.name}
                onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
              />
            )}
            <input 
              type="email" placeholder="Email" required
              className="w-full h-11 bg-[#252a36] border border-white/10 rounded-lg px-4 text-white focus:outline-none focus:border-blue-500"
              value={view === 'signin' ? signInData.email : signUpData.email}
              onChange={(e) => view === 'signin' 
                ? setSignInData({...signInData, email: e.target.value}) 
                : setSignUpData({...signUpData, email: e.target.value})}
            />
            <input 
              type="password" placeholder="Password" required
              className="w-full h-11 bg-[#252a36] border border-white/10 rounded-lg px-4 text-white focus:outline-none focus:border-blue-500"
              value={view === 'signin' ? signInData.password : signUpData.password}
              onChange={(e) => view === 'signin' 
                ? setSignInData({...signInData, password: e.target.value}) 
                : setSignUpData({...signUpData, password: e.target.value})}
            />
            <button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all active:scale-95">
              {loading ? 'WAIT...' : (view === 'signin' ? 'LOGIN' : 'REGISTER')}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6 text-gray-600 text-xs">
            <div className="flex-1 h-px bg-white/10"></div>
            <span>OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleGoogleLogin} type="button" className="flex-1 h-11 bg-white rounded-lg flex items-center justify-center gap-2 border hover:bg-gray-100 transition-all active:scale-95 cursor-pointer">
              <img src={logogoogle} alt="Google" className="w-5 h-5 object-contain" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;