"use client";

import PostItCard from './post-it-card';
import { ListChecks } from 'lucide-react';
import type { TodoItem } from '@/lib/types';
import { Badge } from '../ui/badge';

interface PendientesCardProps {
  items: TodoItem[];
  onClick: () => void;
}

export default function PendientesCard({ items, onClick }: PendientesCardProps) {
  const pendingItemsCount = items.filter(item => !item.completed).length;

  return (
    <PostItCard
        title="Pendientes"
        icon={
            <div className="relative">
                <ListChecks className="w-8 h-8" />
                {pendingItemsCount > 0 && 
                    <Badge variant="destructive" className="absolute -top-2 -right-3 h-5 w-5 justify-center rounded-full p-0">
                        {pendingItemsCount}
                    </Badge>
                }
             </div>
        }
        colorClasses="bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700/60"
        onClick={onClick}
        description="Gestiona tus tareas con Google Tasks."
        className="col-span-1"
    />
  );
}
