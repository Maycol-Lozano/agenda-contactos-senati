import { useState, useRef } from 'react';
import { useContactos } from './hooks/useContactos';
import Estadisticas from './components/Estadisticas';
import ContactoForm from './components/ContactoForm';
import ContactoCard from './components/ContactoCard';
// 1. IMPORTAS LAS DOS FUNCIONES DE DATABASE
import { exportarBaseDatos, importarBaseDatos } from './db/database';

export default function App() {
  const {
    listos,
    contactos,
    grupos,
    texto,
    categoria,
    error,
    setTexto,
    setCategoria,
    crear,
    crearGrupo,
    actualizar,
    eliminar,
    favorito
  } = useContactos();

  const [editando, setEditando] = useState(null);

  // 2. CREAS EL REF Y LA FUNCIÓN DE IMPORTACIÓN AQUÍ
  const fileInputRef = useRef(null);

  const handleImportar = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    if (window.confirm('¿Deseas reemplazar la base de datos actual con este archivo agenda.db?')) {
      await importarBaseDatos(archivo);
    }
    e.target.value = '';
  };

  if (!listos) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        Cargando base de datos...
      </div>
    );
  }

  const handleGuardar = (datos) => {
    let exito = false;
    if (editando) {
      exito = actualizar(editando.id, datos);
      if (exito) setEditando(null);
    } else {
      exito = crear(datos);
    }
    return exito;
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Agenda de Contactos
          </h1>

          {/* 3. PEGAS ÚNICAMENTE LOS BOTONES EN LA PARTE SUPERIOR */}
          <div className="flex gap-2">
            <input
              type="file"
              accept=".db,.sqlite"
              ref={fileInputRef}
              onChange={handleImportar}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              📥 Importar DB
            </button>
            <button
              onClick={exportarBaseDatos}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              📤 Exportar DB
            </button>
          </div>
        </div>

        <Estadisticas contactos={contactos} />

        {error && (
          <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        <ContactoForm
          editando={editando}
          grupos={grupos}
          onGuardar={handleGuardar}
          onCrearGrupo={crearGrupo}
          onCancelar={() => setEditando(null)}
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Buscar por nombre, tel, email o nota..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:w-2/3"
          />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="Todas">Todas</option>
            <option value="Personal">Personal</option>
            <option value="Trabajo">Trabajo</option>
            <option value="SENATI">SENATI</option>
            <option value="Familia">Familia</option>
          </select>
        </div>

        <div className="space-y-3">
          {contactos.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No se encontraron contactos.
            </p>
          ) : (
            contactos.map((contacto) => (
              <ContactoCard
                key={contacto.id}
                contacto={contacto}
                onEditar={(c) => setEditando(c)}
                onEliminar={eliminar}
                onFavorito={favorito}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}