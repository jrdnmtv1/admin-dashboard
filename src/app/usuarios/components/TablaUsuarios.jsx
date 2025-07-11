"use client"

import { Pencil, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export default function TablaUsuarios({
  usuarios,
  loading,
  onEditar,
  onEliminar,
  usuarioAEliminar,
  setUsuarioAEliminar,
}) {
  return (
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
          usuarios.map((user) => (
            <tr key={user._id} className="border-t border-gray-200 dark:border-zinc-700">
              <td className="px-4 py-2">{user.nombre}</td>
              <td className="px-4 py-2">{user.correo}</td>
              <td className="px-4 py-2">{user.rol}</td>
              <td className="px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => onEditar(user)}
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                  <Pencil className="w-4 h-4 inline" />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={() => setUsuarioAEliminar(user)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
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
                        onClick={() => onEliminar(usuarioAEliminar._id)}
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
  )
}
