"use client";

import { useAuth } from '@/contexts/auth-context';
import AuthCard from '@/components/auth/auth-card';
import AppContent from '@/app/app-content';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-64 w-full max-w-md mb-4" />
        <Skeleton className="h-32 w-full max-w-md" />
      </div>
    );
  }

  if (!user) {
    return <AuthCard />;
  }

  return <AppContent />;
}// Force rebuild
