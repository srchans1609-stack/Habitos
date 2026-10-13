// Estructuras de datos principales
let habitos = [];
let registros = [];

// ==========================================
// FASE 1: Persistencia con JSON y Cookies
// ==========================================

function guardarCookie(nombre, valor, dias = 7) {
    const jsonString = JSON.stringify(valor);
    const valorCodificado = encodeURIComponent(jsonString);
    const fecha = new Date();
    fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000));
    document.cookie = `${nombre}=${valorCodificado};expires=${fecha.toUTCString()};path=/`;
}

function leerCookie(nombre) {
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
        const [clave, valor] = c.trim().split('=');
        if (clave === nombre && valor) {
            try {
                const valorDecodificado = decodeURIComponent(valor);
                return JSON.parse(valorDecodificado);
            } catch (e) {
                console.error(`Error al parsear cookie ${nombre}:`, e);
                return null;
            }
        }
    }
    return null;
}

function borrarCookie(nombre) {
    document.cookie = `${nombre}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

function guardarTodo() {
    guardarCookie('habitos', habitos);
    guardarCookie('registros', registros);
}

function cargarDatos() {
    habitos = leerCookie('habitos') || [];
    registros = leerCookie('registros') || [];
}


// Inicialización
window.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    actualizarDesplegableHabitos();
    actualizarEstadisticas();
});