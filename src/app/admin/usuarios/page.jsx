"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UsuariosAdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Panel de Usuarios 🔐</h1>
        {/* Aquí podrías cargar tus componentes de Usuarios */}
    </div>
  )
}
