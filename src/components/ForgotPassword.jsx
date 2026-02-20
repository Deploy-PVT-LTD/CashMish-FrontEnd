import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from './Footer';
import Swal from 'sweetalert2';
import { BASE_URL } from '../api/api';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Email Sent!',
                    text: 'Check your inbox for password reset instructions.',
                    confirmButtonColor: '#2563eb'
                });
                navigate('/cartlogin');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.message || 'Something went wrong',
                    confirmButtonColor: '#2563eb'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Please check your connection and try again.',
                confirmButtonColor: '#2563eb'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                        <p className="text-gray-500 text-sm">
                            Enter your email address and we'll send you instructions to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="name@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Sending Link...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    <button
                        onClick={() => navigate('/login')}
                        className="w-full mt-6 text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </button>
                </div>
            </div>

            {/* <Footer /> */}
        </div>
    );
};

export default ForgotPassword;
