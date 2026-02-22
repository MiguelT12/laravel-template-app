export function mostrarInicio(contenedor) {
    contenedor.innerHTML = '';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'card p-5 shadow-sm border-0 bg-light';

    const titulo = document.createElement('h2');
    titulo.className = 'text-primary';
    titulo.textContent = 'Bienvenido a nuestro proyecto';
    tarjeta.appendChild(titulo);

    const descripcion = document.createElement('p');
    descripcion.className = 'lead';
    descripcion.textContent = 'Tu plataforma personalizada para la gestión de entrenamientos ciclistas.';
    tarjeta.appendChild(descripcion);

    const separador = document.createElement('br');
    tarjeta.appendChild(separador);

    const fila = document.createElement('div');
    fila.className = 'row mt-4';

    const col1 = document.createElement('div');
    col1.className = 'col-md-6';
    
    const tituloCol1 = document.createElement('h5');
    tituloCol1.textContent = '📊 Gestión de Bloques';
    col1.appendChild(tituloCol1);
    
    const textoCol1 = document.createElement('p');
    textoCol1.textContent = 'Organiza tus sesiones por tipos y duraciones.';
    col1.appendChild(textoCol1);

    fila.appendChild(col1);

    const col2 = document.createElement('div');
    col2.className = 'col-md-6';
    
    const tituloCol2 = document.createElement('h5');
    tituloCol2.textContent = '📅 Planificación de sesiones';
    col2.appendChild(tituloCol2);
    
    const textoCol2 = document.createElement('p');
    textoCol2.textContent = 'Programa entrenamientos en el calendario.';
    col2.appendChild(textoCol2);

    fila.appendChild(col2);

    const col3 = document.createElement('div');
    col3.className = 'col-md-6';

    const tituloCol3 = document.createElement('h5');
    tituloCol3.textContent = '💻 Desarrolladores';
    col3.appendChild(tituloCol3);

    const textoCol3 = document.createElement('p');
    textoCol3.textContent = 'Raúl García, David Ruiz y Miguel Tejero';
    col3.appendChild(textoCol3);

    fila.appendChild(col3);

    tarjeta.appendChild(fila);

    contenedor.appendChild(tarjeta);
}