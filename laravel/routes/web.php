<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\RegisterController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('index');
});

/*
|--------------------------------------------------------------------------
| AUTH AUTOMÁTICO LARAVEL
|--------------------------------------------------------------------------
*/

Auth::routes();

/*
|--------------------------------------------------------------------------
| REGISTRO PERSONALIZADO (sobrescribe el default)
|--------------------------------------------------------------------------
*/

Route::post('/register', [RegisterController::class, 'register'])->name('register');
