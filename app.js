// Estructuras de datos principales
let habitos = [];
let registros = [];


// FASE 1: Persistencia con JSON y Cookies


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

//Formularios y Desplegable


function actualizarDesplegableHabitos() {
    const select = document.getElementById('registro-habito');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Selecciona un hábito --</option>';
    
    habitos.forEach(habito => {
        const option = document.createElement('option');
        option.value = habito.id;
        option.textContent = habito.nombre;
        select.appendChild(option);
    });
}

document.getElementById('form-habito')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombreInput = document.getElementById('habito-nombre').value.trim();
    const descripcion = document.getElementById('habito-descripcion').value.trim();
    const categoria = document.getElementById('habito-categoria').value;

    if (!nombreInput) {
        alert('El nombre del hábito es obligatorio.');
        return;
    }

    const nuevoHabito = {
        id: Date.now(),
        nombre: nombreInput,
        descripcion: descripcion,
        categoria: categoria
    };

    habitos.push(nuevoHabito);
    guardarTodo();
    actualizarDesplegableHabitos();
    actualizarEstadisticas();
    this.reset();
});

document.getElementById('form-registro')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const habitoId = document.getElementById('registro-habito').value;
    const fecha = document.getElementById('registro-fecha').value;
    const observaciones = document.getElementById('registro-observaciones').value.trim();
    const cumplido = document.getElementById('registro-cumplido').checked;

    if (!habitoId || !fecha) {
        alert('Debes seleccionar un hábito y una fecha.');
        return;
    }

    const nuevoRegistro = {
        id: Date.now(),
        habitoId: Number(habitoId),
        fecha: fecha,
        observaciones: observaciones,
        cumplido: cumplido
    };

    registros.push(nuevoRegistro);
    guardarTodo();
    actualizarEstadisticas();
    
    const modal = document.getElementById('modal-seguimiento');
    if (modal && !modal.classList.contains('oculto')) {
        renderizarTabla();
    }
    this.reset();
});

//Modal, Tabla y Cambiar Estado


const modal = document.getElementById('modal-seguimiento');
const btnVerSeguimiento = document.getElementById('btn-ver-seguimiento');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');

btnVerSeguimiento?.addEventListener('click', (e) => {
    e.preventDefault();
    renderizarTabla();
    modal?.classList.remove('oculto');
});

btnCerrarModal?.addEventListener('click', () => {
    modal?.classList.add('oculto');
});

modal?.addEventListener('click', function(e) {
    if (e.target === this) {
        modal.classList.add('oculto');
    }
});

function toggleCumplido(registroId) {
    const reg = registros.find(r => r.id === registroId);
    if (reg) {
        reg.cumplido = !reg.cumplido;
        guardarTodo();
        actualizarEstadisticas();
        renderizarTabla();
    }
}

// Expuesta globalmente para comunicación entre ventanas si fuera necesario
window.toggleCumplido = toggleCumplido;

function renderizarTabla() {
    const tbody = document.getElementById('tbody-registros');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    registros.forEach(reg => {
        const habitoAsociado = habitos.find(h => h.id === reg.habitoId);
        const nombreHabito = habitoAsociado ? habitoAsociado.nombre : 'Hábito eliminado';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${nombreHabito}</td>
            <td>${reg.fecha}</td>
            <td>${reg.observaciones || '-'}</td>
            <td style="color: ${reg.cumplido ? 'green' : 'red'}; font-weight: bold;">
                ${reg.cumplido ? '✓ Cumplido' : '✗ Fallado'}
            </td>
            <td>
                <button onclick="toggleCumplido(${reg.id})">Cambiar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const cumplidos = registros.filter(r => r.cumplido).length;
    const fallados = registros.filter(r => !r.cumplido).length;
    const resumen = document.getElementById('resumen-modal');
    if (resumen) {
        resumen.textContent = `Resumen: ${cumplidos} cumplidos / ${fallados} fallados (Total: ${registros.length})`;
    }
}

//Estadísticas y Limpieza


function actualizarEstadisticas() {
    const totalHabitos = document.getElementById('stat-total-habitos');
    const cumplidosEl = document.getElementById('stat-cumplidos');
    const falladosEl = document.getElementById('stat-fallados');

    if (totalHabitos) totalHabitos.textContent = habitos.length;
    
    const cumplidos = registros.filter(r => r.cumplido).length;
    const fallados = registros.filter(r => !r.cumplido).length;

    if (cumplidosEl) cumplidosEl.textContent = cumplidos;
    if (falladosEl) falladosEl.textContent = fallados;
}

document.getElementById('btn-borrar-todo')?.addEventListener('click', () => {
    if (confirm('¿Estás seguro de borrar todos los hábitos y registros?')) {
        borrarCookie('habitos');
        borrarCookie('registros');
        habitos = [];
        registros = [];
        actualizarDesplegableHabitos();
        actualizarEstadisticas();
        if (modal && !modal.classList.contains('oculto')) {
            renderizarTabla();
        }
    }
});
// Inicialización
window.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    actualizarDesplegableHabitos();
    actualizarEstadisticas();
});

