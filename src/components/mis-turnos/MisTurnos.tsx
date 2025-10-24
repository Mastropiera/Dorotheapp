"use client";

import React, { useMemo } from "react";
import type { LocalEvent } from "@/lib/types/calendar";

// ✅ Definir tipos localmente si no están en @/lib/types
export interface ExtraHourEntry {
  id: string;
  date: string;
  hours: number;
  notes?: string;
}

export interface ShiftDetails {
  start: string;
  end: string;
  overnight: boolean;
  symbol: string;
  color: string;
}

export interface ShiftEarningsSettings {
  startDate: Date;
  endDate: Date;
  hourlyRate: number;
  extraHourlyRate: number;
  discountPercent: number;
}

export interface ShiftEarningsSummary {
  totalStandardHours: number;
  totalExtraHours: number;
  totalBruto: number;
  totalLiquido: number;
}

interface MisTurnosProps {
  localEvents: LocalEvent[];
  extraHours: ExtraHourEntry[];
  presetShifts: Record<string, ShiftDetails>;
  settings: ShiftEarningsSettings;
  addExtraHours: (entry: ExtraHourEntry) => void;
}

const MisTurnos: React.FC<MisTurnosProps> = ({
  localEvents,
  extraHours,
  presetShifts,
  settings,
  addExtraHours,
}) => {
  // 🔹 Filtrar turnos dentro del rango de fechas
  const filteredShifts = useMemo(() => {
    return localEvents.filter((ev) => {
      const date = new Date(ev.date);
      return (
        date >= settings.startDate &&
        date <= settings.endDate &&
        ev.type === "shift"
      );
    });
  }, [localEvents, settings]);

  // 🔹 Calcular horas estándar
  const totalStandardHours = useMemo(() => {
    return filteredShifts.reduce((sum, ev) => {
      // ✅ Verificar que shiftType existe y es válido
      if (!ev.shiftType) return sum;
      
      const shift = presetShifts[ev.shiftType];
      if (!shift) return sum;

      // ✅ Convertir formato HH:MM a horas decimales correctamente
      const [startHour, startMin] = shift.start.split(":").map(Number);
      const [endHour, endMin] = shift.end.split(":").map(Number);
      
      let start = startHour + startMin / 60;
      let end = endHour + endMin / 60;
      
      // ✅ Manejar turnos overnight
      if (shift.overnight && end < start) {
        end += 24;
      }
      
      return sum + (end - start);
    }, 0);
  }, [filteredShifts, presetShifts]);

  // 🔹 Calcular horas extra
  const totalExtraHours = useMemo(() => {
    // ✅ Filtrar horas extra dentro del rango de fechas
    return extraHours
      .filter((entry) => {
        const date = new Date(entry.date);
        return date >= settings.startDate && date <= settings.endDate;
      })
      .reduce((sum, entry) => sum + entry.hours, 0);
  }, [extraHours, settings]);

  // 🔹 Calcular bruto y líquido
  const totalBruto = useMemo(() => {
    return (
      totalStandardHours * settings.hourlyRate +
      totalExtraHours * settings.extraHourlyRate
    );
  }, [totalStandardHours, totalExtraHours, settings]);

  const totalLiquido = useMemo(() => {
    return totalBruto * (1 - settings.discountPercent / 100);
  }, [totalBruto, settings]);

  return (
    <div className="bg-card p-4 sm:p-6 rounded-xl shadow-md border border-border space-y-6">
      <h2 className="text-xl font-bold text-foreground">📊 Resumen de Turnos</h2>

      {/* ✅ Período con mejor formato */}
      <div className="bg-muted/50 p-3 rounded-lg">
        <p className="text-sm text-muted-foreground">Período de cálculo</p>
        <p className="font-semibold">
          {settings.startDate.toLocaleDateString("es-CL", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}{" "}
          -{" "}
          {settings.endDate.toLocaleDateString("es-CL", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* ✅ Resumen de horas con mejor diseño */}
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <span className="text-sm font-medium">⏰ Horas estándar</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {totalStandardHours.toFixed(2)} hrs
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
          <span className="text-sm font-medium">⚡ Horas extra</span>
          <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
            {totalExtraHours.toFixed(2)} hrs
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
          <span className="text-sm font-medium">💰 Total bruto</span>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            ${totalBruto.toLocaleString("es-CL")}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
          <span className="text-sm font-medium">💵 Total líquido</span>
          <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
            ${totalLiquido.toLocaleString("es-CL")}
          </span>
        </div>

        {/* ✅ Mostrar descuentos si existen */}
        {settings.discountPercent > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            * Descuentos aplicados: {settings.discountPercent}%
          </p>
        )}
      </div>

      {/* ✅ Detalles adicionales */}
      <div className="pt-4 border-t border-border space-y-2">
        <p className="text-sm text-muted-foreground">
          📅 Turnos trabajados: <span className="font-semibold">{filteredShifts.length}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          💵 Tarifa estándar: <span className="font-semibold">${settings.hourlyRate.toLocaleString("es-CL")}/hora</span>
        </p>
        <p className="text-sm text-muted-foreground">
          ⚡ Tarifa extra: <span className="font-semibold">${settings.extraHourlyRate.toLocaleString("es-CL")}/hora</span>
        </p>
      </div>

      {/* ✅ Botón mejorado para agregar hora extra */}
      <button
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-lg font-medium transition-colors shadow-sm"
        onClick={() =>
          addExtraHours({
            id: `extra-${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            hours: 1,
            notes: "Hora extra añadida manualmente",
          })
        }
      >
        ➕ Agregar 1 hora extra
      </button>
    </div>
  );
};

export default MisTurnos;