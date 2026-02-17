<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SesionEntrenamiento extends Model
{
    protected $table = 'sesion_entrenamiento';
    public $timestamps = false;

    protected $fillable = [
        'id_plan', 
        'fecha', 
        'nombre', 
        'descripcion', 
        'completada'
    ];

    public function plan() {
        return $this->belongsTo(PlanEntrenamiento::class, 'id_plan');
    }

    // Relación N:M con campos extra en la tabla intermedia 'sesion_bloque'
    public function bloques() {
        return $this->belongsToMany(BloqueEntrenamiento::class, 'sesion_bloque', 'id_sesion_entrenamiento', 'id_bloque_entrenamiento')
                    ->withPivot(['orden', 'repeticiones', 'duracion_real', 'potencia_real', 'pulso_real']);
    }
}