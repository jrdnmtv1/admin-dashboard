"use client";

import { useAuth } from "@/app/context/auth-context";

export default function Header() {
  const { usuario } = useAuth();
  return (
    <header className="bg-white dark:bg-zinc-800 px-6 py-4 border-b border-gray-200 dark:border-zinc-700 shadow-sm flex justify-between items-center">
      <h1 className="text-xl font-bold">Panel de administración</h1>
      {usuario && (
        <div className="text-sm">
          Bienvenido, <span className="font-semibold">{usuario.nombre}</span>
        </div>
      )}
    </header>
  );
}
