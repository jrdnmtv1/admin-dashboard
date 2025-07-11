"use client";

import { useAuth } from "./context/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated]);

  if(isLoading) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bienvenido al panel</h1>
      {/* Aquí puedes agregar tarjetas de resumen, accesos rápidos, estadísticas, etc. */}
      <p className="text-gray-600">Selecciona una sección desde el menú lateral</p>
    </div>
  )
}
