<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\BloqueController;

Route::get('/', function () {
    return view('index');
});

Auth::routes();

Route::post('/register', [RegisterController::class, 'register'])->name('register');

Route::middleware('auth')->group(function () {

    Route::get('/bloques', [BloqueController::class, 'index']);
    Route::post('/bloques', [BloqueController::class, 'store']);
    Route::delete('/bloques/{id}', [BloqueController::class, 'destroy']);
    Route::get('/bloques/{id}', [BloqueController::class, 'show']);

});
