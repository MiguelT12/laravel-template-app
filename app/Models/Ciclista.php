<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ciclista extends Model
{
    protected $table = 'ciclistas';
    protected $fillable = ['nombre', 'apellido', 'email', 'telefono', 'direccion', 'ciudad', 'provincia'];
    protected $hidden = ['password'];
    public $timestamps = false;

    public function planes()
    {
        return $this->hasMany(Articulo::class);
    }
    
}
