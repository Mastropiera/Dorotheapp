"use client";

import { useState, useCallback, useEffect } from "react";
import type { Patient, PatientNote } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export function usePacientes(
  initialPatients: Patient[] = [],
  initialNotes: Record<string, PatientNote[]> = {}
) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [patientNotes, setPatientNotes] = useState<Record<string, PatientNote[]>>(initialNotes);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Guardar en Firestore
  const savePatientData = useCallback(
    async (field: string, data: any) => {
      if (!user) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { [field]: data }, { merge: true });
      } catch (error) {
        console.error(`Error guardando ${field}:`, error);
        toast({
          title: "Error al guardar",
          description: "No se pudieron guardar tus datos de pacientes.",
          variant: "destructive",
        });
      }
    },
    [user, toast]
  );

  useEffect(() => {
    savePatientData("patients", patients);
  }, [patients, savePatientData]);

  useEffect(() => {
    savePatientData("patientNotes", patientNotes);
  }, [patientNotes, savePatientData]);

  // Handlers para Pacientes
  const addPatient = (patientData: Omit<Patient, "id" | "createdAt">) => {
    const newPatient: Patient = {
      ...patientData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setPatients((prev) =>
      [...prev, newPatient].sort((a, b) => a.name.localeCompare(b.name))
    );
    toast({
      title: "Paciente Añadido",
      description: `El paciente "${newPatient.name}" ha sido añadido.`,
    });
  };

  const deletePatient = (patientId: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== patientId));
    setPatientNotes((prev) => {
      const { [patientId]: _, ...rest } = prev;
      return rest;
    });
    if (selectedPatientId === patientId) {
      setSelectedPatientId(null);
    }
    toast({ title: "Paciente Eliminado", variant: "destructive" });
  };

  // Handlers para Notas
  const addPatientNote = (
    patientId: string,
    noteContent: string,
    vitalSigns?: PatientNote["vitalSigns"]
  ) => {
    if (!patientId || !noteContent.trim()) return;
    const newNote: PatientNote = {
      id: crypto.randomUUID(),
      patientId,
      content: noteContent.trim(),
      vitalSigns: vitalSigns,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPatientNotes((prev) => {
      const patientSpecificNotes = prev[patientId] || [];
      return {
        ...prev,
        [patientId]: [newNote, ...patientSpecificNotes],
      };
    });
    toast({
      title: "Nota Añadida",
      description: "Se ha añadido una nota para el paciente.",
    });
  };

  const deletePatientNote = (patientId: string, noteId: string) => {
    setPatientNotes((prev) => {
      const patientSpecificNotes = (prev[patientId] || []).filter(
        (note) => note.id !== noteId
      );
      return {
        ...prev,
        [patientId]: patientSpecificNotes,
      };
    });
    toast({ title: "Nota Eliminada", variant: "destructive" });
  };

  return {
    patients,
    patientNotes,
    selectedPatientId,
    setSelectedPatientId,
    addPatient,
    deletePatient,
    addPatientNote,
    deletePatientNote,
  };
}