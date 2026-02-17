<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Ciclista extends Authenticatable
{
    use Notifiable;

    protected $table = 'ciclista';
    public $timestamps = false; 

    protected $fillable = [
        'nombre', 
        'apellidos', 
        'fecha_nacimiento', 
        'peso_base', 
        'altura_base', 
        'email', 
        'password'
    ];

    protected $hidden = ['password'];

    // Estas son las relaciones del diagrama modelo entidad-relacion
    public function planes() {
        return $this->hasMany(PlanEntrenamiento::class, 'id_ciclista');
    }
    
    public function bicicletas() {
        return $this->hasMany(Bicicleta::class, 'id_ciclista');
    }

    public function historicos() {
        return $this->hasMany(HistoricoCiclista::class, 'id_ciclista');
    }
}