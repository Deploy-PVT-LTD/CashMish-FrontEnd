import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BASE_URL } from '../api/api';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- 1. Backend se Fresh Data lana ---
  const fetchAndUpdateBalance = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        setWalletBalance(0);
        setPendingOrders([]);
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      const userId = user._id || user.id;

      const response = await fetch(`${BASE_URL}/api/forms/wallet-balance/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.balance || 0);
        setPendingOrders(data.pendingActions || []);
      }
    } catch (err) {
      console.error('Wallet Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndUpdateBalance();
  }, [fetchAndUpdateBalance]);

  // --- 2. FRONTEND FUNCTIONS (Important Fix) ---

  // Manual update ke liye (Jab bid accept ho)
  const addToWallet = (amount) => {
    setWalletBalance(prev => prev + amount);
  };

  // Payout ke baad balance clear karne ke liye
  const clearWalletAfterPayout = (orderId) => {
    console.log("Clearing Wallet for Order:", orderId);
    setWalletBalance(0); // Frontend par foran 0 kar do
    // Optional: Agar aap chahte hain ke refresh par bhi 0 rahe jab tak BE update na ho:
    // localStorage.setItem('walletBalance', '0'); 
  };

  // --- 3. Cash Withdraw Logic ---
  const withdrawCash = async (formData) => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id || user.id;

      if (!userId || !token) return { success: false, error: 'Session expired.' };

      const response = await fetch(`${BASE_URL}/api/bankDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          accountHolderName: formData.name,
          accountNumber: formData.accountNumber,
          bankName: formData.bankName,
          amount: walletBalance,
          status: 'pending'
        })
      });

      if (response.ok) {
        await fetchAndUpdateBalance();
        return { success: true };
      } else {
        const result = await response.json();
        return { success: false, error: result.message || 'Withdrawal failed' };
      }
    } catch (err) {
      return { success: false, error: 'Server connection failed.' };
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchUserBankDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id || user.id;
      if (!userId || !token) return [];

      const response = await fetch(`${BASE_URL}/api/bankDetails`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const allTransactions = Array.isArray(data) ? data : [];
        return allTransactions.filter(item => {
          const itemUserId = item.userId?._id || item.userId;
          return String(itemUserId) === String(userId);
        });
      }
      return [];
    } catch (err) {
      console.error("History fetch error:", err);
      return [];
    }
  };

  const resetWallet = () => {
    setWalletBalance(0);
    setPendingOrders([]);
  };

  return (
    <WalletContext.Provider value={{
      walletBalance,
      setWalletBalance,
      addToWallet,           // Ab yeh function body ke saath export ho raha hai
      clearWalletAfterPayout, // Ab yeh function body ke saath export ho raha hai
      pendingOrders,
      isProcessing,
      loading,
      fetchAndUpdateBalance,
      withdrawCash,
      fetchUserBankDetails,
      resetWallet,
      hasPendingAction: pendingOrders.length > 0
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);