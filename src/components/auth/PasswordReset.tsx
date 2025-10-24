"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function PasswordReset() {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Correo enviado",
        description: "Revisa tu bandeja de entrada para restablecer la contraseña.",
      });
      setShowForm(false);
      setEmail("");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el correo de restablecimiento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="text-xs text-blue-600 hover:underline"
      >
        ¿Olvidaste tu contraseña?
      </button>
    );
  }

  return (
    <form onSubmit={handleReset} className="mt-2 space-y-2">
      <Input
        type="email"
        placeholder="tu@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowForm(false)}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
