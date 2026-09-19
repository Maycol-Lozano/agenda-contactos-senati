export default function Estadisticas({ contactos = [] }) {
  const total = contactos.length;
  const favoritos = contactos.filter((c) => c.favorito).length;

  // Obtener cumpleañeros del mes actual
  const mesActual = new Date().getMonth();
  const cumpleañeros = contactos.filter((c) => {
    if (!c.cumple) return false;
    const fechaCumple = new Date(c.cumple);
    return fechaCumple.getMonth() === mesActual;
  }).length;

  return (
    <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-4 text-center shadow-sm transition">
      <div>
        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{total}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
      </div>
      <div>
        <p className="text-xl font-bold text-amber-500 flex items-center justify-center gap-1">
          ★ {favoritos}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Favoritos</p>
      </div>
      <div>
        <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
          🎂 {cumpleañeros}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Cumples del mes</p>
      </div>
    </div>
  );
}