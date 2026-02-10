document.addEventListener('DOMContentLoaded', () => {
    const sectionLogin = document.getElementById('section-login');
    const sectionApp = document.getElementById('section-app');
    const formLogin = document.getElementById('form-login');
    const menuDinamico = document.getElementById('menu-dinamico');
    const contentArea = document.getElementById('content-area');

    // 1. Lógica de Login
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const credentials = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                // Guardamos el token para futuras peticiones
                localStorage.setItem('token_ciclista', data.access_token);
                cargarInterfazPrincipal();
            } else {
                alert(data.error || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
        }
    });

    // 2. Cargar Menú desde JSON (Requisito FASE 1)
    async function cargarInterfazPrincipal() {
        sectionLogin.classList.add('hidden');
        sectionApp.classList.remove('hidden');

        const res = await fetch('/menus.json');
        const data = await res.json();

        // Creamos el menú dinámicamente
        const ul = document.createElement('ul');
        data.opciones.forEach(opcion => {
            const li = document.createElement('li');
            li.textContent = opcion.nombre;
            li.onclick = () => cargarVistaConsulta(opcion.endpoint);
            ul.appendChild(li);
        });
        menuDinamico.appendChild(ul);
    }

    // 3. Página de Consulta (Requisito FASE 1)
    async function cargarVistaConsulta(endpoint) {
        contentArea.innerHTML = `<h3>Consultando ${endpoint}...</h3>`;

        try {
            const response = await fetch(`/api/${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token_ciclista')}`,
                    'Accept': 'application/json'
                }
            });
            const datos = await response.json();
            
            // Aquí pintarás la tabla más adelante, de momento mostramos el JSON
            contentArea.innerHTML = `<h3>Listado de ${endpoint.toUpperCase()}</h3>
                                     <pre>${JSON.stringify(datos, null, 2)}</pre>`;
        } catch (error) {
            contentArea.innerHTML = `<p style="color:red">Error al cargar datos.</p>`;
        }
    }
});