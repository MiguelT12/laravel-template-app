<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BloqueEntrenamiento extends Model
{
    protected $table = 'bloque_entrenamiento';

    protected $fillable = [
        'id_ciclista',
        'nombre',
        'descripcion',
        'tipo',
        'duracion_estimada',
        'potencia_pct_min',
        'potencia_pct_max',
        'pulso_pct_max',
        'pulso_reserva_pct',
        'comentario',
        'id_ciclista'   
    ];
}
