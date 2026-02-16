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

// routes/web.php

Route::middleware(['auth'])->group(function () {
    Route::get('/sesiones-web', function() {
        return response()->json([
            [
                'id' => 1,
                'nombre' => 'Subida a la Sierra',
                'recorrido' => 'Madrid - Navacerrada',
                'fecha' => '2023-10-01',
                'kilometros' => 65.5
            ],
            [
                'id' => 2,
                'nombre' => 'Entreno Suave',
                'recorrido' => 'Carril Bici Sur',
                'fecha' => '2023-10-05',
                'kilometros' => 30.0
            ]
        ]);
    });
});