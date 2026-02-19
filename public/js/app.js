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
    const formLogin = document.getElementById('form-login');

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

        const res = await fetch('/sesiones-web');
        const sesiones = await res.json();

        let html = '<h3>Sesiones</h3>';

        sesiones.forEach(s => {
            html += `
                <div class="card">
                    <h5>${s.nombre}</h5>
                    <p>${s.recorrido}</p>
                    <small>${s.fecha} - ${s.kilometros} km</small>
                </div>
            `;
        });

        contenedorPrincipal.innerHTML = html;
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


      

    // ================= VERIFICAR SESIÓN =================
    async function verificarEstadoSesion() {
        try {
            const res = await fetch('/sesiones-web', {
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) mostrarDashboard();
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
            await cargarSesiones();
            return;
        }

        if (endpoint === '/bloques') {
            mostrarPanelBloques();
            return;
        }

        if (endpoint === '/profile') {
            contenedorPrincipal.innerHTML =
                '<div class="alert alert-warning">Perfil en construcción</div>';
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






});
