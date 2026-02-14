import React, { useState, useEffect } from 'react';
import { Trash2, Clock, DollarSign, Check, Smartphone, RefreshCw } from 'lucide-react';
import Header from '../components/header.jsx';
import Swal from 'sweetalert2';

const MobileCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = 'http://localhost:5000';

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
          myForms = allForms.filter(f => {
            const fUserId = f.userId?._id || f.userId;
            return fUserId && fUserId.toString() === userId.toString();
          });
        } else {
          myForms = allForms.filter(f => guestOrderIds.includes(f._id));
        }

        const sorted = myForms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCartItems(transformForms(sorted));

        // ✅ SIRF ACTIVE ORDERS GINEIN (Accepted/Rejected ko nikaal kar)
        const activeCount = myForms.filter(f => 
          f.status !== 'accepted' && f.status !== 'rejected'
        ).length;

        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: activeCount }));
      }
    } catch (error) {
      console.error("❌ Cart Load Error:", error);
    }
    setLoading(false);
  };

  const transformForms = (forms) => {
    return forms.map(form => ({
      id: form._id || form.id,
      brand: form.mobileId?.brand || form.brand || 'N/A',
      name: form.mobileId?.phoneModel || form.phoneModel || form.name || 'N/A',
      storage: form.storage,
      condition: form.screenCondition || form.condition,
      uploadDate: form.pickUpDetails?.pickUpDate ? 
        new Date(form.pickUpDetails.pickUpDate).toLocaleDateString() : 
        'N/A',
      status: String(form.status || 'pending').toLowerCase(),
      address: form.pickUpDetails?.address?.addressText || form.address || 'N/A',
      bidPrice: parseFloat(form.bidPrice) || 0,
      modelImage: form.mobileId?.image || form.image || null 
    }));
  };

  useEffect(() => {
    loadUserCart();
  }, []);

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    let path = img.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\/+/, '');
    return path.includes('uploads/') ? `${BASE_URL}/${path}` : `${BASE_URL}/uploads/${path}`;
  };

  const handleCancelOrder = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently remove the order.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/forms/${id}`, {
          method: 'DELETE',
          headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
        });

        if (response.ok) {
          const guestOrders = JSON.parse(localStorage.getItem('myGuestOrders') || '[]');
          localStorage.setItem('myGuestOrders', JSON.stringify(guestOrders.filter(oid => oid !== id)));
          Swal.fire('Deleted!', 'Order cancelled.', 'success');
          loadUserCart();
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to cancel.', 'error');
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}/api/forms/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          ...(token && { 'Authorization': `Bearer ${token}` }) 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        Swal.fire({ icon: 'success', title: `Bid ${newStatus}`, showConfirmButton: false, timer: 1500 });
        loadUserCart();
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-10 font-sans">
      <Header />
      <div className="max-w-4xl mx-auto p-3 md:p-6">
        <div className="flex justify-between items-center mb-6 px-2">
          <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">Orders Tracking</h1>
          <button onClick={loadUserCart} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all" disabled={loading}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        
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
              const displayImg = item.modelImage;
              const isRejected = item.status === 'rejected';
              const isAccepted = item.status === 'accepted';
              const hasBid = item.bidPrice > 0;

              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 transition-all duration-300">
                  <div className="p-4 md:p-5 flex flex-col md:flex-row gap-5 items-center md:items-start">
                    
                    {/* Image Section with Pop-up Effect */}
                    <div className="group w-28 h-28 md:w-32 md:h-32 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-50 shrink-0 shadow-inner relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-100">
                      {displayImg ? (
                        <img 
                          src={getImageUrl(displayImg)} 
                          className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2" 
                          alt="model"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=Phone"; }}
                        />
                      ) : (
                        <Smartphone className="text-gray-200 group-hover:scale-110 transition-transform" size={30} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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

                      {hasBid ? (
                        <div className={`rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-4 ${isRejected ? 'bg-red-50/50' : isAccepted ? 'bg-green-50/50' : 'bg-blue-50'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${isRejected ? 'bg-red-100 text-red-600' : isAccepted ? 'bg-green-100 text-green-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-100'}`}>
                              <DollarSign size={18} strokeWidth={2.5} />
                            </div>
                            <div className="text-left">
                              <p className="text-[10px] font-bold uppercase text-gray-400 leading-none mb-1">Final Price Offer</p>
                              <p className={`text-2xl font-black ${isRejected ? 'text-red-400 line-through' : isAccepted ? 'text-green-700' : 'text-blue-700'}`}>
                                ${item.bidPrice}
                              </p>
                            </div>
                          </div>

                          {!isAccepted && !isRejected && (
                            <div className="flex gap-3 w-full md:w-auto">
                              <button 
                                onClick={() => handleUpdateStatus(item.id, 'accepted')} 
                                className="flex-1 md:px-6 py-2.5 bg-green-600 text-white text-[11px] font-black uppercase rounded-xl hover:bg-green-700 hover:shadow-lg hover:shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-2 tracking-wider"
                              >
                                <Check size={16} strokeWidth={3}/> Accept Bid
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(item.id, 'rejected')} 
                                className="flex-1 md:px-6 py-2.5 bg-white border-2 border-red-50 text-red-500 text-[11px] font-black uppercase rounded-xl hover:bg-red-50 hover:border-red-100 active:scale-95 transition-all tracking-wider"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {isAccepted && <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200 animate-pulse">✓ Bid Accepted</div>}
                          {isRejected && <div className="text-red-600 text-xs font-black uppercase">✗ Bid Declined</div>}
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl p-4 bg-amber-50 border border-amber-100/50">
                          <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-2 rounded-lg">
                                <Clock className="text-amber-600" size={18} />
                            </div>
                            <p className="text-xs font-bold text-amber-800 tracking-tight">Awaiting Admin Verification & Price Offer</p>
                          </div>
                          <button 
                            onClick={() => handleCancelOrder(item.id)}
                            className="w-full md:w-auto px-5 py-2.5 bg-white border border-red-100 text-red-500 text-[10px] font-black uppercase rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                          >
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
    pending: { bg: "bg-orange-100", text: "text-orange-600", label: "Pending" },
    accepted: { bg: "bg-green-100", text: "text-green-600", label: "Accepted" },
    rejected: { bg: "bg-red-100", text: "text-red-600", label: "Rejected" },
    bid_received: { bg: "bg-blue-100", text: "text-blue-600", label: "Bid Received" },
    "bid-placed": { bg: "bg-blue-100", text: "text-blue-600", label: "Bid Placed" }
  };
  const statusStyle = statusMap[status] || statusMap.pending;
  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text} border border-white/50 shadow-sm`}>
      {statusStyle.label}
    </span>
  );
};

export default MobileCart;