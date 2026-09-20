<<<<<<< HEAD
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
=======
import { useContactos } from './hooks/useContactos';
import { useDarkMode } from './hooks/useDarkMode';
import ContactoForm from './components/ContactoForm';
import ContactoCard from './components/ContactoCard';
import Estadisticas from './components/Estadisticas';
import ImportadorJSON from './components/ImportadorJSON';
import { exportarContactosJSON } from './utils/contacto.js';

export default function App() {
  const [isDark, toggleDarkMode] = useDarkMode();

  const {
    contactos,
    paginaActual,
    totalPaginas,
    setPaginaActual,
    busqueda,
    setBusqueda,
    categoria,
    setCategoria,
    orden,
    setOrden,
    soloFavoritos,
    setSoloFavoritos,
    limpiarFiltros,
    contactoEditar,
    setContactoEditar,
    guardar,
    importar,
    eliminar,
    alternarFav
  } = useContactos();

  const selectClass = "rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 md:p-8 transition-colors duration-200">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Agenda de Contactos SENATI</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title="Cambiar Modo Oscuro"
            >
              {isDark ? '☀️ Claro' : '🌙 Oscuro'}
            </button>
            <ImportadorJSON onImportar={importar} />
            <button
              onClick={() => exportarContactosJSON(contactos)}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 transition"
            >
              📥 Exportar JSON
            </button>
          </div>
        </header>

        {/* Panel de Estadísticas */}
        <Estadisticas contactos={contactos} />

        {/* Formulario */}
        <ContactoForm
          contactoEditar={contactoEditar}
          onGuardar={guardar}
          onCancelar={() => setContactoEditar(null)}
        />

        {/* Búsqueda Avanzada, Filtro, Orden y Favoritos */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="Buscar por nombre, tel, email o nota..."
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <select
            className={selectClass}
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
>>>>>>> fefcd915a1f91e61a6530f29a0649b35d94de09f
          >
            <option value="Todas">Todas</option>
            <option value="Personal">Personal</option>
            <option value="Trabajo">Trabajo</option>
            <option value="SENATI">SENATI</option>
            <option value="Familia">Familia</option>
          </select>
<<<<<<< HEAD
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
=======

          <select
            className={selectClass}
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="nombre_asc">Nombre (A-Z)</option>
            <option value="nombre_desc">Nombre (Z-A)</option>
            <option value="recientes">Más recientes</option>
          </select>

          <button
            onClick={() => setSoloFavoritos(!soloFavoritos)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition flex items-center justify-center gap-1 ${
              soloFavoritos
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            title="Filtrar solo favoritos"
          >
            ★ {soloFavoritos ? 'Ver todos' : 'Favoritos'}
          </button>

          {(busqueda || categoria !== 'Todas' || soloFavoritos) && (
            <button
              onClick={limpiarFiltros}
              className="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 transition"
              title="Limpiar filtros"
            >
              ✕ Limpiar
            </button>
          )}
        </div>

        {/* Lista de Contactos */}
        <div className="space-y-3">
          {contactos.length > 0 ? (
            contactos.map((c) => (
              <ContactoCard
                key={c.id}
                c={c}
                onEditar={setContactoEditar}
                onEliminar={eliminar}
                onFavorito={alternarFav}
              />
            ))
          ) : (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">
              No se encontraron contactos.
            </p>
          )}
        </div>

        {/* Controles de Paginación */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
            <button
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition"
            >
              ← Anterior
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition"
            >
              Siguiente →
            </button>
          </div>
        )}
>>>>>>> fefcd915a1f91e61a6530f29a0649b35d94de09f
      </div>
    </div>
  );
}