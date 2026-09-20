import React, { useState } from 'react';
import { useContactos } from './hooks/useContactos';
import DialogoConfirmar from './components/DialogoConfirmar';
import { Estadisticas } from './components/Estadisticas';
import ContactoCard from './components/ContactoCard';
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

  // Estados del formulario de contactos
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [grupoId, setGrupoId] = useState('');
  const [cumple, setCumple] = useState('');
  const [notas, setNotas] = useState('');
  const [esFavorito, setEsFavorito] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  // Estado para crear un nuevo grupo
  const [nuevoGrupo, setNuevoGrupo] = useState('');

  // Estado para el modal de confirmación
  const [modalEliminar, setModalEliminar] = useState({ abierto: false, id: null, nombre: '' });

  if (!listos) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-gray-500 font-medium">Cargando base de datos SQLite...</p>
      </div>
    );
  }

  const limpiarFormulario = () => {
    setNombre('');
    setApellido('');
    setTelefono('');
    setEmail('');
    setGrupoId('');
    setCumple('');
    setNotas('');
    setEsFavorito(false);
    setIdEditar(null);
  };

  const prepararEdicion = (c) => {
    setIdEditar(c.id);
    setNombre(c.nombre || '');
    setApellido(c.apellido || '');
    setTelefono(c.telefono || '');
    setEmail(c.email || '');
    setGrupoId(c.grupo_id || '');
    setCumple(c.cumple || '');
    setNotas(c.notas || '');
    setEsFavorito(Boolean(c.favorito));
  };

  const manejarGuardar = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) {
      alert('Nombre y teléfono son obligatorios.');
      return;
    }

    const grupoSel = grupos.find((g) => String(g.id) === String(grupoId));

    const datosContacto = {
      nombre,
      apellido,
      telefono,
      email,
      categoria: grupoSel ? grupoSel.nombre : 'Personal',
      grupo_id: grupoId ? parseInt(grupoId, 10) : null,
      cumple,
      notas,
      favorito: esFavorito
    };

    let exito = false;
    if (idEditar) {
      exito = actualizar(idEditar, datosContacto);
    } else {
      exito = crear(datosContacto);
    }

    if (exito) {
      limpiarFormulario();
    }
  };

  const manejarCrearGrupo = (e) => {
    e.preventDefault();
    if (!nuevoGrupo.trim()) return;
    crearGrupo(nuevoGrupo.trim());
    setNuevoGrupo('');
  };

  const abrirModalEliminar = (c) => {
    setModalEliminar({
      abierto: true,
      id: c.id,
      nombre: `${c.nombre} ${c.apellido}`.trim()
    });
  };

  const confirmarEliminacion = () => {
    if (modalEliminar.id) {
      eliminar(modalEliminar.id);
      setModalEliminar({ abierto: false, id: null, nombre: '' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Encabezado */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Agenda de Contactos</h1>
            <p className="text-xs text-slate-500">Gestión local SQLite & SENATI</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportarBaseDatos}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition flex items-center gap-1"
            >
              📥 Exportar .DB
            </button>
            <label className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg cursor-pointer transition flex items-center gap-1">
              📂 Importar .DB
              <input
                type="file"
                accept=".db"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0]) importarBaseDatos(e.target.files[0]);
                }}
              />
            </label>
          </div>
        </div>

        {/* Panel de Estadísticas */}
        <Estadisticas contactos={contactos} />

        {/* Formulario para Crear Grupo Nuevo */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <form onSubmit={manejarCrearGrupo} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Nombre del nuevo grupo..."
              value={nuevoGrupo}
              onChange={(e) => setNuevoGrupo(e.target.value)}
              className="p-2 border border-slate-300 rounded-lg text-sm flex-1 outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition"
            >
              + Crear Grupo
            </button>
          </form>
        </div>

        {/* Formulario Crear / Editar Contacto */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-base font-semibold text-slate-800 mb-4">
            {idEditar ? 'Editar Contacto' : 'Nuevo Contacto'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={manejarGuardar} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre *"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg text-sm w-full outline-none focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg text-sm w-full outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Teléfono *"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg text-sm w-full outline-none focus:border-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg text-sm w-full outline-none focus:border-blue-500"
              />
              <select
                value={grupoId}
                onChange={(e) => setGrupoId(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg text-sm w-full bg-white outline-none focus:border-blue-500"
              >
                <option value="">Seleccionar Grupo...</option>
                {grupos.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nombre}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={cumple}
                onChange={(e) => setCumple(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg text-sm w-full outline-none focus:border-blue-500"
              />
            </div>

            <textarea
              placeholder="Notas..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="p-2 border border-slate-300 rounded-lg text-sm w-full h-20 outline-none focus:border-blue-500"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="fav"
                checked={esFavorito}
                onChange={(e) => setEsFavorito(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="fav" className="text-sm text-slate-600 select-none">
                Marcar como favorito
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {idEditar && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                {idEditar ? 'Guardar Cambios' : 'Agregar Contacto'}
              </button>
            </div>
          </form>
        </div>

        {/* Buscador y Filtros por Grupo/Categoría */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono, email o notas..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg text-sm w-full outline-none focus:border-blue-500"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="p-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="Todas">Todas las categorías/grupos</option>
              {grupos.map((g) => (
                <option key={g.id} value={g.nombre}>
                  {g.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Contactos (Renderizado con ContactoCard) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactos.length === 0 ? (
            <div className="col-span-full text-center py-8 text-slate-400 text-sm">
              No hay contactos registrados.
            </div>
          ) : (
            contactos.map((c) => (
              <ContactoCard
                key={c.id}
                contacto={c}
                alEditar={prepararEdicion}
                alEliminar={abrirModalEliminar}
                alFavorito={favorito}
              />
            ))
          )}
        </div>

      </div>

      {/* Modal Confirmar Eliminar */}
      <DialogoConfirmar
        abierto={modalEliminar.abierto}
        nombre={modalEliminar.nombre}
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setModalEliminar({ abierto: false, id: null, nombre: '' })}
      />
    </div>
  );
}