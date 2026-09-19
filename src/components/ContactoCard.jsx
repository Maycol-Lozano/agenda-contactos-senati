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
}