<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Gestión Ciclista</title>

    <link href="{{ asset('css/index.css') }}" rel="stylesheet">
</head>
<body>

<!-- =====================================================
====================== LOGIN =============================
====================================================== -->

<div id="vista-login" class="login-wrapper">
    <div class="card-login">

        <h3 class="text-center">Iniciar Sesión</h3>

        <!-- LOGIN -->
        <form id="form-login">
            @csrf

            <div class="form-group">
                <label>Email</label>
                <input type="email" id="email" placeholder="migue@test.com" required>
            </div>

            <div class="form-group">
                <label>Contraseña</label>
                <input type="password" id="password" placeholder="123456" required>
            </div>

            <button type="submit">Entrar</button>
            <p id="mensaje-error"></p>
        </form>

        <!-- LINK REGISTRO -->
        <p style="text-align:center; margin-top:15px;">
            ¿No tienes cuenta?
            <a href="#" onclick="mostrarRegistro()">Regístrate</a>
        </p>

        <!-- =====================================================
        ================== FORM REGISTRO ========================
        ====================================================== -->

        <div id="registroForm" style="display:none; margin-top:20px;">

            <h3>Crear cuenta</h3>

            <form method="POST" action="{{ route('register') }}">
                @csrf

                <input type="text" name="nombre" placeholder="Nombre" required>
                <input type="text" name="apellidos" placeholder="Apellidos" required>

                <label>Fecha nacimiento</label>
                <input type="date" name="fecha_nacimiento" required>

                <input type="number" step="0.01" name="peso_base" placeholder="Peso (kg)">
                <input type="number" name="altura_base" placeholder="Altura (cm)">

                <input type="email" name="email" placeholder="Email" required>

                <input type="password" name="password" placeholder="Contraseña" required>
                <input type="password" name="password_confirmation" placeholder="Confirmar contraseña" required>

                <button type="submit">Crear cuenta</button>
            </form>

        </div>

    </div>
</div>


<!-- =====================================================
===================== DASHBOARD ==========================
====================================================== -->

<div id="vista-dashboard" class="hidden">

    <nav class="navbar">
        <div class="navbar-content">
            <a class="navbar-brand">CicloApp</a>

            <ul id="dynamic-menu-container"></ul>

            <div>
                <form id="form-logout" method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="btn btn-logout">Cerrar Sesión</button>
                </form>
            </div>
        </div>
    </nav>

    <div class="container">
        <h2 id="titulo-seccion">Bienvenido</h2>
        <hr>

        <div id="contenedor-principal">
            <div class="alert alert-info text-center">
                Selecciona una opción del menú para comenzar.
            </div>
        </div>
    </div>

</div>


<!-- =====================================================
======================== SCRIPTS =========================
====================================================== -->

<script src="{{ asset('js/app.js') }}"></script>

<script>
function mostrarRegistro() {
    document.getElementById("registroForm").style.display = "block";
}
</script>

</body>
</html>
