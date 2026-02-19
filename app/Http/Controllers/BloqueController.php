<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BloqueEntrenamiento;
use Illuminate\Support\Facades\Auth;

class BloqueController extends Controller
{
    public function index()
    {
        return response()->json(
            BloqueEntrenamiento::all()
        );
    }

    public function show($id)
    {
        return response()->json(
            BloqueEntrenamiento::findOrFail($id)
        );
    }

    public function store(Request $request)
    {
        $bloque = BloqueEntrenamiento::create([
            'nombre' => $request->nombre,
            'tipo' => $request->tipo,
            'duracion_estimada' => $request->duracion_estimada,
            'id_ciclista' => Auth::id()   
        ]);

        return response()->json($bloque, 201);
    }

    public function destroy($id)
    {
        BloqueEntrenamiento::destroy($id);
        return response()->json(['ok'=>true]);
    }
}
