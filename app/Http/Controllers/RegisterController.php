<?php

namespace App\Http\Controllers;

use App\Models\Ciclista;
use App\Models\Bicicleta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:80',
            'apellidos' => 'required|string|max:80',
            'fecha_nacimiento' => 'required|date',
            'email' => 'required|email|unique:ciclista,email',
            'password' => 'required|min:6|confirmed'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // crear ciclista
        $ciclista = Ciclista::create([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'peso_base' => $request->peso_base,
            'altura_base' => $request->altura_base,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        // crear bici automática
        Bicicleta::create([
            'nombre' => 'Primera bicicleta',
            'tipo' => 'carretera',
            'comentario' => null
        ]);

        Auth::login($ciclista);

        return redirect('/')->with('success', 'Cuenta creada correctamente');
    }
}