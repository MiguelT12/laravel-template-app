<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SesionEntrenamiento;

class SesionController extends Controller
{
    public function index(Request $request)
    {
        // 1. Obtener el usuario autenticado (gracias al token)
        $ciclista = $request->user();

        // 2. Leer parámetros para el scroll infinito
        // Si no se envían, por defecto offset es 0 y limit es 10
        $offset = $request->input('offset', 0);
        $limit = $request->input('limit', 10);

        // 3. Buscar las sesiones DE ESTE CICLISTA
        // La relación es: Sesion -> Plan -> Ciclista
        $sesiones = SesionEntrenamiento::whereHas('plan', function($query) use ($ciclista) {
            $query->where('id_ciclista', $ciclista->id);
        })
        ->with('bloques') // Cargar también los bloques de la sesión
        ->orderBy('fecha', 'asc') // Ordenar por fecha
        ->skip($offset)
        ->take($limit)
        ->get();

        // 4. Devolver respuesta JSON
        return response()->json($sesiones);
    }
}