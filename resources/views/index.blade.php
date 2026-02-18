<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Gestion Ciclista</title>
    
    <link href="{{ asset('css/index.css') }}" rel="stylesheet">
</head>
<body>

    <div id="vista-login" class="login-wrapper">
        <div class="card-login">
            <h3 class="text-center">Iniciar Sesion</h3>
            <form id="form-login">
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" id="email" class="form-control" placeholder="migue@test.com" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Contrasena</label>
                    <input type="password" id="password" class="form-control" placeholder="123456" required>
                </div>
                <button type="submit" class="btn btn-primary">Entrar</button>
                <p id="mensaje-error" class="text-danger mt-3 text-center"></p>
            </form>
        </div>
    </div>

    <div id="vista-dashboard" class="hidden">
        
        <nav class="navbar">
            <div class="navbar-content">
                <a class="navbar-brand" >CicloApp</a>
                
                <ul id="dynamic-menu-container">
                    </ul>

                <div>
                    <form id="form-logout" method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="btn btn-logout">Cerrar Sesion</button>
                    </form>
                </div>
            </div>
        </nav>
        
        <div class="container">
            <h2 id="titulo-seccion">Bienvenido</h2>
            <hr>
            
            <div id="contenedor-principal">
                <div class="alert alert-info text-center">Selecciona una opcion del menu para comenzar.</div>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>

