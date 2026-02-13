import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SI from '../assets/signin.svg';
import SU from '../assets/signup.png';
import logo from '../assets/deploy-logo.png';
import logoApple from '../assets/apple.png';
import logogoogle from '../assets/google.png';

const LoginCard = () => {
  const [view, setView] = useState('signin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });

  // Apple SDK Load karna (Wapas daldia hai)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // --- Social Login Handlers ---

  const handleGoogleLogin = () => {
    const receiveMessage = (event) => {
      if (event.origin !== "http://localhost:5000") return;
      const { token, user } = event.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        window.removeEventListener("message", receiveMessage);
        navigate('/');
      }
    };
    window.addEventListener("message", receiveMessage);
    window.open('http://localhost:5000/api/auth/google', 'google-login', `width=500,height=600`);
  };

  const handleAppleLogin = async () => {
    try {
      window.AppleID.auth.init({
        clientId: 'com.your.app.service', 
        scope: 'name email',
        redirectURI: 'https://your-domain.com/api/auth/apple/callback', 
        usePopup: true,
      });

      const response = await window.AppleID.auth.signIn();
      if (response && response.authorization) {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/auth/apple/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response.authorization),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/');
        }
      }
    } catch (err) {
      console.error("Apple Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Manual Auth Handlers ---

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signUpData.name,
          email: signUpData.email,
          password: signUpData.password,
          role: 'user'
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration Successful!");
        setView('signin');
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
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
        navigate('/');
      } else { alert(data.message); }
    } catch (err) { alert('Network error'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#212531] grid place-items-center p-4 font-['Poppins']">
      <div className="flex flex-col md:flex-row w-full max-w-[800px] bg-[#1a1d26] rounded-xl overflow-hidden shadow-2xl">
        
        {/* Left Section */}
        <div className="w-full md:w-[120px] bg-[#15181f] flex md:flex-col items-center py-6 border-b md:border-b-0 md:border-r border-white/5">
          <img src={logo} alt="logo" className="h-10 mb-4 md:mb-10 px-2" />
          <div className="flex md:flex-col gap-6 text-xs font-bold tracking-widest">
            <button onClick={() => setView('signin')} className={view === 'signin' ? 'text-blue-500' : 'text-gray-500 hover:text-white'}>SIGN IN</button>
            <button onClick={() => setView('signup')} className={view === 'signup' ? 'text-blue-500' : 'text-gray-500 hover:text-white'}>SIGN UP</button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="hidden md:flex flex-1 bg-blue-600 p-8 flex-col justify-center items-center text-white text-center rounded-xl ">
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

          {/* Social Buttons (Handlers connected!) */}
          <div className="flex gap-3">
            <button onClick={handleGoogleLogin} type="button" className="flex-1 h-11 bg-white rounded-lg flex items-center justify-center gap-2 border hover:bg-gray-100 transition-all active:scale-95">
              <img src={logogoogle} alt="Google" className="w-5 h-5 object-contain" />
              {/* <span className="text-sm font-semibold text-gray-700">Google</span> */}
            </button>
            <button onClick={handleAppleLogin} type="button" className="flex-1 h-11 bg-white rounded-lg flex items-center justify-center gap-2 border hover:bg-gray-100 transition-all active:scale-95">
              <img src={logoApple} alt="Apple" className="w-5 h-5 object-contain" />
              {/* <span className="text-sm font-semibold text-gray-700">Apple</span> */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;