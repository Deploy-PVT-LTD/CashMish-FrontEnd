import React, { useState, useEffect } from 'react';
import { Trash2, Clock, DollarSign, Check, Smartphone, RefreshCw, X, Gift, Wallet, AlertCircle } from 'lucide-react';
import Header from './header.jsx';
import Swal from 'sweetalert2';
import { useWallet } from './Walletcontext';

const BASE_URL = 'http://localhost:5000';

// ── Accept Bid Popup ──────────────────────────────────────────────────────────
const AcceptPopup = ({ isOpen, onClose, bidPrice, onWithdraw, onCoupon }) => {
  if (!isOpen) return null;
  const bonus = (bidPrice * 0.07).toFixed(2);
  const withBonus = (bidPrice + parseFloat(bonus)).toFixed(2);
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" style={{ animation: 'popupIn 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-5 relative">
          <button onClick={onClose} className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"><X size={20} /></button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl"><Wallet className="text-white" size={24} /></div>
            <div>
              <h2 className="text-white font-black text-lg uppercase tracking-tight">Bid Accepted!</h2>
              <p className="text-green-100 text-xs font-semibold">Choose your payout method</p>
            </div>
          </div>
          <div className="mt-3 bg-white/10 rounded-xl p-3">
            <p className="text-white/80 text-[11px] font-bold uppercase mb-0.5">Amount Added to Wallet</p>
            <p className="text-white text-3xl font-black">${parseFloat(bidPrice).toFixed(2)}</p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-gray-600 text-xs font-bold text-center uppercase tracking-wide mb-4">How do you want to receive this?</p>
          <button onClick={onWithdraw} className="w-full group bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-green-500 hover:bg-green-50 transition-all flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-600 transition-colors"><DollarSign className="text-green-600 group-hover:text-white transition-colors" size={22} /></div>
            <div className="text-left flex-grow">
              <h3 className="text-gray-900 font-black text-base uppercase tracking-tight">Withdraw Cash</h3>
              <p className="text-gray-500 text-xs font-semibold mt-0.5">Receive in 48 hours to your bank</p>
            </div>
          </button>
          <button onClick={onCoupon} className="w-full group relative bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-4 hover:border-orange-400 hover:shadow-md transition-all flex items-center gap-4 overflow-hidden">
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">+7% Bonus</div>
            <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-orange-500 transition-colors"><Gift className="text-orange-600 group-hover:text-white transition-colors" size={22} /></div>
            <div className="text-left flex-grow">
              <h3 className="text-gray-900 font-black text-base uppercase tracking-tight">Get Coupons</h3>
              <p className="text-gray-600 text-xs font-semibold mt-0.5">Earn <span className="text-orange-600 font-black">${bonus} extra</span> — Total ${withBonus}</p>
            </div>
          </button>
          <button onClick={onClose} className="w-full text-gray-400 text-xs font-semibold py-2 hover:text-gray-600 transition-colors">Decide later from Wallet</button>
        </div>
      </div>
      <style>{`@keyframes popupIn { from { opacity: 0; transform: scale(0.85) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
};

// ── Withdraw Form Modal — calls POST /api/bank-details ────────────────────────
const WithdrawModal = ({ isOpen, onClose, amount, orderId, onSuccess }) => {
  const { withdrawCash } = useWallet();
  const [form, setForm] = useState({ name: '', accountNumber: '', bankName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (isOpen) { setForm({ name: '', accountNumber: '', bankName: '' }); setSubmitted(false); setApiError(''); }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.accountNumber || !form.bankName) return;
    setIsSubmitting(true);
    setApiError('');
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id || user.id;
      if (!userId) { setApiError('User not logged in. Please login first.'); setIsSubmitting(false); return; }

      const response = await fetch(`${BASE_URL}/api/bank-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
        body: JSON.stringify({ userId, accountHolderName: form.name, accountNumber: form.accountNumber, bankName: form.bankName, amount, orderId, status: 'pending' })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Server error: ${response.status}`);
      }

      withdrawCash(form, orderId);
      setSubmitted(true);
      setTimeout(() => { onSuccess?.(); }, 2000);
    } catch (err) {
      console.error('Bank details save error:', err);
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" style={{ animation: 'popupIn 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-5 relative">
          <button onClick={onClose} disabled={isSubmitting} className="absolute top-3 right-3 text-white/70 hover:text-white disabled:opacity-40 transition-colors"><X size={20} /></button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl"><DollarSign className="text-white" size={22} /></div>
            <div>
              <h2 className="text-white font-black text-lg uppercase tracking-tight">Withdraw Cash</h2>
              <p className="text-green-100 text-xs font-semibold">Amount: ${parseFloat(amount).toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          {submitted ? (
            <div className="text-center py-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="text-green-600" size={32} /></div>
              <h3 className="text-gray-900 font-black text-lg mb-2 uppercase">Request Submitted!</h3>
              <p className="text-gray-600 text-sm font-semibold mb-1">Aapko 48 hours ke andar paise receive ho jayenge.</p>
              <p className="text-gray-400 text-xs">Bank details saved successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {apiError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-red-700 text-xs font-semibold">{apiError}</p>
                </div>
              )}
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1.5 uppercase tracking-wide">Account Holder Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm font-semibold" placeholder="Enter account holder name" />
              </div>
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1.5 uppercase tracking-wide">Account Number</label>
                <input type="text" required value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm font-semibold" placeholder="Enter account number" />
              </div>
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1.5 uppercase tracking-wide">Bank Name</label>
                <input type="text" required value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm font-semibold" placeholder="Enter bank name" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-sm uppercase hover:bg-gray-50 transition-all disabled:opacity-50">Back</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-black text-sm uppercase hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isSubmitting ? <><RefreshCw size={16} className="animate-spin" /> Saving...</> : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Coupon Confirm Modal ──────────────────────────────────────────────────────
const CouponModal = ({ isOpen, onClose, amount, orderId, onSuccess }) => {
  const { getCoupons, isProcessing } = useWallet();
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { if (isOpen) setSubmitted(false); }, [isOpen]);
  if (!isOpen) return null;
  const bonus = (amount * 0.07).toFixed(2);
  const total = (amount + parseFloat(bonus)).toFixed(2);
  const handleConfirm = () => { getCoupons(orderId); setSubmitted(true); setTimeout(() => { onSuccess?.(); }, 1500); };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" style={{ animation: 'popupIn 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 relative">
          <button onClick={onClose} disabled={isProcessing} className="absolute top-3 right-3 text-white/70 hover:text-white disabled:opacity-40"><X size={20} /></button>
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
                <div className="flex justify-between"><span className="text-gray-600 text-sm font-semibold">Original Amount:</span><span className="text-gray-900 font-bold">${parseFloat(amount).toFixed(2)}</span></div>
                <div className="flex justify-between text-orange-600"><span className="text-sm font-semibold">7% Bonus:</span><span className="font-bold">+${bonus}</span></div>
                <div className="border-t-2 border-orange-200 pt-2"><div className="flex justify-between"><span className="text-gray-900 font-black uppercase">Total Value:</span><span className="text-green-600 text-xl font-black">${total}</span></div></div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3"><p className="text-blue-900 text-xs font-semibold text-center">📧 Coupons will be sent to your registered email</p></div>
              <div className="flex gap-3">
                <button onClick={onClose} disabled={isProcessing} className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-sm uppercase hover:bg-gray-50 transition-all disabled:opacity-50">Back</button>
                <button onClick={handleConfirm} disabled={isProcessing} className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-black text-sm uppercase hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50">{isProcessing ? 'Processing...' : 'Confirm'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Cart ─────────────────────────────────────────────────────────────────
const MobileCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingOrders, setProcessingOrders] = useState(new Set());
  const { addToWallet, walletBalance, pendingOrders } = useWallet();
  const [acceptPopup, setAcceptPopup] = useState({ open: false, orderId: null, bidPrice: 0 });
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
    } catch (error) { console.error('❌ Cart Load Error:', error); }
    setLoading(false);
  };

  const transformForms = (forms) => forms.map(form => ({
    id: form._id || form.id,
    brand: form.mobileId?.brand || form.brand || 'N/A',
    name: form.mobileId?.phoneModel || form.phoneModel || form.name || 'N/A',
    storage: form.storage,
    condition: form.screenCondition || form.condition,
    uploadDate: form.pickUpDetails?.pickUpDate ? new Date(form.pickUpDetails.pickUpDate).toLocaleDateString() : 'N/A',
    status: String(form.status || 'pending').toLowerCase(),
    address: form.pickUpDetails?.address?.addressText || form.address || 'N/A',
    bidPrice: parseFloat(form.bidPrice) || 0,
    modelImage: form.mobileId?.image || form.image || null
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
    // Step 1: Status update karo
    const updateRes = await fetch(`${BASE_URL}/api/forms/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` // Token hamesha bhejein
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!updateRes.ok) throw new Error('Failed to update status');
    
    const responseData = await updateRes.json();
    // Backend se updated form ka data lo
    const updatedForm = responseData.form || responseData;

    // Instant UI update
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));

    if (newStatus === 'accepted') {
      // Direct updatedForm se price uthao, dobara fetch karne ki zaroorat nahi
      const freshBidPrice = parseFloat(updatedForm.bidPrice) || 0;

      if (freshBidPrice > 0) {
        // Context Update
        addToWallet(freshBidPrice, id);
        
        // Popup dikhao
        setAcceptPopup({ 
          open: true, 
          orderId: id, 
          bidPrice: freshBidPrice 
        });
        
        // Wallet state ko DB se sync karne ke liye refresh trigger karein
        if (typeof fetchAndUpdateBalance === 'function') {
           fetchAndUpdateBalance();
        }
      }
    } else if (newStatus === 'rejected') {
      Swal.fire({ icon: 'success', title: 'Order Rejected', showConfirmButton: false, timer: 1500 });
    }

    // List refresh karein
    loadUserCart();

  } catch (e) {
    console.error('Update Status Error:', e);
    // Yahan alert change kar diya taaki user ko pata chale exact error
    Swal.fire('Connection Error', 'Server se connect nahi ho pa raha. Check if Backend is running at ' + BASE_URL, 'error');
  } finally {
    setProcessingOrders(prev => { 
      const s = new Set(prev); 
      s.delete(id); 
      return s; 
    });
  }
};
  const handlePopupWithdraw = () => { const { orderId, bidPrice } = acceptPopup; setAcceptPopup({ open: false, orderId: null, bidPrice: 0 }); setWithdrawModal({ open: true, orderId, amount: bidPrice }); };
  const handlePopupCoupon = () => { const { orderId, bidPrice } = acceptPopup; setAcceptPopup({ open: false, orderId: null, bidPrice: 0 }); setCouponModal({ open: true, orderId, amount: bidPrice }); };
  const handleWithdrawSuccess = () => setWithdrawModal({ open: false, orderId: null, amount: 0 });
  const handleCouponSuccess = () => setCouponModal({ open: false, orderId: null, amount: 0 });

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-10 font-sans">
      <Header />
      <AcceptPopup isOpen={acceptPopup.open} onClose={() => setAcceptPopup({ open: false, orderId: null, bidPrice: 0 })} bidPrice={acceptPopup.bidPrice} onWithdraw={handlePopupWithdraw} onCoupon={handlePopupCoupon} />
      <WithdrawModal isOpen={withdrawModal.open} onClose={() => setWithdrawModal({ open: false, orderId: null, amount: 0 })} amount={withdrawModal.amount} orderId={withdrawModal.orderId} onSuccess={handleWithdrawSuccess} />
      <CouponModal isOpen={couponModal.open} onClose={() => setCouponModal({ open: false, orderId: null, amount: 0 })} amount={couponModal.amount} orderId={couponModal.orderId} onSuccess={handleCouponSuccess} />

      <div className="max-w-4xl mx-auto p-3 md:p-6">
        <div className="flex justify-between items-center mb-6 px-2">
          <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">Orders Tracking</h1>
          <button onClick={loadUserCart} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all" disabled={loading}><RefreshCw size={18} className={loading ? 'animate-spin' : ''} /></button>
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
              
             <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openWallet'))} 
            className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-black uppercase hover:bg-green-700 transition-all"
          >
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
              const isAccepted = item.status === 'accepted';
              const hasBid = item.bidPrice > 0;
              const isItemProcessing = processingOrders.has(item.id);
              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 transition-all duration-300">
                  <div className="p-4 md:p-5 flex flex-col md:flex-row gap-5 items-center md:items-start">
                    <div className="group w-28 h-28 md:w-32 md:h-32 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-50 shrink-0 shadow-inner relative overflow-hidden">
                      {item.modelImage ? (
                        <img src={getImageUrl(item.modelImage)} className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110" alt="model" onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Phone'; }} />
                      ) : <Smartphone className="text-gray-200" size={30} />}
                    </div>
                    <div className="flex-grow w-full text-center md:text-left">
                      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-2 mb-3">
                        <div>
                          <h3 className="text-lg font-black text-gray-800 leading-none uppercase tracking-tight">{item.brand} {item.name}</h3>
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
                      {hasBid && !isRejected ? (
                        <div className={`rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-4 ${isAccepted ? 'bg-green-50/50' : 'bg-blue-50'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${isAccepted ? 'bg-green-100 text-green-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-100'}`}><DollarSign size={18} strokeWidth={2.5} /></div>
                            <div className="text-left">
                              <p className="text-[10px] font-bold uppercase text-gray-400 leading-none mb-1">Final Price Offer</p>
                              <p className={`text-2xl font-black ${isAccepted ? 'text-green-700' : 'text-blue-700'}`}>${item.bidPrice}</p>
                            </div>
                          </div>
                          {isAccepted ? (
                            <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">✓ Bid Accepted</div>
                          ) : (
                            <div className="flex gap-3 w-full md:w-auto">
                              <button onClick={() => handleUpdateStatus(item.id, 'accepted')} disabled={isItemProcessing} className="flex-1 md:px-6 py-2.5 bg-green-600 text-white text-[11px] font-black uppercase rounded-xl hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
                                {isItemProcessing ? <><RefreshCw size={16} className="animate-spin" /> Processing...</> : <><Check size={16} strokeWidth={3} /> Accept Bid</>}
                              </button>
                              <button onClick={() => handleUpdateStatus(item.id, 'rejected')} disabled={isItemProcessing} className="flex-1 md:px-6 py-2.5 bg-white border-2 border-red-50 text-red-500 text-[11px] font-black uppercase rounded-xl hover:bg-red-50 active:scale-95 transition-all tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">Reject</button>
                            </div>
                          )}
                        </div>
                      ) : isRejected ? (
                        <div className="bg-red-50 p-4 rounded-2xl border border-red-100"><p className="text-red-600 text-xs font-black uppercase">✗ Bid Declined / Order Cancelled</p></div>
                      ) : (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl p-4 bg-amber-50 border border-amber-100/50">
                          <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-2 rounded-lg"><Clock className="text-amber-600" size={18} /></div>
                            <p className="text-xs font-bold text-amber-800 tracking-tight">Awaiting Admin Verification & Price Offer</p>
                          </div>
                          <button onClick={() => handleCancelOrder(item.id)} className="w-full md:w-auto px-5 py-2.5 bg-white border border-red-100 text-red-500 text-[10px] font-black uppercase rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2">
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
  const statusMap = { pending: { bg: 'bg-orange-100', text: 'text-orange-600', label: 'Pending' }, accepted: { bg: 'bg-green-100', text: 'text-green-600', label: 'Accepted' }, rejected: { bg: 'bg-red-100', text: 'text-red-600', label: 'Rejected' }, bid_received: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Bid Received' }, 'bid-placed': { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Bid Placed' } };
  const s = statusMap[status] || statusMap.pending;
  return <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${s.bg} ${s.text} border border-white/50 shadow-sm`}>{s.label}</span>;
};

export default MobileCart;