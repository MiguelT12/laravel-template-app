export function mostrarPanelEntrenamientos(contenedor) {
    contenedor.innerHTML = '';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'card p-4 shadow-sm';

    const titulo = document.createElement('h4');
    titulo.textContent = 'Entrenamientos realizados';
    tarjeta.appendChild(titulo);

    const botonVer = document.createElement('button');
    botonVer.className = 'btn btn-primary w-100 mb-2';
    botonVer.textContent = 'Ver entrenamientos';
    botonVer.onclick = () => window.cargarEntrenamientos();
    tarjeta.appendChild(botonVer);

    const btnRegistrar = document.createElement('button');
    btnRegistrar.className = 'btn btn-success w-100';
    btnRegistrar.textContent = 'Registrar entrenamiento';
    btnRegistrar.onclick = () => window.mostrarFormEntrenamiento();
    tarjeta.appendChild(btnRegistrar);

    contenedor.appendChild(tarjeta);
}

export async function cargarEntrenamientos(contenedor) {
    contenedor.innerHTML = '';

    try {
        const res = await fetch('/entrenamientos', { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error();
        const entrenamientos = await res.json();

        if (!Array.isArray(entrenamientos) || entrenamientos.length === 0) {
            const alertaInfo = document.createElement('div');
            alertaInfo.className = 'alert alert-info';
            alertaInfo.textContent = 'No hay entrenamientos registrados';
            contenedor.appendChild(alertaInfo);
            return;
        }

        const titulo = document.createElement('h3');
        titulo.textContent = 'Entrenamientos realizados';
        contenedor.appendChild(titulo);

        const tabla = document.createElement('table');
        tabla.className = 'table table-striped';

        const cabecera = document.createElement('thead');
        const filaCabecera = document.createElement('tr');
        
        const titulos = ['Fecha', 'Duración', 'Km', 'Potencia media', 'Pulso medio', 'Comentario'];
        titulos.forEach(texto => {
            const th = document.createElement('th');
            th.textContent = texto;
            filaCabecera.appendChild(th);
        });

        cabecera.appendChild(filaCabecera);
        tabla.appendChild(cabecera);

        const cuerpoTabla = document.createElement('tbody');

        entrenamientos.forEach(e => {
            const fila = document.createElement('tr');

            const celdaFecha = document.createElement('td');
            celdaFecha.textContent = e.fecha;
            fila.appendChild(celdaFecha);

            const celdaDuracion = document.createElement('td');
            celdaDuracion.textContent = e.duracion;
            fila.appendChild(celdaDuracion);

            const celdaKm = document.createElement('td');
            celdaKm.textContent = e.kilometros;
            fila.appendChild(celdaKm);

            const celdaPotencia = document.createElement('td');
            celdaPotencia.textContent = e.potencia_media ?? '-';
            fila.appendChild(celdaPotencia);

            const celdaPulso = document.createElement('td');
            celdaPulso.textContent = e.pulso_medio ?? '-';
            fila.appendChild(celdaPulso);

            const celdaComentario = document.createElement('td');
            celdaComentario.textContent = e.comentario ?? '-';
            fila.appendChild(celdaComentario);

            cuerpoTabla.appendChild(fila);
        });

        tabla.appendChild(cuerpoTabla);
        contenedor.appendChild(tabla);

    } catch (err) {
        console.error(err);
        contenedor.innerHTML = '';
        const alertaError = document.createElement('div');
        alertaError.className = 'alert alert-danger';
        alertaError.textContent = 'Error cargando entrenamientos';
        contenedor.appendChild(alertaError);
    }
}

export async function verEntrenamiento(id, contenedor) {
    contenedor.innerHTML = '';

    try {
        const res = await fetch('/entrenamientos/' + id);
        const e = await res.json();

        const titulo = document.createElement('h3');
        titulo.textContent = 'Detalle entrenamiento';
        contenedor.appendChild(titulo);

        const tarjeta = document.createElement('div');
        tarjeta.className = 'card p-4';

        // Función para crear las líneas de texto rápido
        const crearDato = (etiqueta, valor) => {
            const parrafo = document.createElement('p');
            const negrita = document.createElement('b');
            negrita.textContent = etiqueta + ': ';
            parrafo.appendChild(negrita);
            parrafo.appendChild(document.createTextNode(valor));
            return parrafo;
        };

        tarjeta.appendChild(crearDato('Fecha', e.fecha));
        tarjeta.appendChild(crearDato('Duración', e.duracion));
        tarjeta.appendChild(crearDato('Kilómetros', e.kilometros));
        tarjeta.appendChild(crearDato('Recorrido', e.recorrido));
        
        tarjeta.appendChild(document.createElement('hr'));

        tarjeta.appendChild(crearDato('Pulso medio', e.pulso_medio));
        tarjeta.appendChild(crearDato('Pulso máximo', e.pulso_max));
        tarjeta.appendChild(crearDato('Potencia media', e.potencia_media));
        tarjeta.appendChild(crearDato('Potencia normalizada', e.potencia_normalizada));

        tarjeta.appendChild(document.createElement('hr'));

        tarjeta.appendChild(crearDato('Bicicleta', e.bicicleta?.nombre ?? '-'));
        tarjeta.appendChild(crearDato('Sesión planificada', e.sesion?.nombre ?? '-'));

        tarjeta.appendChild(document.createElement('hr'));

        tarjeta.appendChild(crearDato('Comentario', e.comentario ?? '-'));

        const btnVolver = document.createElement('button');
        btnVolver.className = 'btn btn-secondary mt-3';
        btnVolver.textContent = 'Volver';
        btnVolver.onclick = () => window.cargarEntrenamientos();
        tarjeta.appendChild(btnVolver);

        contenedor.appendChild(tarjeta);

    } catch (err) {
        console.error(err);
        const alertaError = document.createElement('div');
        alertaError.className = 'alert alert-danger';
        alertaError.textContent = 'Error cargando los detalles del entrenamiento';
        contenedor.appendChild(alertaError);
    }
}

export function mostrarFormEntrenamiento(contenedor) {
    contenedor.innerHTML = '';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'card p-4 shadow-sm';

    const titulo = document.createElement('h4');
    titulo.textContent = 'Registrar entrenamiento';
    tarjeta.appendChild(titulo);

    // Función auxiliar para crear campos de formulario
    const crearCampo = (textoEtiqueta, idBase, tipo, placeholder = '', paso = '') => {
        const etiqueta = document.createElement('label');
        etiqueta.textContent = textoEtiqueta;
        tarjeta.appendChild(etiqueta);

        const campo = document.createElement('input');
        campo.type = tipo;
        campo.id = idBase;
        campo.className = 'form-control mb-2';
        if (placeholder) campo.placeholder = placeholder;
        if (paso) campo.step = paso;
        tarjeta.appendChild(campo);
    };

    crearCampo('Fecha', 'entFecha', 'datetime-local');
    crearCampo('Duración (hh:mm:ss)', 'entDuracion', 'text', '01:30:00');
    crearCampo('Kilómetros', 'entKm', 'number', '', '0.01');
    crearCampo('Pulso medio', 'entPulsoMedio', 'number');
    crearCampo('Potencia media', 'entPotenciaMedia', 'number');

    const etiquetaComentario = document.createElement('label');
    etiquetaComentario.textContent = 'Comentario';
    tarjeta.appendChild(etiquetaComentario);

    const campoComentario = document.createElement('textarea');
    campoComentario.id = 'entComentario';
    campoComentario.className = 'form-control mb-3';
    tarjeta.appendChild(campoComentario);

    const divBotones = document.createElement('div');

    const btnGuardar = document.createElement('button');
    btnGuardar.className = 'btn btn-success';
    btnGuardar.textContent = 'Guardar';
    btnGuardar.onclick = () => window.guardarEntrenamiento();
    divBotones.appendChild(btnGuardar);

    divBotones.appendChild(document.createTextNode(' ')); // Espacio

    const btnCancelar = document.createElement('button');
    btnCancelar.className = 'btn btn-secondary';
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.onclick = () => window.cargarEntrenamientos();
    divBotones.appendChild(btnCancelar);

    tarjeta.appendChild(divBotones);
    contenedor.appendChild(tarjeta);
}

export async function guardarEntrenamiento(csrfToken, reloadCb) {
    const data = {
        fecha: document.getElementById('entFecha').value,
        duracion: document.getElementById('entDuracion').value,
        kilometros: document.getElementById('entKm').value,
        pulso_medio: document.getElementById('entPulsoMedio').value,
        potencia_media: document.getElementById('entPotenciaMedia').value,
        comentario: document.getElementById('entComentario').value
    };

    try {
        const res = await fetch('/entrenamientos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error();

        alert("Entrenamiento registrado");
        reloadCb();

    } catch (e) {
        console.error(e);
        alert("Error guardando entrenamiento");
    }
}