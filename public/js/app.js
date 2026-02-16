document.addEventListener('DOMContentLoaded', () => {

    // --- REFERENCIAS DOM ---
    const vistaLogin = document.getElementById('vista-login');
    const vistaDashboard = document.getElementById('vista-dashboard');
    const menuContainer = document.getElementById('dynamic-menu-container');
    const contenedorPrincipal = document.getElementById('contenedor-principal');
    const tituloSeccion = document.getElementById('titulo-seccion');
    const mensajeError = document.getElementById('mensaje-error');
    
    // CSRF Token para Laravel
    const metaToken = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = metaToken ? metaToken.getAttribute('content') : '';

    // --- ARRANQUE ---
    verificarEstadoSesion();

    // --- LÓGICA DE LOGIN ---
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            mensajeError.textContent = "Verificando...";
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({ email, password })
                });

                if (res.ok) {
                    mensajeError.textContent = "";
                    mostrarDashboard();
                } else {
                    const data = await res.json();
                    mensajeError.textContent = data.message || "Credenciales incorrectas";
                }
            } catch (error) {
                mensajeError.textContent = "Error de conexión";
            }
        });
    }

    // --- LÓGICA DE LOGOUT ---
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            await fetch('/logout', { 
                method: 'POST', 
                headers: { 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' } 
            });
            window.location.reload();
        });
    }

    // --- FUNCIONES PRINCIPALES ---

    function mostrarDashboard() {
        if (vistaLogin) vistaLogin.classList.add('hidden');
        if (vistaDashboard) vistaDashboard.classList.remove('hidden');
        cargarMenuDinamico();
    }

    async function cargarMenuDinamico() {
        if (!menuContainer) return; // Protección contra errores

        try {
            const res = await fetch('/menus.json');
            const data = await res.json();
            
            menuContainer.innerHTML = ''; // Limpiar menú anterior

            data.opciones.forEach(opcion => {
                const li = document.createElement('li');
                li.className = 'nav-item';
                
                const a = document.createElement('a');
                a.className = 'nav-link';
                a.textContent = opcion.nombre;
                a.href = "#";
                
                // Al hacer clic, cargamos el módulo correspondiente
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Quitamos clase active de todos y la ponemos al actual
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    a.classList.add('active');
                    
                    cargarModulo(opcion.endpoint, opcion.nombre);
                });

                li.appendChild(a);
                menuContainer.appendChild(li);
            });
        } catch (error) {
            console.error("Error cargando menus.json", error);
        }
    }

    // --- ROUTER (Aquí decides qué mostrar según el menú) ---
    async function cargarModulo(endpoint, nombre) {
        tituloSeccion.textContent = nombre;
        contenedorPrincipal.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary"></div> Cargando...</div>';

        if (endpoint === '/sesiones-web') {
            await cargarSesiones();
        } else if (endpoint === '/profile') {
            contenedorPrincipal.innerHTML = '<div class="alert alert-warning">Módulo de Perfil en construcción.</div>';
        } else {
            contenedorPrincipal.innerHTML = `<div class="alert alert-info">Bienvenido a la sección ${nombre}</div>`;
        }
    }

    async function cargarSesiones() {
        try {
            const res = await fetch('/sesiones-web', { headers: { 'Accept': 'application/json' }});
            if (!res.ok) throw new Error("Error en servidor");
            
            const sesiones = await res.json();
            
            if (sesiones.length > 0) {
                // Generamos la tabla de sesiones
                let html = '<div class="row">';
                sesiones.forEach(s => {
                    html += `
                        <div class="col-md-6 mb-3">
                            <div class="card shadow-sm border-start border-primary border-5">
                                <div class="card-body">
                                    <h5 class="card-title text-primary">${s.nombre}</h5>
                                    <p class="card-text text-muted">${s.recorrido}</p>
                                    <div class="d-flex justify-content-between">
                                        <span class="badge bg-secondary">${s.fecha}</span>
                                        <span class="fw-bold">${s.kilometros} km</span>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                });
                html += '</div>';
                contenedorPrincipal.innerHTML = html;
            } else {
                contenedorPrincipal.innerHTML = '<p>No hay sesiones registradas.</p>';
            }
        } catch (error) {
            contenedorPrincipal.innerHTML = '<div class="alert alert-danger">Error al cargar datos. Revisa la consola.</div>';
            console.error(error);
        }
    }

    async function verificarEstadoSesion() {
        try {
            // Hacemos una petición ligera para ver si estamos logueados
            const res = await fetch('/sesiones-web', { headers: { 'Accept': 'application/json' }});
            if (res.ok) mostrarDashboard();
            else if (vistaLogin) vistaLogin.classList.remove('hidden');
        } catch (e) {
            if (vistaLogin) vistaLogin.classList.remove('hidden');
        }
    }
});