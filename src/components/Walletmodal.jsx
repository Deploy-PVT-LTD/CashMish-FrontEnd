import React, { useState } from 'react';
import { X, Wallet, DollarSign, Gift, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useWallet } from './Walletcontext';

const WalletModal = ({ isOpen, onClose }) => {
  const {
    walletBalance,
    isProcessing,
    hasPendingAction,
    pendingOrders,
    withdrawCash,
    getCoupons
  } = useWallet();

  const [currentView, setCurrentView] = useState('main'); // 'main' | 'withdraw' | 'coupon'
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderAmount, setSelectedOrderAmount] = useState(0);
  const [withdrawalForm, setWithdrawalForm] = useState({
    name: '',
    accountNumber: '',
    bankName: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState(''); // 'withdraw' | 'coupon'

  if (!isOpen) return null;

  const handleClose = () => {
    if (!isProcessing) {
      setCurrentView('main');
      setSelectedOrderId(null);
      setSelectedOrderAmount(0);
      setWithdrawalForm({ name: '', accountNumber: '', bankName: '' });
      setShowSuccess(false);
      setSuccessType('');
      onClose();
    }
  };

  const startWithdraw = (orderId, amount) => {
    setSelectedOrderId(orderId);
    setSelectedOrderAmount(amount);
    setCurrentView('withdraw');
  };

  const startCoupon = (orderId, amount) => {
    setSelectedOrderId(orderId);
    setSelectedOrderAmount(amount);
    setCurrentView('coupon');
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (withdrawalForm.name && withdrawalForm.accountNumber && withdrawalForm.bankName) {
      withdrawCash(withdrawalForm, selectedOrderId);
      setSuccessType('withdraw');
      setShowSuccess(true);
    }
  };

  const handleCouponConfirm = () => {
    getCoupons(selectedOrderId);
    setSuccessType('coupon');
    setShowSuccess(true);
  };

  const bonusAmount = (selectedOrderAmount * 0.07).toFixed(2);
  const totalWithBonus = (selectedOrderAmount + parseFloat(bonusAmount)).toFixed(2);

  // Transaction history from localStorage
  const withdrawalHistory = JSON.parse(localStorage.getItem('withdrawalHistory') || '[]');
  const couponHistory = JSON.parse(localStorage.getItem('couponHistory') || '[]');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        style={{ animation: 'fadeInScale 0.2s ease-out' }}
      >
        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 relative">
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Wallet className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-white text-xl font-black uppercase tracking-tight">My Wallet</h2>
              <p className="text-green-100 text-xs font-semibold">
                {hasPendingAction
                  ? 'Action Required'
                  : walletBalance > 0
                  ? 'Available Balance'
                  : 'Transaction History'}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-white/80 text-sm font-bold mb-1">Current Balance</p>
            <p className="text-white text-4xl font-black">${walletBalance.toFixed(2)}</p>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">

          {/* SUCCESS VIEW */}
          {showSuccess && (
            <div className="text-center py-6">
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
                onClick={handleClose}
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-black text-sm uppercase hover:bg-green-700 transition-all"
              >
                Done
              </button>
            </div>
          )}

          {/* WITHDRAW FORM VIEW */}
          {!showSuccess && currentView === 'withdraw' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-2">
                <p className="text-green-900 font-bold text-sm">
                  Withdrawal Amount:{' '}
                  <span className="text-green-700 font-black">${selectedOrderAmount.toFixed(2)}</span>
                </p>
              </div>

              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wide">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={withdrawalForm.name}
                    onChange={(e) => setWithdrawalForm({ ...withdrawalForm, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm font-semibold"
                    placeholder="Enter account holder name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wide">
                    Account Number
                  </label>
                  <input
                    type="text"
                    required
                    value={withdrawalForm.accountNumber}
                    onChange={(e) => setWithdrawalForm({ ...withdrawalForm, accountNumber: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm font-semibold"
                    placeholder="Enter account number"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wide">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    required
                    value={withdrawalForm.bankName}
                    onChange={(e) => setWithdrawalForm({ ...withdrawalForm, bankName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm font-semibold"
                    placeholder="Enter bank name"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentView('main')}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-sm uppercase hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-black text-sm uppercase hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* COUPON CONFIRMATION VIEW */}
          {!showSuccess && currentView === 'coupon' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-5">
                <h3 className="text-gray-900 font-black text-lg mb-4 uppercase tracking-tight">
                  Coupon Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm font-semibold">Original Amount:</span>
                    <span className="text-gray-900 font-bold">${selectedOrderAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-orange-600">
                    <span className="text-sm font-semibold">Bonus (7%):</span>
                    <span className="font-bold">+${bonusAmount}</span>
                  </div>
                  <div className="border-t-2 border-orange-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 text-base font-black uppercase">Total Value:</span>
                      <span className="text-green-600 text-2xl font-black">${totalWithBonus}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-900 text-xs font-semibold text-center">
                  📧 Coupons will be sent to your registered email address
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCurrentView('main')}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-sm uppercase hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleCouponConfirm}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-black text-sm uppercase hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          )}

          {/* MAIN VIEW */}
          {!showSuccess && currentView === 'main' && (
            <div className="space-y-5">

              {/* PENDING ORDERS — pehle yeh dikhao agar action baaki hai */}
              {pendingOrders.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="text-amber-500 shrink-0" size={16} />
                    <p className="text-amber-700 text-xs font-black uppercase tracking-wide">
                      Action Required — {pendingOrders.length} order{pendingOrders.length > 1 ? 's' : ''} pending
                    </p>
                  </div>

                  <div className="space-y-3">
                    {pendingOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-amber-100 p-1.5 rounded-lg">
                              <Clock className="text-amber-600" size={16} />
                            </div>
                            <div>
                              <p className="text-amber-900 font-black text-sm uppercase">Order Accepted</p>
                              <p className="text-amber-700 text-xs font-bold">
                                Amount: ${order.amount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <span className="bg-amber-200 text-amber-800 text-[9px] font-black px-2 py-1 rounded-full uppercase">
                            Pending
                          </span>
                        </div>

                        <p className="text-amber-800 text-xs font-semibold mb-3">
                          Choose how you want to receive this amount:
                        </p>

                        <div className="flex gap-2">
                          <button
                            onClick={() => startWithdraw(order.id, order.amount)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white rounded-lg py-2.5 text-[11px] font-black uppercase hover:bg-green-700 transition-all"
                          >
                            <DollarSign size={13} />
                            Withdraw Cash
                          </button>
                          <button
                            onClick={() => startCoupon(order.id, order.amount)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 text-white rounded-lg py-2.5 text-[11px] font-black uppercase hover:bg-orange-600 transition-all"
                          >
                            <Gift size={13} />
                            Coupons +7%
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TRANSACTION HISTORY */}
              {(withdrawalHistory.length > 0 || couponHistory.length > 0) && (
                <div>
                  <p className="text-gray-500 text-xs font-black uppercase tracking-wide mb-3">
                    Transaction History
                  </p>
                  <div className="space-y-2">
                    {withdrawalHistory.map((w, i) => (
                      <div key={i} className="bg-green-50 border border-green-100 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-600 p-2 rounded-lg shrink-0">
                            <Clock className="text-white" size={16} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="text-green-900 font-black text-sm uppercase">
                                Withdrawal In Progress
                              </h4>
                              <span className="text-green-700 font-black text-sm">
                                ${w.amount?.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-green-700 text-xs mt-1">
                              {w.bankName} · {w.accountNumber}
                            </p>
                            <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                              <p className="text-blue-900 text-[10px] font-semibold text-center">
                                ⏱️ You will receive your amount within 48 hours
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {couponHistory.map((c, i) => (
                      <div key={i} className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-orange-500 p-2 rounded-lg shrink-0">
                            <Gift className="text-white" size={16} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="text-orange-900 font-black text-sm uppercase">
                                Coupons Claimed!
                              </h4>
                              <span className="text-green-600 font-black text-sm">
                                ${c.totalAmount?.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-orange-700 text-xs mt-1">
                              +7% Bonus: ${c.bonusAmount?.toFixed(2)}
                            </p>
                            <p className="text-orange-600 text-[10px] mt-1">
                              📧 Sent to your registered email
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EMPTY STATE */}
              {pendingOrders.length === 0 &&
                withdrawalHistory.length === 0 &&
                couponHistory.length === 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                    <Wallet className="text-gray-300 mx-auto mb-2" size={36} />
                    <p className="text-gray-500 text-sm font-bold">No transactions yet</p>
                    <p className="text-gray-400 text-xs mt-1 font-semibold">
                      Accept a bid from your cart to add funds to your wallet
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default WalletModal;