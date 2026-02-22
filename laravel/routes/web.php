<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\BloqueController;
use App\Http\Controllers\PlanEntrenamientoController;

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

    Route::get('/planes-ent', [PlanEntrenamientoController::class,'index']);
    Route::post('/planes-ent', [PlanEntrenamientoController::class,'store']);
    Route::get('/planes-ent/{id}', [PlanEntrenamientoController::class,'show']);
    Route::delete('/planes-ent/{id}', [PlanEntrenamientoController::class,'destroy']);


    
});


