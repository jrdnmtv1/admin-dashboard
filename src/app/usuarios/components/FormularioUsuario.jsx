"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function FormularioUsuario({
  nombre,
  correo,
  rol,
  setNombre,
  setCorreo,
  setRol,
  onGuardar,
  errores,
  editingUser,
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 mt-4">
        <div>
          <Label htmlFor="nombre" className="mb-1 block">
            Nombre
          </Label>
          <Input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 ${
              errores?.nombre ? "border-red-500" : ""
            }`}
          />
          {errores?.nombre && (
            <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
          )}
        </div>

        <div>
          <Label htmlFor="correo" className="mb-1 block">
            Correo
          </Label>
          <Input
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)} // ✅ corregido
            className={`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 ${
              errores?.correo ? "border-red-500" : ""
            }`}
          />
          {errores?.correo && (
            <p className="text-red-500 text-sm mt-1">{errores.correo}</p>
          )}
        </div>

        <div>
          <Label htmlFor="rol" className="mb-1 block">
            Rol
          </Label>
          <Select value={rol} onValueChange={setRol}>
            <SelectTrigger
              className={`w-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0  ${
                errores?.rol ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-900 text-black dark:text-white ">
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Editor">Editor</SelectItem>
              <SelectItem value="Invitado">Invitado</SelectItem>
            </SelectContent>
          </Select>
          {errores?.rol && (
            <p className="text-red-500 text-sm mt-1">{errores.rol}</p>
          )}
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button onClick={onGuardar} className="cursor-pointer hover:opacity-80">
          {editingUser ? "Guardar cambios" : "Agregar usuario"}
        </Button>
      </DialogFooter>
    </>
  );
}
