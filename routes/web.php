<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use App\Http\Controllers\SesionController;
use App\Http\Controllers\BloqueController;
use App\Http\Controllers\SesionEntrenamientoController;
use App\Http\Controllers\SesionBloqueController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\EntrenamientoController;

Route::get('/', function () {
    return view('index');
});

// Auth laravel
Auth::routes();

// Registro
Route::post('/register', [RegisterController::class, 'register'])->name('register');

// Token para fetch
Route::get('/csrf-token', function (Request $request) {
    $request->session()->regenerateToken();

    return response()->json([
        'token' => csrf_token()
    ]);
});

// Para SPA
Route::get('/check-auth', function () {
    return response()->json([
        'auth' => auth()->check()
    ]);
});

// Rutas que requieren un login
Route::middleware('auth')->group(function () {
    Route::get('/sesiones-web', [SesionController::class, 'index']);

    // Sesiones entrenamiento
    Route::get('/sesiones', [SesionEntrenamientoController::class, 'index']);
    Route::post('/sesiones', [SesionEntrenamientoController::class, 'store']);
    Route::get('/sesiones/{id}', [SesionEntrenamientoController::class, 'show']);
    Route::put('/sesiones/{id}', [SesionEntrenamientoController::class, 'update']);
    Route::delete('/sesiones/{id}', [SesionEntrenamientoController::class, 'destroy']);

    // Bloques entrenamiento
    Route::get('/bloques', [BloqueController::class, 'index']);
    Route::post('/bloques', [BloqueController::class, 'store']);
    Route::get('/bloques/{id}', [BloqueController::class, 'show']);
    Route::delete('/bloques/{id}', [BloqueController::class, 'destroy']);

    // Sesión - Bloque
    Route::prefix('sesiones')->group(function () {

        Route::get('{sesionId}/bloques', [SesionBloqueController::class, 'index']);
        Route::post('{sesionId}/bloques', [SesionBloqueController::class, 'store']);
        Route::put('{sesionId}/bloques/{bloqueId}', [SesionBloqueController::class, 'update']);
        Route::delete('{sesionId}/bloques/{bloqueId}', [SesionBloqueController::class, 'destroy']);

    });

    Route::get('/entrenamientos', [EntrenamientoController::class, 'index']);
    Route::post('/entrenamientos', [EntrenamientoController::class, 'store']);
    Route::get('/entrenamientos/{id}', [EntrenamientoController::class, 'show']);
    Route::delete('/entrenamientos/{id}', [EntrenamientoController::class, 'destroy']);

    // Editar los datos del usuario
    Route::put('/datos-perfil', function (\Illuminate\Http\Request $request) {
    $user = $request->user();
    
    $user->update($request->only(['nombre', 'peso_base', 'altura_base', 'fecha_nacimiento']));
    
    return response()->json([
        'message' => 'Perfil actualizado correctamente',
        'user' => $user
    ]);
});
});

// PARA PASAR LOS DATOS DEL USUARIO Y SE MUESTREN EN PANTALLA
Route::middleware('auth')->get('/datos-perfil', function (\Illuminate\Http\Request $request) {
    return response()->json($request->user());
});