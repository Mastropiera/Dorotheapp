
"use client";

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SavedShoppingList, IncomeEntry, ManualExpenseEntry } from '@/lib/types';
import { PiggyBank, CalendarDays, TrendingUp, TrendingDown, Wallet, PlusCircle, ArrowDown, ArrowUp, ShoppingBag, Trash2 } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface MisFinanzasDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shoppingLists: SavedShoppingList[];
  incomeEntries: IncomeEntry[];
  onAddIncomeEntry: (entry: Omit<IncomeEntry, 'id'>) => void;
  onDeleteIncomeEntry: (id: string) => void;
  manualExpenseEntries: ManualExpenseEntry[];
  onAddManualExpenseEntry: (entry: Omit<ManualExpenseEntry, 'id'>) => void;
  onDeleteManualExpenseEntry: (id: string) => void;
}

export default function MisFinanzasDialog({
  isOpen,
  onOpenChange,
  shoppingLists,
  incomeEntries,
  onAddIncomeEntry,
  onDeleteIncomeEntry,
  manualExpenseEntries,
  onAddManualExpenseEntry,
  onDeleteManualExpenseEntry,
}: MisFinanzasDialogProps) {
  const [newIncomeDescription, setNewIncomeDescription] = useState('');
  const [newIncomeAmount, setNewIncomeAmount] = useState('');
  const [newIncomeDate, setNewIncomeDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const [newManualExpenseDescription, setNewManualExpenseDescription] = useState('');
  const [newManualExpenseAmount, setNewManualExpenseAmount] = useState('');
  const [newManualExpenseDate, setNewManualExpenseDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const totalIncome = useMemo(() => {
    return incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  }, [incomeEntries]);

  const totalShoppingExpenses = useMemo(() => {
    return shoppingLists.reduce((sum, list) => sum + list.total, 0);
  }, [shoppingLists]);

  const totalManualExpenses = useMemo(() => {
    return manualExpenseEntries.reduce((sum, entry) => sum + entry.amount, 0);
  }, [manualExpenseEntries]);

  const totalExpenses = useMemo(() => {
    return totalShoppingExpenses + totalManualExpenses;
  }, [totalShoppingExpenses, totalManualExpenses]);
  
  const balance = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  const handleAddIncome = () => {
    const amount = parseFloat(newIncomeAmount);
    if (newIncomeDescription.trim() && !isNaN(amount) && amount > 0 && newIncomeDate) {
      onAddIncomeEntry({
        description: newIncomeDescription.trim(),
        amount,
        date: newIncomeDate,
      });
      setNewIncomeDescription('');
      setNewIncomeAmount('');
      setNewIncomeDate(format(new Date(), 'yyyy-MM-dd'));
    }
  };

  const handleAddManualExpense = () => {
    const amount = parseFloat(newManualExpenseAmount);
    if (newManualExpenseDescription.trim() && !isNaN(amount) && amount > 0 && newManualExpenseDate) {
      onAddManualExpenseEntry({
        description: newManualExpenseDescription.trim(),
        amount,
        date: newManualExpenseDate,
      });
      setNewManualExpenseDescription('');
      setNewManualExpenseAmount('');
      setNewManualExpenseDate(format(new Date(), 'yyyy-MM-dd'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <PiggyBank className="mr-2 h-6 w-6 text-primary" />
            Mis Finanzas
          </DialogTitle>
          <DialogDescription>
            Registra tus ingresos y gastos, revisa tus compras y calcula tu balance.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-3 mt-4">
          <div className="space-y-4 bg-card p-4 rounded-lg shadow border">
            <div className="flex flex-col gap-2"> {/* Cambiado a flex-col y gap-2 */}
              <div className="text-center p-2 rounded-md bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700">
                <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center justify-center"><ArrowUp className="mr-1 h-3 w-3" />INGRESOS</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">${totalIncome.toFixed(2)}</p>
              </div>
              <Separator className="my-1" />
              <div className="text-center p-2 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center justify-center"><ArrowDown className="mr-1 h-3 w-3" />GASTOS</p>
                <p className="text-xl font-bold text-red-700 dark:text-red-300">${totalExpenses.toFixed(2)}</p>
              </div>
              <Separator className="my-1" />
              <div className="text-center p-2 rounded-md bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center justify-center"><Wallet className="mr-1 h-3 w-3" />BALANCE</p>
                <p className={`text-xl font-bold ${balance >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-destructive'}`}>
                  ${balance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <Accordion type="multiple" defaultValue={['ingresos', 'gastos']} className="w-full space-y-4">
            <AccordionItem value="ingresos" className="border rounded-lg shadow-sm bg-card overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
                <div className="flex items-center text-lg font-medium text-green-600">
                  <TrendingUp className="mr-2 h-5 w-5" /> Ingresos
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                <div className="space-y-3 mb-4 pt-3 border-t">
                  <Input
                    placeholder="Descripción del ingreso"
                    value={newIncomeDescription}
                    onChange={(e) => setNewIncomeDescription(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Monto"
                      value={newIncomeAmount}
                      onChange={(e) => setNewIncomeAmount(e.target.value)}
                      className="w-1/2"
                    />
                    <Input
                      type="date"
                      value={newIncomeDate}
                      onChange={(e) => setNewIncomeDate(e.target.value)}
                      className="w-1/2"
                    />
                  </div>
                  <Button onClick={handleAddIncome} className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir Ingreso
                  </Button>
                </div>
                {incomeEntries.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-3">No hay ingresos registrados.</p>
                ) : (
                  <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {incomeEntries.map((entry) => (
                      <li key={entry.id} className="flex justify-between items-center p-2 border rounded-md text-sm hover:bg-muted/20">
                        <div className="flex-grow">
                          <p className="font-medium">{entry.description}</p>
                          <p className="text-xs text-muted-foreground">{format(parseISO(entry.date), "PPP", { locale: es })}</p>
                        </div>
                        <span className="font-semibold text-green-600 mr-2">${entry.amount.toFixed(2)}</span>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteIncomeEntry(entry.id)} aria-label="Eliminar ingreso">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="gastos" className="border rounded-lg shadow-sm bg-card overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
                <div className="flex items-center text-lg font-medium text-red-600">
                  <TrendingDown className="mr-2 h-5 w-5" /> Gastos
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0 space-y-6">
                <div className="pt-3 border-t">
                    <h4 className="text-md font-medium mb-2 flex items-center text-foreground">
                        <PlusCircle className="mr-2 h-4 w-4 text-red-500" />
                        Añadir Otro Gasto
                    </h4>
                    <div className="space-y-3 mb-4">
                    <Input
                        placeholder="Descripción del gasto"
                        value={newManualExpenseDescription}
                        onChange={(e) => setNewManualExpenseDescription(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <Input
                        type="number"
                        placeholder="Monto"
                        value={newManualExpenseAmount}
                        onChange={(e) => setNewManualExpenseAmount(e.target.value)}
                        className="w-1/2"
                        />
                        <Input
                        type="date"
                        value={newManualExpenseDate}
                        onChange={(e) => setNewManualExpenseDate(e.target.value)}
                        className="w-1/2"
                        />
                    </div>
                    <Button onClick={handleAddManualExpense} className="w-full bg-red-500 hover:bg-red-600 text-white">
                        <PlusCircle className="mr-2 h-4 w-4" /> Añadir Gasto Manual
                    </Button>
                    </div>
                    {manualExpenseEntries.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic text-center py-3">No hay otros gastos registrados.</p>
                    ) : (
                    <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {manualExpenseEntries.map((entry) => (
                        <li key={entry.id} className="flex justify-between items-center p-2 border rounded-md text-sm hover:bg-muted/20">
                            <div className="flex-grow">
                            <p className="font-medium">{entry.description}</p>
                            <p className="text-xs text-muted-foreground">{format(parseISO(entry.date), "PPP", { locale: es })}</p>
                            </div>
                            <span className="font-semibold text-red-600 mr-2">${entry.amount.toFixed(2)}</span>
                            <Button variant="ghost" size="icon" onClick={() => onDeleteManualExpenseEntry(entry.id)} aria-label="Eliminar gasto">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </li>
                        ))}
                    </ul>
                    )}
                </div>
                
                <Separator />

                <div>
                    <h4 className="text-md font-medium mb-2 flex items-center text-foreground">
                       <ShoppingBag className="mr-2 h-4 w-4 text-red-500" />
                        Compras Guardadas
                    </h4>
                    {shoppingLists.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic text-center py-3">No hay compras guardadas.</p>
                    ) : (
                    <div className="max-h-60 overflow-y-auto pr-1">
                    {shoppingLists.map((list) => (
                        <Accordion key={list.id} type="single" collapsible className="w-full mb-2 border rounded-md">
                        <AccordionItem value={`shopping-${list.id}`}>
                                <AccordionTrigger className="text-sm px-3 py-2 hover:bg-muted/30">
                                    <div className="flex justify-between w-full">
                                        <span className="flex items-center">
                                            <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {format(parseISO(list.date), "PPP p", { locale: es })}
                                        </span>
                                        <span className="font-semibold">${list.total.toFixed(2)}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-3 pb-2 pt-0">
                                    <ul className="space-y-1 text-xs pl-2 border-l ml-2 mt-1">
                                        {list.items.map(item => (
                                            <li key={item.id} className="flex justify-between">
                                                <span>{item.name} {item.checked ? "(✓)" : ""}</span>
                                                <span>{item.price > 0 ? `$${item.price.toFixed(2)}` : "-"}</span>
                                            </li>
                                        ))}
                                        <li className="font-medium border-t pt-1 mt-1">
                                            Total: ${list.total.toFixed(2)}
                                        </li>
                                    </ul>
                                </AccordionContent>
                        </AccordionItem>
                        </Accordion>
                    ))}
                    </div>
                    )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    
