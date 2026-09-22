import React, { useCallback, useEffect, useState } from 'react';
import { GrcDataset } from '../types';
import { seedDataset } from '../data/seedData';

// Shared props passed from App.tsx into every page component.
export interface GrcPageProps {
  data: GrcDataset;
  setData: React.Dispatch<React.SetStateAction<GrcDataset>>;
  logActivity: (message: string) => void;
}

const STORAGE_KEY = 'novatech-grc-dataset-v1';

export function loadDataset(): GrcDataset {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedDataset();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as GrcDataset;
  } catch (err) {
    console.error('Failed to load GRC dataset from localStorage, reseeding.', err);
    const seeded = seedDataset();
    return seeded;
  }
}

export function saveDataset(data: GrcDataset): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save GRC dataset to localStorage.', err);
  }
}

export function resetDataset(): GrcDataset {
  const seeded = seedDataset();
  saveDataset(seeded);
  return seeded;
}

/**
 * Central app-state hook. Every page reads/writes the dataset through this
 * hook so the whole application (dashboard included) stays in sync and
 * changes persist to localStorage automatically.
 */
export function useGrcData() {
  const [data, setData] = useState<GrcDataset>(() => loadDataset());

  useEffect(() => {
    saveDataset(data);
  }, [data]);

  const logActivity = useCallback((message: string) => {
    setData((prev) => ({
      ...prev,
      activityLog: [
        { id: `ACT-${Date.now()}`, timestamp: new Date().toISOString(), message },
        ...prev.activityLog,
      ].slice(0, 25),
    }));
  }, []);

  const reset = useCallback(() => {
    const seeded = resetDataset();
    setData(seeded);
  }, []);

  return { data, setData, logActivity, reset };
}

export function nextId(prefix: string, existingIds: string[]): string {
  const numbers = existingIds
    .map((id) => {
      const match = id.match(/(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !Number.isNaN(n));
  const max = numbers.length > 0 ? Math.max(...numbers) : 0;
  const next = max + 1;
  return `${prefix}-${String(next).padStart(3, '0')}`;
}
