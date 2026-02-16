<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BloqueController;
use App\Http\Controllers\SesionController;
// Importa aquí el resto de tus controladores según los crees

/*
|--------------------------------------------------------------------------
| Rutas Públicas
|--------------------------------------------------------------------------
*/
// Esta es la ruta que llamaremos desde el formulario de login de JS
Route::post('/login', [AuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
| Rutas Protegidas (Requieren Token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Ruta para obtener los datos del usuario logueado (útil para el perfil)
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Rutas de tu lógica de negocio
    Route::get('/bloques', [BloqueController::class, 'index']);
    // Iremos añadiendo el resto de rutas (POST, PUT, DELETE) poco a poco
});