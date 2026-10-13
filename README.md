# HábitoTracker

**Módulo:** Desarrollo Web en Entorno Cliente (2º DAW)

**Centro:** IES Juan García Valdemora

**Alumno:** Ander Chans Rodríguez

## Descripción del Proyecto

**HábitoTracker** es una aplicación web para la gestión y seguimiento de hábitos diarios. Permite crear hábitos personalizados, registrar el cumplimiento diario con observaciones y visualizar el rendimiento general mediante un panel de estadísticas y una tabla de seguimiento flotante (modal).

## Estructura del Proyecto

```
Habitos/
├── index.html     # Estructura principal y modal
├── estilos.css    # Estilos CSS y diseño del modal
├── app.js         # Lógica, gestión de cookies y DOM
└── README.md      # Documentación del proyecto
```

## Documentación de las Fases (RA3)

### Fase 1: Persistencia con JSON (Criterio g)

**Ciclo Objeto -> JSON -> Cookie -> Objeto:**

1. **Objeto -> JSON:** Las cookies solo guardan texto, así que usamos `JSON.stringify()` para convertir arrays y objetos en cadenas de texto JSON.

2. **`encodeURIComponent`:** El JSON contiene comillas, comas y espacios que rompen la estructura de las cookies. `encodeURIComponent()` los convierte en caracteres seguros.

3. **Guardado:** La cadena codificada se almacena en `document.cookie`.

4. **Cookie -> Objeto:** Para recuperar los datos hacemos lo opuesto: `decodeURIComponent()` recupera el JSON y `JSON.parse()` lo convierte de nuevo en un objeto JavaScript.

### Fase 2: Formulario A - Crear Hábitos (Criterio e)

* **Estructura del objeto hábito:** `{ id, nombre, descripcion, categoria }`.

* **Validación:** Se usa `.trim()` sobre el campo del nombre para evitar textos vacíos. Si está vacío, se muestra una alerta y se cancela el envío.

### Fase 3: Formulario B - Registrar Días (Criterios e + d)

* **Desplegable dinámico:** Se recorre el array `habitos` insertando elementos `<option>` por código.

* **Relación `habitoId`:** Cada registro guarda el ID del hábito correspondiente (`habitoId`), actuando como una clave foránea para vincular los dos arrays de datos.

### Fase 4: Menú y Modal con la Tabla (Criterio d + f)

* **Modal vs `window.open`:** Un modal es un elemento `<div>` de la misma página que se muestra u oculta alternando la clase CSS `.oculto` con `classList`. No abre ventanas nuevas del navegador como lo hace `window.open()`.

### Fase 5: Cambiar estado desde la tabla (Criterios e + g)

* **Uso de `window.opener`:** En el flujo de ventanas emergentes, `window.opener` permite a la ventana secundaria ejecutar la función `toggleCumplido(id)` sobre la ventana principal, modificando el array original y guardando los cambios en las cookies.

### Fase 6: Estadísticas y Pulido (Criterios d + h)

* Se calculan los hábitos cumplidos y fallados filtrando el array de registros mediante `.filter()`.

* Se añade control de errores e inicialización mediante el evento `DOMContentLoaded`.

## Tecnologías Utilizadas

* HTML5 / CSS3

* JavaScript Vanilla (ES6+)

* Cookies HTTP & JSON

* Git & GitHub Pages
