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
        'duracion_estimada'
    ];

    public function sesiones()
    {
        return $this->belongsToMany(
            SesionEntrenamiento::class,
            'sesion_bloque',
            'id_bloque_entrenamiento',
            'id_sesion_entrenamiento'
        )->withPivot([
            'orden',
            'repeticiones'
        ]);
    }
}