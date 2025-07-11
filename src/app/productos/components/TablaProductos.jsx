"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function TablaProductos({
  productos,
  loading,
  onEditar,
  onEliminar,
  productoAEliminar,
  setProductoAEliminar,
}) {
  return (
    <table className="w-full text-sm bg-white dark:bg-zinc-800 rounded shadow overflow-hidden">
      <thead>
        <tr className="bg-gray-100 dark:bg-zinc-700 text-left">
          <th className="px-4 py-2">Nombre</th>
          <th className="px-4 py-2">Precio</th>
          <th className="px-4 py-2">Descripcion</th>
          <th className="px-4 py-2">Categoria</th>
          <th className="px-4 py-2">Stock</th>
          <th className="px-4 py-2">Imagen</th>
          <th className="px-4 py-2 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="7" className="text-center py-4 text-gray-500">
              ⌛ Cargando productos...
            </td>
          </tr>
        ) : (
          productos.map((product) => (
            <tr
              key={product._id}
              className="border-t border-gray-200 dark:border-zinc-700"
            >
              <td className="px-4 py-2">{product.nombre}</td>
              <td className="px-4 py-2">{product.precio}</td>
              <td className="px-4 py-2">{product.descripcion}</td>
              <td className="px-4 py-2">{product.categoria}</td>
              <td className="px-4 py-2">{product.stock}</td>
              <td className="px-4 py-2">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="w-16 h-16 object-cover rounded"
                />
              </td>
              <td className="px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => onEditar(product)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Pencil className="w-4 h-4 inline" />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={() => setProductoAEliminar(product)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Estás a punto de eliminar permanentemente a{" "}
                      <span className="font-semibold text-red-500">
                        {productoAEliminar?.nombre}
                      </span>
                      . Esta acción no se puede deshacer.
                    </p>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onEliminar(productoAEliminar._id)}
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
  );
}
