<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Ciclista extends Authenticatable
{
    use HasApiTokens, Notifiable; 

    protected $table = 'ciclista';
    protected $fillable = ['nombre', 'apellidos','email', 'password', 'fecha_nacimiento', 'peso', 'altura'];
    protected $hidden = ['password', 'remember_token'];
    public $timestamps = false;

    public function planes()
    {
        // Asegúrate de crear el modelo PlanEntrenamiento después
        return $this->hasMany(PlanEntrenamiento::class, 'id_ciclista');
    }
    
}
