<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SesionEntrenamiento;

class SesionEntrenamientoController extends Controller
{
    public function index()
    {
        return response()->json(
            SesionEntrenamiento::orderBy('fecha', 'desc')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:150',
            'fecha' => 'required|date'
        ]);

        $sesion = SesionEntrenamiento::create([
            'nombre' => $request->nombre,
            'fecha' => $request->fecha,
            'id_plan' => null,
            'descripcion' => null,
            'completada' => false
        ]);

        return response()->json($sesion, 201);
    }

    public function show($id)
    {
        return response()->json(
            SesionEntrenamiento::findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $sesion = SesionEntrenamiento::findOrFail($id);

        $sesion->update($request->only([
            'nombre',
            'fecha',
            'descripcion',
            'completada'
        ]));

        return response()->json($sesion);
    }

    public function destroy($id)
    {
        SesionEntrenamiento::findOrFail($id)->delete();
        return response()->json(['ok' => true]);
    }
}