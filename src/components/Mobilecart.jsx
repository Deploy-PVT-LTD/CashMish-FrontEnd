import React, { useState, useEffect } from 'react';
import { Bell, Trash2, X, MapPin, Clock, Phone, DollarSign, Check, XCircle, Smartphone } from 'lucide-react';
import Header from '../components/header.jsx';
import Swal from 'sweetalert2';

const MobileCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [closedNotifications, setClosedNotifications] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [processingBid, setProcessingBid] = useState(null);

  useEffect(() => {
    loadUserCart();
  }, []);

  const loadUserCart = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user._id;

    if (userId && token) {
      setIsLoggedIn(true);
      await fetchLoggedInUserForms(token, userId);
    } else {
      setIsLoggedIn(false);
      await fetchGuestUserForms();
    }
    setLoading(false);
  };

  const fetchLoggedInUserForms = async (token, userId) => {
    try {
      const response = await fetch('http://localhost:5000/api/forms', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const allForms = await response.json();
        const userForms = allForms.filter(form => {
          const formUserId = form.userId?._id || form.userId;
          return formUserId && (formUserId.toString() === userId.toString());
        });

        const transformedItems = transformForms(userForms);
        setCartItems(transformedItems);
        localStorage.setItem(`userCart_${userId}`, JSON.stringify(transformedItems));
        localStorage.setItem('userCart', JSON.stringify(transformedItems));
      } else {
        loadFromLocalStorage(userId);
      }
    } catch (error) {
      loadFromLocalStorage(userId);
    }
  };

  const fetchGuestUserForms = async () => {
    const localCart = JSON.parse(localStorage.getItem('userCart') || '[]');
    const phoneNumber = localCart[0]?.phoneNumber;
    
    if (!phoneNumber) {
      setCartItems(localCart);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/forms');
      if (response.ok) {
        const allForms = await response.json();
        const guestForms = allForms.filter(form => 
          form.pickUpDetails?.phoneNumber === phoneNumber
        );
        
        if (guestForms.length > 0) {
          const transformedItems = transformForms(guestForms);
          setCartItems(transformedItems);
          localStorage.setItem('userCart', JSON.stringify(transformedItems));
        } else {
          setCartItems(localCart);
        }
      }
    } catch (error) {
      setCartItems(localCart);
    }
  };

  const transformForms = (forms) => {
    return forms.map(form => ({
      id: form._id,
      brand: form.mobileId?.brand || 'N/A',
      name: form.mobileId?.phoneModel || 'N/A',
      image: form.mobileId?.image || null, // ✅ Added Image here
      storage: form.storage,
      condition: form.screenCondition,
      uploadDate: new Date(form.pickUpDetails?.pickUpDate).toLocaleDateString(),
      status: form.status || 'pending',
      address: form.pickUpDetails?.address?.addressText || 'N/A',
      phoneNumber: form.pickUpDetails?.phoneNumber || 'N/A',
      timeSlot: form.pickUpDetails?.timeSlot || 'N/A',
      fullName: form.pickUpDetails?.fullName || 'N/A',
      estimatedPrice: form.estimatedPrice || 0,
      bidPrice: form.bidPrice || 0
    }));
  };

  const loadFromLocalStorage = (userId) => {
    const key = userId ? `userCart_${userId}` : 'userCart';
    const data = localStorage.getItem(key);
    setCartItems(data ? JSON.parse(data) : []);
  };

  const handleAcceptBid = async (id) => {
    const token = localStorage.getItem('token');
    setProcessingBid(id);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://localhost:5000/api/forms/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ status: 'accepted' })
      });

      if (response.ok) {
        updateLocalStateAndStorage(id, 'accepted');
        Swal.fire({
          icon: 'success',
          title: 'Bid Accepted',
          text: 'Your bid has been accepted successfully!',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingBid(null);
    }
  };

  const handleRejectBid = async (id) => {
    const result = await Swal.fire({
      title: 'Reject Bid?',
      text: 'Are you sure you want to reject this offer?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, Reject',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    const token = localStorage.getItem('token');
    setProcessingBid(id);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://localhost:5000/api/forms/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ status: 'rejected' })
      });

      if (response.ok) {
        updateLocalStateAndStorage(id, 'rejected');
        Swal.fire('Rejected', 'The bid has been rejected.', 'info');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingBid(null);
    }
  };

  const updateLocalStateAndStorage = (id, newStatus) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user._id;

    const updated = cartItems.map(item => item.id === id ? { ...item, status: newStatus } : item);
    setCartItems(updated);
    localStorage.setItem('userCart', JSON.stringify(updated));
    if (userId) localStorage.setItem(`userCart_${userId}`, JSON.stringify(updated));
  };

  const removeItem = async (id) => {
    const result = await Swal.fire({
      title: 'Cancel Pickup?',
      text: 'This pickup will be removed permanently',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No'
    });

    if (!result.isConfirmed) return;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user._id;
    const token = localStorage.getItem('token');

    const filteredItems = cartItems.filter(item => item.id !== id);
    setCartItems(filteredItems);
    localStorage.setItem('userCart', JSON.stringify(filteredItems));
    if (userId) localStorage.setItem(`userCart_${userId}`, JSON.stringify(filteredItems));

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`http://localhost:5000/api/forms/${id}`, {
        method: 'DELETE',
        headers: headers
      });
    } catch (error) {
      console.error('❌ Error deleting from backend:', error);
    }
  };

  const closeNotification = (id) => {
    setClosedNotifications(prev => new Set(prev).add(id));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Pickup' },
      bid_received: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Bid Received' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Accepted' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      under_review: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Under Review' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="max-w-6xl mx-auto p-4 md:p-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />
      <div className="max-w-6xl mx-auto p-4 md:p-8">

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">Track Orders</h1>
          <p className="text-gray-500 font-medium">
            {cartItems.length} Device(s) scheduled for inspection
            {!isLoggedIn && <span className="text-orange-500 ml-2 font-bold">(Guest Mode)</span>}
          </p>
        </div>

        <div className="space-y-6">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border-2 border-dashed border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-gray-300 w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No active pickups</h3>
              <p className="text-gray-500 mt-2">Your scheduled pickups will appear here.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {item.notification && !closedNotifications.has(item.id) && (
                  <div className="bg-green-800 p-3 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3 ml-2">
                      <Bell className="w-4 h-4 fill-white/20" />
                      <p className="text-xs md:text-sm font-semibold">{item.notification}</p>
                    </div>
                    <button onClick={() => closeNotification(item.id)} className="hover:bg-green-900 p-1 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="p-5 md:p-7">
                  <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* ✅ Image Section UI Update */}
                    <div className="w-full lg:w-72 h-48 bg-white rounded-2xl flex flex-col items-center justify-center relative shadow-md border border-gray-100 overflow-hidden group">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center bg-slate-100 w-full h-full text-slate-400">
                          <Smartphone className="w-12 h-12 mb-2" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{item.brand}</span>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-3">
                         <span className="text-[9px] font-mono text-gray-400 bg-white/90 px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                           ID: #{String(item.id).slice(-6)}
                         </span>
                      </div>
                    </div>

                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 uppercase leading-none">{item.brand} {item.name}</h3>
                          <p className="text-xs text-gray-400 mt-1 font-bold tracking-wider">REF: {item.id}</p>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <InfoBox label="Condition" value={item.condition} />
                        <InfoBox label="Storage" value={item.storage} />
                        <InfoBox label="Scheduled Date" value={item.uploadDate} />

                        <div className="col-span-2 md:col-span-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-3 h-3 text-green-800" />
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Time Slot</p>
                          </div>
                          <p className="text-sm font-bold text-gray-800">{item.timeSlot || 'Not Set'}</p>
                        </div>

                        <div className="col-span-2 bg-green-50/30 p-4 rounded-xl border border-green-100/50">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-3 h-3 text-green-800" />
                            <p className="text-[10px] text-green-800 uppercase font-bold tracking-wider">Pickup Address</p>
                          </div>
                          <p className="text-sm font-medium text-gray-700 line-clamp-2 leading-relaxed">{item.address}</p>
                        </div>

                        <div className="col-span-2 md:col-span-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Phone className="w-3 h-3 text-green-700" />
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Contact</p>
                          </div>
                          <p className="text-sm font-bold text-gray-800">{item.phoneNumber}</p>
                        </div>
                      </div>

                      {item.bidPrice > 0 && (
                        <div className="mt-6 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-green-200 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-green-100 p-2 rounded-lg">
                                <DollarSign className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Bid Price by Admin</p>
                                <p className="text-2xl font-black text-green-700">${item.bidPrice.toLocaleString()}</p>
                              </div>
                            </div>
                            {item.estimatedPrice > 0 && (
                              <div className="text-right">
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Estimated</p>
                                <p className="text-sm font-semibold text-gray-600">${item.estimatedPrice.toLocaleString()}</p>
                              </div>
                            )}
                          </div>

                          {item.status !== 'accepted' && item.status !== 'rejected' && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleAcceptBid(item.id)}
                                disabled={processingBid === item.id}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                              >
                                <Check className="w-4 h-4" />
                                {processingBid === item.id ? 'Processing...' : 'Accept Bid'}
                              </button>
                              <button
                                onClick={() => handleRejectBid(item.id)}
                                disabled={processingBid === item.id}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4" />
                                {processingBid === item.id ? 'Processing...' : 'Reject Bid'}
                              </button>
                            </div>
                          )}

                          {item.status === 'accepted' && (
                            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 flex items-center justify-center gap-2">
                              <Check className="w-5 h-5 text-green-600" />
                              <p className="text-green-800 font-bold text-sm uppercase">Bid Accepted Successfully!</p>
                            </div>
                          )}

                          {item.status === 'rejected' && (
                            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 flex items-center justify-center gap-2">
                              <XCircle className="w-5 h-5 text-red-600" />
                              <p className="text-red-800 font-bold text-sm uppercase">Bid Rejected</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-8 flex justify-end">
                        {item.status !== 'accepted' && item.status !== 'rejected' && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-2 text-gray-400 hover:text-red-600 font-bold text-xs uppercase tracking-widest transition-colors group bg-transparent border-none cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" /> Cancel Pickup
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">{label}</p>
    <p className="text-sm font-bold text-gray-800">{value || 'N/A'}</p>
  </div>
);

export default MobileCart;