<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Gestión Ciclista</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <style>
        .hidden { display: none !important; }
        body { background-color: #f0f2f5; }
        .card-login { max-width: 400px; margin: 100px auto; }
        .nav-link { cursor: pointer; }
    </style>
</head>
<body>

    <div id="vista-login" class="container">
        <div class="card card-login shadow-sm">
            <div class="card-body p-4">
                <h3 class="text-center mb-4">Iniciar Sesión</h3>
                <form id="form-login">
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" id="email" class="form-control" placeholder="migue@test.com" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Contraseña</label>
                        <input type="password" id="password" class="form-control" placeholder="123456" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Entrar</button>
                    <p id="mensaje-error" class="text-danger mt-3 text-center small"></p>
                </form>
            </div>
        </div>
    </div>

    <div id="vista-dashboard" class="hidden">
        
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">CicloApp</a>
                
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="dynamic-menu-container">
                        </ul>

                    <div class="d-flex">
                        <button id="btn-logout" class="btn btn-outline-danger btn-sm">Cerrar Sesión</button>
                    </div>
                </div>
            </div>
        </nav>
        
        <div class="container mt-4">
            <h2 id="titulo-seccion">Bienvenido</h2>
            <hr>
            
            <div id="contenedor-principal">
                <div class="alert alert-info text-center">Selecciona una opción del menú para comenzar.</div>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/app.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>