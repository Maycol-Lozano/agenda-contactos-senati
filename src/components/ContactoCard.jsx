<<<<<<< HEAD
import { useState } from 'react';

export default function ContactoCard({ contacto, onEditar, onEliminar, onFavorito }) {
  const [tipoMensaje, setTipoMensaje] = useState('Saludo');
  const [mensaje, setMensaje] = useState(`Hola ${contacto.nombre}, te escribo desde mi agenda de contactos.`);

  // Banco amplio de opciones estilo IA para ir cambiando aleatoriamente
  const sugerirMensaje = () => {
    const nombre = contacto.nombre;
    const plantillas = {
      Saludo: [
        `¡Hola ${nombre}! 👋 ¿Cómo estás? Espero que estés teniendo un excelente día.`,
        `¡Qué tal, ${nombre}! 😃 Paso a saludarte. ¡Espero que todo vaya de maravilla!`,
        `Hola ${nombre} ✨ ¿Cómo va tu semana? Un saludo cordial por aquí.`
      ],
      Cumpleaños: [
        `¡Feliz cumpleaños ${nombre}! 🎉🎂 Deseo que pases un día genial lleno de éxitos.`,
        `¡Muchas felicidades en tu día, ${nombre}! 🥳🎈 Que todos tus proyectos se cumplan este año.`,
        `¡Un abrazo fuerte por tu cumpleaños, ${nombre}! 🎁 Disfruta mucho con la familia.`
      ],
      Trabajo: [
        `Hola ${nombre}, coordinamos el avance del proyecto pendiente cuando tengas un momento libre.`,
        `Estimado/a ${nombre}, te escribo para revisar los puntos acordados. Quedo atento a tu respuesta. 💼`,
        `Hola ${nombre} 👋 ¿Tendrás unos minutos hoy para coordinar un tema de trabajo?`
      ],
      Recordatorio: [
        `Hola ${nombre}, te escribo este recordatorio rápido sobre la reunión programada. ¡Saludos! 📌`,
        `¡Hola ${nombre}! Solo para recordarte lo que acordamos previamente. Saludos.`,
        `Hola ${nombre}, un saludo rápido para no olvidar nuestro pendiente de hoy. ⏰`
      ]
    };

    const lista = plantillas[tipoMensaje] || plantillas.Saludo;
    
    // Seleccionar una frase distinta a la actual para que cambie en cada clic
    let nuevaSugerencia = mensaje;
    while (nuevaSugerencia === mensaje && lista.length > 1) {
      const indice = Math.floor(Math.random() * lista.length);
      nuevaSugerencia = lista[indice];
    }
    
    setMensaje(nuevaSugerencia);
  };

  const abrirWhatsApp = () => {
    const numLimpio = contacto.telefono.replace(/\D/g, '');
    window.open(`https://wa.me/${numLimpio}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const descargarVCF = () => {
    const vcardData = 
`BEGIN:VCARD
VERSION:3.0
FN:${contacto.nombre} ${contacto.apellido || ''}
TEL;TYPE=CELL:${contacto.telefono}
EMAIL:${contacto.email || ''}
NOTE:${contacto.notas || ''}
END:VCARD`;

    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${contacto.nombre}_${contacto.apellido || 'contacto'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const compartirContacto = () => {
    const info = `Contacto: ${contacto.nombre} ${contacto.apellido || ''}\nTeléfono: ${contacto.telefono}`;
    if (navigator.share) {
      navigator.share({ title: 'Contacto SENATI', text: info }).catch(() => {});
    } else {
      navigator.clipboard.writeText(info);
      alert('Información del contacto copiada al portapapeles.');
    }
  };

  const confirmarEliminar = () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar a "${contacto.nombre} ${contacto.apellido || ''}"?`)) {
      onEliminar(contacto.id);
    }
  };

  const iniciales = `${contacto.nombre?.[0] || ''}${contacto.apellido?.[0] || ''}`.toUpperCase();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {iniciales}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              {contacto.nombre} {contacto.apellido}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{contacto.telefono}</p>
            {contacto.cumple && (
              <p className="text-xs text-slate-400">🎂 {contacto.cumple}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => onFavorito(contacto.id)}
          className={`text-lg ${contacto.favorito ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'}`}
        >
          ★
        </button>
      </div>

      {contacto.grupo_nombre && (
        <span
          className="inline-block rounded-md px-2 py-0.5 text-xs font-semibold text-white"
          style={{ backgroundColor: contacto.grupo_color || '#3b82f6' }}
        >
          {contacto.grupo_nombre}
        </span>
      )}

      {/* Bloque de Generador e Inteligencia de Mensajes para WhatsApp */}
      <div className="space-y-2 rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
        <select
          value={tipoMensaje}
          onChange={(e) => setTipoMensaje(e.target.value)}
          className="w-full rounded border border-slate-300 bg-white p-1 text-xs dark:border-slate-700 dark:bg-slate-800"
        >
          <option value="Saludo">Saludo</option>
          <option value="Cumpleaños">Cumpleaños</option>
          <option value="Trabajo">Trabajo</option>
          <option value="Recordatorio">Recordatorio</option>
        </select>

        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows="2"
          className="w-full rounded border border-slate-300 p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
        />

        <div className="flex gap-2">
          <button
            onClick={abrirWhatsApp}
            className="flex-1 rounded bg-emerald-600 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
          >
            Escribir por WhatsApp
          </button>
          <button
            onClick={sugerirMensaje}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Sugerir mensaje
          </button>
        </div>
      </div>

      {/* Fila de Botones: Compartir, .vcf, Editar y Eliminar */}
      <div className="flex flex-wrap items-center justify-end gap-1.5 pt-1 text-xs">
        <button
          onClick={compartirContacto}
          className="rounded border border-slate-300 px-2.5 py-1 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Compartir
        </button>
        <button
          onClick={descargarVCF}
          className="rounded border border-slate-300 px-2.5 py-1 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Descargar .vcf
        </button>
        <button
          onClick={() => onEditar(contacto)}
          className="rounded border border-slate-300 px-2.5 py-1 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Editar
        </button>
        <button
          onClick={confirmarEliminar}
          className="rounded border border-red-200 px-2.5 py-1 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
=======
export default function ContactoCard({ c, onEditar, onEliminar, onFavorito }) {
  const formatearWhatsApp = (tel) => tel.replace(/\D/g, '');

  const descargarVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${c.nombre} ${c.apellido || ''}
TEL:${c.telefono}
EMAIL:${c.email || ''}
NOTE:${c.notas || ''}
END:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${c.nombre}_contacto.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const compartirContacto = async () => {
    const texto = `Contacto: ${c.nombre} ${c.apellido || ''}\nTeléfono: ${c.telefono}${c.email ? '\nEmail: ' + c.email : ''}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: c.nombre, text: texto });
      } catch (err) {
        console.log('Error al compartir', err);
      }
    } else {
      navigator.clipboard.writeText(texto);
      alert('¡Datos del contacto copiados al portapapeles!');
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-4 shadow-sm transition">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/60 font-semibold text-blue-600 dark:text-blue-400">
            {c.nombre[0]?.toUpperCase()}
            {c.apellido ? c.apellido[0]?.toUpperCase() : ''}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-slate-800 dark:text-slate-100">
                {c.nombre} {c.apellido}
              </h3>
              {c.favorito && <span className="text-amber-500 text-sm">★</span>}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{c.telefono}</p>
          </div>
        </div>

        <button
          onClick={() => onFavorito(c.id)}
          className="text-slate-400 hover:text-amber-500 dark:text-slate-500 dark:hover:text-amber-400 transition"
          title="Marcar Favorito"
        >
          {c.favorito ? '★' : '☆'}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-slate-100 dark:bg-slate-700/60 px-2.5 py-0.5 text-slate-600 dark:text-slate-300">
          {c.categoria}
        </span>
        {c.cumple && (
          <span className="text-slate-500 dark:text-slate-400">
            🎂 {c.cumple}
          </span>
        )}
      </div>

      {c.notas && (
        <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-900/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
          "{c.notas}"
        </p>
      )}

      {/* Botones de acción adaptados */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
        <a
          href={`https://wa.me/${formatearWhatsApp(c.telefono)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-whatsapp px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:opacity-90 transition flex items-center gap-1"
        >
          Escribir por WhatsApp
        </a>

        <button
          onClick={compartirContacto}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          Compartir
        </button>

        <button
          onClick={descargarVCard}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          Descargar .vcf
        </button>

        <button
          onClick={() => onEditar(c)}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          Editar
        </button>

        <button
          onClick={() => onEliminar(c.id)}
          className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
>>>>>>> fefcd915a1f91e61a6530f29a0649b35d94de09f
}