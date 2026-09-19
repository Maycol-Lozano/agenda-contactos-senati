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
          >
            <option value="Todas">Todas</option>
            <option value="Personal">Personal</option>
            <option value="Trabajo">Trabajo</option>
            <option value="SENATI">SENATI</option>
            <option value="Familia">Familia</option>
          </select>

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
      </div>
    </div>
  );
}