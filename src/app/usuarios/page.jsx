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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// const initialUsers = [
//   { id: 1, nombre: "Ana Torres", correo: "ana@mail.com", rol: "Admin" },
//   { id: 2, nombre: "Carlos Díaz", correo: "carlos@mail.com", rol: "Editor" },
// ];

export default function UsuariosPage() {
  const [users, setUsers] = useState([]);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 8;

  useEffect(() => {
    fetch("http://localhost:4000/api/usuarios")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar usuarios: ", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!open) {
      setNombre("");
      setCorreo("");
      setRol("");
      setEditingUser(null);
      setError("");
    }
  }, [open]);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const usuariosFiltrados = users.filter((user) =>
    user.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * usuariosPorPagina,
    paginaActual * usuariosPorPagina
  );

  const esCorreoValido = (correo) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  };

  const handleGuardar = async () => {
    if (!nombre.trim() || !correo.trim() || !rol.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!esCorreoValido(correo)) {
      setError("El correo electrónico no es válido");
      return;
    }

    // Limpiar errores si pasa validación
    setError("");

    try {
      if (editingUser) {
        const res = await fetch(
          `http://localhost:4000/api/usuarios/${editingUser._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, correo, rol }),
          }
        );

        const actualizado = await res.json();
        setUsers(
          users.map((u) => (u._id === actualizado._id ? actualizado : u))
        );
      } else {
        const res = await fetch(`http://localhost:4000/api/usuarios`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, correo, rol }),
        });

        const creado = await res.json();
        setUsers([...users, creado]);
      }

      setNombre("");
      setCorreo("");
      setRol("");
      setEditingUser(null);
      setOpen(false);
      setError("");
    } catch (err) {
      console.error("Error al guardar usuario: ", err);
      setError("No se pudo guardar el usuario.");
    }

    // if (editingUser) {
    //   // Modo edición
    //   const actualizados = users.map((u) =>
    //     u.id === editingUser.id ? { ...u, nombre, correo, rol } : u
    //   );
    //   setUsers(actualizados);
    // } else {
    //   // Modo agregar
    //   const nuevo = {
    //     id: Date.now(),
    //     nombre,
    //     correo,
    //     rol,
    //   };
    //   setUsers([...users, nuevo]);
    // }

    // // Limpiar
    // setNombre("");
    // setCorreo("");
    // setRol("");
    // setEditingUser(null);
    // setOpen(false);
  };

  // const handleEliminar = (id) => {
  //   const confirmado = window.confirm(
  //     "¿Estás seguro de eliminar este usuario?"
  //   );
  //   if (!confirmado) return;

  //   const filtrados = users.filter((u) => u.id !== id);
  //   setUsers(filtrados);
  // };

  const handleEliminar = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/usuarios/${id}`, {
        method: "DELETE",
      });

      setUsers(users.filter((u) => u._id !== id));
      setUsuarioAEliminar(null);
    } catch (err) {
      console.log("Error al eliminar usuario:", err);
    }
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
                  className={`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 ${
                    error && !nombre.trim() ? "border-red-500" : ""
                  }`}
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
                  className={`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 ${
                    error && (!correo.trim() || !esCorreoValido(correo))
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </div>
              <div>
                <Label htmlFor="rol" className="mb-1 block">
                  Rol
                </Label>
                <Select value={rol} onValueChange={setRol}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 text-black dark:text-white">
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Invitado">Invitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && (
                <p className="text-sm text-red-500 bg-red-100 dark:bg-red-950 dark:text-red-400 rounded px-3 py-2">
                  {error}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button onClick={handleGuardar}>
                {editingUser ? "Guardar cambios" : "Agregar usuario"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="mb-4 px-4 py-2 w-full sm:w-64 rounded border dark:bg-zinc-800 dark:border-zinc-700"
      />
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
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                ⌛ Cargando usuarios...
              </td>
            </tr>
          ) : (
            usuariosPaginados.map((user) => (
              <tr
                key={user._id}
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
                            // setUsers(
                            //   users.filter((u) => u.id !== usuarioAEliminar.id)
                            // );
                            handleEliminar(usuarioAEliminar._id);
                            // setUsuarioAEliminar(null);
                          }}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="fixed bottom-0 right-0 bg-white dark:bg-zinc-900 dark:border-zinc-700 py-2 px-4 flex justify-center items-center gap-4 z-50">
        <button
          onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
          disabled={paginaActual === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ⬅️Anterior
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Página {paginaActual} de {totalPaginas}
        </span>
        <button
          onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Siguiente➡️
        </button>
      </div>
    </div>
  );
}
