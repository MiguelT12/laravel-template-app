<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SesionEntrenamiento;
use App\Models\BloqueEntrenamiento;

class SesionBloqueController extends Controller
{
    // Listar bloques por id
    public function index($sesionId)
    {
        $sesion = SesionEntrenamiento::with('bloques')
            ->findOrFail($sesionId);

        return response()->json($sesion->bloques);
    }

    // Añadir bloque a sesión
    public function store(Request $request, $sesionId)
    {
        $request->validate([
            'id_bloque_entrenamiento' => 'required|exists:bloque_entrenamiento,id',
            'orden' => 'required|integer|min:1',
            'repeticiones' => 'required|integer|min:1'
        ]);

        $sesion = SesionEntrenamiento::findOrFail($sesionId);

        $sesion->bloques()->attach(
            $request->id_bloque_entrenamiento,
            [
                'orden' => $request->orden,
                'repeticiones' => $request->repeticiones
            ]
        );

        return response()->json([
            'ok' => true,
            'message' => 'Bloque añadido a la sesión'
        ]);
    }

    // Actualizar datos
    public function update(Request $request, $sesionId, $bloqueId)
    {
        $request->validate([
            'orden' => 'required|integer|min:1',
            'repeticiones' => 'required|integer|min:1'
        ]);

        $sesion = SesionEntrenamiento::findOrFail($sesionId);

        $sesion->bloques()->updateExistingPivot(
            $bloqueId,
            [
                'orden' => $request->orden,
                'repeticiones' => $request->repeticiones
            ]
        );

        return response()->json([
            'ok' => true,
            'message' => 'Bloque actualizado en la sesión'
        ]);
    }

    // Eliminar
    public function destroy($sesionId, $bloqueId)
    {
        $sesion = SesionEntrenamiento::findOrFail($sesionId);

        $sesion->bloques()->detach($bloqueId);

        return response()->json([
            'ok' => true,
            'message' => 'Bloque eliminado de la sesión'
        ]);
    }
}