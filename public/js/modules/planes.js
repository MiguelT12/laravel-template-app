export function mostrarPanelPlanes(contenedor) {
    contenedor.innerHTML = '';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'card p-4 shadow-sm';

    const titulo = document.createElement('h4');
    titulo.textContent = 'Planes de entrenamiento';
    tarjeta.appendChild(titulo);

    const btnVer = document.createElement('button');
    btnVer.className = 'btn btn-primary mb-2';
    btnVer.textContent = 'Ver planes';
    btnVer.onclick = () => window.cargarPlanes();
    tarjeta.appendChild(btnVer);

    tarjeta.appendChild(document.createTextNode(' '));

    const btnCrear = document.createElement('button');
    btnCrear.className = 'btn btn-success';
    btnCrear.textContent = 'Crear plan';
    btnCrear.onclick = () => window.mostrarFormPlan();
    tarjeta.appendChild(btnCrear);

    contenedor.appendChild(tarjeta);
}

export async function cargarPlanes(contenedor) {
    try {
        const res = await fetch('/planes-ent', { headers: { Accept: 'application/json' } });
        const planes = await res.json();

        contenedor.innerHTML = '';

        if (planes.length === 0) {
            const alertaInfo = document.createElement('div');
            alertaInfo.className = 'alert alert-info';
            alertaInfo.textContent = 'No hay planes';
            contenedor.appendChild(alertaInfo);
            return;
        }

        const tabla = document.createElement('table');
        tabla.className = 'table';

        const filaCabecera = document.createElement('tr');
        const titulos = ['Nombre', 'Inicio', 'Fin', ''];
        titulos.forEach(texto => {
            const th = document.createElement('th');
            th.textContent = texto;
            filaCabecera.appendChild(th);
        });
        tabla.appendChild(filaCabecera);

        planes.forEach(p => {
            const fila = document.createElement('tr');

            const celdaNombre = document.createElement('td');
            celdaNombre.textContent = p.nombre;
            fila.appendChild(celdaNombre);

            const celdaInicio = document.createElement('td');
            celdaInicio.textContent = p.fecha_inicio;
            fila.appendChild(celdaInicio);

            const celdaFin = document.createElement('td');
            celdaFin.textContent = p.fecha_fin ?? '-';
            fila.appendChild(celdaFin);

            const celdaAcciones = document.createElement('td');

            const btnVer = document.createElement('button');
            btnVer.className = 'btn btn-sm btn-info';
            btnVer.textContent = 'Ver';
            btnVer.onclick = () => window.verPlan(p.id);
            celdaAcciones.appendChild(btnVer);

            celdaAcciones.appendChild(document.createTextNode(' '));

            const btnModificar = document.createElement('button');
            btnModificar.className = 'btn btn-sm btn-warning';
            btnModificar.textContent = 'Modificar';
            btnModificar.onclick = () => window.mostrarFormEditarPlan(p.id);
            celdaAcciones.appendChild(btnModificar);

            celdaAcciones.appendChild(document.createTextNode(' '));

            const btnEliminar = document.createElement('button');
            btnEliminar.className = 'btn btn-sm btn-danger';
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = () => window.eliminarPlan(p.id);
            celdaAcciones.appendChild(btnEliminar);

            fila.appendChild(celdaAcciones);
            tabla.appendChild(fila);
        });

        contenedor.appendChild(tabla);

    } catch {
        contenedor.innerHTML = '';
        const alertaError = document.createElement('div');
        alertaError.className = 'alert alert-danger';
        alertaError.textContent = 'Error cargando planes';
        contenedor.appendChild(alertaError);
    }
}

export function mostrarFormPlan(contenedor) {
    contenedor.innerHTML = '';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'card p-4';

    const titulo = document.createElement('h4');
    titulo.textContent = 'Nuevo plan';
    tarjeta.appendChild(titulo);

    const inputNombre = document.createElement('input');
    inputNombre.id = 'planNombre';
    inputNombre.className = 'form-control mb-2';
    inputNombre.placeholder = 'Nombre';
    tarjeta.appendChild(inputNombre);

    const inputDesc = document.createElement('textarea');
    inputDesc.id = 'planDesc';
    inputDesc.className = 'form-control mb-2';
    inputDesc.placeholder = 'Descripción';
    tarjeta.appendChild(inputDesc);

    const inputInicio = document.createElement('input');
    inputInicio.id = 'planInicio';
    inputInicio.type = 'date';
    inputInicio.className = 'form-control mb-2';
    tarjeta.appendChild(inputInicio);

    const inputFin = document.createElement('input');
    inputFin.id = 'planFin';
    inputFin.type = 'date';
    inputFin.className = 'form-control mb-2';
    tarjeta.appendChild(inputFin);

    const inputObj = document.createElement('textarea');
    inputObj.id = 'planObj';
    inputObj.className = 'form-control mb-2';
    inputObj.placeholder = 'Objetivo';
    tarjeta.appendChild(inputObj);

    const btnGuardar = document.createElement('button');
    btnGuardar.className = 'btn btn-success';
    btnGuardar.textContent = 'Guardar';
    btnGuardar.onclick = () => window.guardarPlan();
    tarjeta.appendChild(btnGuardar);

    contenedor.appendChild(tarjeta);
}

