import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginCard = () => {
  const [view, setView] = useState('signin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      navigate('/');
    }
  }, [navigate]);

  // Sign In State
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Sign Up State
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const activeBarTop = view === 'signin' ? '33.33%' : '66.66%';
  const heroInnerTop = view === 'signin' ? '0' : '-100%';
  const formsTop = view === 'signin' ? '0' : '-100%';

  // Handle Sign In Submit
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signInData)
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Load user-specific cart from localStorage (previously saved)
        const userId = data.user.id;
        const userCartKey = `userCart_${userId}`;
        const existingUserCart = JSON.parse(localStorage.getItem(userCartKey) || '[]');

        // Set current cart to user's cart
        localStorage.setItem('userCart', JSON.stringify(existingUserCart));

        navigate('/');
      } else {
        alert(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Login failed. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up Submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: signUpData.username,
          email: signUpData.email,
          password: signUpData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // New user starts with empty cart
        const userId = data.user.id;
        const userCartKey = `userCart_${userId}`;
        localStorage.setItem(userCartKey, JSON.stringify([]));
        localStorage.setItem('userCart', JSON.stringify([]));

        navigate('/');
      } else {
        alert(data.message || 'Sign up failed. Please try again.');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Sign up failed. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-0 bg-[#212531] text-[#747b92] min-h-screen grid place-items-center overflow-hidden font-['Poppins',_sans-serif] p-4">
      <div className="flex flex-col md:flex-row items-stretch w-full max-w-[660px] h-auto md:h-[360px] rounded-lg bg-black/32 shadow-2xl">

        {/* NAV */}
        <ul className="relative flex flex-row md:flex-col justify-between md:justify-center w-full md:w-[148px] h-12 md:h-auto list-none m-0 p-0">
          <div
            className={`absolute rounded bg-[#4672ff] transition-all duration-500
              top-0 h-0.5 w-16 md:left-0 md:w-1.5 md:h-1/3
              ${view === 'signin' ? 'left-[42%] md:top-[33.33%]' : 'left-[75%] md:top-[66.66%]'}
            `}
          />
          <li className="flex-1 grid place-items-center">
            <span className="text-white font-bold text-xl">📱</span>
          </li>
          <li className="flex-1 grid place-items-center">
            <button
              onClick={() => setView('signin')}
              className={`opacity-75 hover:opacity-100 bg-transparent border-none cursor-pointer ${
                view === 'signin' ? 'text-white opacity-100' : ''
              }`}
            >
              Sign In
            </button>
          </li>
          <li className="flex-1 grid place-items-center">
            <button
              onClick={() => setView('signup')}
              className={`opacity-75 hover:opacity-100 bg-transparent border-none cursor-pointer ${
                view === 'signup' ? 'text-white opacity-100' : ''
              }`}
            >
              Sign Up
            </button>
          </li>
        </ul>

        {/* HERO */}
        <div className="relative flex flex-col justify-end flex-none w-full md:w-[300px] h-[200px] md:h-auto -mt-4 md:-my-12 overflow-hidden rounded-xl bg-[#4672ff]">
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{ top: heroInnerTop }}
          >
            <div className="h-[200px] md:h-[456px] w-full flex flex-col justify-start md:justify-center">
              <h2 className="pl-6 pt-4 md:pt-0 text-white text-lg md:text-2xl font-bold">Welcome Back.</h2>
              <h3 className="pl-6 pt-1 md:pt-0 text-white/75 text-xs md:text-sm">
                Please enter your credentials.
              </h3>
              <div className="w-full h-24 md:h-auto flex items-center justify-center mt-4">
                <span className="text-6xl">🔐</span>
              </div>
            </div>

            <div className="h-[456px] w-full flex flex-col justify-center">
              <h2 className="pl-6 text-white text-lg md:text-2xl font-bold">Sign Up Now.</h2>
              <h3 className="pl-6 text-white/75 text-xs md:text-sm">
                Join the crowd and get started.
              </h3>
              <div className="w-full h-24 md:h-auto flex items-center justify-center mt-4">
                <span className="text-6xl">🚀</span>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="relative overflow-hidden p-4 md:p-6 w-full md:w-[400px]">

          {/* DESKTOP (ORIGINAL ANIMATION) */}
          <div
            className="hidden md:block absolute h-[200%] left-0 right-0 transition-all duration-500"
            style={{ top: formsTop }}
          >
            {/* SIGN IN */}
            <form onSubmit={handleSignIn} className="h-[360px] p-6 flex flex-col justify-center gap-2">
              <label className="text-sm">Email</label>
              <input
                type="email"
                required
                value={signInData.email}
                onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                className="h-10 px-3 rounded bg-transparent border border-white/20 text-white"
              />
              <label className="text-sm">Password</label>
              <input
                type="password"
                required
                value={signInData.password}
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                className="h-10 px-3 rounded bg-transparent border border-white/20 text-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-10 bg-[#426df8] text-white rounded mt-3 disabled:opacity-50 cursor-pointer border-none font-medium"
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </form>

            {/* SIGN UP */}
            <form onSubmit={handleSignUp} className="h-[360px] p-6 flex flex-col justify-center gap-2">
              <label className="text-sm">Username</label>
              <input
                type="text"
                required
                value={signUpData.username}
                onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                className="h-10 px-3 rounded bg-transparent border border-white/20 text-white"
              />
              <label className="text-sm">Email</label>
              <input
                type="email"
                required
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                className="h-10 px-3 rounded bg-transparent border border-white/20 text-white"
              />
              <label className="text-sm">Password</label>
              <input
                type="password"
                required
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                className="h-10 px-3 rounded bg-transparent border border-white/20 text-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-10 bg-[#426df8] text-white rounded mt-3 disabled:opacity-50 cursor-pointer border-none font-medium"
              >
                {loading ? 'SIGNING UP...' : 'SIGN UP'}
              </button>
            </form>
          </div>

          {/* MOBILE (ONLY ACTIVE FORM) */}
          <div className="block md:hidden">
            {view === 'signin' && (
              <form onSubmit={handleSignIn} className="p-6 flex flex-col gap-2">
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  required
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  className="h-10 px-3 rounded bg-transparent border border-white/20 text-white"
                />
                <label className="text-sm">Password</label>
                <input
                  type="password"
                  required
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  className="h-10 px-3 rounded bg-transparent border border-white/20 text-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-10 bg-[#426df8] text-white rounded mt-3 disabled:opacity-50 cursor-pointer border-none font-medium"
                >
                  {loading ? 'SIGNING IN...' : 'SIGN IN'}
                </button>
              </form>
            )}

            {view === 'signup' && (
              <form onSubmit={handleSignUp} className="p-6 flex flex-col gap-2">
                <label className="text-sm">Username</label>
                <input
                  type="text"
                  required
                  value={signUpData.username}
                  onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                  className="h-10 px-3 rounded bg-transparent border border-white/20 text-white"
                />
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  required
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  className="h-10 px-3 rounded bg-transparent border border-white/20 text-white"
                />
                <label className="text-sm">Password</label>
                <input
                  type="password"
                  required
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  className="h-10 px-3 rounded bg-transparent border border-white/20 text-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-10 bg-[#426df8] text-white rounded mt-3 disabled:opacity-50 cursor-pointer border-none font-medium"
                >
                  {loading ? 'SIGNING UP...' : 'SIGN UP'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginCard;