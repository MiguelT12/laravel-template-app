document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Referencias a los elementos del DOM ---
    const vistaLogin = document.getElementById('vista-login');
    const vistaDashboard = document.getElementById('vista-dashboard');
    const formLogin = document.getElementById('form-login');
    const btnLogout = document.getElementById('btn-logout');
    const contenedorSesiones = document.getElementById('contenedor-sesiones');
    const mensajeError = document.getElementById('mensaje-error');

    // Token CSRF necesario para Laravel
    const metaToken = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = metaToken ? metaToken.getAttribute('content') : '';

    // --- 2. Estado Inicial: Ocultamos todo hasta saber si hay sesión ---
    if (vistaLogin) vistaLogin.classList.add('hidden');
    if (vistaDashboard) vistaDashboard.classList.add('hidden');

    // Verificamos si ya hay una sesión activa al cargar/refrescar la página
    verificarEstadoSesion();

    // --- 3. Lógica de Inicio de Sesión ---
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // UI: Mostramos que estamos trabajando
            mensajeError.textContent = "Verificando credenciales...";
            mensajeError.classList.remove('hidden');

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    // Éxito: Limpiamos error y entramos
                    mensajeError.textContent = "";
                    mostrarDashboard();
                } else {
                    // Fallo: Obtenemos el mensaje de error del servidor
                    const data = await response.json();
                    mensajeError.textContent = data.message || "Email o contraseña incorrectos";
                }
            } catch (error) {
                console.error("Error en Login:", error);
                mensajeError.textContent = "Error de comunicación con el servidor.";
            }
        });
    }

    // --- 4. Lógica de Cierre de Sesión ---
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            try {
                await fetch('/logout', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json'
                    }
                });
            } catch (e) {
                console.log("Sesión ya cerrada en el servidor");
            }
            // Al salir, recargamos la página para resetear todo el estado
            window.location.reload();
        });
    }

    // --- 5. Funciones de Control de Vistas ---

    function mostrarDashboard() {
        if (vistaLogin) vistaLogin.classList.add('hidden');
        if (vistaDashboard) vistaDashboard.classList.remove('hidden');
        cargarSesiones();
    }

    async function verificarEstadoSesion() {
        try {
            // Intentamos acceder a una ruta protegida (las sesiones del ciclista)
            const response = await fetch('/sesiones-web', {
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Si el servidor responde 200, la sesión es válida -> Dashboard
                mostrarDashboard();
            } else {
                // Si responde 401/419, no hay sesión -> Mostramos el Login
                if (vistaLogin) vistaLogin.classList.remove('hidden');
            }
        } catch (error) {
            // Si hay error de red, mostramos el login por defecto
            if (vistaLogin) vistaLogin.classList.remove('hidden');
        }
    }

    async function cargarSesiones() {
        if (!contenedorSesiones) return;
        
        contenedorSesiones.innerHTML = '<p class="text-center">Cargando tus entrenamientos...</p>';

        try {
            const response = await fetch('/sesiones-web', {
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) throw new Error("No autorizado");

            const sesiones = await response.json();

            if (sesiones && sesiones.length > 0) {
                // Mapeamos los datos de la tabla 'entrenamiento' del SQL
                contenedorSesiones.innerHTML = sesiones.map(s => `
                    <div class="card mb-3 shadow-sm border-left-primary">
                        <div class="card-body">
                            <h6 class="font-weight-bold text-primary">${s.nombre || 'Sesión de Entrenamiento'}</h6>
                            <p class="mb-1 text-dark small">${s.recorrido || 'Sin ubicación'}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge badge-secondary">${s.fecha}</span>
                                <span class="text-muted small">${s.kilometros || 0} km</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            } else {
                contenedorSesiones.innerHTML = '<p class="alert alert-info">Aún no tienes entrenamientos registrados.</p>';
            }
        } catch (error) {
            contenedorSesiones.innerHTML = '<p class="text-danger">Error al cargar los datos del ciclista.</p>';
        }
    }
});