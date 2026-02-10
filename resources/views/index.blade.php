<!DOCTYPE html>
<html>
<head>
    <title>Ciclismo App</title>
    <style>
        .hidden { display: none; }
        nav ul { list-style: none; display: flex; gap: 15px; background: #f4f4f4; padding: 10px; }
        nav li { cursor: pointer; color: blue; text-decoration: underline; }
    </style>
</head>
<body>

    <div id="section-login">
        <h2>Login</h2>
        <form id="form-login">
            <input type="email" id="email" placeholder="Email (migue@test.com)" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Entrar</button>
        </form>
    </div>

    <div id="section-app" class="hidden">
        <header>
            <nav id="menu-dinamico"></nav> <button id="logout-btn">Cerrar Sesión</button>
        </header>
        <hr>
        <main id="content-area">
            <h3>Bienvenido. Selecciona una opción del menú.</h3>
        </main>
    </div>

    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>