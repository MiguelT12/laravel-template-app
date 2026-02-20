<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SesionEntrenamiento;
use App\Models\BloqueEntrenamiento;

class SesionBloqueController extends Controller
{

    /*
    | LISTAR BLOQUES DE UNA SESIÓN
    */
    public function index($sesionId)
    {
        $sesion = SesionEntrenamiento::with('bloques')->findOrFail($sesionId);

        return response()->json($sesion->bloques);
    }

    /*
    | AÑADIR BLOQUE A SESIÓN
    */
    public function store(Request $request, $sesionId)
    {
        $request->validate([
            'id_bloque_entrenamiento' => 'required|exists:bloque_entrenamiento,id',
            'orden' => 'required|integer',
            'repeticiones' => 'required|integer'
        ]);

        $sesion = SesionEntrenamiento::findOrFail($sesionId);

        $sesion->bloques()->attach(
            $request->id_bloque_entrenamiento,
            [
                'orden' => $request->orden,
                'repeticiones' => $request->repeticiones
            ]
        );

        return response()->json(['ok' => true]);
    }

    /*
    | ELIMINAR BLOQUE DE SESIÓN
    */
    public function destroy($sesionId, $bloqueId)
    {
        $sesion = SesionEntrenamiento::findOrFail($sesionId);

        $sesion->bloques()->detach($bloqueId);

        return response()->json(['ok' => true]);
    }

}