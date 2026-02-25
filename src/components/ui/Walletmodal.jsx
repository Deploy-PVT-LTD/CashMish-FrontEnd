import React, { useState, useEffect } from 'react';
import { X, Wallet, DollarSign, Gift, CheckCircle, RefreshCw, Landmark, Zap, AlertCircle, ArrowLeft } from 'lucide-react';
import { useWallet } from '../../contexts/Walletcontext';

const WalletModal = ({ isOpen, onClose }) => {
  const {
    walletBalance,
    isProcessing,
    pendingOrders,
    fetchUserBankDetails,
    clearWalletAfterPayout,
    withdrawCash
  } = useWallet();

  // 'main' | 'select' | 'form' | 'success'
  const [currentView, setCurrentView] = useState('main');
  const [payoutMethod, setPayoutMethod] = useState(''); // 'zelle' | 'bank'
  const [form, setForm] = useState({ name: '', accountNumber: '', bankName: '', zelleContact: '', zelleContactType: 'email' });
  const [apiError, setApiError] = useState('');
  const [bankDetailsList, setBankDetailsList] = useState([]);
  const [loadingBankDetails, setLoadingBankDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayAmount = walletBalance || 0;

  useEffect(() => {
    if (isOpen) {
      setCurrentView('main');
      setPayoutMethod('');
      setApiError('');
      setForm({ name: '', accountNumber: '', bankName: '', zelleContact: '', zelleContactType: 'email' });
      loadBankDetails();
    }
  }, [isOpen]);

  const loadBankDetails = async () => {
    setLoadingBankDetails(true);
    const details = await fetchUserBankDetails();
    setBankDetailsList(details || []);
    setLoadingBankDetails(false);
  };

  if (!isOpen) return null;

  const handleClose = () => {
    if (!isProcessing && !isSubmitting) {
      setCurrentView('main');
      setApiError('');
      onClose();
    }
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    if (payoutMethod === 'bank' && (!form.accountNumber || !form.bankName)) return;
    if (payoutMethod === 'zelle' && !form.zelleContact) return;

    setApiError('');
    setIsSubmitting(true);
    try {
      const result = await withdrawCash({ ...form, payoutMethod }, displayAmount);
      if (result.success) {
        setCurrentView('success');
        loadBankDetails();
      } else {
        setApiError(result.error || 'Withdrawal failed');
      }
    } catch (err) {
      setApiError(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const map = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
      paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Paid ✓' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' }
    };
    const s = map[status] || map.pending;
    return <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wide ${s.bg} ${s.text}`}>{s.label}</span>;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 relative">
          <button onClick={handleClose} disabled={isProcessing || isSubmitting} className="absolute top-4 right-4 text-white/80 hover:text-white disabled:opacity-50 cursor-pointer"><X size={24} /></button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl"><Wallet className="text-white" size={28} /></div>
            <div>
              <h2 className="text-white text-xl font-black uppercase tracking-tight">My Wallet</h2>
              <p className="text-green-100 text-xs font-semibold">Available Balance</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-white/80 text-sm font-bold mb-1">Current Balance</p>
            <p className="text-white text-4xl font-black">${displayAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="p-6 max-h-[65vh] overflow-y-auto">

          {/* SUCCESS VIEW */}
          {currentView === 'success' && (
            <div className="text-center py-6">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="text-green-600" size={40} /></div>
              <h3 className="text-gray-900 font-black text-xl mb-2 uppercase tracking-tight">Request Submitted!</h3>
              <p className="text-gray-600 text-sm font-semibold mb-1">You will receive payment within 48 hours.</p>
              <p className="text-gray-400 text-xs mb-6">{payoutMethod === 'zelle' ? 'Zelle details saved successfully.' : 'Bank details saved successfully.'}</p>
              <button onClick={handleClose} className="px-8 py-3 bg-green-600 text-white rounded-xl font-black text-sm uppercase shadow-lg hover:bg-green-700 transition-colors cursor-pointer">Done</button>
            </div>
          )}

          {/* METHOD SELECTION VIEW */}
          {currentView === 'select' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <button type="button" onClick={() => setCurrentView('main')} className="text-gray-400 hover:text-gray-600 cursor-pointer"><ArrowLeft size={18} /></button>
                <p className="text-gray-600 text-sm font-semibold">Choose your payout method</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Zelle FIRST */}
                <button
                  onClick={() => { setPayoutMethod('zelle'); setCurrentView('form'); }}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group"
                >
                  <div className="bg-purple-100 group-hover:bg-purple-200 p-3 rounded-full transition-colors">
                    <Zap className="text-purple-600" size={24} />
                  </div>
                  <span className="text-sm font-bold text-gray-800">Zelle</span>
                </button>
                {/* Bank SECOND */}
                <button
                  onClick={() => { setPayoutMethod('bank'); setCurrentView('form'); }}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group"
                >
                  <div className="bg-blue-100 group-hover:bg-blue-200 p-3 rounded-full transition-colors">
                    <Landmark className="text-blue-600" size={24} />
                  </div>
                  <span className="text-sm font-bold text-gray-800">Bank Account</span>
                </button>
              </div>
            </div>
          )}

          {/* FORM VIEW */}
          {currentView === 'form' && (
            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <button type="button" onClick={() => setCurrentView('select')} className="text-gray-400 hover:text-gray-600 cursor-pointer"><ArrowLeft size={18} /></button>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${payoutMethod === 'zelle' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {payoutMethod === 'zelle' ? 'Zelle' : 'Bank Account'}
                </span>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                <p className="text-green-900 font-bold text-sm">Withdrawal Amount: <span className="text-green-700 font-black">${displayAmount.toFixed(2)}</span></p>
              </div>

              {apiError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-red-700 text-xs font-semibold">{apiError}</p>
                </div>
              )}

              {/* Full Name (common) */}
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1.5 uppercase tracking-wide">Full Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm font-semibold" placeholder="Enter your full name" />
              </div>

              {/* Bank Fields */}
              {payoutMethod === 'bank' && (
                <>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1.5 uppercase tracking-wide">Account Number</label>
                    <input type="text" required value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm font-semibold" placeholder="Enter account number" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1.5 uppercase tracking-wide">Bank Name</label>
                    <input type="text" required value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm font-semibold" placeholder="Enter bank name" />
                  </div>
                </>
              )}

              {/* Zelle Fields */}
              {payoutMethod === 'zelle' && (
                <>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1.5 uppercase tracking-wide">Contact Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setForm({ ...form, zelleContactType: 'email', zelleContact: '' })}
                        className={`py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${form.zelleContactType === 'email' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        Email
                      </button>
                      <button type="button" onClick={() => setForm({ ...form, zelleContactType: 'phone', zelleContact: '' })}
                        className={`py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${form.zelleContactType === 'phone' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        Phone
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1.5 uppercase tracking-wide">
                      {form.zelleContactType === 'email' ? 'Zelle Email' : 'Zelle Phone Number'}
                    </label>
                    <input
                      type={form.zelleContactType === 'email' ? 'email' : 'tel'}
                      required
                      value={form.zelleContact}
                      onChange={(e) => setForm({ ...form, zelleContact: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-sm font-semibold"
                      placeholder={form.zelleContactType === 'email' ? 'your@email.com' : '(555) 123-4567'}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setCurrentView('select')} disabled={isSubmitting} className="flex-1 py-3 border-2 rounded-xl font-bold text-xs uppercase hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50">Back</button>
                <button type="submit" disabled={isSubmitting || displayAmount <= 0} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-black text-xs uppercase flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer hover:bg-green-700">
                  {isSubmitting ? <RefreshCw className="animate-spin" size={14} /> : 'Submit Request'}
                </button>
              </div>
            </form>
          )}

          {/* MAIN VIEW */}
          {currentView === 'main' && (
            <div className="space-y-4">
              {/* Withdraw Button */}
              <button
                onClick={() => setCurrentView('select')}
                disabled={displayAmount <= 0}
                className="w-full group bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-green-500 hover:bg-green-50 transition-all flex items-center gap-4 disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-white cursor-pointer"
              >
                <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-600 transition-colors"><DollarSign className="text-green-600 group-hover:text-white transition-colors" size={22} /></div>
                <div className="text-left flex-grow">
                  <h3 className="text-gray-900 font-black text-base uppercase tracking-tight">Withdraw Cash</h3>
                  <p className="text-gray-500 text-xs font-semibold mt-0.5">Receive in 48 hours via Zelle or Bank</p>
                </div>
              </button>

              {/* Transaction History */}
              <div>
                <div className="flex justify-between items-center mb-3 mt-6">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Transaction History</p>
                  <RefreshCw
                    size={14}
                    className={`${loadingBankDetails ? 'animate-spin' : ''} cursor-pointer text-gray-400 hover:text-green-600`}
                    onClick={loadBankDetails}
                  />
                </div>

                {bankDetailsList?.length > 0 ? (
                  <div className="space-y-2">
                    {bankDetailsList.map((item) => (
                      <div key={item._id} className="bg-gray-50 border border-gray-100 rounded-xl p-3 hover:bg-white transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[11px] font-black text-gray-900 uppercase">{(item.payoutMethod === 'zelle') ? 'Zelle' : (item.bankName || 'Withdrawal')}</p>
                              <p className="text-sm font-black text-green-700">${(item.amount || 0).toFixed(2)}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] text-gray-400 font-bold uppercase">
                                {new Date(item.createdAt).toLocaleDateString('en-GB')}
                              </p>
                              <StatusBadge status={item.status} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl">
                    <p className="text-gray-400 text-xs font-bold">No history found</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default WalletModal;