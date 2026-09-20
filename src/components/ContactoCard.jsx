import React, { useState, useEffect } from 'react';

export default function ContactoCard({ contacto, alEditar, alEliminar, alFavorito }) {
  const [tipoMensaje, setTipoMensaje] = useState('Saludo');
  const [mensajeTexto, setMensajeTexto] = useState('');

  // Genera iniciales del avatar
  const obtenerIniciales = () => {
    const n = (contacto.nombre || '').trim();
    const a = (contacto.apellido || '').trim();
    const init1 = n ? n[0].toUpperCase() : '';
    const init2 = a ? a[0].toUpperCase() : (n[1] ? n[1].toUpperCase() : '');
    return `${init1}${init2}` || 'C';
  };

  // Obtiene el nombre completo limpio evitando duplicados
  const obtenerNombreCompleto = () => {
    const n = (contacto.nombre || '').trim();
    const a = (contacto.apellido || '').trim();
    return `${n} ${a}`.trim() || 'Contacto';
  };

  // Genera las plantillas según la opción seleccionada
  const generarPlantilla = (tipo) => {
    const nombreCompleto = obtenerNombreCompleto();
    switch (tipo) {
      case 'Saludo':
        return `Hola ${nombreCompleto}, te escribo desde mi agenda de contactos.`;
      case 'Recordatorio':
        return `Hola ${nombreCompleto}, te escribo para recordarte sobre nuestro pendiente.`;
      case 'Felicitación':
        return `¡Feliz cumpleaños ${nombreCompleto}! Espero que tengas un excelente día.`;
      default:
        return `Hola ${nombreCompleto}.`;
    }
  };

  // Sincroniza el texto del mensaje cuando cambia el select o el contacto
  useEffect(() => {
    setMensajeTexto(generarPlantilla(tipoMensaje));
  }, [tipoMensaje, contacto]);

  // Rota automáticamente entre Saludo -> Recordatorio -> Felicitación
  const sugerirMensaje = () => {
    const opciones = ['Saludo', 'Recordatorio', 'Felicitación'];
    const siguienteIndice = (opciones.indexOf(tipoMensaje) + 1) % opciones.length;
    setTipoMensaje(opciones[siguienteIndice]);
  };

  const abrirWhatsApp = () => {
    if (!contacto.telefono) return;
    const numLimpio = contacto.telefono.replace(/\D/g, '');
    const url = `https://wa.me/${numLimpio}?text=${encodeURIComponent(mensajeTexto)}`;
    window.open(url, '_blank');
  };

  const descargarVCF = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${contacto.apellido || ''};${contacto.nombre || ''};;;\nFN:${obtenerNombreCompleto()}\nTEL;TYPE=CELL:${contacto.telefono || ''}\nEMAIL:${contacto.email || ''}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${contacto.nombre || 'contacto'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const compartirContacto = async () => {
    const texto = `Contacto: ${obtenerNombreCompleto()}\nTeléfono: ${contacto.telefono}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Contacto', text: texto });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(texto);
      alert('Datos del contacto copiados al portapapeles.');
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
      {/* Cabecera del Contacto */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-base shrink-0">
          {obtenerIniciales()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-slate-800 text-base truncate">
              {obtenerNombreCompleto()}
            </h3>
            <button
              onClick={() => alFavorito(contacto.id)}
              className={`text-lg transition ${
                contacto.favorito ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'
              }`}
            >
              ★
            </button>
          </div>
          
          <p className="text-sm text-slate-500 font-medium">{contacto.telefono}</p>

          {contacto.cumple && (
            <p className="text-xs text-slate-400 mt-0.5">
              Cumple: {contacto.cumple}
            </p>
          )}

          <div className="mt-1.5">
            <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-purple-600 text-white rounded-full">
              {contacto.grupo_nombre || contacto.categoria || 'Personal'}
            </span>
          </div>
        </div>
      </div>

      {/* Select de categoría de mensaje */}
      <div>
        <select
          value={tipoMensaje}
          onChange={(e) => setTipoMensaje(e.target.value)}
          className="w-full p-2 text-xs bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-700 font-medium"
        >
          <option value="Saludo">Saludo</option>
          <option value="Recordatorio">Recordatorio</option>
          <option value="Felicitación">Felicitación</option>
        </select>
      </div>

      {/* Área del mensaje editable */}
      <div>
        <textarea
          value={mensajeTexto}
          onChange={(e) => setMensajeTexto(e.target.value)}
          className="w-full p-2 text-xs border border-slate-200 rounded-lg resize-none h-16 outline-none focus:border-emerald-500 text-slate-700"
        />
      </div>

      {/* Botones de acción WhatsApp */}
      <div className="flex items-center gap-2">
        <button
          onClick={abrirWhatsApp}
          className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition"
        >
          Escribir por WhatsApp
        </button>
        <button
          onClick={sugerirMensaje}
          className="py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs rounded-lg transition"
        >
          Sugerir mensaje
        </button>
      </div>

      {/* Opciones adicionales */}
      <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100">
        <button
          onClick={compartirContacto}
          className="py-1.5 px-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs rounded-lg transition text-center"
        >
          Compartir
        </button>
        <button
          onClick={descargarVCF}
          className="py-1.5 px-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs rounded-lg transition text-center"
        >
          Descargar .vcf
        </button>
        <button
          onClick={() => alEditar(contacto)}
          className="py-1.5 px-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs rounded-lg transition text-center"
        >
          Editar
        </button>
        <button
          onClick={() => alEliminar(contacto)}
          className="py-1.5 px-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs rounded-lg transition text-center"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}