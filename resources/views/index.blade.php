<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>PROYECTO DAW</title>

    <!-- TU CSS -->
    <link href="{{ asset('css/index.css') }}" rel="stylesheet">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <script>
        function mostrarRegistro() {
            document.getElementById("registroForm").style.display = "block";
        }
    </script>

    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js"></script>



</head>
<body>
<div id="vista-login" class="login-wrapper">
    <div class="card-login">

        <h3 class="text-center">Iniciar Sesión</h3>

        <!-- LOGIN -->
        <form id="main-login-form">
            @csrf

            <div class="form-group mb-2">
                <label>Email</label>
                <input type="email" id="email" class="form-control" placeholder="email@test.com" required>
            </div>

            <div class="form-group mb-3">
                <label>Contraseña</label>
                <input type="password" id="password" class="form-control" placeholder="123456" required>
            </div>

            <button type="submit" class="btn btn-primary w-100">Entrar</button>
            <p id="mensaje-error" class="text-danger mt-2 text-center"></p>
        </form>

       <p style="text-align:center; margin-top:15px;">
            <button type="button" onclick="mostrarRegistro()">Regístrate</button>
        </p>

        <div id="registroForm" style="display:none; margin-top:20px;">

            <h3>Crear cuenta</h3>

            <form method="POST" action="{{ route('register') }}">
                @csrf

                <input class="form-control mb-2" type="text" name="nombre" placeholder="Nombre" required>
                <input class="form-control mb-2" type="text" name="apellidos" placeholder="Apellidos" required>

                <label>Fecha nacimiento</label>
                <input class="form-control mb-2" type="date" name="fecha_nacimiento" required>

                <input class="form-control mb-2" type="number" step="0.01" name="peso_base" placeholder="Peso (kg)">
                <input class="form-control mb-2" type="number" name="altura_base" placeholder="Altura (cm)">

                <input class="form-control mb-2" type="email" name="email" placeholder="Email" required>

                <input class="form-control mb-2" type="password" name="password" placeholder="Contraseña" required>
                <input class="form-control mb-3" type="password" name="password_confirmation" placeholder="Confirmar contraseña" required>

                <button class="btn btn-success w-100" type="submit">Crear cuenta</button>
            </form>

        </div>

    </div>
</div>


<div id="vista-dashboard" class="hidden">

    <nav class="navbar navbar-dark bg-dark shadow-sm">
        <div class="container-fluid">
            <span class="navbar-brand">PROYECTO DAW</span>

            <ul id="dynamic-menu-container" class="nav"></ul>

            <form id="form-logout" method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="btn btn-outline-danger btn-sm">Cerrar Sesión</button>
            </form>
        </div>
    </nav>

    <div class="container mt-4">
        <h2 id="titulo-seccion">Bienvenido</h2>
        <hr>

        <div id="contenedor-principal">
            <div class="alert alert-info text-center">
                Selecciona una opción del menú para comenzar.
            </div>
        </div>
    </div>

</div>


<script src="{{ asset('js/app.js') }}?t={{ time() }}"></script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
