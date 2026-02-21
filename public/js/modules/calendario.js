export async function mostrarCalendarioSesiones(contenedor, csrfToken, clickSesionCb, reloadCalendarioCb) {
    contenedor.innerHTML = `
        <div class="card p-4 shadow-sm">
            <h4>Calendario de sesiones</h4>
            <div id="calendario"></div>
        </div>
    `;
    const res = await fetch('/sesiones', { headers: { 'Accept': 'application/json' } });
    const sesiones = await res.json();
    const eventos = sesiones.map(s => ({ id: s.id, title: s.nombre, start: s.fecha }));
    const calendarEl = document.getElementById('calendario');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        height: 650,
        events: eventos,
        dateClick: async function(info) {
            const nombre = prompt("Nombre de la sesión:");
            if (!nombre) return;
            await fetch('/sesiones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify({ nombre: nombre, fecha: info.dateStr, id_plan: 1 })
            });
            reloadCalendarioCb();
        },
        eventClick: function(info) {
            clickSesionCb(info.event.id);
        }
    });
    calendar.render();
}