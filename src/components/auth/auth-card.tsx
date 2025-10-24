
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AuthCard() {
  const { register, loginWithEmail, loginWithGoogle, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password);
      toast({
        title: "Registro Exitoso",
        description: "Tu cuenta ha sido creada. ¡Bienvenida!", 
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Ocurrió un error desconocido.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este correo electrónico ya está registrado.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña debe tener al menos 6 caracteres.";
      }
      toast({
        title: "Error de Registro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Correo o contraseña incorrectos.";
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        errorMessage = "Correo o contraseña incorrectos.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "Esta cuenta ha sido deshabilitada.";
      }
      toast({
        title: "Error de Inicio de Sesión",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: any) {
       console.error("Google login failed", error);
        toast({
          title: "Error de inicio de sesión con Google",
          description: error.message || "Ocurrió un error inesperado.",
          variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <CardTitle className="text-4xl text-primary font-untalo-cursive">
              Dorothea
            </CardTitle>
            <Image
              src="/avatars/gatita.webp"
              alt="Dorothea illustration"
              width={60}
              height={60}
              className="rounded-lg"
            />
          </div>
          <CardDescription className="text-sm text-muted-foreground pt-2 px-4 text-justify">
            <p className="mb-2">
              Dorothea es un organizador diario para Enfermería.
            </p>
            <p>
              Incluye un calendario de turnos, programación de actividades y
              tareas y otras funciones de organización personal, y además
              integra herramientas de uso clínico: escalas de evaluación,
              calculadoras, registro de RCP y otras funciones que facilitarán tu
              trabajo diario{" "}
              <Heart className="inline-block h-4 w-4 text-blue-500 fill-blue-500" />
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Acceder</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4 py-4">
                  <div className="space-y-1">
                    <Label htmlFor="login-email">Correo</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <p className="text-xs text-muted-foreground text-right">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!email) {
                          toast({
                            title: "Ingresa tu correo",
                            description:
                              "Por favor, escribe tu correo antes de solicitar un restablecimiento.",
                            variant: "destructive",
                          });
                          return;
                        }
                        await resetPassword(email);
                      }}
                      className="underline hover:text-primary"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER */}
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <div className="space-y-4 py-4">
                  <div className="space-y-1">
                    <Label htmlFor="register-email">Correo</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Registrando..." : "Crear Cuenta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-xs text-muted-foreground text-center">
              Conecta tu cuenta de Google para sincronizar tu Calendario y
              Tareas. (Verificación de la app en proceso).
            </p>
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Conectando..." : "Iniciar Sesión con Google"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center pt-4">
          <p className="text-xs text-muted-foreground text-center">
            Al registrarte o iniciar sesión, aceptas nuestros{" "}
            <Link
              href="/terms.html"
              target="_blank"
              className="underline hover:text-primary"
            >
              Términos de Servicio
            </Link>{" "}
            y nuestra{" "}
            <Link
              href="/privacy.html"
              target="_blank"
              className="underline hover:text-primary"
            >
              Política de Privacidad
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
