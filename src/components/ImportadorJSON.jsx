<<<<<<< HEAD
import { useRef } from 'react';

export default function ImportadorJSON({ onImportar }) {
    const fileInputRef = useRef(null);

    const manejarArchivo = (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        const lector = new FileReader();
        lector.onload = (evento) => {
            try {
                const datos = JSON.parse(evento.target.result);
                if (Array.isArray(datos)) {
                    onImportar(datos);
                    alert(`¡Se importaron ${datos.length} contactos correctamente!`);
                } else {
                    alert('El archivo JSON debe contener un arreglo de contactos.');
                }
            } catch (err) {
                alert('Error al leer el archivo JSON. Verifica el formato.');
            }
        };
        lector.readAsText(archivo);
        e.target.value = ''; // Limpiar el input para permitir reimportar el mismo archivo
    };

    return (
        <>
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={manejarArchivo}
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition"
            >
                📤 Importar JSON
            </button>
        </>
    );
=======
import { useRef } from 'react';

export default function ImportadorJSON({ onImportar }) {
    const fileInputRef = useRef(null);

    const manejarArchivo = (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        const lector = new FileReader();
        lector.onload = (evento) => {
            try {
                const datos = JSON.parse(evento.target.result);
                if (Array.isArray(datos)) {
                    onImportar(datos);
                    alert(`¡Se importaron ${datos.length} contactos correctamente!`);
                } else {
                    alert('El archivo JSON debe contener un arreglo de contactos.');
                }
            } catch (err) {
                alert('Error al leer el archivo JSON. Verifica el formato.');
            }
        };
        lector.readAsText(archivo);
        e.target.value = ''; // Limpiar el input para permitir reimportar el mismo archivo
    };

    return (
        <>
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={manejarArchivo}
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition"
            >
                📤 Importar JSON
            </button>
        </>
    );
>>>>>>> fefcd915a1f91e61a6530f29a0649b35d94de09f
}