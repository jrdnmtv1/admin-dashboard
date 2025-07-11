"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function FormularioProductos({
  nombre,
  setNombre,
  precio,
  setPrecio,
  descripcion,
  setDescripcion,
  categoria,
  setCategoria,
  stock,
  setStock,
  imagen,
  setImagen,
  onGuardar,
  errores,
  editingproduct,
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {editingproduct ? "Editar Producto" : "Nuevo Producto"}
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
          <Label htmlFor="precio" className="mb-1 block">
            Precio
          </Label>
          <Input
            id="precio"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className={`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 ${
              errores?.precio ? "border-red-500" : ""
            }`}
          />
          {errores?.precio && (
            <p className="text-red-500 text-sm mt-1">{errores.precio}</p>
          )}
        </div>

        <div>
          <Label htmlFor="descripcion" className="mb-1 block">
            Descripción
          </Label>
          <Input
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="categoria" className="mb-1 block">
            Categoría
          </Label>
          <Input
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="stock" className="mb-1 block">
            Stock
          </Label>
          <Input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 ${
              errores?.stock ? "border-red-500" : ""
            }`}
          />
          {errores?.stock && (
            <p className="text-red-500 text-sm mt-1">{errores.stock}</p>
          )}
        </div>

        <div>
          <Label htmlFor="imagen" className="mb-1 block">
            Imagen (URL)
          </Label>
          <Input
            id="imagen"
            type="url"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            className={`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 ${
              errores?.imagen ? "border-red-500" : ""
            }`}
          />
          {errores?.imagen && (
            <p className="text-red-500 text-sm mt-1">{errores.imagen}</p>
          )}
        </div>

        {errores?.general && (
          <p className="text-sm text-red-500 bg-red-100 dark:bg-red-950 dark:text-red-400 rounded px-3 py-2">
            {errores.general}
          </p>
        )}
      </div>

      <DialogFooter className="mt-6">
        <Button onClick={onGuardar}>
          {editingproduct ? "Guardar cambios" : "Agregar producto"}
        </Button>
      </DialogFooter>
    </>
  );
}