export async function guardarPlan(csrfToken, reload) {
    const data = {
        nombre: document.getElementById('planNombre').value,
        descripcion: document.getElementById('planDesc').value,
        fecha_inicio: document.getElementById('planInicio').value,
        fecha_fin: document.getElementById('planFin').value,
        objetivo: document.getElementById('planObj').value
    };

    try {
        const res = await fetch('/planes-ent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error();

        alert("Plan creado");
        reload();

    } catch {
        alert("Error guardando plan");
    }
}

export async function verPlan(id, contenedor) {
    const res = await fetch('/planes-ent/' + id);
    const p = await res.json();

    contenedor.innerHTML = '';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'card p-4';

    const titulo = document.createElement('h4');
    titulo.textContent = p.nombre;
    tarjeta.appendChild(titulo);

    const parrafoDesc = document.createElement('p');
    parrafoDesc.textContent = p.descripcion ?? '';
    tarjeta.appendChild(parrafoDesc);

    const crearLinea = (etiqueta, valor) => {
        const parrafo = document.createElement('p');
        const negrita = document.createElement('b');
        negrita.textContent = etiqueta + ': ';
        parrafo.appendChild(negrita);
        parrafo.appendChild(document.createTextNode(valor));
        return parrafo;
    };

    tarjeta.appendChild(crearLinea('Inicio', p.fecha_inicio));
    tarjeta.appendChild(crearLinea('Fin', p.fecha_fin ?? '-'));
    tarjeta.appendChild(crearLinea('Objetivo', p.objetivo ?? ''));

    contenedor.appendChild(tarjeta);
}

export async function mostrarFormEditarPlan(id, contenedor) {
    try {
        const res = await fetch('/planes-ent/' + id, {
            headers: { Accept: 'application/json' }
        });

        if (!res.ok) throw new Error();

        const p = await res.json();

        contenedor.innerHTML = '';

        const tarjeta = document.createElement('div');
        tarjeta.className = 'card p-4';

        const titulo = document.createElement('h4');
        titulo.textContent = 'Modificar plan';
        tarjeta.appendChild(titulo);

        const inputNombre = document.createElement('input');
        inputNombre.id = 'planEditNombre';
        inputNombre.className = 'form-control mb-2';
        inputNombre.placeholder = 'Nombre';
        inputNombre.value = p.nombre ?? '';
        tarjeta.appendChild(inputNombre);

        const inputDesc = document.createElement('textarea');
        inputDesc.id = 'planEditDesc';
        inputDesc.className = 'form-control mb-2';
        inputDesc.placeholder = 'Descripción';
        inputDesc.value = p.descripcion ?? '';
        tarjeta.appendChild(inputDesc);

        const inputInicio = document.createElement('input');
        inputInicio.id = 'planEditInicio';
        inputInicio.type = 'date';
        inputInicio.className = 'form-control mb-2';
        inputInicio.value = p.fecha_inicio ?? '';
        tarjeta.appendChild(inputInicio);

        const inputFin = document.createElement('input');
        inputFin.id = 'planEditFin';
        inputFin.type = 'date';
        inputFin.className = 'form-control mb-2';
        inputFin.value = p.fecha_fin ?? '';
        tarjeta.appendChild(inputFin);

        const inputObj = document.createElement('textarea');
        inputObj.id = 'planEditObj';
        inputObj.className = 'form-control mb-2';
        inputObj.placeholder = 'Objetivo';
        inputObj.value = p.objetivo ?? '';
        tarjeta.appendChild(inputObj);

        const btnGuardar = document.createElement('button');
        btnGuardar.className = 'btn btn-success';
        btnGuardar.textContent = 'Guardar cambios';
        btnGuardar.onclick = () => window.actualizarPlan(id);
        tarjeta.appendChild(btnGuardar);

        tarjeta.appendChild(document.createTextNode(' '));

        const btnCancelar = document.createElement('button');
        btnCancelar.className = 'btn btn-secondary';
        btnCancelar.textContent = 'Cancelar';
        btnCancelar.onclick = () => window.cargarPlanes();
        tarjeta.appendChild(btnCancelar);

        contenedor.appendChild(tarjeta);
    } catch {
        alert('Error cargando el plan para editar');
    }
}

export async function actualizarPlan(id, csrfToken, reload) {
    const data = {
        nombre: document.getElementById('planEditNombre').value,
        descripcion: document.getElementById('planEditDesc').value,
        fecha_inicio: document.getElementById('planEditInicio').value,
        fecha_fin: document.getElementById('planEditFin').value,
        objetivo: document.getElementById('planEditObj').value
    };

    try {
        const res = await fetch('/planes-ent/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error();

        alert('Plan actualizado');
        reload();
    } catch {
        alert('Error actualizando plan');
    }
}

export async function eliminarPlan(id, csrfToken, reload) {
    if (!confirm("¿Eliminar plan?")) return;

    await fetch('/planes-ent/' + id, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': csrfToken }
    });

    reload();
}
