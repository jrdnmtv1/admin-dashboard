"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/context/auth-context";

const schema = z.object({
  nombre: z.string().min(1, "Nombre obligatorio"),
  correo: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  const router = useRouter();
  const { login } = useAuth();

  const handleRegister = async () => {
    try {
      schema.parse({ nombre, correo, password });
      setErrores({});
      setMensaje("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, correo, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.message || "Error al registrarse");
        return;
      }

      if (!data.token) {
        setMensaje("Error: token no recibido del servidor");
        return;
      }

      login(data.token);
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
    <div className="max-w-md mx-auto mt-10 space-y-6 bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-center">Registrarse</h2>
      <div>
        <Label htmlFor="nombre" className="mb-1">
          Nombre
        </Label>
        <Input
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 ${
            errores.nombre ? "border-red-500" : ""
          }`}
        />
        {errores.nombre && (
          <p className="text-sm text-red-500">{errores.nombre}</p>
        )}
      </div>
      <div>
        <Label htmlFor="correo" className="mb-1">
          Correo
        </Label>
        <Input
          id="correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className={`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 ${
            errores.correo ? "border-red-500" : ""
          }`}
        />
        {errores.correo && (
          <p className="text-sm text-red-500">{errores.correo}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password" className="mb-1">
          Contraseña
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 ${
            errores.password ? "border-red-500" : ""
          }`}
        />
        {errores.password && (
          <p className="text-sm text-red-500">{errores.password}</p>
        )}
      </div>

      {mensaje && <p className="text-red-500">{mensaje}</p>}

      <Button
        onClick={handleRegister}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        Registrarse
      </Button>
    </div>
  );
}
