# Agenda de Contactos Web - Laboratorio SENATI

Este proyecto es una aplicación web moderna para la gestión de contactos (CRUD), desarrollada como parte del laboratorio de SENATI. Utiliza React y Tailwind CSS para una interfaz intuitiva, con persistencia de datos local mediante IndexedDB.

## 📸 Capturas de Pantalla

Aquí puedes ver la interfaz de la aplicación en funcionamiento en Modo Oscuro.

### 1. Vista Principal y Estadísticas

Esta vista muestra el panel superior con estadísticas (Total, Favoritos, Cumpleaños), los botones de Importar/Exportar JSON, el selector de tema (Modo Claro/Oscuro) y el formulario completo para registrar un **Nuevo Contacto**.

![Vista Principal y Formulario de Registro](screenshots/vista_principal.png)

### 2. Lista de Contactos y Funciones (CRUD)

Esta captura muestra la sección inferior donde se listan los contactos registrados. Se aprecian las tarjetas detalladas de contactos (`ContactoCard.jsx`) con información como: Nombre completo, Teléfono, Categoría, Fecha de Cumpleaños, Notas y el estado de Favorito.

También se observan los controles de:
*   Barra de **Búsqueda** en tiempo real.
*   Filtros por **Categoría**.
*   **Ordenamiento** (Nombre AZ).
*   Botón para filtrar solo **Favoritos**.

Y en cada tarjeta, los botones funcionales para: **Escribir por WhatsApp**, **Compartir**, **Descargar .vcf** (VCard), **Editar** (abre el formulario en modo edición) y **Eliminar** (con confirmación)[cite: 4].

![Vista de Lista de Contactos y Funciones](screenshots/vista_lista.png)

## 🛠️ Instrucciones de Instalación y Ejecución

Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

1.  **Requisitos:** Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)[cite: 4].
2.  **Clonar o Descargar:** Obtén el código del proyecto. Si descargaste el `.zip`, descomprímelo.
3.  **Abrir Terminal:** Navega a la carpeta del proyecto (`agenda-contactos`) en tu terminal o VS Code.
4.  **Instalar Dependencias:** Ejecuta el siguiente comando para descargar e instalar todas las librerías necesarias (`node_modules`), basándose en el archivo `package.json`[cite: 1, 4]:
    ```bash
    npm install
    ```
5.  **Iniciar Servidor de Desarrollo:** Ejecuta el comando para encender el servidor local de Vite[cite: 1, 4]:
    ```bash
    npm run dev
    ```
6.  **Ver en Navegador:** Una vez que la terminal indique que el servidor está corriendo (generalmente en `http://localhost:5173/`), abre esa dirección en tu navegador para ver la aplicación[cite: 4].

## 🧠 Decisiones de Diseño e Implementación

Para el desarrollo de este laboratorio, se tomaron las siguientes decisiones de diseño y técnicas[cite: 3]:

1.  **Persistencia Local con IndexedDB:** Se eligió IndexedDB para cumplir con el requerimiento de base de datos local persistente sin depender de un servidor externo (`src/db/contactsRepo.js`)[cite: 4]. Esto garantiza que los contactos se mantengan incluso después de cerrar el navegador.
2.  **Modularización de Componentes React:** La interfaz se dividió en componentes reutilizables y atómicos (ej: `ContactoCard.jsx`, `ContactoForm.jsx`, `ImportadorJSON.jsx`) dentro de `src/components`, facilitando el mantenimiento y la escalabilidad[cite: 4].
3.  **Hooks Personalizados para Sincronización:** Se implementaron hooks personalizados (`src/hooks/useContactos.js`) para centralizar la lógica de comunicación con IndexedDB y asegurar que el estado de React se actualice correctamente, evitando renders innecesarios.
4.  **Estilizado Moderno y Responsivo con Tailwind CSS:** Se optó por Tailwind CSS para un desarrollo rápido y flexible de la interfaz, logrando un diseño moderno, totalmente responsivo y con soporte nativo para el cambio de tema entre **Modo Claro** y **Modo Oscuro**[cite: 4].

---
*Desarrollado por [cite: Maycol Lozano]*
