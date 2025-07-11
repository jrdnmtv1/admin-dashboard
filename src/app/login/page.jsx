"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useAuth } from "../context/auth-context";

const schema = z.object({
  correo: z.string().email("Correo invalido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      schema.parse({ correo, password });
      setErrores({});

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.mensaje || "Error al iniciar sesión");
        return;
      }

      // Guardar token
    //   localStorage.setItem("token", data.token);

      // Usar el login del contexto
login(data.token);


      // Redirigir
      router.push("/");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const erroresZod = {};
        err.errors.forEach((e) => {
          erroresZod[e.path[0]] = e.message;
        });
        setErrores(erroresZod);
      } else {
        setMensaje("Ocurrió un error inesperado");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-lg shadow space-y-6">
        <h1 className="text-2xl font-bold text-center text-zinc-800 dark:text-white">
          Iniciar Sesión
        </h1>

        <div>
          <Label htmlFor="correo" className="mb-1">Correo</Label>
          <Input
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className={`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 ${errores.correo ? "border-red-500" : ""}`}
          />
          {errores.correo && (
            <p className="text-sm text-red-500 mt-1">{errores.correo}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="mb-1">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 ${errores.password ? "border-red-500" : ""}`}
          />
          {errores.password && (
            <p className="text-sm text-red-500 mt-1">{errores.password}</p>
          )}
        </div>

        {mensaje && (
          <p className="text-sm text-red-500 bg-red-100 dark:bg-red-950 dark:text-red-400 rounded px-3 py-2">
            {mensaje}
          </p>
        )}

        <button onClick={handleLogin} className="bg-blue-600 text-white mx-auto block px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
          Ingresar
        </button>
      </div>
    </div>
  );
}
