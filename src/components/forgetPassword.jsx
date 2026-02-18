import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/deploy-logo.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        const response = await fetch('https://cashmish-backend.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Reset link sent to your email!');
        setEmail('');
      } else {
        setMessage(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      setMessage('Error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-0 bg-[#212531] text-[#747b92] min-h-screen grid place-items-center overflow-hidden font-['Poppins',_sans-serif] p-4">
      <div className="flex flex-col items-center w-full max-w-[400px] rounded-lg bg-black/32 shadow-2xl p-8">
        
        <img src={logo} alt="logo" className="h-16 w-auto mb-6" />
        
        <h2 className="text-white text-2xl font-bold mb-2">Forgot Password?</h2>
        <p className="text-sm text-center mb-6">Enter your email and we'll send you a reset link</p>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="text-sm block mb-2">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full h-10 px-3 rounded bg-transparent border border-white/20 text-white" 
              placeholder="your@email.com"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="h-10 bg-[#426df8] text-white rounded font-medium cursor-pointer border-none disabled:opacity-50"
          >
            {loading ? 'SENDING...' : 'SEND RESET LINK'}
          </button>
          
          {message && (
            <p className={`text-sm text-center ${message.includes('sent') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}
          
          <Link to="/login" className="text-[#4672ff] text-sm text-center hover:underline mt-2">
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;