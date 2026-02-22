import { mostrarInicio } from './modules/inicio.js';
import { cargarPerfil, mostrarFormPerfil, ocultarFormPerfil, guardarPerfil } from './modules/perfil.js';
import { mostrarPanelBloques, cargarBloques, mostrarFormBloque, crearBloque, eliminarBloque } from './modules/bloques.js';
import { mostrarPanelSesiones, cargarSesiones, mostrarFormSesion, crearSesion, eliminarSesion, verBloquesSesion, mostrarFormAgregarBloqueSesion, agregarBloqueSesion, eliminarBloqueSesion } from './modules/sesiones.js';
import { mostrarCalendarioSesiones } from './modules/calendario.js';
import { mostrarPanelEntrenamientos,cargarEntrenamientos,verEntrenamiento,mostrarFormEntrenamiento,guardarEntrenamiento} from './modules/entrenamientos.js';
import { mostrarPanelPlanes, cargarPlanes, mostrarFormPlan, guardarPlan, verPlan, eliminarPlan } from './modules/planes.js';


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

    // Login 
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

    // Logout
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

    // Dashboard
    function mostrarDashboard() {
        vistaLogin.classList.add('hidden');
        vistaDashboard.classList.remove('hidden');
        cargarMenuDinamico();
        cargarModulo('/inicio', 'Inicio');
    }

    // Menú dinámico
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

    // Enrutador
    async function cargarModulo(endpoint, nombre) {
        tituloSeccion.textContent = nombre;

        if (endpoint === '/inicio') return mostrarInicio(contenedorPrincipal);
        if (endpoint === '/profile') return cargarPerfil(contenedorPrincipal);

        // BLOQUES
        if (endpoint === '/bloques')
            return mostrarPanelBloques(contenedorPrincipal);

        // SESIÓN DE BLOQUES (gestión de sesiones)
        if (endpoint === '/sesiones' || endpoint === '/sesiones-web')
            return mostrarPanelSesiones(contenedorPrincipal, csrfToken);

        // SESIÓN DE ENTRENAMIENTOS (calendario + scroll)
        if (endpoint === '/sesiones-ent')
            return window.mostrarCalendarioSesiones();

        if (endpoint === '/entrenamientos')
            return mostrarPanelEntrenamientos(contenedorPrincipal);

        if (endpoint === '/planes-ent')
            return mostrarPanelPlanes(contenedorPrincipal);

        contenedorPrincipal.innerHTML = '';
        const alertaInfo = document.createElement('div');
        alertaInfo.className = 'alert alert-info';
        alertaInfo.textContent = `Bienvenido a la sección ${nombre}`;
        contenedorPrincipal.appendChild(alertaInfo);
    }

    // Enviamos a buscar otros js para que no se carguen todos aquí y sea un archivo infinito
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

    // Perfil
    window.mostrarFormPerfil = () => mostrarFormPerfil();
    window.ocultarFormPerfil = () => ocultarFormPerfil();
    window.guardarPerfil = () => guardarPerfil(csrfToken, () => cargarPerfil(contenedorPrincipal));

    window.mostrarFormEntrenamiento = () => mostrarFormEntrenamiento(contenedorPrincipal);

    window.guardarEntrenamiento = () => guardarEntrenamiento(csrfToken, window.cargarEntrenamientos);

    window.cargarPlanes = () => cargarPlanes(contenedorPrincipal);
    window.mostrarFormPlan = () => mostrarFormPlan(contenedorPrincipal);
    window.guardarPlan = () => guardarPlan(csrfToken, window.cargarPlanes);
    window.verPlan = (id) => verPlan(id, contenedorPrincipal);
    window.eliminarPlan = (id) => eliminarPlan(id, csrfToken, window.cargarPlanes);