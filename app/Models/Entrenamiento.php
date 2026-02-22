<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entrenamiento extends Model
{
    // Nombre exacto de la tabla según el PDF
    protected $table = 'entrenamiento'; 
    public $timestamps = false;

    // Todos los campos del diagrama
    protected $fillable = [
        'id_ciclista', 
        'id_bicicleta', 
        'id_sesion', 
        'fecha', 
        'duracion', 
        'kilometros', 
        'recorrido', 
        'pulso_medio', 
        'pulso_max',
        'potencia_media', 
        'potencia_normalizada', 
        'velocidad_media',
        'puntos_estres_tss', 
        'factor_intensidad_if', 
        'ascenso_metros', 
        'comentario'
    ];

    // Relaciones
    // Pertenece a un Ciclista 
    public function ciclista()
    {
        return $this->belongsTo(Ciclista::class, 'id_ciclista');
    }

    // Pertenece a una Bicicleta 
    public function bicicleta()
    {
        return $this->belongsTo(Bicicleta::class, 'id_bicicleta');
    }

    // Puede estar vinculado a una Sesión planificada 
    public function sesion()
    {
        return $this->belongsTo(SesionEntrenamiento::class, 'id_sesion');
    }
}
