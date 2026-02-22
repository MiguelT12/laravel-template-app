export function mostrarPanelBloques(contenedor) {

    contenedor.innerHTML = '';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'card p-4 shadow-sm';

    const h4 = document.createElement('h4');
    h4.className = 'mb-3';
    h4.textContent = 'Gestión de bloques';
    tarjeta.appendChild(h4);

    const divBotones = document.createElement('div');
    divBotones.className = 'd-flex gap-2 flex-wrap';

    const botonVer = document.createElement('button');
    botonVer.className = 'btn btn-primary';
    botonVer.textContent = 'Ver bloques';
    botonVer.onclick = () => cargarBloques(contenedor);
    divBotones.appendChild(botonVer);

    const botonCrear = document.createElement('button');
    botonCrear.className = 'btn btn-success';
    botonCrear.textContent = 'Crear bloque';
    botonCrear.onclick = () => mostrarFormBloque(contenedor);
    divBotones.appendChild(botonCrear);

    tarjeta.appendChild(divBotones);
    contenedor.appendChild(tarjeta);
}

export async function cargarBloques(contenedor) {

    contenedor.innerHTML = '<div class="text-center p-3">Cargando bloques...</div>';

    try {

        const res = await fetch('/bloques', {
            headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) throw new Error();

        const bloques = await res.json();

        contenedor.innerHTML = '';

        const btnVolver = document.createElement('button');
        btnVolver.className = 'btn btn-secondary mb-3';
        btnVolver.textContent = '← Volver';
        btnVolver.onclick = () => mostrarPanelBloques(contenedor);
        contenedor.appendChild(btnVolver);

        if (bloques.length === 0) {
            contenedor.innerHTML += `<div class="alert alert-info">No hay bloques creados</div>`;
            return;
        }

        const tabla = document.createElement('table');
        tabla.className = 'table table-striped';

        tabla.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Duración</th>
                    <th>Acciones</th>
                </tr>
            </thead>
        `;

        const tbody = document.createElement('tbody');

        bloques.forEach(b => {

            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${b.id}</td>
                <td>${b.nombre}</td>
                <td>${b.tipo}</td>
                <td>${b.duracion_estimada ?? '-'}</td>
                <td></td>
            `;

            const tdAcciones = tr.lastElementChild;

            const btnEliminar = document.createElement('button');
            btnEliminar.className = 'btn btn-danger btn-sm';
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = () => eliminarBloque(b.id, () => cargarBloques(contenedor));

            tdAcciones.appendChild(btnEliminar);
            tbody.appendChild(tr);
        });

        tabla.appendChild(tbody);
        contenedor.appendChild(tabla);

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = `<div class="alert alert-danger">Error cargando bloques</div>`;
    }
}

export function mostrarFormBloque(contenedor) {

    contenedor.innerHTML = '';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'card p-4 shadow-sm';

    tarjeta.innerHTML = `
        <h4>Nuevo bloque</h4>

        <input id="bloqueNombre" class="form-control mb-2" placeholder="Nombre">
        <input id="bloqueTipo" class="form-control mb-2" placeholder="Tipo">
        <input id="bloqueDuracion" class="form-control mb-3" type="number" placeholder="Duración minutos">

        <button id="guardarBloque" class="btn btn-success me-2">Guardar</button>
        <button id="cancelarBloque" class="btn btn-secondary">Cancelar</button>
    `;

    contenedor.appendChild(tarjeta);

    document.getElementById('guardarBloque').onclick =
        () => crearBloque(() => cargarBloques(contenedor));

    document.getElementById('cancelarBloque').onclick =
        () => mostrarPanelBloques(contenedor);
}

export async function crearBloque(reloadCb) {

    const csrf = document.querySelector('meta[name="csrf-token"]').content;

    const nombre = document.getElementById('bloqueNombre').value;
    const tipo = document.getElementById('bloqueTipo').value;
    const duracion = document.getElementById('bloqueDuracion').value;

    if (!nombre || !tipo) {
        alert("Nombre y tipo obligatorios");
        return;
    }

    try {

        const res = await fetch('/bloques', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf
            },
            body: JSON.stringify({ nombre, tipo, duracion_estimada: duracion })
        });

        if (!res.ok) throw new Error();

        reloadCb();

    } catch (error) {
        console.error(error);
        alert("Error creando bloque");
    }
}

export async function eliminarBloque(id, reloadCb) {

    const csrf = document.querySelector('meta[name="csrf-token"]').content;

    if (!confirm("¿Eliminar bloque?")) return;

    try {

        const res = await fetch(`/bloques/${id}`, {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': csrf }
        });

        if (!res.ok) throw new Error();

        reloadCb();

    } catch (error) {
        console.error(error);
        alert("Error eliminando bloque");
    }
}