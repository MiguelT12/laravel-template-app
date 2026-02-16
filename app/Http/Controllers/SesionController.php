<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SesionController extends Controller
{
    public function index()
    {
        // 1. Aquí más adelante haremos la consulta a la base de datos real.
        // $sesiones = Sesion::where('ciclista_id', Auth::id())->get();

        // 2. POR AHORA: Devolvemos datos falsos para que veas que funciona el menú
        return response()->json([
            [
                'id' => 1,
                'nombre' => 'Entrenamiento de Montaña',
                'fecha' => '2023-10-25',
                'kilometros' => 45.5,
                'recorrido' => 'Cercedilla - Navacerrada'
            ],
            [
                'id' => 2,
                'nombre' => 'Serie de Velocidad',
                'fecha' => '2023-10-28',
                'kilometros' => 20.0,
                'recorrido' => 'Velódromo'
            ]
        ]);
    }
}