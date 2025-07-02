"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

const initialUsers = [
  { id: 1, nombre: "Ana Torres", correo: "ana@mail.com", rol: "Admin" },
  { id: 2, nombre: "Carlos Díaz", correo: "carlos@mail.com", rol: "Editor" },
];

export default function UsuariosPage() {
  const [users, setUsers] = useState(initialUsers);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  useEffect(() => {
    if (!open) {
      setNombre("");
      setCorreo("");
      setRol("");
      setEditingUser(null);
    }
  }, [open]);

  const handleGuardar = () => {
    if (!nombre || !correo || !rol) return;

    if (editingUser) {
      // Modo edición
      const actualizados = users.map((u) =>
        u.id === editingUser.id ? { ...u, nombre, correo, rol } : u
      );
      setUsers(actualizados);
    } else {
      // Modo agregar
      const nuevo = {
        id: Date.now(),
        nombre,
        correo,
        rol,
      };
      setUsers([...users, nuevo]);
    }

    // Limpiar
    setNombre("");
    setCorreo("");
    setRol("");
    setEditingUser(null);
    setOpen(false);
  };

  const handleEliminar = (id) => {
    const confirmado = window.confirm(
      "¿Estás seguro de eliminar este usuario?"
    );
    if (!confirmado) return;

    const filtrados = users.filter((u) => u.id !== id);
    setUsers(filtrados);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">👥 Usuarios</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              <Plus className="w-4 h-4" />
              Agregar usuario
            </button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
            <DialogHeader>
              <DialogTitle>Nuevo Usuario</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre" className="mb-1 block">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                />
              </div>
              <div>
                <Label htmlFor="correo" className="mb-1 block">
                  Correo
                </Label>
                <Input
                  id="correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                />
              </div>
              <div>
                <Label htmlFor="rol" className="mb-1 block">
                  Rol
                </Label>
                <Input
                  id="rol"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleGuardar}>
                {editingUser ? "Guardar cambios" : "Agregar usuario"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <table className="w-full text-sm bg-white dark:bg-zinc-800 rounded shadow overflow-hidden">
        <thead>
          <tr className="bg-gray-100 dark:bg-zinc-700 text-left">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Correo</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-t border-gray-200 dark:border-zinc-700"
            >
              <td className="px-4 py-2">{user.nombre}</td>
              <td className="px-4 py-2">{user.correo}</td>
              <td className="px-4 py-2">{user.rol}</td>
              <td className="px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => {
                    setEditingUser(user);
                    setNombre(user.nombre);
                    setCorreo(user.correo);
                    setRol(user.rol);
                    setOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Pencil className="w-4 h-4 inline" />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={() => setUsuarioAEliminar(user)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Estás a punto de eliminar permanentemente a{" "}
                      <span className="font-semibold text-red-500">
                        {usuarioAEliminar?.nombre}
                      </span>
                      . Esta acción no se puede deshacer.
                    </p>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          if (!usuarioAEliminar) return;
                          setUsers(
                            users.filter((u) => u.id !== usuarioAEliminar.id)
                          );
                          setUsuarioAEliminar(null);
                        }}
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
