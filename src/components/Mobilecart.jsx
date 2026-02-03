import React, { useState, useEffect } from 'react';
import { Bell, Trash2, X, MapPin, Clock, Phone } from 'lucide-react';
import Header from '../components/header.jsx';

const MobileCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [closedNotifications, setClosedNotifications] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadUserCart();
  }, []);

  const loadUserCart = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user._id;

    console.log('🔍 Loading cart for userId:', userId);

    if (userId && token) {
      // User is logged in - fetch from database
      setIsLoggedIn(true);
      try {
        const response = await fetch('http://localhost:5000/api/forms', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const allForms = await response.json();
          console.log('📦 All forms from DB:', allForms.length);
          
          // Filter forms by userId - handle both string and ObjectId comparison
          const userForms = allForms.filter(form => {
            const formUserId = form.userId?._id || form.userId;
            const match = formUserId && (
              formUserId.toString() === userId.toString() ||
              formUserId === userId
            );
            console.log(`Comparing: ${formUserId} === ${userId} = ${match}`);
            return match;
          });

          console.log('✅ User forms found:', userForms.length);

          const transformedItems = userForms.map(form => {
            console.log('📱 Processing form:', {
              id: form._id,
              userId: form.userId,
              mobile: form.mobileId
            });

            return {
              id: form._id,
              brand: form.mobileId?.brand || 'N/A',
              name: form.mobileId?.phoneModel || 'N/A',
              storage: form.storage,
              condition: form.screenCondition,
              uploadDate: new Date(form.pickUpDetails?.pickUpDate).toLocaleDateString(),
              status: form.status || 'pending',
              address: form.pickUpDetails?.address?.addressText || 'N/A',
              phoneNumber: form.pickUpDetails?.phoneNumber || 'N/A',
              timeSlot: form.pickUpDetails?.timeSlot || 'N/A',
              fullName: form.pickUpDetails?.fullName || 'N/A'
            };
          });

          console.log('🎯 Transformed items:', transformedItems);
          setCartItems(transformedItems);

          // Sync to localStorage
          const userCartKey = `userCart_${userId}`;
          localStorage.setItem(userCartKey, JSON.stringify(transformedItems));
          localStorage.setItem('userCart', JSON.stringify(transformedItems));
        } else {
          console.error('❌ Failed to fetch forms from database:', response.status);
          // Fallback to localStorage
          loadFromLocalStorage(userId);
        }
      } catch (error) {
        console.error('❌ Error fetching from API:', error);
        // Fallback to localStorage if API fails
        loadFromLocalStorage(userId);
      }
    } else {
      // Guest user - load from localStorage only
      console.log('👤 Guest user - loading from localStorage');
      setIsLoggedIn(false);
      loadFromLocalStorage(null);
    }
    setLoading(false);
  };

  const loadFromLocalStorage = (userId) => {
    if (userId) {
      const userCartKey = `userCart_${userId}`;
      const userCart = localStorage.getItem(userCartKey);
      console.log('📂 Loading from localStorage key:', userCartKey);
      if (userCart) {
        const items = JSON.parse(userCart);
        console.log('✅ Found items in localStorage:', items.length);
        setCartItems(items);
        localStorage.setItem('userCart', userCart);
      } else {
        console.log('⚠️ No items in localStorage');
        setCartItems([]);
      }
    } else {
      // Guest user
      const guestCart = localStorage.getItem('userCart');
      console.log('👤 Loading guest cart');
      setCartItems(guestCart ? JSON.parse(guestCart) : []);
    }
  };

  const removeItem = async (id) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user._id;
    const token = localStorage.getItem('token');

    console.log('🗑️ Removing item:', id);

    // Remove from local state
    const filteredItems = cartItems.filter(item => item.id !== id);
    setCartItems(filteredItems);

    // Update localStorage
    localStorage.setItem('userCart', JSON.stringify(filteredItems));
    if (userId) {
      localStorage.setItem(`userCart_${userId}`, JSON.stringify(filteredItems));
    }

    // If logged in, also delete from database
    if (userId && token) {
      try {
        const response = await fetch(`http://localhost:5000/api/forms/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          console.log('✅ Deleted from database');
        } else {
          console.error('❌ Failed to delete from database');
        }
      } catch (error) {
        console.error('❌ Error deleting from database:', error);
      }
    }
  };

  const closeNotification = (id) => {
    setClosedNotifications(prev => new Set(prev).add(id));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Pickup' },
      bid_received: { bg: 'bg-green-100', text: 'text-green-800', label: 'Bid Received' },
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
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto p-4 md:p-8">

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">Track Orders</h1>
          <p className="text-gray-500 font-medium">
            {cartItems.length} Device(s) scheduled for inspection
            {!isLoggedIn && <span className="text-orange-500 ml-2">(Guest Mode - Login to save permanently)</span>}
          </p>
        </div>

        <div className="space-y-6">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border-2 border-dashed border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-gray-300 w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No active pickups</h3>
              <p className="text-gray-500 mt-2">Your scheduled pickups will appear here.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Notification Bar */}
                {item.notification && !closedNotifications.has(item.id) && (
                  <div className="bg-blue-600 p-3 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3 ml-2">
                      <Bell className="w-4 h-4 fill-white/20" />
                      <p className="text-xs md:text-sm font-semibold">{item.notification}</p>
                    </div>
                    <button onClick={() => closeNotification(item.id)} className="hover:bg-blue-700 p-1 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="p-5 md:p-7">
                  <div className="flex flex-col lg:flex-row gap-8">

                    {/* Device Visual */}
                    <div className="w-full lg:w-72 h-44 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex flex-col items-center justify-center text-white relative shadow-lg">
                      <span className="text-xs uppercase tracking-widest opacity-50 mb-1 font-bold">{item.brand}</span>
                      <span className="text-2xl font-black">{item.name}</span>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-70">
                        <span className="text-[10px] font-mono">{item.storage}</span>
                        <span className="text-[10px] font-mono">ID: #{String(item.id).slice(-6)}</span>
                      </div>
                    </div>

                    {/* Information Grid */}
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 uppercase">{item.brand} {item.name}</h3>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Technical Details */}
                        <InfoBox label="Condition" value={item.condition} />
                        <InfoBox label="Storage" value={item.storage} />
                        <InfoBox label="Scheduled Date" value={item.uploadDate} />

                        {/* Contact & Location Details */}
                        <div className="col-span-2 md:col-span-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Time Slot</p>
                          </div>
                          <p className="text-sm font-bold text-gray-800">{item.timeSlot || 'Not Set'}</p>
                        </div>

                        <div className="col-span-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-3 h-3 text-blue-600" />
                            <p className="text-[10px] text-blue-600 uppercase font-bold tracking-wider">Pickup Address</p>
                          </div>
                          <p className="text-sm font-medium text-gray-700 line-clamp-2 leading-relaxed">
                            {item.address}
                          </p>
                        </div>

                        <div className="col-span-2 md:col-span-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Phone className="w-3 h-3 text-green-600" />
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Contact</p>
                          </div>
                          <p className="text-sm font-bold text-gray-800">{item.phoneNumber}</p>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-2 text-gray-400 hover:text-red-600 font-bold text-xs uppercase tracking-widest transition-colors group bg-transparent border-none cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" /> Cancel Pickup
                        </button>
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

// Reusable Small Component for Grid items
const InfoBox = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">{label}</p>
    <p className="text-sm font-bold text-gray-800">{value || 'N/A'}</p>
  </div>
);

export default MobileCart;