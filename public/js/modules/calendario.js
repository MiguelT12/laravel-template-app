export async function mostrarCalendarioSesiones(contenedor, csrfToken, clickSesionCb, reloadCalendarioCb) {
    contenedor.innerHTML = '';
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta p-4 shadow-sm';

    const h4 = document.createElement('h4');
    h4.textContent = 'Calendario de sesiones';
    tarjeta.appendChild(h4);

    const divCalendario = document.createElement('div');
    divCalendario.id = 'calendario';
    tarjeta.appendChild(divCalendario);

    contenedor.appendChild(tarjeta);

    try {
        const res = await fetch('/sesiones', { 
            headers: { 'Accept': 'application/json' } 
        });
        
        if (!res.ok) throw new Error("Error obteniendo sesiones");
        
        const sesiones = await res.json();
        const eventos = sesiones.map(s => ({ 
            id: s.id, 
            title: s.nombre, 
            start: s.fecha 
        }));

        // Pasamos directamente la variable divCalendario en lugar de usar document.getElementById
        const calendar = new FullCalendar.Calendar(divCalendario, {
            initialView: 'dayGridMonth',
            locale: 'es',
            height: 650,
            events: eventos,
            dateClick: async function(info) {
                const nombre = prompt("Nombre de la sesión:");
                if (!nombre) return;
                
                try {
                    await fetch('/sesiones', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json', 
                            'X-CSRF-TOKEN': csrfToken 
                        },
                        body: JSON.stringify({ 
                            nombre: nombre, 
                            fecha: info.dateStr, 
                            id_plan: 1 
                        })
                    });
                    reloadCalendarioCb();
                } catch (error) {
                    console.error("Error al crear sesión:", error);
                    alert("Error guardando la sesión");
                }
            },
            eventClick: function(info) {
                clickSesionCb(info.event.id);
            }
        });

        calendar.render();

    } catch (error) {
        console.error(error);
        
        // Si hay error, reemplazamos el calendario por un mensaje de alerta
        contenedor.innerHTML = '';
        const divError = document.createElement('div');
        divError.className = 'alert alert-danger';
        divError.textContent = 'Error cargando el calendario';
        contenedor.appendChild(divError);
    }
}