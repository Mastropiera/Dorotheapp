"use client";

import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Cloud, CloudOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';

interface SyncStatusIndicatorProps {
  userId: string;
  className?: string;
}

export default function SyncStatusIndicator({ userId, className = '' }: SyncStatusIndicatorProps) {
  const {
    isOnline,
    isSyncing,
    pendingCount,
    failedCount,
    lastSyncTime,
    syncAll,
    retryFailedItems,
  } = useOfflineSync(userId);

  const [showDetails, setShowDetails] = useState(false);

  const getStatusIcon = () => {
    if (!isOnline) {
      return <CloudOff className="h-4 w-4 text-muted-foreground" />;
    }
    if (isSyncing) {
      return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    if (failedCount > 0) {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
    if (pendingCount > 0) {
      return <RefreshCw className="h-4 w-4 text-yellow-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (!isOnline) {
      return 'Sin conexión';
    }
    if (isSyncing) {
      return 'Sincronizando...';
    }
    if (failedCount > 0) {
      return `${failedCount} error${failedCount > 1 ? 'es' : ''}`;
    }
    if (pendingCount > 0) {
      return `${pendingCount} pendiente${pendingCount > 1 ? 's' : ''}`;
    }
    if (lastSyncTime) {
      return `Sincronizado ${formatDistanceToNow(lastSyncTime, { 
        addSuffix: true,
        locale: es 
      })}`;
    }
    return 'Sincronizado';
  };

  const getStatusColor = () => {
    if (!isOnline) return 'text-muted-foreground';
    if (isSyncing) return 'text-blue-500';
    if (failedCount > 0) return 'text-destructive';
    if (pendingCount > 0) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
        title="Estado de sincronización"
      >
        {getStatusIcon()}
        <span className={getStatusColor()}>{getStatusText()}</span>
      </button>

      {showDetails && (
        <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Estado de sincronización</span>
              <button
                onClick={() => setShowDetails(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Conexión:</span>
                <span className={isOnline ? 'text-green-500' : 'text-muted-foreground'}>
                  {isOnline ? 'En línea' : 'Sin conexión'}
                </span>
              </div>

              {pendingCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pendientes:</span>
                  <span className="text-yellow-500">{pendingCount}</span>
                </div>
              )}

              {failedCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Errores:</span>
                  <span className="text-destructive">{failedCount}</span>
                </div>
              )}

              {lastSyncTime && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Última sync:</span>
                  <span className="text-muted-foreground text-xs">
                    {formatDistanceToNow(lastSyncTime, { 
                      addSuffix: true,
                      locale: es 
                    })}
                  </span>
                </div>
              )}
            </div>

            {isOnline && (
              <div className="space-y-2 pt-2 border-t border-border">
                {pendingCount > 0 && (
                  <button
                    onClick={() => syncAll()}
                    disabled={isSyncing}
                    className="w-full px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSyncing ? 'Sincronizando...' : 'Sincronizar ahora'}
                  </button>
                )}

                {failedCount > 0 && (
                  <button
                    onClick={() => retryFailedItems()}
                    disabled={isSyncing}
                    className="w-full px-3 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reintentar errores
                  </button>
                )}
              </div>
            )}

            {!isOnline && (
              <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                Los cambios se guardarán localmente y se sincronizarán cuando vuelva la conexión.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}