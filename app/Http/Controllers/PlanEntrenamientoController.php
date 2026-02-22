<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PlanEntrenamiento;

class PlanEntrenamientoController extends Controller
{
    public function index()
    {
        return PlanEntrenamiento::where('id_ciclista', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'fecha_inicio' => 'required|date'
        ]);

        return PlanEntrenamiento::create([
            'id_ciclista' => Auth::id(),
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'objetivo' => $request->objetivo,
            'activo' => 1
        ]);
    }

    public function show($id)
    {
        return PlanEntrenamiento::where('id_ciclista', Auth::id())
            ->findOrFail($id);
    }

    public function destroy($id)
    {
        $plan = PlanEntrenamiento::where('id_ciclista', Auth::id())
            ->findOrFail($id);

        $plan->delete();

        return response()->json(['ok' => true]);
    }
}