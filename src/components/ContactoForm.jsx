<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react';
import { verificarDuplicadoIA } from '../db/contactosRepo';

export default function ContactoForm({ contactoEditar, onGuardar, onCancelar }) {
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        categoria: 'Personal',
        favorito: false,
        notas: '',
        cumple: ''
    });

    const [errores, setErrores] = useState({});
    const [alertaIA, setAlertaIA] = useState(null);

    useEffect(() => {
        if (contactoEditar) {
            setForm({
                nombre: contactoEditar.nombre || '',
                apellido: contactoEditar.apellido || '',
                telefono: contactoEditar.telefono || '',
                email: contactoEditar.email || '',
                categoria: contactoEditar.categoria || 'Personal',
                favorito: Boolean(contactoEditar.favorito),
                notas: contactoEditar.notas || '',
                cumple: contactoEditar.cumple || ''
            });
            setErrores({});
            setAlertaIA(null);
        } else {
            resetearForm();
        }
    }, [contactoEditar]);

    const resetearForm = () => {
        setForm({
            nombre: '',
            apellido: '',
            telefono: '',
            email: '',
            categoria: 'Personal',
            favorito: false,
            notas: '',
            cumple: ''
        });
        setErrores({});
        setAlertaIA(null);
    };

    const validar = (nombreCampo, valor) => {
        let error = '';
        if (nombreCampo === 'nombre') {
            if (!valor.trim()) error = 'El nombre es obligatorio.';
            else if (valor.trim().length < 2) error = 'Debe tener al menos 2 caracteres.';
        }
        if (nombreCampo === 'telefono') {
            if (!valor.trim()) error = 'El teléfono es obligatorio.';
            else if (!/^[0-9+\s-]{6,15}$/.test(valor.trim())) error = 'Formato de teléfono no válido.';
        }
        if (nombreCampo === 'email' && valor.trim()) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())) error = 'Correo electrónico no válido.';
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        const nuevoForm = { ...form, [name]: val };
        setForm(nuevoForm);

        const msjError = validar(name, val);
        setErrores((prev) => ({ ...prev, [name]: msjError }));

        // Reto IA: Verificación en tiempo real de duplicados
        if ((name === 'nombre' || name === 'telefono') && !contactoEditar) {
            const mensajeDuplicado = verificarDuplicadoIA(nuevoForm.nombre, nuevoForm.telefono);
            setAlertaIA(mensajeDuplicado);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errNombre = validar('nombre', form.nombre);
        const errTel = validar('telefono', form.telefono);
        const errEmail = validar('email', form.email);

        if (errNombre || errTel || errEmail) {
            setErrores({ nombre: errNombre, telefono: errTel, email: errEmail });
            return;
        }

        // Bloqueo por detección de IA en caso de duplicado explícito al intentar guardar
        if (alertaIA && !contactoEditar) {
            alert("No se puede guardar: " + alertaIA);
            return;
        }

        onGuardar(form);
        resetearForm();
    };

    const inputClass = (campo) =>
        `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none transition ${errores[campo]
            ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-slate-800 dark:text-slate-100 focus:border-red-500'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:border-blue-500'
        }`;

    return (
        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-4 shadow-sm space-y-4 transition">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                {contactoEditar ? 'Editar Contacto' : 'Nuevo Contacto'}
            </h2>

            {/* Banner de alerta inteligente por detección de duplicados (Reto IA) */}
            {alertaIA && !contactoEditar && (
                <div className="rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
                    <span>🤖</span>
                    <p>{alertaIA}</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre *"
                        value={form.nombre}
                        onChange={handleChange}
                        className={inputClass('nombre')}
                    />
                    {errores.nombre && <p className="mt-1 text-xs text-red-500">{errores.nombre}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        name="apellido"
                        placeholder="Apellido"
                        value={form.apellido}
                        onChange={handleChange}
                        className={inputClass('apellido')}
                    />
                </div>

                <div>
                    <input
                        type="text"
                        name="telefono"
                        placeholder="Teléfono *"
                        value={form.telefono}
                        onChange={handleChange}
                        className={inputClass('telefono')}
                    />
                    {errores.telefono && <p className="mt-1 text-xs text-red-500">{errores.telefono}</p>}
                </div>

                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className={inputClass('email')}
                    />
                    {errores.email && <p className="mt-1 text-xs text-red-500">{errores.email}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Categoría</label>
                    <select
                        name="categoria"
                        value={form.categoria}
                        onChange={handleChange}
                        className={inputClass('categoria')}
                    >
                        <option value="Personal">Personal</option>
                        <option value="Trabajo">Trabajo</option>
                        <option value="SENATI">SENATI</option>
                        <option value="Familia">Familia</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Fecha de Cumpleaños</label>
                    <input
                        type="date"
                        name="cumple"
                        value={form.cumple}
                        onChange={handleChange}
                        className={inputClass('cumple')}
                    />
                </div>
            </div>

            <div>
                <textarea
                    name="notas"
                    placeholder="Notas..."
                    rows="2"
                    value={form.notas}
                    onChange={handleChange}
                    className={inputClass('notas')}
                />
            </div>

            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                        type="checkbox"
                        name="favorito"
                        checked={form.favorito}
                        onChange={handleChange}
                        className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                    Marcar como favorito
                </label>

                <div className="flex gap-2">
                    {contactoEditar && (
                        <button
                            type="button"
                            onClick={onCancelar}
                            className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition"
                    >
                        {contactoEditar ? 'Actualizar' : 'Guardar'}
                    </button>
                </div>
            </div>
        </form>
    );
>>>>>>> fefcd915a1f91e61a6530f29a0649b35d94de09f
}