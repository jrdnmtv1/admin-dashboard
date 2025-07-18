import { DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function BotonAgregarUsuario() {
  return (
    <DialogTrigger asChild>
      <button className="mb-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer">
        <Plus className="w-4 h-4" />
        Agregar usuario
      </button>
    </DialogTrigger>
  );
}
