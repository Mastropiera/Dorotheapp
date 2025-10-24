import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { syncQueue, type PendingSyncItem, type SyncQueueState } from '@/lib/syncQueue';
import type { LocalEvent } from '@/lib/types';
import { addDays } from 'date-fns';

export function useOfflineSync(userId: string) {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [syncState, setSyncState] = useState<SyncQueueState>(syncQueue.getState());
  const [isSyncing, setIsSyncing] = useState(false);

  // Monitorear estado de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Suscribirse a cambios en la cola
  useEffect(() => {
    const unsubscribe = syncQueue.subscribe(() => {
      setSyncState(syncQueue.getState());
    });

    return () => {
      unsubscribe(); // ✅ ahora devuelve void, no boolean
    };
  }, []);

  // Sincronizar automáticamente cuando vuelve la conexión
  useEffect(() => {
    if (isOnline && !syncQueue.isEmpty() && !isSyncing) {
      syncAll();
    }
  }, [isOnline]);

  // Sincronizar un item individual
  const syncItem = useCallback(async (item: PendingSyncItem): Promise<boolean> => {
    if (!userId) return false;

    try {
      const collectionPath = `users/${userId}/${item.collection}`;
      const docRef = doc(db, collectionPath, item.id);

      switch (item.action) {
        case 'create':
        case 'update':
          await setDoc(docRef, item.data, { merge: true });
          break;
        case 'delete':
          await deleteDoc(docRef);
          break;
      }

      syncQueue.remove(item.id, item.collection);
      return true;
    } catch (error) {
      console.error('Error syncing item:', error);
      syncQueue.markAsRetried(
        item.id,
        item.collection,
        error instanceof Error ? error.message : 'Unknown error'
      );
      return false;
    }
  }, [userId]);

  // Sincronizar todos los items pendientes
  const syncAll = useCallback(async () => {
    if (!isOnline || !userId || isSyncing) return;

    setIsSyncing(true);
    syncQueue.setSyncing(true);

    const pendingItems = syncQueue.getPending();
    let successCount = 0;
    let failCount = 0;

    for (const item of pendingItems) {
      const success = await syncItem(item);
      if (success) successCount++;
      else failCount++;
    }

    syncQueue.setSyncing(false);
    syncQueue.setLastSyncTime(Date.now());
    setIsSyncing(false);

    console.log(`Sync completed: ${successCount} successful, ${failCount} failed`);

    return { successCount, failCount };
  }, [isOnline, userId, isSyncing, syncItem]);

  // Agregar item a la cola de sincronización
  const addToSyncQueue = useCallback((
    id: string,
    action: 'create' | 'update' | 'delete',
    collection: 'calendar' | 'menstrualData' | 'extraHours',
    data: any
  ) => {
    syncQueue.add({ id, action, collection, data });

    if (isOnline && !isSyncing) {
      setTimeout(() => syncAll(), 100);
    }
  }, [isOnline, isSyncing, syncAll]);

  // Limpiar items fallidos
  const clearFailedItems = useCallback(() => {
    syncQueue.clearFailed();
  }, []);

  // Reintentar items fallidos
  const retryFailedItems = useCallback(async () => {
    if (!isOnline || !userId) return;

    const failedItems = syncQueue.getFailed();
    
    failedItems.forEach(item => {
      syncQueue.add({
        id: item.id,
        action: item.action,
        collection: item.collection,
        data: item.data,
      });
    });

    await syncAll();
  }, [isOnline, userId, syncAll]);

  return {
    isOnline,
    isSyncing,
    syncState,
    pendingCount: syncState.items.filter(i => i.retries < 3).length,
    failedCount: syncState.items.filter(i => i.retries >= 3).length,
    lastSyncTime: syncState.lastSyncTime,
    addToSyncQueue,
    syncAll,
    clearFailedItems,
    retryFailedItems,
  };
}
