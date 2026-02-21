<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SesionEntrenamiento;

class SesionEntrenamientoController extends Controller
{
    // LISTAR
    public function index()
    {
        return response()->json(
            SesionEntrenamiento::orderBy('fecha','desc')->get()
        );
    }

    // CREAR
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

    // ELIMINAR
    public function destroy($id)
    {
        $sesion = SesionEntrenamiento::findOrFail($id);
        $sesion->delete();

        return response()->json(['ok'=>true]);
    }

    // VER BLOQUES DE UNA SESION
    public function bloques($id)
    {
        $sesion = SesionEntrenamiento::with('bloques')->findOrFail($id);
        return response()->json($sesion->bloques);
    }
}