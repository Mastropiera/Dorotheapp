// src/app/TestFirestore.tsx
"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface FirestoreData {
  [key: string]: any;
}

export default function TestFirestore({ userId }: { userId: string }) {
  const [data, setData] = useState<FirestoreData | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const docRef = doc(db, "usuarios", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
          console.log("Documento:", docSnap.data());
        } else {
          // Si no existe, crea un documento de prueba
          await setDoc(docRef, { welcome: `Hola ${userId}` });
          setData({ welcome: `Hola ${userId}` });
          console.log("Documento creado:", { welcome: `Hola ${userId}` });
        }
      } catch (error) {
        console.error("Error Firestore:", error);
      }
    };

    fetchData();
  }, [userId]);

  if (!userId) return <div>No hay usuario autenticado</div>;

  return (
    <div>
      <h2>Datos Firestore del usuario:</h2>
      <pre>{data ? JSON.stringify(data, null, 2) : "Cargando..."}</pre>
    </div>
  );
}
