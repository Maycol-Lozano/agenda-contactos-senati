import React from 'react';

export default function DialogoConfirmar({ abierto, nombre, onConfirmar, onCancelar }) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl animate-fade-in">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          ¿Eliminar contacto?
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar a{' '}
          <strong className="text-gray-900">{nombre}</strong>? Esta acción no se
          puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancelar}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}