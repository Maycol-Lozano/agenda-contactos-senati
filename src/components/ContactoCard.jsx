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
}