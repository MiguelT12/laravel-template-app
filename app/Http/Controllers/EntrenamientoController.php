<?php

namespace App\Http\Controllers;

use App\Models\Entrenamiento;
use Illuminate\Support\Facades\Auth;

class EntrenamientoController extends Controller
{
    /*
    | LISTAR ENTRENAMIENTOS DEL CICLISTA LOGUEADO
    */
    public function index()
    {
        return response()->json(
            Entrenamiento::with(['bicicleta', 'sesion'])
                ->where('id_ciclista', Auth::id())
                ->orderBy('fecha', 'desc')
                ->get()
        );
    }

    /*
    | DETALLE ENTRENAMIENTO
    */
    public function show($id)
    {
        return response()->json(
            Entrenamiento::with(['bicicleta', 'sesion'])
                ->where('id_ciclista', Auth::id())
                ->findOrFail($id)
        );
    }
}