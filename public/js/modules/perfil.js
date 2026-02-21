export async function cargarPerfil(contenedor) {
    // Limpiamos el contenedor y creamos el texto de carga con DOM
    contenedor.innerHTML = '';
    const textoCarga = document.createElement('p');
    textoCarga.textContent = 'Cargando datos...';
    contenedor.appendChild(textoCarga);

    try {
        const res = await fetch('/datos-perfil', {
            headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) throw new Error();
        const u = await res.json();
        
        contenedor.innerHTML = '';
        const vistaDatos = document.createElement('div');
        vistaDatos.id = 'vista-datos-perfil';
        vistaDatos.className = 'card p-4 shadow-sm';

        const tituloVista = document.createElement('h5');
        tituloVista.className = 'text-primary mb-3';
        tituloVista.textContent = 'Datos de mi Perfil';
        vistaDatos.appendChild(tituloVista);

        const lista = document.createElement('ul');
        lista.className = 'list-group list-group-flush mb-3';

        // Función auxiliar para crear los elementos <li>
        const crearItemLista = (etiqueta, valor) => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            
            const strong = document.createElement('strong');
            strong.textContent = etiqueta + ': ';
            
            li.appendChild(strong);
            li.appendChild(document.createTextNode(valor));
            return li;
        };

        const nombreCompleto = `${u.nombre || u.name || ''} ${u.apellidos || ''}`.trim();
        lista.appendChild(crearItemLista('Nombre', nombreCompleto));
        lista.appendChild(crearItemLista('Email', u.email || '--'));
        lista.appendChild(crearItemLista('Nacimiento', u.fecha_nacimiento || '--'));
        lista.appendChild(crearItemLista('Peso', u.peso_base ? u.peso_base + ' kg' : '--'));
        lista.appendChild(crearItemLista('Altura', u.altura_base ? u.altura_base + ' cm' : '--'));
        
        vistaDatos.appendChild(lista);

        const btnModificar = document.createElement('button');
        btnModificar.className = 'btn btn-primary';
        btnModificar.textContent = 'Modificar datos';
        btnModificar.onclick = () => window.mostrarFormPerfil();
        vistaDatos.appendChild(btnModificar);

        // Formulario
        const formEditar = document.createElement('div');
        formEditar.id = 'form-editar-perfil';
        formEditar.className = 'card p-4 shadow-sm d-none';

        const tituloForm = document.createElement('h5');
        tituloForm.className = 'text-primary mb-3';
        tituloForm.textContent = 'Editar Perfil';
        formEditar.appendChild(tituloForm);

        const inputNombre = document.createElement('input');
        inputNombre.type = 'text';
        inputNombre.id = 'edit-nombre';
        inputNombre.className = 'form-control mb-2';
        inputNombre.placeholder = 'Nombre';
        inputNombre.value = u.nombre || u.name || '';
        formEditar.appendChild(inputNombre);

        const inputApellidos = document.createElement('input');
        inputApellidos.type = 'text';
        inputApellidos.id = 'edit-apellidos';
        inputApellidos.className = 'form-control mb-2';
        inputApellidos.placeholder = 'Apellidos';
        inputApellidos.value = u.apellidos || '';
        formEditar.appendChild(inputApellidos);

        const inputNacimiento = document.createElement('input');
        inputNacimiento.type = 'date';
        inputNacimiento.id = 'edit-nacimiento';
        inputNacimiento.className = 'form-control mb-2';
        inputNacimiento.value = u.fecha_nacimiento || '';
        formEditar.appendChild(inputNacimiento);

        const inputPeso = document.createElement('input');
        inputPeso.type = 'number';
        inputPeso.step = '0.01';
        inputPeso.id = 'edit-peso';
        inputPeso.className = 'form-control mb-2';
        inputPeso.placeholder = 'Peso (kg)';
        inputPeso.value = u.peso_base || '';
        formEditar.appendChild(inputPeso);

        const inputAltura = document.createElement('input');
        inputAltura.type = 'number';
        inputAltura.id = 'edit-altura';
        inputAltura.className = 'form-control mb-2';
        inputAltura.placeholder = 'Altura (cm)';
        inputAltura.value = u.altura_base || '';
        formEditar.appendChild(inputAltura);

        const divBotones = document.createElement('div');
        divBotones.className = 'mt-3';

        const btnGuardar = document.createElement('button');
        btnGuardar.className = 'btn btn-success';
        btnGuardar.textContent = 'Guardar cambios';
        btnGuardar.onclick = () => window.guardarPerfil();
        divBotones.appendChild(btnGuardar);

        divBotones.appendChild(document.createTextNode(' '));

        const btnCancelar = document.createElement('button');
        btnCancelar.className = 'btn btn-secondary';
        btnCancelar.textContent = 'Cancelar';
        btnCancelar.onclick = () => window.ocultarFormPerfil();
        divBotones.appendChild(btnCancelar);

        formEditar.appendChild(divBotones);

        // Añadimos las dos estructuras principales al contenedor
        contenedor.appendChild(vistaDatos);
        contenedor.appendChild(formEditar);

    } catch {
        contenedor.innerHTML = '';
        const divError = document.createElement('div');
        divError.className = 'alert alert-danger';
        divError.textContent = 'Error cargando perfil';
        contenedor.appendChild(divError);
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
        reloadCb(); 
    } catch (error) {
        console.error(error);
        alert("Error al actualizar el perfil");
    }
}