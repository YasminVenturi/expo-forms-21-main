import React, { createContext, useState, useEffect } from 'react';


export const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const storedBalance = await AsyncStorage.getItem('balance');
        if (storedBalance !== null) {
          setBalance(parseFloat(storedBalance));
        } else {
          setBalance(1356.00); 
        }
      } catch (error) {
        console.error('Erro ao carregar o saldo:', error);
      }
    };

    loadBalance();
  }, []);

  const updateBalance = async (newBalance) => {
    try {
      await AsyncStorage.setItem('balance', newBalance.toFixed(2));
      setBalance(newBalance);
    } catch (error) {
      console.error('Erro ao atualizar o saldo:', error);
    }
  };

  return (
    <BalanceContext.Provider value={{ balance, updateBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};
