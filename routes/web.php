<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\SesionController;
use App\Http\Controllers\BloqueController;
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
| AUTH
|--------------------------------------------------------------------------
*/

Auth::routes();
Route::post('/register', [RegisterController::class, 'register'])->name('register');

/*
|--------------------------------------------------------------------------
| CSRF TOKEN FETCH
|--------------------------------------------------------------------------
*/

Route::get('/csrf-token', function (Request $request) {
    $request->session()->regenerateToken();
    return response()->json(['token' => csrf_token()]);
});

/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    // SESIONES
    Route::get('/sesiones-web', [SesionController::class, 'index']);

    // BLOQUES CRUD
    Route::get('/bloques', [BloqueController::class, 'index']);
    Route::post('/bloques', [BloqueController::class, 'store']);
    Route::delete('/bloques/{id}', [BloqueController::class, 'destroy']);
    Route::get('/bloques/{id}', [BloqueController::class, 'show']);

});
