import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WalletContext = createContext();
const BASE_URL = 'http://localhost:5000'; // Apna live URL yahan lagayein

export const WalletProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [pendingOrders, setPendingOrders] = useState([]); // DB se aane wale pending actions
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const addToWallet = (amount, orderId) => {
  setWalletBalance(prev => prev + amount);
  // Optional: orderId ke basis par pendingOrders ko update karo ya backend ko sync karo
};


  // ── FETCH BALANCE & PENDING ACTIONS DIRECT FROM DB ──
  const fetchAndUpdateBalance = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id || user.id;

      if (!userId || !token) {
        setWalletBalance(0);
        setPendingOrders([]);
        setLoading(false);
        return;
      }

      // Yeh API aapke DB se accepted bids ka total aur pending actions return karegi
      const response = await fetch(`${BASE_URL}/api/forms/wallet-balance/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // data.balance = Total Approved Bid Price
        // data.pendingActions = Wo orders jinpe abhi tak Withdraw ya Coupon select nahi hua
        setWalletBalance(data.balance || 0);
        setPendingOrders(data.pendingActions || []);
      }
    } catch (error) {
      console.error("DB Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // App load hone par refresh
  useEffect(() => {
    fetchAndUpdateBalance();
  }, [fetchAndUpdateBalance]);

  const resetWallet = () => {
    setWalletBalance(0);
    setPendingOrders([]);
  };

  return (
    <WalletContext.Provider value={{
      walletBalance,
      pendingOrders,
      isProcessing,
      loading,
      fetchAndUpdateBalance,
      resetWallet,
      addToWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);