<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Ciclista;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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

        // 🔥 AQUÍ VA EL HASH DE PASSWORD
        Ciclista::create([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'peso_base' => $request->peso_base,
            'altura_base' => $request->altura_base,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        return redirect('/')->with('success','Usuario creado correctamente');
    }
}
