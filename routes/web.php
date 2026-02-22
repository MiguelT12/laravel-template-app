<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use App\Http\Controllers\BloqueController;
use App\Http\Controllers\SesionEntrenamientoController;
use App\Http\Controllers\SesionBloqueController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\EntrenamientoController;
use App\Http\Controllers\PlanEntrenamientoController;

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

    // Planes de entrenamiento
    Route::get('/planes-ent', [PlanEntrenamientoController::class, 'index']);
    Route::post('/planes-ent', [PlanEntrenamientoController::class, 'store']);
    Route::get('/planes-ent/{id}', [PlanEntrenamientoController::class, 'show']);
    Route::put('/planes-ent/{id}', [PlanEntrenamientoController::class, 'update']);
    Route::delete('/planes-ent/{id}', [PlanEntrenamientoController::class, 'destroy']); 

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

// Para pasar los datos del usuario y se muestren en pantalla
Route::middleware('auth')->get('/datos-perfil', function (\Illuminate\Http\Request $request) {
    return response()->json($request->user());
});
