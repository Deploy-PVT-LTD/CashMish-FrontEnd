import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WalletContext = createContext();
const BASE_URL = 'https://cashmish-backend.onrender.com';

// ── localStorage: paid orderIds track karo ──────────────────────────────────
const WALLET_PAID_KEY = 'walletPaidOrderIds';
const getPaidOrderIds = () => { try { return JSON.parse(localStorage.getItem(WALLET_PAID_KEY) || '[]'); } catch { return []; } };
const markOrderPaid = (orderId) => {
  if (!orderId) return;
  const ids = getPaidOrderIds();
  const key = String(orderId);
  if (!ids.includes(key)) { ids.push(key); localStorage.setItem(WALLET_PAID_KEY, JSON.stringify(ids)); }
};

export const WalletProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── DB se balance fetch — paid orders subtract karo ──────────────────────
  const fetchAndUpdateBalance = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id || user.id;
      if (!userId || !token) { setWalletBalance(0); setPendingOrders([]); setLoading(false); return; }

      const response = await fetch(`${BASE_URL}/api/forms/wallet-balance/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // backend returns: { balance, pendingActions: [{ orderId, amount }] }
        const allActions = data.pendingActions || [];
        const paidIds = getPaidOrderIds();

        // Paid orders filter karo
        const unpaid = allActions.filter(a => !paidIds.includes(String(a.orderId)));
        const paidTotal = allActions
          .filter(a => paidIds.includes(String(a.orderId)))
          .reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0);

        const adjusted = Math.max(0, (data.balance || 0) - paidTotal);
        setWalletBalance(adjusted);
        setPendingOrders(unpaid);
      }
    } catch (err) { console.error('fetchAndUpdateBalance error:', err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAndUpdateBalance(); }, [fetchAndUpdateBalance]);

  // ── Instant local add (accept ke baad) ───────────────────────────────────
  const addToWallet = (amount) => {
    setWalletBalance(prev => prev + parseFloat(amount || 0));
  };

  // ── Withdraw/Coupon ke baad: orderId mark karo + balance 0 karo ──────────
  const clearWalletAfterPayout = (orderId) => {
    if (orderId) markOrderPaid(orderId);
    setWalletBalance(0);
    setPendingOrders([]);
  };

  // ── POST /api/bankDetails — withdraw form ─────────────────────────────────
  const withdrawCash = async (formData, orderId) => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id || user.id;
      if (!userId || !token) return { success: false, error: 'User not logged in.' };

      const response = await fetch(`${BASE_URL}/api/bankDetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          userId,
          accountHolderName: formData.name,
          accountNumber: formData.accountNumber,
          bankName: formData.bankName,
          status: 'pending'
        })
      });

      if (!response.ok) {
        const e = await response.json().catch(() => ({}));
        return { success: false, error: e.message || e.error || `Server error: ${response.status}` };
      }
      clearWalletAfterPayout(orderId);
      return { success: true };
    } catch (err) { return { success: false, error: err.message || 'Something went wrong.' }; }
    finally { setIsProcessing(false); }
  };

  // ── Coupons confirm ───────────────────────────────────────────────────────
  const getCoupons = async (orderId) => {
    setIsProcessing(true);
    try { clearWalletAfterPayout(orderId); return { success: true }; }
    catch (err) { return { success: false, error: err.message }; }
    finally { setIsProcessing(false); }
  };

  // ── Transaction history: GET /api/bankDetails/user/:userId ───────────────
  // NOTE: Backend controller uses req.body.userId but route is GET /user/:userId
  // Controller bug: it uses req.body on a GET — workaround: use req.params via fixed route
  // Since we cant change backend, we call GET all and filter client-side
  const fetchUserBankDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id || user.id;
      if (!userId || !token) return [];

      // Backend controller has bug (GET uses req.body) — use GET all & filter
      const response = await fetch(`${BASE_URL}/api/bankDetails`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const all = Array.isArray(data) ? data : [];
        // Filter by current user
        return all.filter(item => {
          const itemUserId = item.userId?._id || item.userId;
          return String(itemUserId) === String(userId);
        });
      }
      return [];
    } catch { return []; }
  };

  const resetWallet = () => { setWalletBalance(0); setPendingOrders([]); };
  const hasPendingAction = pendingOrders && pendingOrders.length > 0;

  return (
    <WalletContext.Provider value={{
      walletBalance, pendingOrders, hasPendingAction, isProcessing, loading,
      fetchAndUpdateBalance, addToWallet, clearWalletAfterPayout,
      withdrawCash, getCoupons, fetchUserBankDetails, resetWallet, markOrderPaid
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);