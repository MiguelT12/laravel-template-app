export function mostrarPanelEntrenamientos(contenedor) {
    contenedor.innerHTML = `
        <div class="card p-4 shadow-sm">
            <h4>Entrenamientos realizados</h4>
            <button class="btn btn-primary w-100 mb-2" onclick="cargarEntrenamientos()">Ver entrenamientos</button>
            <button class="btn btn-success w-100" onclick="mostrarFormEntrenamiento()">Registrar entrenamiento</button>
        </div>
    `;
}

export async function cargarEntrenamientos(contenedor) {
    try {
        const res = await fetch('/entrenamientos', { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error();
        const entrenamientos = await res.json();
        if (!Array.isArray(entrenamientos) || entrenamientos.length === 0) {
            contenedor.innerHTML = '<div class="alert alert-info">No hay entrenamientos registrados</div>';
            return;
        }
        let html = `
            <h3>Entrenamientos realizados</h3>
            <table class="table table-striped">
                <tr><th>Fecha</th><th>Duración</th><th>Km</th><th>Potencia media</th><th>Pulso medio</th><th>Comentario</th></tr>
        `;
        entrenamientos.forEach(e => {
            html += `
                <tr>
                    <td>${e.fecha}</td><td>${e.duracion}</td><td>${e.kilometros}</td>
                    <td>${e.potencia_media ?? '-'}</td><td>${e.pulso_medio ?? '-'}</td><td>${e.comentario ?? '-'}</td>
                </tr>
            `;
        });
        html += '</table>';
        contenedor.innerHTML = html;
    } catch (err) {
        console.error(err);
        contenedor.innerHTML = '<div class="alert alert-danger">Error cargando entrenamientos</div>';
    }
}

export async function verEntrenamiento(id, contenedor) {
    const res = await fetch('/entrenamientos/' + id);
    const e = await res.json();
    contenedor.innerHTML = `
        <h3>Detalle entrenamiento</h3>
        <div class="card p-4">
            <p><b>Fecha:</b> ${e.fecha}</p>
            <p><b>Duración:</b> ${e.duracion}</p>
            <p><b>Kilómetros:</b> ${e.kilometros}</p>
            <p><b>Recorrido:</b> ${e.recorrido}</p><hr>
            <p><b>Pulso medio:</b> ${e.pulso_medio}</p>
            <p><b>Pulso máximo:</b> ${e.pulso_max}</p>
            <p><b>Potencia media:</b> ${e.potencia_media}</p>
            <p><b>Potencia normalizada:</b> ${e.potencia_normalizada}</p><hr>
            <p><b>Bicicleta:</b> ${e.bicicleta?.nombre ?? '-'}</p>
            <p><b>Sesión planificada:</b> ${e.sesion?.nombre ?? '-'}</p><hr>
            <p><b>Comentario:</b> ${e.comentario ?? '-'}</p>
            <button class="btn btn-secondary mt-3" onclick="cargarEntrenamientos()">Volver</button>
        </div>
    `;
}
export function mostrarFormEntrenamiento(contenedor) {

    contenedor.innerHTML = `
        <div class="card p-4 shadow-sm">
            <h4>Registrar entrenamiento</h4>

            <label>Fecha</label>
            <input id="entFecha" type="datetime-local" class="form-control mb-2">

            <label>Duración (hh:mm:ss)</label>
            <input id="entDuracion" class="form-control mb-2" placeholder="01:30:00">

            <label>Kilómetros</label>
            <input id="entKm" type="number" step="0.01" class="form-control mb-2">

            <label>Pulso medio</label>
            <input id="entPulsoMedio" type="number" class="form-control mb-2">

            <label>Potencia media</label>
            <input id="entPotenciaMedia" type="number" class="form-control mb-2">

            <label>Comentario</label>
            <textarea id="entComentario" class="form-control mb-3"></textarea>

            <button class="btn btn-success" onclick="guardarEntrenamiento()">
                Guardar
            </button>

            <button class="btn btn-secondary" onclick="cargarEntrenamientos()">
                Cancelar
            </button>
        </div>
    `;
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