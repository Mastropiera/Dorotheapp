"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const oobCode = searchParams?.get("oobCode") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setError("Código de recuperación inválido o ausente.");
    }
  }, [oobCode]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess(true);
      setTimeout(() => router.push("/"), 3000);
    } catch (err: any) {
      console.error("Error al restablecer contraseña:", err);
      setError("El enlace no es válido o ha expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Restablecer contraseña</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success ? (
          <p className="text-green-600">
            Tu contraseña se ha restablecido correctamente. 
            Serás redirigido al inicio en unos segundos.
          </p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirm">Confirmar contraseña</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Cambiar contraseña"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
