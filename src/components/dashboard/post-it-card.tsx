"use client";

import type React from 'react';
import { cn } from '@/lib/utils';

interface PostItCardProps {
  title: string;
  icon: React.ReactNode;
  colorClasses: string;
  onClick: () => void;
  description: string;
  className?: string;
}

export default function PostItCard({ title, icon, colorClasses, onClick, description, className }: PostItCardProps) {
  return (
    <div
      className={cn(
        "cursor-pointer transition-all transform hover:scale-105 hover:shadow-xl rounded-lg flex flex-col justify-center items-center text-center p-4 h-40",
        colorClasses,
        className
      )}
      onClick={onClick}
    >
      <div className="text-foreground/80 mb-2">{icon}</div>
      <h3 className="text-base font-bold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-foreground/70">{description}</p>
    </div>
  );
}