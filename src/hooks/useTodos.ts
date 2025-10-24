"use client";

import { useState, useCallback, useEffect } from "react";
import type { TodoItem } from "@/lib/types/todos";
import { useAuth } from "@/contexts/auth-context";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export function useTodos(initial: TodoItem[] = []) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [todoItems, setTodoItems] = useState<TodoItem[]>(initial);

  // Guardar en Firestore cuando cambian
  const saveTodos = useCallback(
    async (items: TodoItem[]) => {
      if (!user) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { todoItems: items }, { merge: true });
      } catch (error) {
        console.error("Error guardando tareas:", error);
        toast({
          title: "Error al guardar",
          description: "No se pudieron guardar tus tareas.",
          variant: "destructive",
        });
      }
    },
    [user, toast]
  );

  useEffect(() => {
    if (todoItems.length >= 0) {
      saveTodos(todoItems);
    }
  }, [todoItems, saveTodos]);

  // Handlers
  const addTodoItem = (item: Omit<TodoItem, "id" | "completed">) => {
    const newTodo: TodoItem = {
      ...item,
      id: crypto.randomUUID(),
      completed: false,
    };
    setTodoItems((prev) => [newTodo, ...prev]);
    toast({ title: "Tarea añadida", description: newTodo.text });
  };

  const toggleTodoItem = (id: string) => {
    setTodoItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteTodoItem = (id: string) => {
    setTodoItems((prev) => prev.filter((item) => item.id !== id));
    toast({ title: "Tarea eliminada" });
  };

  const clearCompletedTodos = () => {
    setTodoItems((prev) => prev.filter((item) => !item.completed));
    toast({ title: "Tareas completadas eliminadas" });
  };

  return {
    todoItems,
    addTodoItem,
    toggleTodoItem,
    deleteTodoItem,
    clearCompletedTodos,
  };
}
