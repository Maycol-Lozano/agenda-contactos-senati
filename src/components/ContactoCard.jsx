import React from 'react';

export default function ContactoCard({ contacto, onEditar, onEliminar, onFavorito }) {
  const c = contacto;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-center text-sm">
            {c.nombre ? c.nombre.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              {c.nombre} {c.apellido}
            </h3>
            {c.grupo_nombre && (
              <span className="inline-block mt-0.5 text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {c.grupo_nombre}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onFavorito(c.id)}
          className={`p-1.5 rounded-lg text-lg transition-colors ${
            c.es_favorito 
              ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30' 
              : 'text-slate-300 dark:text-slate-600 hover:text-slate-400'
          }`}
          title={c.es_favorito ? "Quitar de favoritos" : "Marcar como favorito"}
        >
          {c.es_favorito ? '★' : '☆'}
        </button>
      </div>

      <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
        {c.telefono && (
          <div className="flex items-center gap-2">
            <span>📞</span>
            <span>{c.telefono}</span>
          </div>
        )}
        {c.email && (
          <div className="flex items-center gap-2">
            <span>✉️</span>
            <span className="truncate">{c.email}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-end gap-2">
        <button
          onClick={() => onEditar(c)}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          Editar
        </button>

        <button
          onClick={() => onEliminar(c.id)}
          className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}