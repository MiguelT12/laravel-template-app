export function mostrarPanelSesiones(contenedor) {
    contenedor.innerHTML = '';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'card p-4 shadow-sm';

    const titulo = document.createElement('h4');
    titulo.textContent = 'Sesiones de entrenamiento';
    tarjeta.appendChild(titulo);

    const btnVer = document.createElement('button');
    btnVer.className = 'btn btn-primary w-100 mb-2';
    btnVer.textContent = 'Ver sesiones';
    btnVer.onclick = () => window.cargarSesiones();
    tarjeta.appendChild(btnVer);

    const btnCrear = document.createElement('button');
    btnCrear.className = 'btn btn-success w-100';
    btnCrear.textContent = 'Crear sesión';
    btnCrear.onclick = () => window.mostrarFormSesion();
    tarjeta.appendChild(btnCrear);

    contenedor.appendChild(tarjeta);
}

export async function cargarSesiones(contenedor) {
    try {
        const res = await fetch('/sesiones', { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error();
        const sesiones = await res.json();
        if (!Array.isArray(sesiones)) throw new Error();

        contenedor.innerHTML = '';

        if (sesiones.length === 0) {
            const mensaje = document.createElement('p');
            mensaje.textContent = 'No hay sesiones creadas';
            contenedor.appendChild(mensaje);
            return;
        }

        const titulo = document.createElement('h3');
        titulo.textContent = 'Sesiones de entrenamiento';
        contenedor.appendChild(titulo);

        const tabla = document.createElement('table');
        tabla.className = 'table';

        const filaCabecera = document.createElement('tr');
        const titulos = ['ID', 'Nombre', 'Fecha', 'Acciones'];
        titulos.forEach(texto => {
            const th = document.createElement('th');
            th.textContent = texto;
            filaCabecera.appendChild(th);
        });
        tabla.appendChild(filaCabecera);

        sesiones.forEach(s => {
            const fila = document.createElement('tr');

            const celdaId = document.createElement('td');
            celdaId.textContent = s.id;
            fila.appendChild(celdaId);

            const celdaNombre = document.createElement('td');
            celdaNombre.textContent = s.nombre;
            fila.appendChild(celdaNombre);

            const celdaFecha = document.createElement('td');
            celdaFecha.textContent = s.fecha;
            fila.appendChild(celdaFecha);

            const celdaAcciones = document.createElement('td');
            const btnVer = document.createElement('button');
            btnVer.textContent = 'Ver bloques';
            btnVer.onclick = () => window.verBloquesSesion(s.id);
            celdaAcciones.appendChild(btnVer);
            fila.appendChild(celdaAcciones);

            tabla.appendChild(fila);
        });

        contenedor.appendChild(tabla);

    } catch {
        contenedor.innerHTML = '';
        const mensajeError = document.createElement('p');
        mensajeError.textContent = 'Error cargando sesiones';
        contenedor.appendChild(mensajeError);
    }
}

export function mostrarFormSesion(contenedor) {
    contenedor.innerHTML = '';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'card p-4';

    const titulo = document.createElement('h4');
    titulo.textContent = 'Nueva sesión';
    tarjeta.appendChild(titulo);

    const inputNombre = document.createElement('input');
    inputNombre.id = 'sesionNombre';
    inputNombre.className = 'form-control mb-2';
    inputNombre.placeholder = 'Nombre';
    tarjeta.appendChild(inputNombre);

    const inputFecha = document.createElement('input');
    inputFecha.id = 'sesionFecha';
    inputFecha.type = 'date';
    inputFecha.className = 'form-control mb-2';
    tarjeta.appendChild(inputFecha);

    const btnGuardar = document.createElement('button');
    btnGuardar.className = 'btn btn-success';
    btnGuardar.textContent = 'Guardar';
    btnGuardar.onclick = () => window.crearSesion();
    tarjeta.appendChild(btnGuardar);

    tarjeta.appendChild(document.createTextNode(' '));

    const btnCancelar = document.createElement('button');
    btnCancelar.className = 'btn btn-secondary';
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.onclick = () => window.cargarSesiones();
    tarjeta.appendChild(btnCancelar);

    contenedor.appendChild(tarjeta);
}

export async function crearSesion(csrfToken, reloadCb) {
    const nombre = document.getElementById('sesionNombre').value;
    const fecha = document.getElementById('sesionFecha').value;
    
    if (!nombre || !fecha) { 
        alert("Nombre y fecha obligatorios"); 
        return; 
    }

    await fetch('/sesiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
        body: JSON.stringify({ nombre, fecha, id_plan: 1 })
    });

    reloadCb();
}

export async function eliminarSesion(id, csrfToken, reloadCb) {
    if (!confirm("Eliminar sesión?")) return;
    
    await fetch('/sesiones/' + id, { 
        method: 'DELETE', 
        headers: { 'X-CSRF-TOKEN': csrfToken } 
    });
    
    reloadCb();
}

export async function verBloquesSesion(sesionId, contenedor) {
    try {
        const res = await fetch(`/sesiones/${sesionId}/bloques`, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error();
        const bloques = await res.json();

        contenedor.innerHTML = '';

        const titulo = document.createElement('h3');
        titulo.textContent = `Bloques de la sesión ${sesionId}`;
        contenedor.appendChild(titulo);

        const btnAnadir = document.createElement('button');
        btnAnadir.className = 'btn btn-success mb-3';
        btnAnadir.textContent = 'Añadir bloque a sesión';
        btnAnadir.onclick = () => window.mostrarFormAgregarBloqueSesion(sesionId);
        contenedor.appendChild(btnAnadir);

        if (!Array.isArray(bloques) || bloques.length === 0) {
            const mensaje = document.createElement('p');
            mensaje.textContent = 'No hay bloques en esta sesión';
            contenedor.appendChild(mensaje);
        } else {
            const tabla = document.createElement('table');
            tabla.className = 'table';

            const filaCabecera = document.createElement('tr');
            const titulos = ['Bloque', 'Orden', 'Repeticiones', ''];
            titulos.forEach(texto => {
                const th = document.createElement('th');
                th.textContent = texto;
                filaCabecera.appendChild(th);
            });
            tabla.appendChild(filaCabecera);

            bloques.forEach(b => {
                const fila = document.createElement('tr');

                const celdaNombre = document.createElement('td');
                celdaNombre.textContent = b.nombre;
                fila.appendChild(celdaNombre);

                const celdaOrden = document.createElement('td');
                celdaOrden.textContent = b.pivot?.orden ?? '-';
                fila.appendChild(celdaOrden);

                const celdaRepeticiones = document.createElement('td');
                celdaRepeticiones.textContent = b.pivot?.repeticiones ?? '-';
                fila.appendChild(celdaRepeticiones);

                const celdaAcciones = document.createElement('td');
                const btnQuitar = document.createElement('button');
                btnQuitar.className = 'btn btn-danger btn-sm';
                btnQuitar.textContent = 'Quitar';
                btnQuitar.onclick = () => window.eliminarBloqueSesion(sesionId, b.id);
                celdaAcciones.appendChild(btnQuitar);
                fila.appendChild(celdaAcciones);

                tabla.appendChild(fila);
            });

            contenedor.appendChild(tabla);
        }

        contenedor.appendChild(document.createElement('br'));

        const btnVolver = document.createElement('button');
        btnVolver.className = 'btn btn-secondary';
        btnVolver.textContent = 'Volver';
        btnVolver.onclick = () => window.cargarSesiones();
        contenedor.appendChild(btnVolver);

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '';
        const alertaError = document.createElement('div');
        alertaError.className = 'alert alert-danger';
        alertaError.textContent = 'Error cargando bloques de la sesión';
        contenedor.appendChild(alertaError);
    }
}

export async function mostrarFormAgregarBloqueSesion(sesionId, contenedor) {
    const res = await fetch('/bloques');
    const bloques = await res.json();

    contenedor.innerHTML = '';

    const titulo = document.createElement('h3');
    titulo.textContent = 'Añadir bloque a sesión';
    contenedor.appendChild(titulo);

    const selectBloque = document.createElement('select');
    selectBloque.id = 'bloqueId';

    bloques.forEach(b => {
        const opcion = document.createElement('option');
        opcion.value = b.id;
        opcion.textContent = b.nombre;
        selectBloque.appendChild(opcion);
    });
    contenedor.appendChild(selectBloque);

    const inputOrden = document.createElement('input');
    inputOrden.id = 'orden';
    inputOrden.type = 'number';
    inputOrden.placeholder = 'Orden';
    contenedor.appendChild(inputOrden);

    const inputRepeticiones = document.createElement('input');
    inputRepeticiones.id = 'repeticiones';
    inputRepeticiones.type = 'number';
    inputRepeticiones.placeholder = 'Repeticiones';
    contenedor.appendChild(inputRepeticiones);

    const btnGuardar = document.createElement('button');
    btnGuardar.textContent = 'Guardar';
    btnGuardar.onclick = () => window.agregarBloqueSesion(sesionId);
    contenedor.appendChild(btnGuardar);

    contenedor.appendChild(document.createTextNode(' '));

    const btnCancelar = document.createElement('button');
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.onclick = () => window.verBloquesSesion(sesionId);
    contenedor.appendChild(btnCancelar);
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