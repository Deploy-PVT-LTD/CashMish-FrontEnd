import React, { useState, useEffect } from 'react';
import { X, Wallet, DollarSign, Gift, CheckCircle, RefreshCw } from 'lucide-react';
import { useWallet } from '../../contexts/Walletcontext';

const WalletModal = ({ isOpen, onClose }) => {
  // Context se functions aur state nikaali
  const {
    walletBalance,
    isProcessing,
    pendingOrders,
    fetchUserBankDetails,
    clearWalletAfterPayout,
    withdrawCash // Context wala withdraw use karenge crash se bachne ke liye
  } = useWallet();

  const [currentView, setCurrentView] = useState('main');
  const [withdrawalForm, setWithdrawalForm] = useState({ name: '', accountNumber: '', bankName: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  const [bankDetailsList, setBankDetailsList] = useState([]);
  const [loadingBankDetails, setLoadingBankDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayAmount = walletBalance || 0;

  // Modal khulne par state reset aur history load karo
  useEffect(() => {
    if (isOpen) {
      setCurrentView('main');
      setShowSuccess(false);
      setWithdrawError('');
      setWithdrawalForm({ name: '', accountNumber: '', bankName: '' });
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
      setShowSuccess(false);
      setWithdrawError('');
      onClose();
    }
  };

  // ── Withdrawal Logic (Yahan state 0 hogi) ────────────────────────────────
  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setWithdrawError('');
    setIsSubmitting(true);

    try {
      // Context ke main withdraw function ko call kiya
      const result = await withdrawCash(withdrawalForm, displayAmount);

      if (result.success) {
        // Success hote hi WalletContext.jsx ka clearWalletAfterPayout chal chuka hai
        // Isliye balance ab state mein 0 ho chuka hai
        setShowSuccess(true);
        loadBankDetails();
      } else {
        setWithdrawError(result.error || 'Withdrawal failed');
      }
    } catch (err) {
      setWithdrawError(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Coupon Logic (Yahan bhi state 0 hogi) ────────────────────────────────
  const handleCouponConfirm = () => {
    const orderId = pendingOrders?.[0]?.orderId || null;
    // Foran state 0 karo aur success screen dikhao
    clearWalletAfterPayout(orderId);
    setShowSuccess(true);
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

        {/* Header Section */}
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

          {showSuccess ? (
            <div className="text-center py-6">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="text-green-600" size={40} /></div>
              <h3 className="text-gray-900 font-black text-xl mb-2 uppercase tracking-tight">Success!</h3>
              <p className="text-gray-600 text-sm font-semibold mb-6">Request submitted. Wait for 48 hours.</p>
              <button onClick={handleClose} className="px-8 py-3 bg-green-600 text-white rounded-xl font-black text-sm uppercase shadow-lg hover:bg-green-700 transition-colors cursor-pointer">Done</button>
            </div>

          ) : currentView === 'withdraw' ? (
            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center mb-2">
                <p className="text-green-900 font-bold text-sm">Withdrawal Amount: <span className="text-green-700 font-black">${displayAmount.toFixed(2)}</span></p>
              </div>
              {withdrawError && <p className="text-red-600 text-xs font-bold text-center bg-red-50 p-2 rounded-lg">⚠️ {withdrawError}</p>}
              <input type="text" placeholder="Account Holder Name" required value={withdrawalForm.name} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none text-sm font-semibold" />
              <input type="text" placeholder="Account Number" required value={withdrawalForm.accountNumber} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, accountNumber: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none text-sm font-semibold" />
              <input type="text" placeholder="Bank Name" required value={withdrawalForm.bankName} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, bankName: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none text-sm font-semibold" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setCurrentView('main')} className="flex-1 py-3 border-2 rounded-xl font-bold text-xs uppercase hover:bg-gray-50 transition-colors cursor-pointer">Back</button>
                <button type="submit" disabled={isSubmitting || displayAmount <= 0} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-black text-xs uppercase flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer">
                  {isSubmitting ? <RefreshCw className="animate-spin" size={14} /> : 'Submit Request'}
                </button>
              </div>
            </form>

          ) : (
            <div className="space-y-4">
              {/* Withdraw Button */}
              <button
                onClick={() => setCurrentView('withdraw')}
                disabled={displayAmount <= 0}
                className="w-full group bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-green-500 hover:bg-green-50 transition-all flex items-center gap-4 disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-white cursor-pointer"
              >
                <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-600 transition-colors"><DollarSign className="text-green-600 group-hover:text-white transition-colors" size={22} /></div>
                <div className="text-left flex-grow">
                  <h3 className="cursor-pointer text-gray-900 font-black text-base uppercase tracking-tight">Withdraw Cash</h3>
                  <p className="text-gray-500 text-xs font-semibold mt-0.5">Receive in 48 hours to your bank</p>
                </div>
              </button>

              {/* Transaction History Section */}
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