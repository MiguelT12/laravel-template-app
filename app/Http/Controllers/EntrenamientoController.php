<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Entrenamiento;

class EntrenamientoController extends Controller
{
    // Listar
    public function index()
    {
        return response()->json(
            Entrenamiento::with(['bicicleta', 'sesion'])
                ->orderBy('fecha', 'desc')
                ->get()
        );
    }

    // Ver detalle
    public function show($id)
    {
        return response()->json(
            Entrenamiento::with(['bicicleta', 'sesion'])
                ->findOrFail($id)
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'fecha' => 'required|date',
            'duracion' => 'required',
            'kilometros' => 'required|numeric'
        ]);

        // Si no hay bici, se crea una automática
        $bicicleta = \App\Models\Bicicleta::first();

        if (!$bicicleta) {
            $bicicleta = \App\Models\Bicicleta::create([
                'nombre' => 'Bicicleta por defecto',
                'tipo' => 'carretera'
            ]);
        }

        return Entrenamiento::create([
            'id_ciclista' => auth()->id(),
            'id_bicicleta' => $bicicleta->id,
            'id_sesion' => null,

            'fecha' => $request->fecha,
            'duracion' => $request->duracion,
            'kilometros' => $request->kilometros,

            'recorrido' => $request->recorrido ?? 'Sin definir',
            'potencia_normalizada' => $request->potencia_normalizada ?? 0,
            'velocidad_media' => $request->velocidad_media ?? 0,

            'pulso_medio' => $request->pulso_medio,
            'pulso_max' => $request->pulso_max,
            'potencia_media' => $request->potencia_media,
            'puntos_estres_tss' => $request->puntos_estres_tss,
            'factor_intensidad_if' => $request->factor_intensidad_if,
            'ascenso_metros' => $request->ascenso_metros,
            'comentario' => $request->comentario
        ]);
    }
}