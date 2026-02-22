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
    botonCrear.className = 'btn btn-success w-100';
    botonCrear.textContent = 'Crear bloque';
    botonCrear.onclick = () => mostrarFormBloque(contenedor);
    divBotones.appendChild(botonCrear);

    tarjeta.appendChild(divBotones);
    contenedor.appendChild(tarjeta);
}

export async function cargarBloques(contenedor) {
    contenedor.innerHTML = '';
    
    const divCargando = document.createElement('div');
    divCargando.className = 'text-center p-3';
    divCargando.textContent = 'Cargando bloques...';
    contenedor.appendChild(divCargando);

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
            const alertaInfo = document.createElement('div');
            alertaInfo.className = 'alert alert-info';
            alertaInfo.textContent = 'No hay bloques creados';
            contenedor.appendChild(alertaInfo);
            return;
        }

        const tabla = document.createElement('table');
        tabla.className = 'table table-striped';

        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        
        const titulos = ['ID', 'Nombre', 'Tipo', 'Duración', 'Acciones'];
        titulos.forEach(texto => {
            const th = document.createElement('th');
            th.textContent = texto;
            trHead.appendChild(th);
        });
        
        thead.appendChild(trHead);
        tabla.appendChild(thead);

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
            btnEliminar.onclick = () => eliminarBloque(b.id, () => cargarBloques(contenedor));
            tdAcciones.appendChild(btnEliminar);
            
            tr.appendChild(tdAcciones);
            tbody.appendChild(tr);
        });

        tabla.appendChild(tbody);
        contenedor.appendChild(tabla);

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '';
        const alertaError = document.createElement('div');
        alertaError.className = 'alert alert-danger';
        alertaError.textContent = 'Error cargando bloques';
        contenedor.appendChild(alertaError);
    }
}

export function mostrarFormBloque(contenedor) {
    contenedor.innerHTML = '';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'card p-4 shadow-sm';

    const titulo = document.createElement('h4');
    titulo.textContent = 'Nuevo bloque';
    tarjeta.appendChild(titulo);

    const inputNombre = document.createElement('input');
    inputNombre.id = 'bloqueNombre';
    inputNombre.className = 'form-control mb-2';
    inputNombre.placeholder = 'Nombre';
    tarjeta.appendChild(inputNombre);

    const inputTipo = document.createElement('input');
    inputTipo.id = 'bloqueTipo';
    inputTipo.className = 'form-control mb-2';
    inputTipo.placeholder = 'Tipo';
    tarjeta.appendChild(inputTipo);

    const inputDuracion = document.createElement('input');
    inputDuracion.id = 'bloqueDuracion';
    inputDuracion.className = 'form-control mb-3';
    inputDuracion.type = 'number';
    inputDuracion.placeholder = 'Duración minutos';
    tarjeta.appendChild(inputDuracion);

    const btnGuardar = document.createElement('button');
    btnGuardar.id = 'guardarBloque';
    btnGuardar.className = 'btn btn-success me-2';
    btnGuardar.textContent = 'Guardar';
    btnGuardar.onclick = () => crearBloque(() => cargarBloques(contenedor));
    tarjeta.appendChild(btnGuardar);

    const btnCancelar = document.createElement('button');
    btnCancelar.id = 'cancelarBloque';
    btnCancelar.className = 'btn btn-secondary';
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.onclick = () => mostrarPanelBloques(contenedor);
    tarjeta.appendChild(btnCancelar);

    contenedor.appendChild(tarjeta);
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