document.addEventListener('DOMContentLoaded', () => {

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
            const res = await fetch('/csrf-token', {
                headers: { 'Accept': 'application/json' },
                credentials: 'same-origin',
                cache: 'no-store'
            });

            if (res.ok) {
                const data = await res.json();
                csrfToken = data.token;
                metaToken.setAttribute('content', csrfToken);
            }
        } catch {}
    }

    // --- ARRANQUE ---
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
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    credentials: 'same-origin',
                    body: body.toString()
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
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRF-TOKEN': csrfToken
                },
                credentials: 'same-origin',
                body: `_token=${csrfToken}`
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
        // ESTA LÍNEA CARGA EL INICIO AUTOMÁTICAMENTE
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

            // CON SUBMENU
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

                    subA.textContent = sub.nombre;
                    subA.href = "#";

                    subA.addEventListener('click', (e) => {
                        e.preventDefault();
                        cargarModulo(sub.endpoint, sub.nombre);
                        li.classList.remove('open');
                    });

                    subLi.appendChild(subA);
                    submenu.appendChild(subLi);
                });

                toggle.addEventListener('click', () => {
                    li.classList.toggle('open');
                });

                li.appendChild(submenu);

            } else {
                const a = document.createElement('a');
                a.textContent = opcion.nombre;
                a.href = "#";
                a.className = 'nav-link';

                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    cargarModulo(opcion.endpoint, opcion.nombre);
                });

                li.appendChild(a);
            }

            menuContainer.appendChild(li);
        });
    }

    // ================= SESIONES =================
    async function cargarSesiones() {

        try {

            const res = await fetch('/sesiones', {
                headers: { 'Accept': 'application/json' }
            });

            if (!res.ok) throw new Error();

            const sesiones = await res.json();

            if (!Array.isArray(sesiones) || sesiones.length === 0) {
                contenedorPrincipal.innerHTML =
                    '<div class="alert alert-info">No hay sesiones creadas</div>';
                return;
            }

            let html = '<h3>Sesiones de entrenamiento</h3>';

            sesiones.forEach(s => {
                html += `
                    <div class="card p-3 mb-2">
                        <h5>${s.nombre}</h5>
                        <p>Fecha: ${s.fecha}</p>
                        <p>Plan ID: ${s.id_plan}</p>
                    </div>
                `;
            });

            contenedorPrincipal.innerHTML = html;

        } catch (err) {

            console.error(err);

            contenedorPrincipal.innerHTML =
                '<div class="alert alert-danger">Error cargando sesiones</div>';
        }
    }

    // ================= BLOQUES =================
    window.cargarBloques = async function () {
        try {
            const res = await fetch('/bloques', {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!res.ok) throw new Error("Error cargando bloques");

            const bloques = await res.json();

            if (bloques.length === 0) {
                contenedorPrincipal.innerHTML =
                    '<div class="alert alert-info">No hay bloques creados</div>';
                return;
            }

            let html = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Duración</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            bloques.forEach(b => {
                html += `
                    <tr>
                        <td>${b.id}</td>
                        <td>${b.nombre}</td>
                        <td>${b.tipo}</td>
                        <td>${b.duracion_estimada ?? '-'}</td>
                        <td>
                            <button class="btn btn-danger btn-sm"
                                onclick="eliminarBloque(${b.id})">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += `</tbody></table>`;

            contenedorPrincipal.innerHTML = html;

        } catch (error) {
            console.error(error);
            contenedorPrincipal.innerHTML =
                '<div class="alert alert-danger">Error cargando bloques</div>';
        }
    }

    async function verificarEstadoSesion() {
        try {
            const res = await fetch('/check-auth', {
                credentials: 'same-origin'
            });

            const data = await res.json();

            if (data.auth) {
                mostrarDashboard();
            } else {
                vistaLogin.classList.remove('hidden');
            }

        } catch {
            vistaLogin.classList.remove('hidden');
        }
    }

    

    window.mostrarFormBloque = function () {

        const html = `
            <div class="card p-4">
                <h4>Nuevo bloque</h4>

                <input id="bloqueNombre" class="form-control mb-2" placeholder="Nombre">

                <input id="bloqueTipo" class="form-control mb-2" placeholder="Tipo">

                <input id="bloqueDuracion" class="form-control mb-2"
                    type="number" placeholder="Duración minutos">

                <button class="btn btn-success" onclick="crearBloque()">
                    Guardar
                </button>

                <button class="btn btn-secondary" onclick="cargarBloques()">
                    Cancelar
                </button>
            </div>
        `;

        document.getElementById('contenedor-principal').innerHTML = html;
    }

    window.crearBloque = async function () {

        const nombre = document.getElementById('bloqueNombre').value;
        const tipo = document.getElementById('bloqueTipo').value;
        const duracion = document.getElementById('bloqueDuracion').value;

        if (!nombre || !tipo) {
            alert("Nombre y tipo son obligatorios");
            return;
        }

        try {

            const res = await fetch('/bloques', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({
                    nombre: nombre,
                    tipo: tipo,
                    duracion_estimada: duracion
                })
            });

            if (!res.ok) throw new Error();

            alert("Bloque creado correctamente");

            // volver a la lista
            cargarBloques();

        } catch (error) {
            console.error(error);
            alert("Error creando bloque");
        }
    }

    async function cargarModulo(endpoint, nombre) {

        tituloSeccion.textContent = nombre;

        if (endpoint === '/sesiones-web') {
            mostrarPanelSesiones();
            return;
        }

        if (endpoint === '/bloques') {
            mostrarPanelBloques();
            return;
        }

        if (endpoint === '/sesiones') {
            mostrarPanelSesiones();
            return;
        }
        
        if (endpoint === '/inicio') {
            contenedorPrincipal.innerHTML = `
                <div class="card p-5 shadow-sm border-0 bg-light">
                    <h2 class="text-primary">Bienvenido a CicloApp</h2>
                    <p class="lead">Tu plataforma personalizada para la gestión de entrenamientos ciclistas.</p>
                    <hr>
                    <div class="row mt-4">
                        <div class="col-md-6">
                            <h5>📊 Gestión de Bloques</h5>
                            <p>Organiza tus sesiones por tipos y duraciones.</p>
                        </div>
                        <div class="col-md-6">
                            <h5>👤 Tu Perfil</h5>
                            <p>Mantén actualizados tus datos de peso y altura.</p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        if (endpoint === '/profile') {
            contenedorPrincipal.innerHTML = '<p>Cargando datos...</p>';
            try {
                const res = await fetch('/api/user', {
                    headers: { 'Accept': 'application/json' }
                });
                const u = await res.json();
                
                contenedorPrincipal.innerHTML = `
                    <div class="card p-4 shadow-sm">
                        <h5 class="text-primary mb-3">Datos de mi Perfil</h5>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><strong>Nombre:</strong> ${u.nombre} ${u.apellidos}</li>
                            <li class="list-group-item"><strong>Email:</strong> ${u.email}</li>
                            <li class="list-group-item"><strong>Nacimiento:</strong> ${u.fecha_nacimiento || '--'}</li>
                            <li class="list-group-item"><strong>Peso:</strong> ${u.peso_base ? u.peso_base + ' kg' : '--'}</li>
                            <li class="list-group-item"><strong>Altura:</strong> ${u.altura_base ? u.altura_base + ' cm' : '--'}</li>
                        </ul>
                    </div>
                `;
            } catch (err) {
                contenedorPrincipal.innerHTML = '<div class="alert alert-danger">No se pudo cargar el perfil.</div>';
            }
            return;
        }

        contenedorPrincipal.innerHTML =
            `<div class="alert alert-info">Bienvenido a la sección ${nombre}</div>`;
    }

    window.eliminarBloque = async function (id) {

        if (!confirm("¿Eliminar bloque?")) return;

        try {
            const res = await fetch(`/bloques/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            if (!res.ok) throw new Error();

            cargarBloques();

        } catch {
            alert("Error eliminando bloque");
        }
    }

    function mostrarPanelBloques() {

        contenedorPrincipal.innerHTML = `
            <div class="card p-4 shadow-sm">

                <h4 class="mb-3">Gestión de bloques</h4>

                <div class="d-flex gap-2 flex-wrap">

                    <button class="btn btn-primary w-100 mb-2" onclick="cargarBloques()">
                        Ver bloques
                    </button>


                    <button class="btn btn-success"
                            onclick="mostrarFormBloque()">
                        Crear bloque
                    </button>

                </div>

            </div>
        `;
    }

    function mostrarPanelSesiones() {
        contenedorPrincipal.innerHTML = `
            <div class="card p-4 shadow-sm">
                <h4>Sesiones de entrenamiento</h4>

                <button class="btn btn-primary w-100 mb-2" onclick="cargarSesiones()">
                    Ver sesiones
                </button>

                <button class="btn btn-success w-100" onclick="mostrarFormSesion()">
                    Crear sesión
                </button>
            </div>
        `;
    }

    window.cargarSesiones = async function () {
        try {

            const res = await fetch('/sesiones', {
                headers:{ 'Accept':'application/json' }
            });

            if (!res.ok) throw new Error();

            const sesiones = await res.json();

            if (!Array.isArray(sesiones)) throw new Error();

            if (sesiones.length === 0) {
                contenedorPrincipal.innerHTML = '<p>No hay sesiones creadas</p>';
                return;
            }

            let html = `
                <h3>Sesiones de entrenamiento</h3>
                <table class="table">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                </tr>
            `;

            sesiones.forEach(s => {
                html += `
                    <tr>
                        <td>${s.id}</td>
                        <td>${s.nombre}</td>
                        <td>${s.fecha}</td>
                        <td>
                            <button onclick="verBloquesSesion(${s.id})">
                                Ver bloques
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += '</table>';

            contenedorPrincipal.innerHTML = html;

        } catch {
            contenedorPrincipal.innerHTML = '<p>Error cargando sesiones</p>';
        }
    }

    window.mostrarFormSesion = function () {
        contenedorPrincipal.innerHTML = `
            <div class="card p-4">
                <h4>Nueva sesión</h4>

                <input id="sesionNombre" class="form-control mb-2" placeholder="Nombre">
                <input id="sesionFecha" type="date" class="form-control mb-2">

                <button class="btn btn-success" onclick="crearSesion()">Guardar</button>
                <button class="btn btn-secondary" onclick="cargarSesiones()">Cancelar</button>
            </div>
        `;
    }

    window.crearSesion = async function () {

        const nombre = document.getElementById('sesionNombre').value;
        const fecha = document.getElementById('sesionFecha').value;

        if (!nombre || !fecha) {
            alert("Nombre y fecha obligatorios");
            return;
        }

        await fetch('/sesiones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                nombre,
                fecha
            })
        });

        cargarSesiones();
    }

    window.eliminarSesion = async function (id) {

        if (!confirm("Eliminar sesión?")) return;

        await fetch('/sesiones/' + id, {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': csrfToken }
        });

        cargarSesiones();
    }

    window.verBloquesSesion = async function (sesionId) {

        const res = await fetch(`/sesiones/${sesionId}/bloques`);
        const bloques = await res.json();

        let html = `
            <h3>Bloques de la sesión ${sesionId}</h3>

            <button onclick="mostrarFormAgregarBloqueSesion(${sesionId})">
                Añadir bloque a sesión
            </button>

            <br><br>
        `;

        if (bloques.length === 0) {
            html += '<p>No hay bloques en esta sesión</p>';
        } else {

            html += `
                <table class="table">
                <tr>
                    <th>Bloque</th>
                    <th>Orden</th>
                    <th>Repeticiones</th>
                    <th></th>
                </tr>
            `;

            bloques.forEach(b => {
                html += `
                    <tr>
                        <td>${b.nombre}</td>
                        <td>${b.pivot.orden}</td>
                        <td>${b.pivot.repeticiones}</td>
                        <td>
                            <button onclick="eliminarBloqueSesion(${sesionId}, ${b.id})">
                                Quitar
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += '</table>';
        }

        html += `<br><button onclick="cargarSesiones()">Volver</button>`;

        contenedorPrincipal.innerHTML = html;
    }

    window.mostrarFormAgregarBloqueSesion = async function (sesionId) {

        const res = await fetch('/bloques');
        const bloques = await res.json();

        let options = '';

        bloques.forEach(b => {
            options += `<option value="${b.id}">${b.nombre}</option>`;
        });

        contenedorPrincipal.innerHTML = `
            <h3>Añadir bloque a sesión</h3>

            <select id="bloqueId">
                ${options}
            </select>

            <input id="orden" type="number" placeholder="Orden">
            <input id="repeticiones" type="number" placeholder="Repeticiones">

            <button onclick="agregarBloqueSesion(${sesionId})">
                Guardar
            </button>

            <button onclick="verBloquesSesion(${sesionId})">
                Cancelar
            </button>
        `;
    }

    window.agregarBloqueSesion = async function (sesionId) {

        const bloqueId = document.getElementById('bloqueId').value;
        const orden = document.getElementById('orden').value;
        const repeticiones = document.getElementById('repeticiones').value;

        await fetch(`/sesiones/${sesionId}/bloques`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'X-CSRF-TOKEN':csrfToken
            },
            body: JSON.stringify({
                id_bloque_entrenamiento: bloqueId,
                orden: orden,
                repeticiones: repeticiones
            })
        });

        verBloquesSesion(sesionId);
    }

    window.eliminarBloqueSesion = async function (sesionId, bloqueId) {

        if (!confirm("Quitar bloque de la sesión?")) return;

        await fetch(`/sesiones/${sesionId}/bloques/${bloqueId}`, {
            method:'DELETE',
            headers:{ 'X-CSRF-TOKEN':csrfToken }
        });

        verBloquesSesion(sesionId);
    }

    













});
