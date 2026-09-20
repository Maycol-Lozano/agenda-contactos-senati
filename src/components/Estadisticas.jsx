export default function Estadisticas({ contactos = [] }) {
  const total = contactos.length;
  const favoritos = contactos.filter((c) => Boolean(c.favorito)).length;

  // Calcular cumpleaños del mes actual
  const mesActual = new Date().getMonth() + 1;
  const cumplesMes = contactos.filter((c) => {
    if (!c.cumple) return false;
    const mesCumple = parseInt(c.cumple.split('-')[1], 10);
    return mesCumple === mesActual;
  }).length;

  return (
    <div className="grid grid-cols-3 gap-4 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white">
      <div>
        <span className="block text-xl font-bold text-blue-600 dark:text-blue-400">{total}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">Total</span>
      </div>
      <div className="border-x border-slate-100 dark:border-slate-800">
        <span className="block text-xl font-bold text-amber-500"> {favoritos}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">Favoritos</span>
      </div>
      <div>
        <span className="block text-xl font-bold text-purple-600 dark:text-purple-400"> {cumplesMes}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">Cumples del mes</span>
      </div>
    </div>
  );
}