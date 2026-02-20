import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Header from './header';
import Footer from './Footer';
import Swal from 'sweetalert2';
import { BASE_URL } from '../api/api';
import { Loader2, Lock, Eye, EyeOff, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Passwords mismatch',
                text: 'The passwords you entered do not match.',
                confirmButtonColor: '#16a34a',
                background: '#fff',
                customClass: { popup: 'rounded-[2rem]' }
            });
            return;
        }

        if (password.length < 6) {
            Swal.fire({
                icon: 'error',
                title: 'Password too weak',
                text: 'Password must be at least 6 characters long.',
                confirmButtonColor: '#16a34a',
                background: '#fff',
                customClass: { popup: 'rounded-[2rem]' }
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Reset Successful!',
                    text: 'You can now log in with your new password.',
                    confirmButtonColor: '#16a34a',
                    background: '#fff',
                    customClass: { popup: 'rounded-[2rem]' }
                }).then(() => {
                    navigate('/login');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Reset Failed',
                    text: data.message || 'The reset link is invalid or expired.',
                    confirmButtonColor: '#16a34a',
                    background: '#fff',
                    customClass: { popup: 'rounded-[2rem]' }
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Please check your connection and try again.',
                confirmButtonColor: '#16a34a',
                background: '#fff',
                customClass: { popup: 'rounded-[2rem]' }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 selection:bg-green-100">
            <Header />

            <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Decorative Blobs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-600/5 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4"></div>

                <div className="bg-white w-full max-w-md p-8 md:p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 relative z-10">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm shadow-green-100">
                            <Lock className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-3 uppercase tracking-tighter">Set New Password</h2>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed px-4">
                            Choose a strong password to secure your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-12 font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-mono"
                                        placeholder="Min. 6 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-12 font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-mono"
                                        placeholder="Repeat new password"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-green-600/20 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    Reset Password
                                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ResetPassword;
