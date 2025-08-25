import React, { createContext, useContext, useState } from 'react';
import { utrService } from '../services/utrService';

interface UTR {
  id: string;
  utrNumber: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

interface UTRContextType {
  utrs: UTR[];
  generateUTR: (data: { amount: number; description: string; userId: string }) => Promise<UTR>;
  getUserUTRs: () => Promise<UTR[]>;
  getUTR: (utrNumber: string) => Promise<UTR | null>;
}

const UTRContext = createContext<UTRContextType>({
  utrs: [],
  generateUTR: async () => ({ id: '', utrNumber: '', amount: 0, description: '', status: '', createdAt: '' }),
  getUserUTRs: async () => [],
  getUTR: async () => null,
});

export const UTRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [utrs, setUTRs] = useState<UTR[]>([]);

  const generateUTR = async (data: { amount: number; description: string; userId: string }) => {
    try {
      const utr = await utrService.generateUTR(data);
      setUTRs(prev => [...prev, utr]);
      return utr;
    } catch (error) {
      console.error('Error generating UTR:', error);
      throw error;
    }
  };

  const getUserUTRs = async () => {
    try {
      const userUTRs = await utrService.getUserUTRs();
      setUTRs(userUTRs);
      return userUTRs;
    } catch (error) {
      console.error('Error fetching UTRs:', error);
      return [];
    }
  };

  const getUTR = async (utrNumber: string) => {
    try {
      return await utrService.getUTR(utrNumber);
    } catch (error) {
      console.error('Error fetching UTR:', error);
      return null;
    }
  };

  return (
    <UTRContext.Provider
      value={{
        utrs,
        generateUTR,
        getUserUTRs,
        getUTR,
      }}
    >
      {children}
    </UTRContext.Provider>
  );
};

export const useUTR = () => useContext(UTRContext);
