import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/deploy-logo.png';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    // UI only - show success message
    setMessage('Password reset successful! Redirecting...');
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="m-0 bg-[#212531] text-[#747b92] min-h-screen grid place-items-center overflow-hidden font-['Poppins',_sans-serif] p-4">
      <div className="flex flex-col items-center w-full max-w-[400px] rounded-lg bg-black/32 shadow-2xl p-8">

        <img src={logo} alt="logo" className="h-16 w-auto mb-6" />

        <h2 className="text-white text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-sm text-center mb-6">Enter your new password</p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="text-sm block mb-2">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 rounded bg-transparent border border-white/20 text-white"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="text-sm block mb-2">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-10 px-3 rounded bg-transparent border border-white/20 text-white"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="h-10 bg-[#426df8] text-white rounded font-medium cursor-pointer border-none hover:bg-[#3559d9] transition-colors"
          >
            RESET PASSWORD
          </button>

          {message && (
            <p className={`text-sm text-center ${message.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;