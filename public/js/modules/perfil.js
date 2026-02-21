export async function cargarPerfil(contenedor) {
    contenedor.innerHTML = '<p>Cargando datos...</p>';
    try {
        const res = await fetch('/datos-perfil', {
            headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) throw new Error();
        const u = await res.json();
        
        contenedor.innerHTML = `
            <div id="vista-datos-perfil" class="card p-4 shadow-sm">
                <h5 class="text-primary mb-3">Datos de mi Perfil</h5>
                <ul class="list-group list-group-flush mb-3">
                    <li class="list-group-item"><strong>Nombre:</strong> ${u.nombre || u.name || ''} ${u.apellidos || ''}</li>
                    <li class="list-group-item"><strong>Email:</strong> ${u.email || '--'}</li>
                    <li class="list-group-item"><strong>Nacimiento:</strong> ${u.fecha_nacimiento || '--'}</li>
                    <li class="list-group-item"><strong>Peso:</strong> ${u.peso_base ? u.peso_base + ' kg' : '--'}</li>
                    <li class="list-group-item"><strong>Altura:</strong> ${u.altura_base ? u.altura_base + ' cm' : '--'}</li>
                </ul>
                <button class="btn btn-primary" onclick="mostrarFormPerfil()">Modificar datos</button>
            </div>

            <div id="form-editar-perfil" class="card p-4 shadow-sm d-none">
                <h5 class="text-primary mb-3">Editar Perfil</h5>
                
                <input type="text" id="edit-nombre" class="form-control mb-2" placeholder="Nombre" value="${u.nombre || u.name || ''}">
                <input type="text" id="edit-apellidos" class="form-control mb-2" placeholder="Apellidos" value="${u.apellidos || ''}">
                <input type="date" id="edit-nacimiento" class="form-control mb-2" value="${u.fecha_nacimiento || ''}">
                <input type="number" step="0.01" id="edit-peso" class="form-control mb-2" placeholder="Peso (kg)" value="${u.peso_base || ''}">
                <input type="number" id="edit-altura" class="form-control mb-2" placeholder="Altura (cm)" value="${u.altura_base || ''}">
                
                <div class="mt-3">
                    <button class="btn btn-success" onclick="guardarPerfil()">Guardar cambios</button>
                    <button class="btn btn-secondary" onclick="ocultarFormPerfil()">Cancelar</button>
                </div>
            </div>
        `;
    } catch {
        contenedor.innerHTML = '<div class="alert alert-danger">Error cargando perfil</div>';
    }
}

export function mostrarFormPerfil() {
    document.getElementById('vista-datos-perfil').classList.add('d-none');
    document.getElementById('form-editar-perfil').classList.remove('d-none');
}

export function ocultarFormPerfil() {
    document.getElementById('form-editar-perfil').classList.add('d-none');
    document.getElementById('vista-datos-perfil').classList.remove('d-none');
}

export async function guardarPerfil(csrfToken, reloadCb) {
    const nombre = document.getElementById('edit-nombre').value;
    const apellidos = document.getElementById('edit-apellidos').value;
    const fecha_nacimiento = document.getElementById('edit-nacimiento').value;
    const peso_base = document.getElementById('edit-peso').value;
    const altura_base = document.getElementById('edit-altura').value;

    try {
        const res = await fetch('/datos-perfil', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({ nombre, apellidos, fecha_nacimiento, peso_base, altura_base })
        });

        if (!res.ok) throw new Error();

        alert("Perfil actualizado correctamente");
        reloadCb(); // Recarga la vista para mostrar los datos nuevos
    } catch (error) {
        console.error(error);
        alert("Error al actualizar el perfil");
    }
}