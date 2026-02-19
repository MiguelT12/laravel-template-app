<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\SesionController;

/*
|--------------------------------------------------------------------------
| WEB ROUTES
|--------------------------------------------------------------------------
*/

// Página principal
Route::get('/', function () {
    return view('index'); // tu SPA principal
});

// Auth Laravel
Auth::routes();

// Token CSRF para fetch
Route::get('/csrf-token', function (Request $request) {
    $request->session()->regenerateToken();

    return response()->json([
        'token' => csrf_token()
    ]);
});

// Rutas protegidas
Route::middleware(['auth'])->group(function () {

    Route::get('/sesiones-web', [SesionController::class, 'index']);

});
