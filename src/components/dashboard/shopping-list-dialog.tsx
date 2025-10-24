
"use client";

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { ShoppingListItem, SavedShoppingList } from '@/lib/types';
import { PlusCircle, Trash2, ShoppingCart, Save, Eraser } from 'lucide-react';
import { format } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';

interface ShoppingListDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveList: (list: SavedShoppingList) => void;
}

export default function ShoppingListDialog({
  isOpen,
  onOpenChange,
  onSaveList,
}: ShoppingListDialogProps) {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  useEffect(() => {
    // Reset form when dialog closes or opens
    if (!isOpen) {
        setItems([]);
        setNewItemName('');
    }
  }, [isOpen]);

  const handleAddItem = () => {
    if (newItemName.trim()) {
      const newItem: ShoppingListItem = {
        id: crypto.randomUUID(),
        name: newItemName.trim(),
        price: 0, // Price defaults to 0
        checked: false,
      };
      setItems(prev => [...prev, newItem]);
      setNewItemName('');
    }
  };

  const handleToggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleItemPriceChange = (id: string, newPrice: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, price: isNaN(newPrice) ? 0 : newPrice } : item
      )
    );
  };

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price || 0), 0);
  }, [items]);

  const handleSaveList = () => {
    if (items.length > 0) {
      const savedList: SavedShoppingList = {
        id: crypto.randomUUID(),
        date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        items: [...items], // Save a copy
        total,
      };
      onSaveList(savedList);
      setItems([]); // Clear current list
      onOpenChange(false); // Close dialog
    }
  };

  const handleClearCurrentList = () => {
    setItems([]);
    setIsClearConfirmOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <ShoppingCart className="mr-2 h-6 w-6 text-primary" />
              Lista de Compras
            </DialogTitle>
            <DialogDescription>
              Añade ítems, marca los comprados e ingresa sus precios.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Nombre del ítem"
                className="flex-grow"
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              />
              <Button onClick={handleAddItem} size="icon" aria-label="Añadir ítem">
                <PlusCircle />
              </Button>
            </div>
            
            <ScrollArea className="h-[250px] pr-3">
               {items.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-4">No hay ítems en la lista.</p>
              ) : (
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-2 p-2 border rounded-md hover:bg-muted/50">
                      <div className="flex items-center gap-2 flex-grow">
                         <Checkbox
                          id={`shop-${item.id}`}
                          checked={item.checked}
                          onCheckedChange={() => handleToggleItem(item.id)}
                          aria-labelledby={`shop-label-${item.id}`}
                        />
                        <label 
                          htmlFor={`shop-${item.id}`}
                          id={`shop-label-${item.id}`}
                          className={`flex-grow cursor-pointer ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {item.name}
                        </label>
                      </div>
                      <Input
                        type="number"
                        value={item.price === 0 && !item.checked ? '' : item.price.toString()}
                        onChange={(e) => handleItemPriceChange(item.id, parseFloat(e.target.value))}
                        placeholder="Precio"
                        className="w-24 text-sm h-8 text-right"
                        disabled={item.checked}
                        min="0"
                        step="0.01"
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)} aria-label="Eliminar ítem">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </div>
          
          <div className="mt-4 pt-4 border-t">
              <p className="text-lg font-semibold text-right">
                Total Estimado: ${total.toFixed(2)}
              </p>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsClearConfirmOpen(true)}
              disabled={items.length === 0}
            >
              <Eraser className="mr-2 h-4 w-4" />
              Limpiar Lista
            </Button>
            <Button onClick={handleSaveList} disabled={items.length === 0}>
              <Save className="mr-2 h-4 w-4" />
              Finalizar y Guardar Compra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isClearConfirmOpen} onOpenChange={setIsClearConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Limpiar Lista Actual?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás segura de que quieres eliminar todos los ítems de la lista actual? Esta acción no se puede deshacer y no afectará las compras ya guardadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsClearConfirmOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearCurrentList}
            >
              Sí, Limpiar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
