
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail,
  signOut,
  User,
  Auth,
} from "firebase/auth";
import { auth } from "@/lib/firebase"; // tu instancia de Firebase Auth
import { useGoogleApi } from "./google-api-context";
import { GOOGLE_API_SCOPES } from "@/lib/google-calendar-config";
import { useToast } from "@/hooks/use-toast";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // No podemos usar useGoogleApi aquí arriba porque está fuera del proveedor.
  // Pero lo necesitaremos en el logout.

  // Detecta cambios de sesión
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Maneja el resultado de redirección de Google
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          setUser(result.user);
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
              localStorage.setItem('google_access_token', credential.accessToken);
          }
        }
      } catch (error) {
        console.error("Error after redirect:", error);
      }
    };
    checkRedirect();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    await setPersistence(auth, browserLocalPersistence);
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // 1. Agregar los scopes solicitados
    provider.addScope('https://www.googleapis.com/auth/calendar');
    provider.addScope('https://www.googleapis.com/auth/tasks');

    try {
      await setPersistence(auth, browserLocalPersistence);
      const isRemote = typeof window !== 'undefined' && window.location.hostname.includes("cloudworkstations.dev");

      if (isRemote) {
        await signInWithRedirect(auth, provider);
        // El resultado se manejará en el useEffect de getRedirectResult
      } else {
        const result = await signInWithPopup(auth, provider);
        // 3. Obtener el credential y el access token del resultado
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          // 2. Guardar el access token en localStorage
          localStorage.setItem('google_access_token', credential.accessToken);
        }
        setUser(result.user);
      }
    } catch (error: any) {
      // 4. Manejo de errores
      console.error("Error durante el inicio de sesión con Google:", error);
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        toast({
          title: "Inicio de sesión cancelado",
          description: "La ventana de inicio de sesión de Google fue cerrada.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error de autenticación",
          description: "No se pudo completar el inicio de sesión con Google. Revisa la consola para más detalles.",
          variant: "destructive",
        });
      }
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    // Aquí no podemos usar el hook, pero la lógica de logout del contexto de google
    // se llamará desde AppContent, donde ambos contextos están disponibles.
    localStorage.removeItem('google_access_token');
    await signOut(auth);
    // Limpieza adicional si fuera necesaria
    console.log("Firebase logout successful");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        register,
        loginWithGoogle,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
