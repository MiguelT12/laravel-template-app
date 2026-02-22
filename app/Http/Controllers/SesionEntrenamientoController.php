<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SesionEntrenamiento;

class SesionEntrenamientoController extends Controller
{
   public function index(Request $request)
    {
        $offset = $request->query('offset', 0);
        $limit = $request->query('limit', 10);

        $sesiones = \App\Models\SesionEntrenamiento::orderBy('fecha', 'desc')
            ->offset($offset)
            ->limit($limit)
            ->get();

        return response()->json($sesiones);
    }

    // Crear    
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:150',
            'fecha' => 'required|date'
        ]);

        $sesion = SesionEntrenamiento::create([
            'id_plan' => 1, // provisional si no eliges plan
            'nombre' => $request->nombre,
            'fecha' => $request->fecha,
            'descripcion' => null,
            'completada' => false
        ]);

        return response()->json($sesion, 201);
    }

    // Eliminar
    public function destroy($id)
    {
        $sesion = SesionEntrenamiento::findOrFail($id);
        $sesion->delete();

        return response()->json(['ok'=>true]);
    }

    // Ver bloques de una sesión
    public function bloques($id)
    {
        $sesion = SesionEntrenamiento::with('bloques')->findOrFail($id);
        return response()->json($sesion->bloques);
    }
}