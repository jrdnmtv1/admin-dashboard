export default function BuscadorProductos({ busqueda, setBusqueda }) {
  return (
    <input
      id="busqueda"
      type="text"
      placeholder="Buscar por producto..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      className="mb-4 px-4 py-2 w-full sm:w-64 rounded border dark:bg-zinc-800 dark:border-zinc-700"
      aria-label="Buscar producto"
    />
  );
}
