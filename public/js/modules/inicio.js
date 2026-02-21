export function mostrarInicio(contenedor) {
    contenedor.innerHTML = `
        <div class="card p-5 shadow-sm border-0 bg-light">
            <h2 class="text-primary">Bienvenido a CicloApp</h2>
            <p class="lead">
                Tu plataforma personalizada para la gestión de entrenamientos ciclistas.
            </p>
            <hr>
            <div class="row mt-4">
                <div class="col-md-6">
                    <h5>📊 Gestión de Bloques</h5>
                    <p>Organiza tus sesiones por tipos y duraciones.</p>
                </div>
                <div class="col-md-6">
                    <h5>📅 Planificación de sesiones</h5>
                    <p>Programa entrenamientos en el calendario.</p>
                </div>
            </div>
        </div>
    `;
}