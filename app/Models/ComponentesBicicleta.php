<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComponentesBicicleta extends Model
{
    protected $table = 'componentes_bicicleta';
    public $timestamps = false;

    protected $fillable = [
        'id_bicicleta', 
        'id_tipo_componente', 
        'marca', 
        'modelo', 
        'especificacion', 
        'velocidad', 
        'posicion', 
        'fecha_montaje', 
        'fecha_retiro', 
        'km_actuales', 
        'km_max_recomendado', 
        'activo', 
        'comentario'
    ];

    // RELACIONES

    // Pertenece a una bicicleta concreta
    public function bicicleta()
    {
        return $this->belongsTo(Bicicleta::class, 'id_bicicleta');
    }

    // Pertenece a un "Tipo" (ej: es una Cadena, es un Pedal...) [cite: 48]
    public function tipoComponente()
    {
        return $this->belongsTo(TipoComponente::class, 'id_tipo_componente');
    }
}