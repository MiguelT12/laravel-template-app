export function mostrarPanelBloques(contenedor) {
    contenedor.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'card p-4 shadow-sm';

    const h4 = document.createElement('h4');
    h4.className = 'mb-3';
    h4.textContent = 'Gestión de bloques';
    card.appendChild(h4);

    const divBotones = document.createElement('div');
    divBotones.className = 'd-flex gap-2 flex-wrap';

    const btnVer = document.createElement('button');
    btnVer.className = 'btn btn-primary w-100 mb-2';
    btnVer.textContent = 'Ver bloques';
    btnVer.onclick = () => window.cargarBloques();
    divBotones.appendChild(btnVer);

    const btnCrear = document.createElement('button');
    btnCrear.className = 'btn btn-success';
    btnCrear.textContent = 'Crear bloque';
    btnCrear.onclick = () => window.mostrarFormBloque();
    divBotones.appendChild(btnCrear);

    card.appendChild(divBotones);
    contenedor.appendChild(card);
}

export async function cargarBloques(contenedor) {
    contenedor.innerHTML = '';

    try {
        const res = await fetch('/bloques', { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error("Error cargando bloques");
        const bloques = await res.json();

        if (bloques.length === 0) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-info';
            alertDiv.textContent = 'No hay bloques creados';
            contenedor.appendChild(alertDiv);
            return;
        }

        const table = document.createElement('table');
        table.className = 'table table-striped';

        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        
        const headers = ['ID', 'Nombre', 'Tipo', 'Duración', 'Acciones'];
        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            trHead.appendChild(th);
        });
        
        thead.appendChild(trHead);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        bloques.forEach(b => {
            const tr = document.createElement('tr');

            const tdId = document.createElement('td');
            tdId.textContent = b.id;
            tr.appendChild(tdId);

            const tdNombre = document.createElement('td');
            tdNombre.textContent = b.nombre;
            tr.appendChild(tdNombre);

            const tdTipo = document.createElement('td');
            tdTipo.textContent = b.tipo;
            tr.appendChild(tdTipo);

            const tdDuracion = document.createElement('td');
            tdDuracion.textContent = b.duracion_estimada ?? '-';
            tr.appendChild(tdDuracion);

            const tdAcciones = document.createElement('td');
            const btnEliminar = document.createElement('button');
            btnEliminar.className = 'btn btn-danger btn-sm';
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = () => window.eliminarBloque(b.id);
            tdAcciones.appendChild(btnEliminar);
            tr.appendChild(tdAcciones);

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        contenedor.appendChild(table);

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '';
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger';
        alertDiv.textContent = 'Error cargando bloques';
        contenedor.appendChild(alertDiv);
    }
}

export function mostrarFormBloque(contenedor) {
    contenedor.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'card p-4';

    const h4 = document.createElement('h4');
    h4.textContent = 'Nuevo bloque';
    card.appendChild(h4);

    const inputNombre = document.createElement('input');
    inputNombre.id = 'bloqueNombre';
    inputNombre.className = 'form-control mb-2';
    inputNombre.placeholder = 'Nombre';
    card.appendChild(inputNombre);

    const inputTipo = document.createElement('input');
    inputTipo.id = 'bloqueTipo';
    inputTipo.className = 'form-control mb-2';
    inputTipo.placeholder = 'Tipo';
    card.appendChild(inputTipo);

    const inputDuracion = document.createElement('input');
    inputDuracion.id = 'bloqueDuracion';
    inputDuracion.className = 'form-control mb-2';
    inputDuracion.type = 'number';
    inputDuracion.placeholder = 'Duración minutos';
    card.appendChild(inputDuracion);

    const btnGuardar = document.createElement('button');
    btnGuardar.className = 'btn btn-success';
    btnGuardar.textContent = 'Guardar';
    btnGuardar.onclick = () => window.crearBloque();
    card.appendChild(btnGuardar);

    // Espacio entre botones
    card.appendChild(document.createTextNode(' '));

    const btnCancelar = document.createElement('button');
    btnCancelar.className = 'btn btn-secondary';
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.onclick = () => window.cargarBloques();
    card.appendChild(btnCancelar);

    contenedor.appendChild(card);
}

export async function crearBloque(csrfToken, reloadCb) {
    const nombre = document.getElementById('bloqueNombre').value;
    const tipo = document.getElementById('bloqueTipo').value;
    const duracion = document.getElementById('bloqueDuracion').value;
    
    if (!nombre || !tipo) { 
        alert("Nombre y tipo son obligatorios"); 
        return; 
    }
    
    try {
        const res = await fetch('/bloques', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json', 
                'X-CSRF-TOKEN': csrfToken 
            },
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
        const res = await fetch(`/bloques/${id}`, { 
            method: 'DELETE', 
            headers: { 'X-CSRF-TOKEN': csrfToken } 
        });
        if (!res.ok) throw new Error();
        reloadCb();
    } catch {
        alert("Error eliminando bloque");
    }
}