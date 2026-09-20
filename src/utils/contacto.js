const PREFIJO_PAIS = '51'; // Perú

export function normalizarTelefono(telefono) {
    const digitos = String(telefono).replace(/\D/g, '');
    if (digitos.startsWith(PREFIJO_PAIS)) return digitos;
    return PREFIJO_PAIS + digitos.replace(/^0+/, '');
}

export function enlaceWhatsApp(telefono, mensaje = '') {
    const numero = normalizarTelefono(telefono);
    const texto = encodeURIComponent(mensaje);
    return `https://wa.me/${numero}${texto ? `?text=${texto}` : ''}`;
}

export async function compartirContacto(c) {
    const texto =
        `${c.nombre} ${c.apellido}\n` +
        `Teléfono: +${normalizarTelefono(c.telefono)}\n` +
        (c.email ? `Correo: ${c.email}\n` : '');

    if (navigator.share) {
        try {
            await navigator.share({ title: c.nombre, text: texto });
            return 'compartido';
        } catch (e) {
            if (e.name === 'AbortError') return 'cancelado';
        }
    }
    await navigator.clipboard.writeText(texto);
    return 'copiado';
}

export function descargarVCard(c) {
    const vcf = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${c.apellido};${c.nombre}`,
        `FN:${c.nombre} ${c.apellido}`,
        `TEL;TYPE=CELL:+${normalizarTelefono(c.telefono)}`,
        c.email ? `EMAIL:${c.email}` : null,
        `NOTE:${c.notas ?? ''}`,
        'END:VCARD'
    ].filter(Boolean).join('\r\n');

    const url = URL.createObjectURL(new Blob([vcf], { type: 'text/vcard' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${c.nombre}-${c.apellido}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
}

// Exportación oficial en JSON
export function exportarContactosJSON(contactos) {
  if (!contactos || contactos.length === 0) {
    alert('No hay contactos para exportar.');
    return;
  }
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contactos, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `contactos_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Exportación requerida para el Ejercicio E7 (.db de SQLite)
export function exportarBaseDatosSQLite(db) {
  if (!db) return;
  const bytes = db.export();
  const blob = new Blob([bytes], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'agenda.db';
  a.click();
  URL.revokeObjectURL(url);
}