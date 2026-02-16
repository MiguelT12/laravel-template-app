<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Plataforma Entrenamientos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .hidden { display: none !important; }
        body { background-color: #f0f2f5; }
        .card-login { max-width: 400px; margin: 100px auto; }
    </style>
</head>
<body>

    <div id="vista-login" class="container">
        <div class="card card-login shadow-sm">
            <div class="card-body p-4">
                <h3 class="text-center mb-4">Iniciar Sesión</h3>
                <form id="form-login">
                    <div class="mb-3">
                        <label>Email</label>
                        <input type="email" id="email" class="form-control" placeholder="test1@prueba.com" required>
                    </div>
                    <div class="mb-3">
                        <label>Contraseña</label>
                        <input type="password" id="password" class="form-control" placeholder="prueba" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Entrar</button>
                    <p id="mensaje-error" class="text-danger mt-3 text-center small"></p>
                </form>
            </div>
        </div>
    </div>

    <div id="vista-dashboard" class="hidden">
        <nav class="navbar navbar-dark bg-dark px-3">
            <span class="navbar-brand mb-0 h1">Gestión Ciclista</span>
            <button id="btn-logout" class="btn btn-outline-light btn-sm">Cerrar Sesión</button>
        </nav>
        
        <div class="container mt-4">
            <h4>Mis Sesiones de Entrenamiento</h4>
            <hr>
            <div id="contenedor-sesiones" class="row">
                <div class="col-12 text-center">Cargando datos...</div>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>