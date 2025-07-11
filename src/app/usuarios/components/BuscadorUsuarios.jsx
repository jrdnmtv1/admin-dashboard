export default function BuscadorUsuarios({ busqueda, setBusqueda }) {
  return (
    <input
      type="text"
      placeholder="Buscar por nombre..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      className="mb-4 px-4 py-2 w-full sm:w-64 rounded border dark:bg-zinc-800 dark:border-zinc-700"
    />
  );
}
