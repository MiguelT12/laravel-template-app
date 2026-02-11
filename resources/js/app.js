document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('main-login-form');
    const sectionLogin = document.getElementById('section-login');
    const sectionDashboard = document.getElementById('section-dashboard');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // BLOQUEA LA RECARGA

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // 1. Guardar sesión
                localStorage.setItem('token', data.access_token);
                
                // 2. INTERCAMBIO DE VISTAS (La "redirección" asíncrona)
                sectionLogin.classList.add('d-none');
                sectionDashboard.classList.remove('d-none');

                // 3. Cargar menús del JSON
                renderMenu();
            } else {
                alert("Credenciales incorrectas");
            }
        });
    }
    renderMenu();
});

async function renderMenu() {
    const res = await fetch('/menus.json');
    const data = await res.json();
    const container = document.getElementById('dynamic-menu-container');
    
    if (!container) return;

    container.innerHTML = data.opciones.map(op => `
        <li class="nav-item">
            <a class="nav-link" href="${op.endpoint}">
                ${op.nombre}
            </a>
        </li>
    `).join('');
}
