<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SesionEntrenamiento extends Model
{
    protected $table = 'sesion_entrenamiento';

    protected $fillable = [
        'id_plan',
        'fecha',
        'nombre',
        'descripcion',
        'completada'
    ];

    public $timestamps = true;

    public function bloques()
    {
        return $this->belongsToMany(
            BloqueEntrenamiento::class,
            'sesion_bloque',
            'id_sesion_entrenamiento',
            'id_bloque_entrenamiento'
        )->withPivot([
            'orden',
            'repeticiones'
        ]);
    }
}