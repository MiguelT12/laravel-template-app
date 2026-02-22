export function mostrarPanelPlanes(contenedor) {

    contenedor.innerHTML = `
        <div class="card p-4 shadow-sm">
            <h4>Planes de entrenamiento</h4>

            <button class="btn btn-primary mb-2"
                onclick="window.cargarPlanes()">
                Ver planes
            </button>

            <button class="btn btn-success"
                onclick="window.mostrarFormPlan()">
                Crear plan
            </button>
        </div>
    `;
}

export async function cargarPlanes(contenedor) {

    contenedor.innerHTML = 'Cargando...';

    try {
        const res = await fetch('/planes-ent',{headers:{Accept:'application/json'}});
        const planes = await res.json();

        if(planes.length===0){
            contenedor.innerHTML='<div class="alert alert-info">No hay planes</div>';
            return;
        }

        let html = `
        <table class="table">
        <tr>
            <th>Nombre</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th></th>
        </tr>`;

        planes.forEach(p=>{
            html+=`
            <tr>
                <td>${p.nombre}</td>
                <td>${p.fecha_inicio}</td>
                <td>${p.fecha_fin??'-'}</td>
                <td>
                    <button class="btn btn-sm btn-info"
                        onclick="window.verPlan(${p.id})">
                        Ver
                    </button>

                    <button class="btn btn-sm btn-danger"
                        onclick="window.eliminarPlan(${p.id})">
                        Eliminar
                    </button>
                </td>
            </tr>`;
        });

        html+='</table>';
        contenedor.innerHTML=html;

    }catch{
        contenedor.innerHTML='<div class="alert alert-danger">Error cargando planes</div>';
    }
}

export function mostrarFormPlan(contenedor){

    contenedor.innerHTML=`
    <div class="card p-4">
        <h4>Nuevo plan</h4>

        <input id="planNombre" class="form-control mb-2" placeholder="Nombre">

        <textarea id="planDesc" class="form-control mb-2"
            placeholder="Descripción"></textarea>

        <input id="planInicio" type="date"
            class="form-control mb-2">

        <input id="planFin" type="date"
            class="form-control mb-2">

        <textarea id="planObj" class="form-control mb-2"
            placeholder="Objetivo"></textarea>

        <button class="btn btn-success"
            onclick="window.guardarPlan()">
            Guardar
        </button>
    </div>`;
}

export async function guardarPlan(csrfToken, reload){

    const data={
        nombre:document.getElementById('planNombre').value,
        descripcion:document.getElementById('planDesc').value,
        fecha_inicio:document.getElementById('planInicio').value,
        fecha_fin:document.getElementById('planFin').value,
        objetivo:document.getElementById('planObj').value
    };

    try{
        const res=await fetch('/planes-ent',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'X-CSRF-TOKEN':csrfToken
            },
            body:JSON.stringify(data)
        });

        if(!res.ok) throw new Error();

        alert("Plan creado");
        reload();

    }catch{
        alert("Error guardando plan");
    }
}

export async function verPlan(id,contenedor){

    const res=await fetch('/planes-ent/'+id);
    const p=await res.json();

    contenedor.innerHTML=`
    <div class="card p-4">
        <h4>${p.nombre}</h4>
        <p>${p.descripcion??''}</p>
        <p><b>Inicio:</b> ${p.fecha_inicio}</p>
        <p><b>Fin:</b> ${p.fecha_fin??'-'}</p>
        <p><b>Objetivo:</b> ${p.objetivo??''}</p>
    </div>`;
}

export async function eliminarPlan(id,csrfToken,reload){

    if(!confirm("Eliminar plan?")) return;

    await fetch('/planes-ent/'+id,{
        method:'DELETE',
        headers:{'X-CSRF-TOKEN':csrfToken}
    });

    reload();
}