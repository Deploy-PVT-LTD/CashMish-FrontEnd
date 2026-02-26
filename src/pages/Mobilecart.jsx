import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Landmark, Zap, ArrowLeft, Clock, DollarSign, Check, Smartphone, RefreshCw, X, Gift, Wallet, AlertCircle } from 'lucide-react';
import Header from '../components/layout/header.jsx';
import Swal from 'sweetalert2';
import { useWallet } from '../contexts/Walletcontext';
import { BASE_URL } from '../lib/api';

// 鈹€鈹€鈹€ Accept Bid Popup 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
const AcceptPopup = ({ isOpen, onClose, amount, onWithdraw, onCoupon }) => {
  if (!isOpen) return null;
  const price = parseFloat(amount) || 0;
  const bonus = (price * 0.07).toFixed(2);
  const withBonus = (price + parseFloat(bonus)).toFixed(2);
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" style={{ animation: 'popupIn 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-5 relative">
          <button onClick={onClose} className="absolute top-3 right-3 text-white/70 hover:text-white cursor-pointer"><X size={20} /></button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl"><Wallet className="text-white" size={24} /></div>
            <div>
              <h2 className="text-white font-black text-lg uppercase tracking-tight">Your Wallet</h2>
              <p className="text-green-100 text-xs font-semibold">Choose your payout method</p>
            </div>
          </div>
          <div className="mt-3 bg-white/10 rounded-xl p-3">
            <p className="text-white/80 text-[11px] font-bold uppercase mb-0.5">Amount in Wallet</p>
            <p className="text-white text-3xl font-black">${price.toFixed(2)}</p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-gray-600 text-xs font-bold text-center uppercase tracking-wide mb-4">How do you want to receive this?</p>
          <button onClick={onWithdraw} className="w-full group bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-green-500 hover:bg-green-50 transition-all flex items-center gap-4 cursor-pointer">
            <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-600 transition-colors"><DollarSign className="text-green-600 group-hover:text-white transition-colors" size={22} /></div>
            <div className="text-left flex-grow">
              <h3 className="text-gray-900 font-black text-base uppercase tracking-tight cursor-pointer">Withdraw Cash</h3>
              <p className="text-gray-500 text-xs font-semibold mt-0.5">Receive in 48 hours to your bank</p>
            </div>
          </button>
        </div>
      </div>
      <style>{`@keyframes popupIn { from { opacity: 0; transform: scale(0.85) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
};

// 鈹€鈹€鈹€ Withdraw Form Modal 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
const WithdrawModal = ({ isOpen, onClose, amount, orderId, onSuccess }) => {
  const { withdrawCash, clearWalletAfterPayout, setWalletBalance } = useWallet();
  const [step, setStep] = useState('select'); // 'select' | 'form' | 'success'
  const [payoutMethod, setPayoutMethod] = useState(''); // 'bank' | 'zelle'
  const [form, setForm] = useState({ name: '', accountNumber: '', bankName: '', zelleContact: '', zelleContactType: 'email' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setPayoutMethod('');
      setForm({ name: '', accountNumber: '', bankName: '', zelleContact: '', zelleContactType: 'email' });
      setApiError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    if (payoutMethod === 'bank' && (!form.accountNumber || !form.bankName)) return;
    if (payoutMethod === 'zelle' && !form.zelleContact) return;

    setIsSubmitting(true);
    setApiError('');
    try {
      const result = await withdrawCash({ ...form, payoutMethod }, amount);
      if (result.success) {
        clearWalletAfterPayout(orderId);
        setStep('success');
        setTimeout(() => { onSuccess?.(); }, 2000);
      } else {
        setApiError(result.error || 'Withdrawal failed');
      }
    } catch (err) {
      setApiError(err.message || 'Something went wrong.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" style={{ animation: 'popupIn 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-5 relative">
          <button onClick={onClose} disabled={isSubmitting} className="absolute top-3 right-3 text-white/70 hover:text-white disabled:opacity-40 cursor-pointer"><X size={20} /></button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl"><DollarSign className="text-white" size={22} /></div>
            <div>
              <h2 className="text-white font-black text-lg uppercase tracking-tight">Withdraw Cash</h2>
              <p className="text-green-100 text-xs font-semibold">Amount: ${parseFloat(amount || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* Step 1: Method Selection */}
          {step === 'select' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm font-semibold text-center">Choose your payout method</p>
              <div className="grid grid-cols-2 gap-3">
                {/* Zelle FIRST */}
                <button
                  onClick={() => { setPayoutMethod('zelle'); setStep('form'); }}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group"
                >
                  <div className="bg-purple-100 group-hover:bg-purple-200 p-3 rounded-full transition-colors">
                    <Zap className="text-purple-600" size={24} />
                  </div>
                  <span className="text-sm font-bold text-gray-800">Zelle</span>
                </button>
                {/* Bank SECOND */}
                <button
                  onClick={() => { setPayoutMethod('bank'); setStep('form'); }}
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

          {/* Step 2: Form (Bank or Zelle) */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Method Badge + Back */}
              <div className="flex items-center gap-2 mb-1">
                <button type="button" onClick={() => setStep('select')} className="text-gray-400 hover:text-gray-600 cursor-pointer"><ArrowLeft size={18} /></button>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${payoutMethod === 'bank' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {payoutMethod === 'bank' ? 'Bank Account' : 'Zelle'}
                </span>
              </div>

              {apiError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-red-700 text-xs font-semibold break-words">{apiError}</p>
                </div>
              )}

              {/* Name (common) */}
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

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep('select')} disabled={isSubmitting} className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-sm uppercase hover:bg-gray-50 disabled:opacity-50 cursor-pointer">Back</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-black text-sm uppercase hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                  {isSubmitting ? <><RefreshCw size={16} className="animate-spin" /> Saving...</> : 'Submit'}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center py-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="text-green-600" size={32} /></div>
              <h3 className="text-gray-900 font-black text-lg mb-2 uppercase">Request Submitted!</h3>
              <p className="text-gray-600 text-sm font-semibold mb-1">You will receive payment within 48 hours.</p>
              <p className="text-gray-400 text-xs">
                {payoutMethod === 'bank' ? 'Bank details saved successfully.' : 'Zelle details saved successfully.'}
              </p>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes popupIn { from { opacity: 0; transform: scale(0.85) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
};

// 鈹€鈹€鈹€ Coupon Modal 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
const CouponModal = ({ isOpen, onClose, amount, orderId, onSuccess }) => {
  const { clearWalletAfterPayout, setWalletBalance } = useWallet();
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { if (isOpen) setSubmitted(false); }, [isOpen]);
  if (!isOpen) return null;
  const price = parseFloat(amount || 0);
  const bonus = (price * 0.07).toFixed(2);
  const total = (price + parseFloat(bonus)).toFixed(2);

  const handleConfirm = () => {
    if (typeof clearWalletAfterPayout === 'function') {
      clearWalletAfterPayout(orderId);
    } else {
      setWalletBalance(0);
      localStorage.setItem('walletBalance', '0');
    }
    setSubmitted(true);
    setTimeout(() => { onSuccess?.(); }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" style={{ animation: 'popupIn 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 relative">
          <button onClick={onClose} className="absolute top-3 right-3 text-white/70 hover:text-white cursor-pointer"><X size={20} /></button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl"><Gift className="text-white" size={22} /></div>
            <div><h2 className="text-white font-black text-lg uppercase">Get Coupons</h2><p className="text-orange-100 text-xs font-semibold">+7% Bonus on your amount</p></div>
          </div>
        </div>
        <div className="p-5">
          {submitted ? (
            <div className="text-center py-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Gift className="text-orange-500" size={32} /></div>
              <h3 className="text-gray-900 font-black text-lg mb-2 uppercase">Coupons Claimed!</h3>
              <p className="text-gray-600 text-sm font-semibold">Coupons sent to your registered email.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-4 space-y-2">
                <div className="flex justify-between"><span className="text-gray-600 text-sm font-semibold">Original Amount:</span><span className="text-gray-900 font-bold">${price.toFixed(2)}</span></div>
                <div className="flex justify-between text-orange-600"><span className="text-sm font-semibold">7% Bonus:</span><span className="font-bold">+${bonus}</span></div>
                <div className="border-t-2 border-orange-200 pt-2"><div className="flex justify-between"><span className="text-gray-900 font-black uppercase">Total Value:</span><span className="text-green-600 text-xl font-black">${total}</span></div></div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3"><p className="text-blue-900 text-xs font-semibold text-center">馃摟 Coupons will be sent to your registered email</p></div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-sm uppercase hover:bg-gray-50 cursor-pointer">Back</button>
                <button onClick={handleConfirm} className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-black text-sm uppercase cursor-pointer">Confirm</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes popupIn { from { opacity: 0; transform: scale(0.85) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
};

// 鈹€鈹€鈹€ Main Cart 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
const MobileCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingOrders, setProcessingOrders] = useState(new Set());
  const { walletBalance, addToWallet } = useWallet();

  const [acceptPopup, setAcceptPopup] = useState({ open: false, orderId: null, amount: 0 });
  const [withdrawModal, setWithdrawModal] = useState({ open: false, orderId: null, amount: 0 });
  const [couponModal, setCouponModal] = useState({ open: false, orderId: null, amount: 0 });

  const loadUserCart = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id || user.id;
    const guestOrderIds = JSON.parse(localStorage.getItem('myGuestOrders') || '[]');
    try {
      const response = await fetch(`${BASE_URL}/api/forms`);
      if (response.ok) {
        const data = await response.json();
        const allForms = data.forms || data;
        let myForms = [];
        if (token && userId) {
          myForms = allForms.filter(f => { const fUserId = f.userId?._id || f.userId; return fUserId && fUserId.toString() === userId.toString(); });
        } else {
          myForms = allForms.filter(f => guestOrderIds.includes(f._id));
        }
        const sorted = myForms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCartItems(transformForms(sorted));
        const activeCount = myForms.filter(f => f.status !== 'accepted' && f.status !== 'rejected').length;
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: activeCount }));
      }
    } catch (err) { console.error('Cart Load Error:', err); }
    setLoading(false);
  };

  const transformForms = (forms) => forms.map(form => ({
    id: form._id || form.id,
    brand: form.mobileId?.brand || form.brand || 'N/A',
    name: form.mobileId?.phoneModel || form.phoneModel || form.name || 'N/A',
    storage: form.storage,
    condition: form.screenCondition || form.condition,
    uploadDate: form.pickUpDetails?.pickUpDate ? new Date(form.pickUpDetails.pickUpDate).toLocaleDateString() : 'N/A',
    status: form.isDeleted ? 'cancelled' : String(form.status || 'pending').toLowerCase(),
    address: form.pickUpDetails?.address?.addressText || form.address || 'N/A',
    bidPrice: parseFloat(form.bidPrice) || 0,
    modelImage: form.mobileId?.image || form.image || null,
    isDeleted: form.isDeleted || false
  }));

  useEffect(() => { loadUserCart(); }, []);

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    let path = img.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\/+/, '');
    return path.includes('uploads/') ? `${BASE_URL}/${path}` : `${BASE_URL}/uploads/${path}`;
  };

  const handleCancelOrder = async (id) => {
    const result = await Swal.fire({ title: 'Are you sure?', text: 'This will permanently remove the order.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, cancel it!' });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/forms/${id}`, { method: 'DELETE', headers: { ...(token && { 'Authorization': `Bearer ${token}` }) } });
        if (response.ok) {
          const guestOrders = JSON.parse(localStorage.getItem('myGuestOrders') || '[]');
          localStorage.setItem('myGuestOrders', JSON.stringify(guestOrders.filter(oid => oid !== id)));
          Swal.fire('Deleted!', 'Order cancelled.', 'success');
          loadUserCart();
        }
      } catch { Swal.fire('Error', 'Failed to cancel.', 'error'); }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    if (processingOrders.has(id)) return;
    setProcessingOrders(prev => new Set(prev).add(id));
    const token = localStorage.getItem('token');
    try {
      const updateRes = await fetch(`${BASE_URL}/api/forms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (!updateRes.ok) throw new Error('Failed to update status');
      const responseData = await updateRes.json();
      const updatedForm = responseData.form || responseData;

      setCartItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));

      // ✔ Clear processing BEFORE loadUserCart so button stops spinning instantly
      setProcessingOrders(prev => { const s = new Set(prev); s.delete(id); return s; });

      if (newStatus === 'accepted') {
        const freshBidPrice = parseFloat(updatedForm.bidPrice) || 0;
        if (freshBidPrice > 0) {
          addToWallet(freshBidPrice);
          setAcceptPopup({ open: true, orderId: id, amount: freshBidPrice });
        }
      } else if (newStatus === 'rejected') {
        Swal.fire({ icon: 'success', title: 'Order Rejected', showConfirmButton: false, timer: 1500 });
      }
      loadUserCart();
    } catch (e) {
      Swal.fire('Connection Error', `Backend check karo: ${BASE_URL}`, 'error');
      setProcessingOrders(prev => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const handleOpenWalletPopup = useCallback(() => {
    if (walletBalance > 0) {
      const acceptedItem = cartItems.find(item => item.status === 'accepted' && item.bidPrice > 0);
      setAcceptPopup({ open: true, orderId: acceptedItem?.id || null, amount: walletBalance });
    }
  }, [cartItems, walletBalance]);

  useEffect(() => {
    const handler = () => handleOpenWalletPopup();
    window.addEventListener('openWallet', handler);
    return () => window.removeEventListener('openWallet', handler);
  }, [handleOpenWalletPopup]);

  const handlePopupWithdraw = () => {
    const { orderId, amount } = acceptPopup;
    setAcceptPopup({ open: false, orderId: null, amount: 0 });
    setWithdrawModal({ open: true, orderId, amount });
  };
  const handlePopupCoupon = () => {
    const { orderId, amount } = acceptPopup;
    setAcceptPopup({ open: false, orderId: null, amount: 0 });
    setCouponModal({ open: true, orderId, amount });
  };
  const handleWithdrawSuccess = () => setWithdrawModal({ open: false, orderId: null, amount: 0 });
  const handleCouponSuccess = () => setCouponModal({ open: false, orderId: null, amount: 0 });

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-10 font-sans">
      <Header />
      <AcceptPopup isOpen={acceptPopup.open} onClose={() => setAcceptPopup({ open: false, orderId: null, amount: 0 })} amount={acceptPopup.amount} onWithdraw={handlePopupWithdraw} onCoupon={handlePopupCoupon} />
      <WithdrawModal isOpen={withdrawModal.open} onClose={() => setWithdrawModal({ open: false, orderId: null, amount: 0 })} amount={withdrawModal.amount} orderId={withdrawModal.orderId} onSuccess={handleWithdrawSuccess} />
      <CouponModal isOpen={couponModal.open} onClose={() => setCouponModal({ open: false, orderId: null, amount: 0 })} amount={couponModal.amount} orderId={couponModal.orderId} onSuccess={handleCouponSuccess} />

      <div className="max-w-4xl mx-auto p-3 md:p-6">
        <div className="flex justify-between items-center mb-6 px-2">
          <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">Orders Tracking</h1>
          <button onClick={loadUserCart} className="cursor-pointer text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all" disabled={loading}><RefreshCw size={18} className={loading ? 'animate-spin' : ''} /></button>
        </div>

        {walletBalance > 0 && (
          <div className="mb-4 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 text-white p-2.5 rounded-xl"><DollarSign size={20} strokeWidth={2.5} /></div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-green-700 mb-0.5">Current Wallet Balance</p>
                  <p className="text-2xl font-black text-green-800">${walletBalance.toFixed(2)}</p>
                </div>
              </div>
              <button onClick={handleOpenWalletPopup} className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-black uppercase hover:bg-green-700 transition-all cursor-pointer">
                View Wallet
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {cartItems.length === 0 && !loading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <Smartphone className="mx-auto text-gray-200 mb-2" size={48} />
              <p className="text-gray-400 font-bold uppercase text-xs">No orders found</p>
            </div>
          ) : loading ? (
            <div className="text-center py-20"><RefreshCw className="animate-spin mx-auto text-blue-600 mb-2" size={32} /></div>
          ) : (
            cartItems.map((item) => {
              const isRejected = item.status === 'rejected';
              const isAccepted = item.status === 'accepted' || item.status === 'paid';
              const isPaid = item.status === 'paid';
              const hasBid = item.bidPrice > 0;
              const isCancelled = item.isDeleted;
              const isItemProcessing = processingOrders.has(item.id);
              return (
                <div key={item.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${isCancelled ? 'opacity-60 grayscale border-gray-200' : 'hover:border-blue-200 border-gray-100'}`}>
                  <div className="p-4 md:p-5 flex flex-col md:flex-row gap-5 items-center md:items-start">
                    <div className="group w-28 h-28 md:w-32 md:h-32 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-50 shrink-0 shadow-inner relative overflow-hidden">
                      {item.modelImage ? (
                        <img src={getImageUrl(item.modelImage)} className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110" alt="model" onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Phone'; }} />
                      ) : <Smartphone className="text-gray-200" size={30} />}
                    </div>
                    <div className="flex-grow w-full text-center md:text-left">
                      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-2 mb-3">
                        <div>
                          <h3 className={`text-lg font-black leading-none uppercase tracking-tight ${isCancelled ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{item.brand} {item.name}</h3>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Requested on {item.uploadDate}</p>
                        </div>
                        <Badge status={item.status} />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        <MiniBox label="Storage" value={item.storage} />
                        <MiniBox label="Condition" value={item.condition} />
                        <div className="col-span-2 bg-gray-50 px-3 py-2 rounded-lg text-left border border-gray-100/50">
                          <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Pickup Address</p>
                          <p className="text-xs font-semibold text-gray-600 truncate">{item.address}</p>
                        </div>
                      </div>

                      {isCancelled ? (
                        <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200 flex items-center justify-center gap-2">
                          <X size={16} className="text-gray-500" />
                          <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase text-center">Request Cancelled</p>
                        </div>
                      ) : hasBid && !isRejected ? (
                        <div className={`rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-4 ${isAccepted ? 'bg-green-50/50' : 'bg-blue-50'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${isAccepted ? 'bg-green-100 text-green-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-100'}`}><DollarSign size={18} strokeWidth={2.5} /></div>
                            <div className="text-left">
                              <p className="text-[10px] font-bold uppercase text-gray-400 leading-none mb-1">Final Price Offer</p>
                              <p className={`text-2xl font-black ${isAccepted ? 'text-green-700' : 'text-blue-700'}`}>${item.bidPrice}</p>
                            </div>
                          </div>
                          {isPaid ? (
                            <div className="bg-green-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-700 shadow-sm flex items-center gap-2">
                              <Check size={14} strokeWidth={3} /> Finalized
                            </div>
                          ) : isAccepted ? (
                            <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">✅ Bid Accepted</div>
                          ) : (
                            <div className="flex gap-3 w-full md:w-auto">
                              <button onClick={() => handleUpdateStatus(item.id, 'accepted')} disabled={isItemProcessing} className="flex-1 md:px-6 py-2.5 bg-green-600 text-white text-[11px] font-black uppercase rounded-xl hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                {isItemProcessing ? <><RefreshCw size={16} className="animate-spin" /> Processing...</> : <><Check size={16} strokeWidth={3} /> Accept Bid</>}
                              </button>
                              <button onClick={() => handleUpdateStatus(item.id, 'rejected')} disabled={isItemProcessing} className="flex-1 md:px-6 py-2.5 bg-white border-2 border-red-50 text-red-500 text-[11px] font-black uppercase rounded-xl hover:bg-red-50 active:scale-95 transition-all tracking-wider disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">Reject</button>
                            </div>
                          )}
                        </div>
                      ) : isRejected ? (
                        <div className="bg-red-50 p-4 rounded-2xl border border-red-100"><p className="text-red-600 text-xs font-black uppercase text-center md:text-left">❌ Bid Declined / Order Cancelled</p></div>
                      ) : (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl p-4 bg-amber-50 border border-amber-100/50">
                          <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-2 rounded-lg"><Clock className="text-amber-600" size={18} /></div>
                            <p className="text-xs font-bold text-amber-800 tracking-tight">Awaiting Admin Verification & Price Offer</p>
                          </div>
                          <button onClick={() => handleCancelOrder(item.id)} className="cursor-pointer w-full md:w-auto px-5 py-2.5 bg-white border border-red-100 text-red-500 text-[10px] font-black uppercase rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                            <Trash2 size={14} /> Cancel Request
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const MiniBox = ({ label, value }) => (
  <div className="bg-gray-50 px-3 py-2 rounded-lg text-left border border-gray-100/50 hover:bg-white transition-colors">
    <p className="text-[9px] text-gray-400 font-bold uppercase leading-none mb-1">{label}</p>
    <p className="text-xs font-bold text-gray-700">{value || 'N/A'}</p>
  </div>
);

const Badge = ({ status }) => {
  const statusMap = {
    pending: { bg: 'bg-orange-100', text: 'text-orange-600', label: 'Pending' },
    accepted: { bg: 'bg-green-100', text: 'text-green-600', label: 'Accepted' },
    paid: { bg: 'bg-green-600', text: 'text-white', label: 'Finalized' },
    rejected: { bg: 'bg-red-100', text: 'text-red-600', label: 'Rejected' },
    bid_received: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Bid Received' },
    'bid-placed': { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Bid Placed' },
    cancelled: { bg: 'bg-gray-200', text: 'text-gray-600', label: 'Cancelled' }
  };
  const s = statusMap[status] || statusMap.pending;
  return <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${s.bg} ${s.text} border border-white/50 shadow-sm`}>{s.label}</span>;
};

export default MobileCart;