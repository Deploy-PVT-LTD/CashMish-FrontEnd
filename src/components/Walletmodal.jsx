import React, { useState, useEffect } from 'react';
import { X, Wallet, DollarSign, Gift, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useWallet } from './Walletcontext';

const WalletModal = ({ isOpen, onClose }) => {
  const {
    walletBalance,
    isProcessing,
    hasPendingAction,
    pendingOrders,
    withdrawCash,
    getCoupons,
    fetchUserBankDetails
  } = useWallet();

  // view: 'payout' | 'withdraw' | 'coupon' | 'history' | 'success'
  const [currentView, setCurrentView] = useState('payout');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderAmount, setSelectedOrderAmount] = useState(0);
  const [withdrawalForm, setWithdrawalForm] = useState({ name: '', accountNumber: '', bankName: '' });
  const [successType, setSuccessType] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [bankDetailsList, setBankDetailsList] = useState([]);
  const [loadingBankDetails, setLoadingBankDetails] = useState(false);

  const couponHistory = JSON.parse(localStorage.getItem('couponHistory') || '[]');

  // Every time modal opens → decide which view to show
  useEffect(() => {
    if (!isOpen) return;

    if (hasPendingAction && pendingOrders.length > 0) {
      // Pending hai → seedha payout selection dikhao (same popup as AcceptPopup)
      const first = pendingOrders[0];
      setSelectedOrderId(first.id);
      setSelectedOrderAmount(first.amount);
      setCurrentView('payout');
    } else {
      // No pending → history dikhao
      setCurrentView('history');
      loadBankDetails();
    }
  }, [isOpen, hasPendingAction]);

  const loadBankDetails = async () => {
    setLoadingBankDetails(true);
    const details = await fetchUserBankDetails();
    setBankDetailsList(details);
    setLoadingBankDetails(false);
  };

  if (!isOpen) return null;

  // Close karo — balance nahi hatega, pending rehega
  const handleClose = () => {
    if (isProcessing) return;
    // Reset form state but NOT pendingOrders (those stay in context/localStorage)
    setWithdrawalForm({ name: '', accountNumber: '', bankName: '' });
    setWithdrawError('');
    setSuccessType('');
    onClose();
  };

  const goToWithdraw = (orderId, amount) => {
    setSelectedOrderId(orderId);
    setSelectedOrderAmount(amount);
    setWithdrawError('');
    setCurrentView('withdraw');
  };

  const goToCoupon = (orderId, amount) => {
    setSelectedOrderId(orderId);
    setSelectedOrderAmount(amount);
    setCurrentView('coupon');
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setWithdrawError('');
    const result = await withdrawCash(withdrawalForm, selectedOrderId);
    if (result?.success) {
      setSuccessType('withdraw');
      setCurrentView('success');
      loadBankDetails();
    } else {
      setWithdrawError(result?.error || 'Something went wrong. Please try again.');
    }
  };

  const handleCouponConfirm = () => {
    getCoupons(selectedOrderId);
    setSuccessType('coupon');
    setCurrentView('success');
  };

  // After success, if more pending orders exist go back to payout, else history
  const handleSuccessDone = () => {
    if (pendingOrders.length > 0) {
      const next = pendingOrders[0];
      setSelectedOrderId(next.id);
      setSelectedOrderAmount(next.amount);
      setCurrentView('payout');
    } else {
      setCurrentView('history');
      loadBankDetails();
    }
    setSuccessType('');
  };

  const bonusAmount = (selectedOrderAmount * 0.07).toFixed(2);
  const totalWithBonus = (selectedOrderAmount + parseFloat(bonusAmount)).toFixed(2);

  const StatusBadge = ({ status }) => {
    const map = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
      paid:    { bg: 'bg-green-100', text: 'text-green-700', label: 'Paid ✓' },
      rejected:{ bg: 'bg-red-100',   text: 'text-red-700',   label: 'Rejected' }
    };
    const s = map[status] || map.pending;
    return (
      <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wide ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ animation: 'fadeInScale 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
      >

        {/* ═══════════════════════════════════════════════════════
            VIEW: PAYOUT SELECTION  (same look as AcceptPopup)
            Dikhao jab user ne action nahi liya
        ═══════════════════════════════════════════════════════ */}
        {currentView === 'payout' && (
          <>
            {/* Green Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-5 relative">
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <Wallet className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-white font-black text-lg uppercase tracking-tight">
                    {pendingOrders.length > 1 ? 'Bid Accepted!' : 'Bid Accepted!'}
                  </h2>
                  <p className="text-green-100 text-xs font-semibold">Choose your payout method</p>
                </div>
              </div>
              <div className="mt-3 bg-white/10 rounded-xl p-3">
                <p className="text-white/80 text-[11px] font-bold uppercase mb-0.5">Amount Added to Wallet</p>
                <p className="text-white text-3xl font-black">${selectedOrderAmount.toFixed(2)}</p>
              </div>
            </div>

            {/* Options */}
            <div className="p-5 space-y-3">
              <p className="text-gray-600 text-xs font-bold text-center uppercase tracking-wide mb-4">
                How do you want to receive this?
              </p>

              {/* Withdraw Cash */}
              <button
                onClick={() => goToWithdraw(selectedOrderId, selectedOrderAmount)}
                className="w-full group bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-green-500 hover:bg-green-50 transition-all flex items-center gap-4"
              >
                <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-600 transition-colors">
                  <DollarSign className="text-green-600 group-hover:text-white transition-colors" size={22} />
                </div>
                <div className="text-left flex-grow">
                  <h3 className="text-gray-900 font-black text-base uppercase tracking-tight">Withdraw Cash</h3>
                  <p className="text-gray-500 text-xs font-semibold mt-0.5">Receive in 48 hours to your bank</p>
                </div>
              </button>

              {/* Get Coupons */}
              <button
                onClick={() => goToCoupon(selectedOrderId, selectedOrderAmount)}
                className="w-full group relative bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-4 hover:border-orange-400 hover:shadow-md transition-all flex items-center gap-4 overflow-hidden"
              >
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  +7% Bonus
                </div>
                <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-orange-500 transition-colors">
                  <Gift className="text-orange-600 group-hover:text-white transition-colors" size={22} />
                </div>
                <div className="text-left flex-grow">
                  <h3 className="text-gray-900 font-black text-base uppercase tracking-tight">Get Coupons</h3>
                  <p className="text-gray-600 text-xs font-semibold mt-0.5">
                    Earn <span className="text-orange-600 font-black">${bonusAmount} extra</span> — Total ${totalWithBonus}
                  </p>
                </div>
              </button>

              {/* Decide later — sirf band karta hai, paise nahi hatatay */}
              <button
                onClick={handleClose}
                className="w-full text-gray-400 text-xs font-semibold py-2 hover:text-gray-600 transition-colors"
              >
                Decide later from Wallet
              </button>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════
            VIEW: WITHDRAW FORM
        ═══════════════════════════════════════════════════════ */}
        {currentView === 'withdraw' && (
          <>
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-5 relative">
              <button onClick={handleClose} disabled={isProcessing} className="absolute top-3 right-3 text-white/70 hover:text-white disabled:opacity-40">
                <X size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <DollarSign className="text-white" size={22} />
                </div>
                <div>
                  <h2 className="text-white font-black text-lg uppercase tracking-tight">Withdraw Cash</h2>
                  <p className="text-green-100 text-xs font-semibold">Amount: ${selectedOrderAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {withdrawError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-700 text-xs font-semibold text-center">⚠️ {withdrawError}</p>
                </div>
              )}

              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1.5 uppercase tracking-wide">Account Holder Name</label>
                  <input
                    type="text" required
                    value={withdrawalForm.name}
                    onChange={(e) => setWithdrawalForm({ ...withdrawalForm, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm font-semibold"
                    placeholder="Enter account holder name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1.5 uppercase tracking-wide">Account Number</label>
                  <input
                    type="text" required
                    value={withdrawalForm.accountNumber}
                    onChange={(e) => setWithdrawalForm({ ...withdrawalForm, accountNumber: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm font-semibold"
                    placeholder="Enter account number"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1.5 uppercase tracking-wide">Bank Name</label>
                  <input
                    type="text" required
                    value={withdrawalForm.bankName}
                    onChange={(e) => setWithdrawalForm({ ...withdrawalForm, bankName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm font-semibold"
                    placeholder="Enter bank name"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => { setWithdrawError(''); setCurrentView('payout'); }}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-sm uppercase hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-black text-sm uppercase hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <><RefreshCw size={16} className="animate-spin" /> Saving...</> : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════
            VIEW: COUPON CONFIRM
        ═══════════════════════════════════════════════════════ */}
        {currentView === 'coupon' && (
          <>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 relative">
              <button onClick={handleClose} className="absolute top-3 right-3 text-white/70 hover:text-white">
                <X size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <Gift className="text-white" size={22} />
                </div>
                <div>
                  <h2 className="text-white font-black text-lg uppercase">Get Coupons</h2>
                  <p className="text-orange-100 text-xs font-semibold">+7% Bonus on your amount</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm font-semibold">Original Amount:</span>
                  <span className="text-gray-900 font-bold">${selectedOrderAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-orange-600">
                  <span className="text-sm font-semibold">7% Bonus:</span>
                  <span className="font-bold">+${bonusAmount}</span>
                </div>
                <div className="border-t-2 border-orange-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-black uppercase">Total Value:</span>
                    <span className="text-green-600 text-xl font-black">${totalWithBonus}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-blue-900 text-xs font-semibold text-center">
                  📧 Coupons will be sent to your registered email
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentView('payout')}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-sm uppercase hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleCouponConfirm}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-black text-sm uppercase hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  {isProcessing ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════
            VIEW: SUCCESS
        ═══════════════════════════════════════════════════════ */}
        {currentView === 'success' && (
          <div className="p-8 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h3 className="text-gray-900 font-black text-xl mb-2 uppercase tracking-tight">
              {successType === 'withdraw' ? 'Withdrawal Submitted!' : 'Coupons Claimed!'}
            </h3>
            <p className="text-gray-600 text-sm font-semibold mb-6">
              {successType === 'withdraw'
                ? 'Aapko 48 hours ke andar paise receive ho jayenge.'
                : 'Coupons have been sent to your registered email.'}
            </p>
            <button
              onClick={handleSuccessDone}
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-black text-sm uppercase hover:bg-green-700 transition-all"
            >
              Done
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            VIEW: HISTORY (no pending)
        ═══════════════════════════════════════════════════════ */}
        {currentView === 'history' && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 relative">
              <button onClick={handleClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
                <X size={24} />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Wallet className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-white text-xl font-black uppercase tracking-tight">My Wallet</h2>
                  <p className="text-green-100 text-xs font-semibold">Transaction History</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-white/80 text-sm font-bold mb-1">Current Balance</p>
                <p className="text-white text-4xl font-black">${walletBalance.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-6 max-h-[55vh] overflow-y-auto space-y-5">

              {/* Bank withdrawal history from backend */}
              {(loadingBankDetails || bankDetailsList.length > 0) && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-500 text-xs font-black uppercase tracking-wide">Withdrawal Requests</p>
                    <button onClick={loadBankDetails} disabled={loadingBankDetails} className="text-gray-400 hover:text-green-600 transition-colors">
                      <RefreshCw size={14} className={loadingBankDetails ? 'animate-spin' : ''} />
                    </button>
                  </div>
                  {loadingBankDetails ? (
                    <div className="flex justify-center py-4">
                      <RefreshCw size={20} className="animate-spin text-green-600" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {bankDetailsList.map((item, i) => (
                        <div key={item._id || i} className="bg-green-50 border border-green-100 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-green-600 p-2 rounded-lg shrink-0">
                              <Clock className="text-white" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="text-green-900 font-black text-sm uppercase">Withdrawal Request</h4>
                                <StatusBadge status={item.status} />
                              </div>
                              <p className="text-green-800 text-xs font-bold mt-1">{item.accountHolderName}</p>
                              <p className="text-green-700 text-xs mt-0.5">{item.bankName} · ****{item.accountNumber?.slice(-4)}</p>
                              {item.status === 'pending' && (
                                <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                                  <p className="text-blue-900 text-[10px] font-semibold text-center">⏱️ You will receive your amount within 48 hours</p>
                                </div>
                              )}
                              {item.status === 'paid' && (
                                <div className="mt-2 bg-green-100 border border-green-200 rounded-lg p-2">
                                  <p className="text-green-900 text-[10px] font-semibold text-center">✅ Payment transferred to your account</p>
                                </div>
                              )}
                              {item.status === 'rejected' && (
                                <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2">
                                  <p className="text-red-700 text-[10px] font-semibold text-center">✗ Request rejected. Please contact support.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Coupon history */}
              {couponHistory.length > 0 && (
                <div>
                  <p className="text-gray-500 text-xs font-black uppercase tracking-wide mb-3">Coupon History</p>
                  <div className="space-y-2">
                    {couponHistory.map((c, i) => (
                      <div key={i} className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-orange-500 p-2 rounded-lg shrink-0">
                            <Gift className="text-white" size={16} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="text-orange-900 font-black text-sm uppercase">Coupons Claimed!</h4>
                              <span className="text-green-600 font-black text-sm">${c.totalAmount?.toFixed(2)}</span>
                            </div>
                            <p className="text-orange-700 text-xs mt-1">+7% Bonus: ${c.bonusAmount?.toFixed(2)}</p>
                            <p className="text-orange-600 text-[10px] mt-1">📧 Sent to your registered email</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {bankDetailsList.length === 0 && couponHistory.length === 0 && !loadingBankDetails && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                  <Wallet className="text-gray-300 mx-auto mb-2" size={36} />
                  <p className="text-gray-500 text-sm font-bold">No transactions yet</p>
                  <p className="text-gray-400 text-xs mt-1 font-semibold">Accept a bid to add funds to your wallet</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default WalletModal;