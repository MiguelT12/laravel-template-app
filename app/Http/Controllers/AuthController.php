<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ciclista;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $ciclista = Ciclista::where('email', $request->email)->first();

        if (!$ciclista || !Hash::check($request->password, $ciclista->password)) {
            return response()->json(['error' => 'Credenciales incorrectas'], 401);
        }

        // Creamos el token para el frontend
        $token = $ciclista->createToken('token_sesion')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }
}