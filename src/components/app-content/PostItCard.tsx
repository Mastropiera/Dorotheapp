// src/components/app-content/PostItCard.tsx
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TodoItem } from "@/lib/types/todos";

// Función para obtener el color según el tipo
const getPostItColor = (type: string) => {
  const colors = {
    todo: "bg-yellow-100 dark:bg-yellow-900",
    log: "bg-red-100 dark:bg-red-900",
    vademecum: "bg-green-100 dark:bg-green-900",
    "lm-compatibility": "bg-purple-100 dark:bg-purple-900",
    calculator: "bg-blue-100 dark:bg-blue-900",
    "child-health": "bg-pink-100 dark:bg-pink-900",
    trivia: "bg-orange-100 dark:bg-orange-900",
    scale: "bg-teal-100 dark:bg-teal-900",
    patients: "bg-indigo-100 dark:bg-indigo-900",
    notes: "bg-lime-100 dark:bg-lime-900",
    shifts: "bg-cyan-100 dark:bg-cyan-900",
    shopping: "bg-rose-100 dark:bg-rose-900",
    finance: "bg-emerald-100 dark:bg-emerald-900",
    cycle: "bg-fuchsia-100 dark:bg-fuchsia-900",
    medication: "bg-violet-100 dark:bg-violet-900",
  };
  return colors[type as keyof typeof colors] || "bg-yellow-100 dark:bg-yellow-900";
};

// Función para hover según el tipo
const getPostItHoverColor = (type: string) => {
  const colors = {
    todo: "hover:bg-yellow-200 dark:hover:bg-yellow-800",
    log: "hover:bg-red-200 dark:hover:bg-red-800",
    vademecum: "hover:bg-green-200 dark:hover:bg-green-800",
    "lm-compatibility": "hover:bg-purple-200 dark:hover:bg-purple-800",
    calculator: "hover:bg-blue-200 dark:hover:bg-blue-800",
    "child-health": "hover:bg-pink-200 dark:hover:bg-pink-800",
    trivia: "hover:bg-orange-200 dark:hover:bg-orange-800",
    scale: "hover:bg-teal-200 dark:hover:bg-teal-800",
    patients: "hover:bg-indigo-200 dark:hover:bg-indigo-800",
    notes: "hover:bg-lime-200 dark:hover:bg-lime-800",
    shifts: "hover:bg-cyan-200 dark:hover:bg-cyan-800",
    shopping: "hover:bg-rose-200 dark:hover:bg-rose-800",
    finance: "hover:bg-emerald-200 dark:hover:bg-emerald-800",
    cycle: "hover:bg-fuchsia-200 dark:hover:bg-fuchsia-800",
    medication: "hover:bg-violet-200 dark:hover:bg-violet-800",
  };
  return colors[type as keyof typeof colors] || "hover:bg-yellow-200 dark:hover:bg-yellow-800";
};

interface SimplePostItCardProps {
  title: string;
  type: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

interface TodoPostItCardProps {
  title: string;
  type: string;
  items: TodoItem[];
  onAddItem: (item: Omit<TodoItem, "id" | "completed">) => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearCompleted?: () => void;
  onClick?: () => void;
  children?: React.ReactNode;
}

// Card simple para navegación
export const PostItCard: React.FC<SimplePostItCardProps> = ({
  title,
  type,
  onClick,
  children,
}) => {
  return (
    <div 
      className={cn(
        "rounded-lg p-4 shadow-md w-64 h-40 flex flex-col justify-between",
        getPostItColor(type),
        onClick ? `cursor-pointer ${getPostItHoverColor(type)} transition-colors` : ""
      )}
      onClick={onClick}
    >
      <h2 className="text-lg font-bold">{title}</h2>
      {children && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </div>
  );
};

// Card para TODOs
export const TodoPostItCard: React.FC<TodoPostItCardProps> = ({
  title,
  type,
  items,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onClearCompleted,
  children,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onAddItem({ text: trimmed });
      setInputValue("");
    }
  };

  return (
    <div className={cn(
      "rounded-lg p-4 shadow-md w-64 min-h-40 flex flex-col",
      getPostItColor(type)
    )}>
      <h2 className="text-lg font-bold mb-2">{title}</h2>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          className="flex-grow p-1 border rounded text-sm"
          placeholder="Añadir nuevo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button size="sm" onClick={handleAdd}>
          +
        </Button>
      </div>

      <ul className="space-y-1 max-h-48 overflow-y-auto flex-grow">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "flex justify-between items-center p-1 rounded text-sm",
              item.completed ? "line-through text-gray-500" : ""
            )}
          >
            <span
              className="cursor-pointer flex-grow"
              onClick={() => onToggleItem(item.id)}
            >
              {item.text}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => onDeleteItem(item.id)}
            >
              ×
            </Button>
          </li>
        ))}
      </ul>

      {onClearCompleted && items.some((i) => i.completed) && (
        <div className="mt-2">
          <Button size="sm" variant="outline" onClick={onClearCompleted}>
            Limpiar completados
          </Button>
        </div>
      )}

      {children && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </div>
  );
};