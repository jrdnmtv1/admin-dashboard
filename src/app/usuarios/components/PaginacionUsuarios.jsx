export default function PaginacionUsuarios({
  paginaActual,
  totalPaginas,
  setPaginaActual,
}) {
  return (
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
  );
}
