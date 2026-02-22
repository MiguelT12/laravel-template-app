<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BloqueController;
use App\Http\Controllers\SesionController;

// Esta es la ruta que llamaremos desde el formulario de login de JS
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    // Ruta para obtener los datos del usuario logueado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/bloques', [BloqueController::class, 'index']);
});