<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * MODIFICACIÓN 1: Interceptar el login exitoso.
     * Si la petición pide JSON (fetch), devolvemos JSON y no redirigimos.
     */
    protected function authenticated(Request $request, $user)
    {
        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Login correcto',
                'user' => $user,
                // Puedes enviar la url de redirección por si el JS la necesita
                'redirect' => $this->redirectTo 
            ], 200);
        }

        // Comportamiento normal (si no usas fetch)
        return redirect()->intended($this->redirectPath());
    }

    /**
     * MODIFICACIÓN 2: Interceptar el logout.
     * Si es por fetch, devolvemos ok sin recargar.
     */
    protected function loggedOut(Request $request)
    {
        if ($request->wantsJson()) {
            return response()->json(['message' => 'Sesión cerrada correctamente'], 204);
        }

        return redirect('/login');
    }
}