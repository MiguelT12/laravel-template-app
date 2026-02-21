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