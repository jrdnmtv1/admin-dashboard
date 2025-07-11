"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, Package, LogIn, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "@/app/context/auth-context";

const navItems = [
  {
    name: "Inicio",
    path: "/",
    icon: <Home className="w-5 h-5" />,
    public: true,
  },
  {
    name: "Login",
    path: "/login",
    icon: <LogIn className="w-5 h-5" />,
    public: true,
  },
  {
    name: "Registrarse",
    path: "/register",
    icon: <UserPlus className="w-5 h-5" />,
    public: true,
  },
  {
    name: "Usuarios",
    path: "/usuarios",
    icon: <Users className="w-5 h-5" />,
    rol: "Admin",
  },
  {
    name: "Productos",
    path: "/productos",
    icon: <Package className="w-5 h-5" />,
    privado: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { usuario, isAuthenticated, logout, isLoading } = useAuth();

  // ⛔ Evita renderizar el sidebar mientras carga el estado
  if (isLoading) return null;

  return (
    <aside className="w-60 bg-zinc-800 text-white p-4 space-y-4 hidden md:block">
      <h2 className="text-xl font-bold mb-6">Admin</h2>
      <nav className="space-y-2">
        {navItems.map((item) => {
          // Mostrar solo si es público, privado con sesión, o por rol
          if (item.public && !isAuthenticated) return renderLink(item, pathname);
          if (item.privado && isAuthenticated)
            return renderLink(item, pathname);
          if (item.rol && usuario?.rol === item.rol)
            return renderLink(item, pathname);
        })}

        {isAuthenticated && (
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex items-center gap-3 px-4 py-2 rounded transition hover:bg-red-600 w-full text-left mt-4 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        )}
      </nav>
    </aside>
  );

  function renderLink(item, pathname) {
    const isActive = pathname === item.path;
    return (
      <Link
        key={item.path}
        href={item.path}
        className={`flex items-center gap-3 px-4 py-2 rounded transition hover:bg-zinc-700 ${
          isActive ? "bg-zinc-700" : ""
        }`}
      >
        {item.icon}
        {item.name}
      </Link>
    );
  }
}
