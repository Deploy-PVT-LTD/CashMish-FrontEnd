import React, { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasEverHadBalance, setHasEverHadBalance] = useState(false);

  // Per-order action tracking: { orderId: 'withdraw' | 'coupon' }
  const [completedActions, setCompletedActions] = useState({});

  // Pending orders: accepted bids where user hasn't chosen withdraw/coupon yet
  // Format: [{ id: string, amount: number }]
  const [pendingOrders, setPendingOrders] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('walletBalance');
    const savedHasEver = localStorage.getItem('hasEverHadBalance');
    const savedCompleted = localStorage.getItem('completedActions');
    const savedPending = localStorage.getItem('pendingOrders');

    if (savedBalance) setWalletBalance(parseFloat(savedBalance));
    if (savedHasEver === 'true') setHasEverHadBalance(true);
    if (savedCompleted) {
      try { setCompletedActions(JSON.parse(savedCompleted)); } catch (e) {}
    }
    if (savedPending) {
      try { setPendingOrders(JSON.parse(savedPending)); } catch (e) {}
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('walletBalance', walletBalance.toString());
    if (hasEverHadBalance) {
      localStorage.setItem('hasEverHadBalance', 'true');
    }
  }, [walletBalance, hasEverHadBalance]);

  useEffect(() => {
    localStorage.setItem('completedActions', JSON.stringify(completedActions));
  }, [completedActions]);

  useEffect(() => {
    localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
  }, [pendingOrders]);

  // Called when user accepts a bid in cart
  const addToWallet = (amount, orderId) => {
    setWalletBalance(prev => prev + amount);
    setHasEverHadBalance(true);

    if (orderId) {
      setPendingOrders(prev => {
        const exists = prev.find(o => o.id === orderId);
        if (exists) return prev;
        return [...prev, { id: orderId, amount }];
      });
    }
  };

  const hasActionForOrder = (orderId) => !!completedActions[orderId];

  // True if there are accepted orders where user hasn't picked withdraw/coupon yet
  const hasPendingAction = pendingOrders.length > 0;
  const pendingAmount = pendingOrders.reduce((sum, o) => sum + o.amount, 0);

  // For backward compatibility
  const actionTaken = Object.keys(completedActions).length > 0 ? 'completed' : null;

  const withdrawCash = (withdrawalDetails, orderId) => {
    setIsProcessing(true);
    const orderEntry = orderId ? pendingOrders.find(o => o.id === orderId) : null;
    const amountToWithdraw = orderEntry ? orderEntry.amount : walletBalance;

    setTimeout(() => {
      setWalletBalance(prev => Math.max(0, prev - amountToWithdraw));

      if (orderId) {
        setCompletedActions(prev => ({ ...prev, [orderId]: 'withdraw' }));
        setPendingOrders(prev => prev.filter(o => o.id !== orderId));
      }

      // Append to withdrawal history
      const history = JSON.parse(localStorage.getItem('withdrawalHistory') || '[]');
      history.push({
        ...withdrawalDetails,
        orderId,
        amount: amountToWithdraw,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('withdrawalHistory', JSON.stringify(history));

      setIsProcessing(false);
    }, 500);

    return true;
  };

  const getCoupons = (orderId) => {
    setIsProcessing(true);
    const orderEntry = orderId ? pendingOrders.find(o => o.id === orderId) : null;
    const amount = orderEntry ? orderEntry.amount : walletBalance;
    const bonusAmount = amount * 0.07;
    const totalWithBonus = amount + bonusAmount;

    setTimeout(() => {
      setWalletBalance(prev => Math.max(0, prev - amount));

      if (orderId) {
        setCompletedActions(prev => ({ ...prev, [orderId]: 'coupon' }));
        setPendingOrders(prev => prev.filter(o => o.id !== orderId));
      }

      const history = JSON.parse(localStorage.getItem('couponHistory') || '[]');
      history.push({
        orderId,
        originalAmount: amount,
        bonusAmount,
        totalAmount: totalWithBonus,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('couponHistory', JSON.stringify(history));

      setIsProcessing(false);
    }, 500);

    return true;
  };

  const resetWallet = () => {
    setWalletBalance(0);
    setIsProcessing(false);
    setHasEverHadBalance(false);
    setCompletedActions({});
    setPendingOrders([]);
    localStorage.removeItem('walletBalance');
    localStorage.removeItem('completedActions');
    localStorage.removeItem('pendingOrders');
    localStorage.removeItem('hasEverHadBalance');
    localStorage.removeItem('withdrawalHistory');
    localStorage.removeItem('couponHistory');
  };

  return (
    <WalletContext.Provider
      value={{
        walletBalance,
        actionTaken,
        isProcessing,
        hasEverHadBalance,
        pendingOrders,
        hasPendingAction,
        pendingAmount,
        completedActions,
        hasActionForOrder,
        addToWallet,
        withdrawCash,
        getCoupons,
        resetWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};