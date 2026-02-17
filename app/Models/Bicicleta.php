<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Bicicleta extends Model
{
    protected $table = 'bicicleta';
    public $timestamps = false;
    protected $fillable = ['id_ciclista', 'nombre', 'tipo', 'comentario'];

    public function ciclista() {
        return $this->belongsTo(Ciclista::class, 'id_ciclista');
    }
}