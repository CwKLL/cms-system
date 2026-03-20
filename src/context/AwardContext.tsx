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
  rejectAward: (id: string, approverName: string, reason?: string) => void;
  updateStatus: (id: string, to: Award['status'], actorName: string, reason?: string, score?: number) => void;
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

  const rejectAward = (id: string, approverName: string, reason?: string) => {
    setAwards((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'rejected' as AwardStatus,
              notes: [
                ...(a.notes ?? []),
                { from: a.status, to: 'rejected', by: approverName, at: new Date().toISOString().slice(0, 10), reason },
              ],
            }
          : a
      )
    );
  };

  const updateStatus = (id: string, to: Award['status'], actorName: string, reason?: string, score?: number) => {
    setAwards((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const updated: Award = { ...a, status: to };
        if (to === 'approved') {
          updated.score = typeof score === 'number' ? score : a.score;
          updated.approvedAt = new Date().toISOString().slice(0, 10);
          updated.approvedBy = actorName;
        } else if (to === 'rejected') {
        } else {
        }
        updated.notes = [...(a.notes ?? []), { from: a.status, to, by: actorName, at: new Date().toISOString().slice(0, 10), reason }];
        return updated;
      })
    );
  };

  const deleteAward = (id: string) => {
    setAwards((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AwardContext.Provider value={{ awards, submitAward, rejectAward, updateStatus, deleteAward }}>
      {children}
    </AwardContext.Provider>
  );
}

export function useAwards(): AwardStore {
  const ctx = useContext(AwardContext);
  if (!ctx) throw new Error('useAwards must be used inside <AwardProvider>');
  return ctx;
}
