"use client";

import TablaUsuarios from "./components/TablaUsuarios";
import FormularioUsuario from "./components/FormularioUsuario";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import BuscadorUsuarios from "./components/BuscadorUsuarios";
import BotonAgregarUsuario from "./components/BotonAgregarUsuario";
import PaginacionUsuarios from "./components/PaginacionUsuarios";
import { z } from "zod";

export default function UsuariosPage() {
  const [users, setUsers] = useState([]);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 8;

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://usuario-api-w7k4.onrender.com/api/usuarios", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("No autorizado");
        }
        return res.json();
      })
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
      setErrores();
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

  const esquemaUsuario = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    correo: z.string().email("El correo electrónico no es valido"),
    rol: z.string().min(1, "Selecciona un rol."),
  });

  const handleGuardar = async () => {
    try {
      // Validar con zod
      esquemaUsuario.parse({ nombre, correo, rol });
      setErrores({}); // limpiar errores anteriores

      if (editingUser) {
        const res = await fetch(
          `https://usuario-api-w7k4.onrender.com/api/usuarios/${editingUser._id}`,
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
        const res = await fetch(
          `https://usuario-api-w7k4.onrender.com/api/usuarios`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, correo, rol }),
          }
        );

        const creado = await res.json();
        setUsers([creado, ...users]);
      }

      // Limpiar formulario
      setNombre("");
      setCorreo("");
      setRol("");
      setEditingUser(null);
      setOpen(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // ⚠️ Obtener errores por campo
        const fieldErrors = {};
        err.errors.forEach((e) => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrores(fieldErrors);
      } else {
        console.error("Error al guardar usuario: ", err);
        setErrores({ general: "No se pudo guardar el usuario." });
      }
    }
  };

  const handleEliminar = async (id) => {
    try {
      await fetch(`https://usuario-api-w7k4.onrender.com/api/usuarios/${id}`, {
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
      <div className="flex justify-between items-center mb-4">
        <BuscadorUsuarios busqueda={busqueda} setBusqueda={setBusqueda} />
        <Dialog open={open} onOpenChange={setOpen}>
          <BotonAgregarUsuario />
          <DialogContent className="bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
            <FormularioUsuario
              nombre={nombre}
              setNombre={setNombre}
              correo={correo}
              setCorreo={setCorreo}
              rol={rol}
              setRol={setRol}
              onGuardar={handleGuardar}
              errores={errores}
              editingUser={editingUser}
            />
          </DialogContent>
        </Dialog>
      </div>
      <TablaUsuarios
        usuarios={usuariosPaginados}
        loading={loading}
        onEditar={(user) => {
          setEditingUser(user);
          setNombre(user.nombre);
          setCorreo(user.correo);
          setRol(user.rol);
          setOpen(true);
        }}
        onEliminar={handleEliminar}
        usuarioAEliminar={usuarioAEliminar}
        setUsuarioAEliminar={setUsuarioAEliminar}
      />
      <PaginacionUsuarios
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        setPaginaActual={setPaginaActual}
      />
    </div>
  );
}
