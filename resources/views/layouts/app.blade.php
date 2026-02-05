<!DOCTYPE html>
<html>
<head>
 <meta charset="UTF-8">
 <title>Mi Aplicación</title>
 {{-- aquí puedes cargar CSS, Bootstrap, Vite, etc --}}
</head>
<body>
 <header>
 <h1>Mi Web</h1>
 {{-- Menú, navbar, etc --}}
 </header>
 <main class="container">
 @yield('content') {{-- ³ Aquí se insertan las vistas hijas --}}
 </main>
 <footer>
 <p>Footer aquí</p>
 </footer>
</body>
</html>