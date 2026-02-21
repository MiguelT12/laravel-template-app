export function mostrarPanelBloques(contenedor) {
    contenedor.innerHTML = `
        <div class="card p-4 shadow-sm">
            <h4 class="mb-3">Gestión de bloques</h4>
            <div class="d-flex gap-2 flex-wrap">
                <button class="btn btn-primary w-100 mb-2" onclick="cargarBloques()">Ver bloques</button>
                <button class="btn btn-success" onclick="mostrarFormBloque()">Crear bloque</button>
            </div>
        </div>
    `;
}

export async function cargarBloques(contenedor) {
    try {
        const res = await fetch('/bloques', { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error("Error cargando bloques");
        const bloques = await res.json();
        if (bloques.length === 0) {
            contenedor.innerHTML = '<div class="alert alert-info">No hay bloques creados</div>';
            return;
        }
        let html = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th><th>Nombre</th><th>Tipo</th><th>Duración</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;
        bloques.forEach(b => {
            html += `
                <tr>
                    <td>${b.id}</td><td>${b.nombre}</td><td>${b.tipo}</td><td>${b.duracion_estimada ?? '-'}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="eliminarBloque(${b.id})">Eliminar</button></td>
                </tr>
            `;
        });
        html += `</tbody></table>`;
        contenedor.innerHTML = html;
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<div class="alert alert-danger">Error cargando bloques</div>';
    }
}

export function mostrarFormBloque(contenedor) {
    contenedor.innerHTML = `
        <div class="card p-4">
            <h4>Nuevo bloque</h4>
            <input id="bloqueNombre" class="form-control mb-2" placeholder="Nombre">
            <input id="bloqueTipo" class="form-control mb-2" placeholder="Tipo">
            <input id="bloqueDuracion" class="form-control mb-2" type="number" placeholder="Duración minutos">
            <button class="btn btn-success" onclick="crearBloque()">Guardar</button>
            <button class="btn btn-secondary" onclick="cargarBloques()">Cancelar</button>
        </div>
    `;
}

export async function crearBloque(csrfToken, reloadCb) {
    const nombre = document.getElementById('bloqueNombre').value;
    const tipo = document.getElementById('bloqueTipo').value;
    const duracion = document.getElementById('bloqueDuracion').value;
    if (!nombre || !tipo) { alert("Nombre y tipo son obligatorios"); return; }
    try {
        const res = await fetch('/bloques', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrfToken },
            body: JSON.stringify({ nombre, tipo, duracion_estimada: duracion })
        });
        if (!res.ok) throw new Error();
        alert("Bloque creado correctamente");
        reloadCb();
    } catch (error) {
        console.error(error);
        alert("Error creando bloque");
    }
}

export async function eliminarBloque(id, csrfToken, reloadCb) {
    if (!confirm("¿Eliminar bloque?")) return;
    try {
        const res = await fetch(`/bloques/${id}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': csrfToken } });
        if (!res.ok) throw new Error();
        reloadCb();
    } catch {
        alert("Error eliminando bloque");
    }
}