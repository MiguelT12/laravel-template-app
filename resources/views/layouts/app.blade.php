<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'CicloApp') }}</title>

    <script src="{{ asset('js/app.js') }}" defer></script>

    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    
    <style>
        .hidden { display: none !important; }
    </style>
</head>
<body>
    <div id="app">
        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div class="container">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto" id="dynamic-menu-container">
                        </ul>

                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item">
                            <a class="nav-link text-danger" href="#" id="btn-logout">Cerrar Sesión</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <main class="py-4 container">
            
            <div id="vista-login">
                @yield('content')
                <div id="mensaje-error" class="alert alert-danger mt-3 hidden text-center"></div>
            </div>

            <div id="vista-dashboard" class="hidden">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 id="titulo-seccion">Bienvenido</h2>
                </div>
                
                <hr>

                <div id="contenedor-principal">
                    </div>
            </div>

        </main>
    </div>
</body>
</html>