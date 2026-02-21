import { mostrarInicio } from './modules/inicio.js';
import { cargarPerfil, mostrarFormPerfil, ocultarFormPerfil, guardarPerfil } from './modules/perfil.js';
import { mostrarPanelBloques, cargarBloques, mostrarFormBloque, crearBloque, eliminarBloque } from './modules/bloques.js';
import { mostrarPanelSesiones, cargarSesiones, mostrarFormSesion, crearSesion, eliminarSesion, verBloquesSesion, mostrarFormAgregarBloqueSesion, agregarBloqueSesion, eliminarBloqueSesion } from './modules/sesiones.js';
import { mostrarCalendarioSesiones } from './modules/calendario.js';
import { mostrarPanelEntrenamientos, cargarEntrenamientos, verEntrenamiento } from './modules/entrenamientos.js';


    // --- REFERENCIAS DOM ---
    const vistaLogin = document.getElementById('vista-login');
    const vistaDashboard = document.getElementById('vista-dashboard');
    const menuContainer = document.getElementById('dynamic-menu-container');
    const contenedorPrincipal = document.getElementById('contenedor-principal');
    const tituloSeccion = document.getElementById('titulo-seccion');
    const mensajeError = document.getElementById('mensaje-error');

    // CSRF Token Laravel
    const metaToken = document.querySelector('meta[name="csrf-token"]');
    let csrfToken = metaToken ? metaToken.getAttribute('content') : '';

    async function refrescarCsrfToken() {
        try {
            const res = await fetch('/csrf-token', { headers: { 'Accept': 'application/json' }, credentials: 'same-origin', cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                csrfToken = data.token;
                metaToken.setAttribute('content', csrfToken);
            }
        } catch {}
    }

    verificarEstadoSesion();

    // ================= LOGIN =================
    const formLogin = document.getElementById('main-login-form');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            mensajeError.textContent = "Verificando...";
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                await refrescarCsrfToken();
                const body = new URLSearchParams();
                body.append('_token', csrfToken);
                body.append('email', email);
                body.append('password', password);

                const res = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                    credentials: 'same-origin', body: body.toString()
                });

                if (res.ok) {
                    mensajeError.textContent = "";
                    mostrarDashboard();
                } else {
                    const data = await res.json();
                    mensajeError.textContent = data.message || "Credenciales incorrectas";
                }
            } catch {
                mensajeError.textContent = "Error de conexión";
            }
        });
    }

    // ================= LOGOUT =================
    const formLogout = document.getElementById('form-logout');
    if (formLogout) {
        formLogout.addEventListener('submit', async (e) => {
            e.preventDefault();
            await refrescarCsrfToken();
            await fetch('/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRF-TOKEN': csrfToken },
                credentials: 'same-origin', body: `_token=${csrfToken}`
            });
            vistaDashboard.classList.add('hidden');
            vistaLogin.classList.remove('hidden');
            menuContainer.innerHTML = '';
        });
    }

    // ================= DASHBOARD =================
    function mostrarDashboard() {
        vistaLogin.classList.add('hidden');
        vistaDashboard.classList.remove('hidden');
        cargarMenuDinamico();
        cargarModulo('/inicio', 'Inicio');
    }

    // ================= MENU DINÁMICO =================
    async function cargarMenuDinamico() {
        const res = await fetch('/menus.json');
        const data = await res.json();
        menuContainer.innerHTML = '';
        data.opciones.forEach(opcion => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            if (opcion.submenu) {
                li.classList.add('has-submenu');
                const toggle = document.createElement('button');
                toggle.textContent = opcion.nombre;
                toggle.className = 'nav-link';
                li.appendChild(toggle);
                const submenu = document.createElement('ul');
                submenu.className = 'submenu';
                opcion.submenu.forEach(sub => {
                    const subLi = document.createElement('li');
                    const subA = document.createElement('a');
                    subA.textContent = sub.nombre; subA.href = "#";
                    subA.addEventListener('click', (e) => {
                        e.preventDefault();
                        cargarModulo(sub.endpoint, sub.nombre);
                        li.classList.remove('open');
                    });
                    subLi.appendChild(subA);
                    submenu.appendChild(subLi);
                });
                toggle.addEventListener('click', () => { li.classList.toggle('open'); });
                li.appendChild(submenu);
            } else {
                const a = document.createElement('a');
                a.textContent = opcion.nombre; a.href = "#"; a.className = 'nav-link';
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    cargarModulo(opcion.endpoint, opcion.nombre);
                });
                li.appendChild(a);
            }
            menuContainer.appendChild(li);
        });
    }

    async function verificarEstadoSesion() {
        try {
            const res = await fetch('/check-auth', { credentials: 'same-origin' });
            const data = await res.json();
            if (data.auth) mostrarDashboard();
            else vistaLogin.classList.remove('hidden');
        } catch {
            vistaLogin.classList.remove('hidden');
        }
    }

    // ================= ENRUTADOR (CARGAR MÓDULO) =================
    async function cargarModulo(endpoint, nombre) {
        tituloSeccion.textContent = nombre;

        if (endpoint === '/inicio') return mostrarInicio(contenedorPrincipal);
        if (endpoint === '/profile') return cargarPerfil(contenedorPrincipal);
        if (endpoint === '/bloques') return mostrarPanelBloques(contenedorPrincipal);
        if (endpoint === '/sesiones' || endpoint === '/sesiones-web') return mostrarPanelSesiones(contenedorPrincipal);
        if (endpoint === '/sesiones-ent') return window.mostrarCalendarioSesiones();
        if (endpoint === '/entrenamientos') return mostrarPanelEntrenamientos(contenedorPrincipal);
        
        if (endpoint === '/planes-ent') {
            contenedorPrincipal.innerHTML = '<div class="alert alert-info">Gestión de planes en construcción</div>';
            return;
        }

        contenedorPrincipal.innerHTML = `<div class="alert alert-info">Bienvenido a la sección ${nombre}</div>`;
    }

    // ================= DELEGACIÓN PARA EL HTML INLINE =================
    // Bloques
    window.cargarBloques = () => cargarBloques(contenedorPrincipal);
    window.mostrarFormBloque = () => mostrarFormBloque(contenedorPrincipal);
    window.crearBloque = () => crearBloque(csrfToken, window.cargarBloques);
    window.eliminarBloque = (id) => eliminarBloque(id, csrfToken, window.cargarBloques);

    // Sesiones
    window.cargarSesiones = () => cargarSesiones(contenedorPrincipal);
    window.mostrarFormSesion = () => mostrarFormSesion(contenedorPrincipal);
    window.crearSesion = () => crearSesion(csrfToken, window.cargarSesiones);
    window.eliminarSesion = (id) => eliminarSesion(id, csrfToken, window.cargarSesiones);
    window.verBloquesSesion = (id) => verBloquesSesion(id, contenedorPrincipal);
    window.mostrarFormAgregarBloqueSesion = (id) => mostrarFormAgregarBloqueSesion(id, contenedorPrincipal);
    window.agregarBloqueSesion = (id) => agregarBloqueSesion(id, csrfToken, window.verBloquesSesion);
    window.eliminarBloqueSesion = (sesionId, bloqueId) => eliminarBloqueSesion(sesionId, bloqueId, csrfToken, window.verBloquesSesion);

    // Calendario
    window.mostrarCalendarioSesiones = () => mostrarCalendarioSesiones(contenedorPrincipal, csrfToken, window.verBloquesSesion, window.mostrarCalendarioSesiones);

    // Entrenamientos
    window.cargarEntrenamientos = () => cargarEntrenamientos(contenedorPrincipal);
    window.verEntrenamiento = (id) => verEntrenamiento(id, contenedorPrincipal);
    // window.mostrarFormEntrenamiento() // No estaba definido en tu código original

    // Perfil
    window.mostrarFormPerfil = () => mostrarFormPerfil();
    window.ocultarFormPerfil = () => ocultarFormPerfil();
    window.guardarPerfil = () => guardarPerfil(csrfToken, () => cargarPerfil(contenedorPrincipal));
