<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use App\Http\Controllers\SesionController;
use App\Http\Controllers\BloqueController;
use App\Http\Controllers\SesionEntrenamientoController;
use App\Http\Controllers\SesionBloqueController;
use App\Http\Controllers\RegisterController;

/*
|--------------------------------------------------------------------------
| HOME SPA
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return view('index');
});


/*
|--------------------------------------------------------------------------
| AUTH LARAVEL
|--------------------------------------------------------------------------
*/
Auth::routes();


/*
|--------------------------------------------------------------------------
| REGISTRO PERSONALIZADO CICLISTA
|--------------------------------------------------------------------------
*/
Route::post('/register', [RegisterController::class, 'register'])->name('register');


/*
|--------------------------------------------------------------------------
| CSRF TOKEN PARA FETCH (SPA)
|--------------------------------------------------------------------------
*/
Route::get('/csrf-token', function (Request $request) {
    $request->session()->regenerateToken();

    return response()->json([
        'token' => csrf_token()
    ]);
});


/*
|--------------------------------------------------------------------------
| CHECK AUTH (MUY IMPORTANTE PARA SPA)
|--------------------------------------------------------------------------
*/
Route::get('/check-auth', function () {
    return response()->json([
        'auth' => auth()->check()
    ]);
});


/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS (LOGIN REQUIRED)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | SESIONES ENTRENAMIENTO (vista SPA mock / legacy)
    |--------------------------------------------------------------------------
    */
    Route::get('/sesiones-web', [SesionController::class, 'index']);


    /*
    |--------------------------------------------------------------------------
    | SESIONES ENTRENAMIENTO CRUD REAL
    |--------------------------------------------------------------------------
    */
    Route::get('/sesiones', [SesionEntrenamientoController::class, 'index']);
    Route::post('/sesiones', [SesionEntrenamientoController::class, 'store']);
    Route::get('/sesiones/{id}', [SesionEntrenamientoController::class, 'show']);
    Route::put('/sesiones/{id}', [SesionEntrenamientoController::class, 'update']);
    Route::delete('/sesiones/{id}', [SesionEntrenamientoController::class, 'destroy']);


    /*
    |--------------------------------------------------------------------------
    | BLOQUES ENTRENAMIENTO CRUD
    |--------------------------------------------------------------------------
    */
    Route::get('/bloques', [BloqueController::class, 'index']);
    Route::post('/bloques', [BloqueController::class, 'store']);
    Route::get('/bloques/{id}', [BloqueController::class, 'show']);
    Route::delete('/bloques/{id}', [BloqueController::class, 'destroy']);


    /*
    |--------------------------------------------------------------------------
    | SESION ↔ BLOQUE (tabla pivot sesion_bloque)
    |--------------------------------------------------------------------------
    */
    Route::prefix('sesiones')->group(function () {

        Route::get('{sesionId}/bloques', [SesionBloqueController::class, 'index']);
        Route::post('{sesionId}/bloques', [SesionBloqueController::class, 'store']);
        Route::put('{sesionId}/bloques/{bloqueId}', [SesionBloqueController::class, 'update']);
        Route::delete('{sesionId}/bloques/{bloqueId}', [SesionBloqueController::class, 'destroy']);

    });

});