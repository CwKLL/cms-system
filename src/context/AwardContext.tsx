'use client';

/**
 * Global in-memory award store for the mock CMS.
 * In production this would be replaced by real API calls.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Award, AwardStatus } from '@/types';
import { MOCK_AWARDS } from '@/lib/mockData';

interface AwardStore {
  awards: Award[];
  submitAward: (award: Omit<Award, 'id' | 'status' | 'score' | 'submittedAt'>) => void;
  approveAward: (id: string, score: number, approverName: string) => void;
  rejectAward: (id: string, approverName: string) => void;
  deleteAward: (id: string) => void;
}

const AwardContext = createContext<AwardStore | null>(null);

export function AwardProvider({ children }: { children: ReactNode }) {
  const [awards, setAwards] = useState<Award[]>(MOCK_AWARDS);

  const submitAward = (award: Omit<Award, 'id' | 'status' | 'score' | 'submittedAt'>) => {
    const newAward: Award = {
      ...award,
      id: `a${Date.now()}`,
      status: 'pending',
      score: 0,
      submittedAt: new Date().toISOString().slice(0, 10),
    };
    setAwards((prev) => [newAward, ...prev]);
  };

  const approveAward = (id: string, score: number, approverName: string) => {
    setAwards((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: 'approved' as AwardStatus, score, approvedAt: new Date().toISOString().slice(0, 10), approvedBy: approverName }
          : a
      )
    );
  };

  const rejectAward = (id: string, approverName: string) => {
    setAwards((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: 'rejected' as AwardStatus, approvedAt: new Date().toISOString().slice(0, 10), approvedBy: approverName }
          : a
      )
    );
  };

  const deleteAward = (id: string) => {
    setAwards((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AwardContext.Provider value={{ awards, submitAward, approveAward, rejectAward, deleteAward }}>
      {children}
    </AwardContext.Provider>
  );
}

export function useAwards(): AwardStore {
  const ctx = useContext(AwardContext);
  if (!ctx) throw new Error('useAwards must be used inside <AwardProvider>');
  return ctx;
}
