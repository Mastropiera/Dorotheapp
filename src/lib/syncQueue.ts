// src/lib/syncQueue.ts
import type { LocalEvent } from './types';

export interface PendingSyncItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  collection: 'calendar' | 'menstrualData' | 'extraHours';
  data: any;
  timestamp: number;
  retries: number;
  lastError?: string;
}

export interface SyncQueueState {
  items: PendingSyncItem[];
  syncing: boolean;
  lastSyncTime?: number;
}

const STORAGE_KEY = 'agendita_sync_queue';
const LAST_SYNC_KEY = 'agendita_last_sync_time';
const MAX_RETRIES = 3;

export class SyncQueue {
  private queue: PendingSyncItem[] = [];
  private syncing = false;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadQueue();
  }

  private loadQueue() {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
      this.queue = [];
    }
  }

  private saveQueue() {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  add(item: Omit<PendingSyncItem, 'timestamp' | 'retries'>) {
    const syncItem: PendingSyncItem = {
      ...item,
      timestamp: Date.now(),
      retries: 0,
    };

    const existingIndex = this.queue.findIndex(
      (q) => q.id === item.id && q.collection === item.collection
    );

    if (existingIndex >= 0) {
      this.queue[existingIndex] = syncItem;
    } else {
      this.queue.push(syncItem);
    }

    this.saveQueue();
    return syncItem;
  }

  remove(id: string, collection: string) {
    this.queue = this.queue.filter((item) => !(item.id === id && item.collection === collection));
    this.saveQueue();
  }

  getAll(): PendingSyncItem[] {
    return [...this.queue];
  }

  getPending(): PendingSyncItem[] {
    return this.queue.filter((item) => item.retries < MAX_RETRIES);
  }

  getFailed(): PendingSyncItem[] {
    return this.queue.filter((item) => item.retries >= MAX_RETRIES);
  }

  markAsRetried(id: string, collection: string, error?: string) {
    const item = this.queue.find((q) => q.id === id && q.collection === collection);
    if (item) {
      item.retries++;
      item.lastError = error;
      this.saveQueue();
    }
  }

  clear() {
    this.queue = [];
    this.saveQueue();
  }

  clearFailed() {
    this.queue = this.queue.filter((item) => item.retries < MAX_RETRIES);
    this.saveQueue();
  }

  getState(): SyncQueueState {
    return {
      items: this.getAll(),
      syncing: this.syncing,
      lastSyncTime: this.getLastSyncTime(),
    };
  }

  setSyncing(syncing: boolean) {
    this.syncing = syncing;
    this.notifyListeners();
  }

  private getLastSyncTime(): number | undefined {
    if (typeof window === 'undefined') return undefined;

    const stored = localStorage.getItem(LAST_SYNC_KEY);
    return stored ? parseInt(stored, 10) : undefined;
  }

  setLastSyncTime(time: number) {
    if (typeof window === 'undefined') return;

    localStorage.setItem(LAST_SYNC_KEY, time.toString());
    this.notifyListeners();
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }
}

// Instancia singleton
export const syncQueue = new SyncQueue();
