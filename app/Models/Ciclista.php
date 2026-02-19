<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Ciclista extends Authenticatable
{
    protected $table = 'ciclista';

    protected $fillable = [
        'nombre',
        'apellidos',
        'fecha_nacimiento',
        'peso_base',
        'altura_base',
        'email',
        'password'
    ];

    protected $hidden = [
        'password'
    ];
}
