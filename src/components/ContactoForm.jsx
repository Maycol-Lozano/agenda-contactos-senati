import { useState, useEffect } from 'react';
import { verificarDuplicadoIA } from '../db/contactosRepo.js';

const VACIO = {
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  categoria: 'Personal',
  grupo_id: '',
  favorito: false,
  notas: '',
  cumple: ''
};

export default function ContactoForm({ editando, grupos = [], onGuardar, onCrearGrupo, onCancelar }) {
  const [form, setForm] = useState(VACIO);
  const [fallos, setFallos] = useState({});
  const [nuevoGrupo, setNuevoGrupo] = useState('');
  const [mostrarCrearGrupo, setMostrarCrearGrupo] = useState(false);

  useEffect(() => {
    setForm(editando ? { ...editando, favorito: Boolean(editando.favorito) } : VACIO);
    setFallos({});
  }, [editando]);

  const cambiar = (campo) => (e) => {
    setForm({
      ...form,
      [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    });
  };

  const handleCrearGrupo = () => {
    if (!nuevoGrupo.trim()) return;
    onCrearGrupo(nuevoGrupo.trim());
    setNuevoGrupo('');
    setMostrarCrearGrupo(false);
  };

  const validar = () => {
    const f = {};
    if (!form.nombre.trim()) f.nombre = 'Escribe el nombre';
    if (!/^[0-9+\s]{6,15}$/.test(form.telefono)) f.telefono = 'Teléfono no válido';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) f.email = 'Correo no válido';

    setFallos(f);
    return Object.keys(f).length === 0;
  };

  const enviar = () => {
    if (!validar()) return;

    if (!editando) {
      const duplicado = verificarDuplicadoIA(form.nombre, form.telefono);
      if (duplicado) {
        const confirmar = window.confirm(
          `Existe un contacto similar: "${duplicado.nombre} ${duplicado.apellido}" (${duplicado.telefono}). ¿Deseas guardarlo de todas formas?`
        );
        if (!confirmar) return;
      }
    }

    if (onGuardar(form)) setForm(VACIO);
  };

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white';

  return (
    <div className="space-y-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900 dark:text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">
          {editando ? 'Editar Contacto' : 'Nuevo Contacto'}
        </h2>
        <button
          onClick={() => setMostrarCrearGrupo(!mostrarCrearGrupo)}
          className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {mostrarCrearGrupo ? '— Cancelar' : '+ Crear nuevo grupo'}
        </button>
      </div>

      {mostrarCrearGrupo && (
        <div className="flex gap-2 rounded-lg bg-blue-50 p-2 dark:bg-slate-800">
          <input
            className={inputClass}
            placeholder="Nombre del nuevo grupo..."
            value={nuevoGrupo}
            onChange={(e) => setNuevoGrupo(e.target.value)}
          />
          <button
            onClick={handleCrearGrupo}
            className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
          >
            Guardar Grupo
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <input
            className={inputClass}
            placeholder="Nombre *"
            value={form.nombre}
            onChange={cambiar('nombre')}
          />
          {fallos.nombre && <p className="mt-1 text-xs text-red-600">{fallos.nombre}</p>}
        </div>

        <div>
          <input
            className={inputClass}
            placeholder="Apellido"
            value={form.apellido}
            onChange={cambiar('apellido')}
          />
        </div>

        <div>
          <input
            className={inputClass}
            placeholder="Teléfono *"
            value={form.telefono}
            onChange={cambiar('telefono')}
          />
          {fallos.telefono && <p className="mt-1 text-xs text-red-600">{fallos.telefono}</p>}
        </div>

        <div>
          <input
            className={inputClass}
            placeholder="Email"
            value={form.email}
            onChange={cambiar('email')}
          />
        </div>

        <div>
          <select className={inputClass} value={form.grupo_id} onChange={cambiar('grupo_id')}>
            <option value="">Seleccionar...</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.id}>
                 {g.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="date"
            className={inputClass}
            value={form.cumple}
            onChange={cambiar('cumple')}
          />
        </div>

        <div className="sm:col-span-2">
          <textarea
            className={inputClass}
            rows="2"
            placeholder="Notas..."
            value={form.notas}
            onChange={cambiar('notas')}
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            id="favCheck"
            checked={form.favorito}
            onChange={cambiar('favorito')}
          />
          <label htmlFor="favCheck" className="text-sm">
            Marcar como favorito
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={enviar}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {editando ? 'Guardar Cambios' : 'Guardar'}
        </button>
        {editando && (
          <button
            onClick={onCancelar}
            className="rounded-lg border px-4 py-2 text-sm dark:border-slate-700"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}