import React from 'react';

export function Estadisticas({ contactos = [] }) {
  const total = contactos.length;
  const favoritos = contactos.filter((c) => Boolean(c.favorito)).length;

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{total}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Total Contactos</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <p className="text-2xl font-bold text-amber-500 dark:text-amber-400">{favoritos}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Favoritos</p>
      </div>
    </div>
  );
}