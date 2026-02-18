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
    let csrfToken = metaToken ? metaToken.getAttribute('content') : '';

    async function refrescarCsrfToken() {
        try {
            const res = await fetch('/csrf-token', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin',
                cache: 'no-store'
            });

            if (res.ok) {
                const data = await res.json();
                if (data && data.token) {
                    csrfToken = data.token;
                    if (metaToken) metaToken.setAttribute('content', csrfToken);
                }
            }
        } catch (e) {}
    }

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
                await refrescarCsrfToken();
                const hacerLogin = async () => {
                    const body = new URLSearchParams();
                    body.append('_token', csrfToken);
                    body.append('email', email);
                    body.append('password', password);

                    return fetch('/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-TOKEN': csrfToken
                        },
                        credentials: 'same-origin',
                        body: body.toString()
                    });
                };

                let res = await hacerLogin();
                if (res.status === 419) {
                    await refrescarCsrfToken();
                    res = await hacerLogin();
                }

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
    const formLogout = document.getElementById('form-logout');
    if (formLogout) {
        formLogout.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await refrescarCsrfToken();
                const hacerLogout = async () => {
                    const body = new URLSearchParams();
                    body.append('_token', csrfToken);

                    return fetch('/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-TOKEN': csrfToken
                        },
                        credentials: 'same-origin',
                        cache: 'no-store',
                        body: body.toString()
                    });
                };

                let res = await hacerLogout();
                if (res.status === 419) {
                    await refrescarCsrfToken();
                    res = await hacerLogout();
                }
            } finally {
                await refrescarCsrfToken();
                if (vistaDashboard) vistaDashboard.classList.add('hidden');
                if (vistaLogin) vistaLogin.classList.remove('hidden');
                if (menuContainer) menuContainer.innerHTML = '';
                if (tituloSeccion) tituloSeccion.textContent = 'Bienvenido';
                if (contenedorPrincipal) {
                    contenedorPrincipal.innerHTML = '<div class="alert alert-info text-center">Selecciona una opcion del menu para comenzar.</div>';
                }
            }
        });
    }

    // --- FUNCIONES PRINCIPALES ---

    function mostrarDashboard() {
        if (vistaLogin) vistaLogin.classList.add('hidden');
        if (vistaDashboard) vistaDashboard.classList.remove('hidden');
        cargarMenuDinamico();
    }

    async function cargarMenuDinamico() {
        if (!menuContainer) return; // Proteccion contra errores

        try {
            const res = await fetch('/menus.json');
            const data = await res.json();
            const opciones = Array.isArray(data.opciones) ? data.opciones : [];

            menuContainer.innerHTML = ''; // Limpiar menu anterior

            opciones.forEach(opcion => {
                const li = document.createElement('li');
                li.className = 'nav-item';

                if (Array.isArray(opcion.submenu) && opcion.submenu.length > 0) {
                    li.classList.add('has-submenu');

                    const toggle = document.createElement('button');
                    toggle.className = 'nav-link nav-toggle';
                    toggle.type = 'button';
                    toggle.textContent = opcion.nombre;
                    li.appendChild(toggle);

                    const submenu = document.createElement('ul');
                    submenu.className = 'submenu';

                    opcion.submenu.forEach(subopcion => {
                        const subLi = document.createElement('li');

                        const subA = document.createElement('a');
                        subA.className = 'nav-link submenu-link';
                        subA.textContent = subopcion.nombre;
                        subA.href = '#';
                        subA.addEventListener('click', (e) => {
                            e.preventDefault();
                            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                            subA.classList.add('active');
                            cargarModulo(subopcion.endpoint, subopcion.nombre);
                            li.classList.remove('open');
                        });

                        subLi.appendChild(subA);
                        submenu.appendChild(subLi);
                    });

                    toggle.addEventListener('click', () => {
                        const isOpen = li.classList.contains('open');
                        document.querySelectorAll('.nav-item.has-submenu.open').forEach(item => item.classList.remove('open'));
                        if (!isOpen) li.classList.add('open');
                    });

                    li.appendChild(submenu);
                } else {
                    const a = document.createElement('a');
                    a.className = 'nav-link';
                    a.textContent = opcion.nombre;
                    a.href = '#';

                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                        a.classList.add('active');
                        cargarModulo(opcion.endpoint, opcion.nombre);
                    });

                    li.appendChild(a);
                }

                menuContainer.appendChild(li);
            });

            if (!menuContainer.dataset.clickOutsideBound) {
                document.addEventListener('click', (e) => {
                    if (!menuContainer.contains(e.target)) {
                        document.querySelectorAll('.nav-item.has-submenu.open').forEach(item => item.classList.remove('open'));
                    }
                });
                menuContainer.dataset.clickOutsideBound = '1';
            }
        } catch (error) {
            console.error('Error cargando menus.json', error);
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
            // Verificamos sesion solo si recibimos JSON real
            const res = await fetch('/sesiones-web', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin',
                cache: 'no-store'
            });
            const contentType = res.headers.get('content-type') || '';
            const esJson = contentType.includes('application/json');

            if (res.ok && esJson) mostrarDashboard();
            else if (vistaLogin) vistaLogin.classList.remove('hidden');
        } catch (e) {
            if (vistaLogin) vistaLogin.classList.remove('hidden');
        }
    }
});



