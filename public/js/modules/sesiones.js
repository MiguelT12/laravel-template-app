export function mostrarPanelSesiones(contenedor) {
    contenedor.innerHTML = `
        <div class="card p-4 shadow-sm">
            <h4>Sesiones de entrenamiento</h4>
            <button class="btn btn-primary w-100 mb-2" onclick="cargarSesiones()">Ver sesiones</button>
            <button class="btn btn-success w-100" onclick="mostrarFormSesion()">Crear sesión</button>
        </div>
    `;
}

export async function cargarSesiones(contenedor) {
    try {
        const res = await fetch('/sesiones', { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error();
        const sesiones = await res.json();
        if (!Array.isArray(sesiones)) throw new Error();
        if (sesiones.length === 0) {
            contenedor.innerHTML = '<p>No hay sesiones creadas</p>';
            return;
        }
        let html = `
            <h3>Sesiones de entrenamiento</h3>
            <table class="table">
            <tr><th>ID</th><th>Nombre</th><th>Fecha</th><th>Acciones</th></tr>
        `;
        sesiones.forEach(s => {
            html += `
                <tr>
                    <td>${s.id}</td><td>${s.nombre}</td><td>${s.fecha}</td>
                    <td><button onclick="verBloquesSesion(${s.id})">Ver bloques</button></td>
                </tr>
            `;
        });
        html += '</table>';
        contenedor.innerHTML = html;
    } catch {
        contenedor.innerHTML = '<p>Error cargando sesiones</p>';
    }
}

export function mostrarFormSesion(contenedor) {
    contenedor.innerHTML = `
        <div class="card p-4">
            <h4>Nueva sesión</h4>
            <input id="sesionNombre" class="form-control mb-2" placeholder="Nombre">
            <input id="sesionFecha" type="date" class="form-control mb-2">
            <button class="btn btn-success" onclick="crearSesion()">Guardar</button>
            <button class="btn btn-secondary" onclick="cargarSesiones()">Cancelar</button>
        </div>
    `;
}

export async function crearSesion(csrfToken, reloadCb) {
    const nombre = document.getElementById('sesionNombre').value;
    const fecha = document.getElementById('sesionFecha').value;
    if (!nombre || !fecha) { alert("Nombre y fecha obligatorios"); return; }
    await fetch('/sesiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
        body: JSON.stringify({ nombre, fecha, id_plan: 1 })
    });
    reloadCb();
}

export async function eliminarSesion(id, csrfToken, reloadCb) {
    if (!confirm("Eliminar sesión?")) return;
    await fetch('/sesiones/' + id, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': csrfToken } });
    reloadCb();
}

export async function verBloquesSesion(sesionId, contenedor) {
    try {
        const res = await fetch(`/sesiones/${sesionId}/bloques`, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error();
        const bloques = await res.json();
        let html = `
            <h3>Bloques de la sesión ${sesionId}</h3>
            <button class="btn btn-success mb-3" onclick="mostrarFormAgregarBloqueSesion(${sesionId})">Añadir bloque a sesión</button>
        `;
        if (!Array.isArray(bloques) || bloques.length === 0) {
            html += '<p>No hay bloques en esta sesión</p>';
        } else {
            html += `<table class="table"><tr><th>Bloque</th><th>Orden</th><th>Repeticiones</th><th></th></tr>`;
            bloques.forEach(b => {
                html += `
                    <tr>
                        <td>${b.nombre}</td><td>${b.pivot?.orden ?? '-'}</td><td>${b.pivot?.repeticiones ?? '-'}</td>
                        <td><button class="btn btn-danger btn-sm" onclick="eliminarBloqueSesion(${sesionId}, ${b.id})">Quitar</button></td>
                    </tr>
                `;
            });
            html += '</table>';
        }
        html += `<br><button class="btn btn-secondary" onclick="cargarSesiones()">Volver</button>`;
        contenedor.innerHTML = html;
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<div class="alert alert-danger">Error cargando bloques de la sesión</div>';
    }
}

export async function mostrarFormAgregarBloqueSesion(sesionId, contenedor) {
    const res = await fetch('/bloques');
    const bloques = await res.json();
    let options = '';
    bloques.forEach(b => { options += `<option value="${b.id}">${b.nombre}</option>`; });
    contenedor.innerHTML = `
        <h3>Añadir bloque a sesión</h3>
        <select id="bloqueId">${options}</select>
        <input id="orden" type="number" placeholder="Orden">
        <input id="repeticiones" type="number" placeholder="Repeticiones">
        <button onclick="agregarBloqueSesion(${sesionId})">Guardar</button>
        <button onclick="verBloquesSesion(${sesionId})">Cancelar</button>
    `;
}

export async function agregarBloqueSesion(sesionId, csrfToken, reloadCb) {
    const bloqueId = document.getElementById('bloqueId').value;
    const orden = document.getElementById('orden').value;
    const repeticiones = document.getElementById('repeticiones').value;
    await fetch(`/sesiones/${sesionId}/bloques`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
        body: JSON.stringify({ id_bloque_entrenamiento: bloqueId, orden: orden, repeticiones: repeticiones })
    });
    reloadCb(sesionId);
}

export async function eliminarBloqueSesion(sesionId, bloqueId, csrfToken, reloadCb) {
    if (!confirm("¿Quitar bloque de la sesión?")) return;
    await fetch(`/sesiones/${sesionId}/bloques/${bloqueId}`, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': csrfToken }
    });
    reloadCb(sesionId);
}