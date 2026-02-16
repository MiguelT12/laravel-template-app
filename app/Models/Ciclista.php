<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Ciclista extends Authenticatable
{
    use Notifiable;

    protected $table = 'ciclista';

    // Campos que se pueden rellenar masivamente
    protected $fillable = [
        'nombre', 
        'apellidos', 
        'email', 
        'password', 
        'fecha_nacimiento', 
        'peso_base', 
        'altura_base'
    ];

    // Ocultar la contraseña en las respuestas JSON por seguridad
    protected $hidden = [
        'password', 
        'remember_token',
    ];

    public $timestamps = false;

    public function planes()
    {
        return $this->hasMany(PlanEntrenamiento::class, 'id_ciclista');
    }
}