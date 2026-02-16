<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\SesionController; // Asegúrate de importar esto

// Ruta principal (SPA)
Route::get('/', function () {
    return view('index');
});

// Rutas de autenticación generadas por la profesora
Auth::routes();

// --- NUEVA RUTA: DATOS PARA FETCH ---
// Usamos el middleware 'auth' normal (no sanctum) porque usamos cookies
Route::middleware(['auth'])->group(function () {
    
    // Esta ruta devuelve el JSON de las sesiones si estás logueado
    Route::get('/sesiones-web', [SesionController::class, 'index']);

});