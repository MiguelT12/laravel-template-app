<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class HistoricoCiclista extends Model
{
    protected $table = 'historico_ciclista';
    public $timestamps = false;
    protected $fillable = [
        'id_ciclista', 'fecha', 'peso', 'ftp', 'pulso_max', 
        'pulso_reposo', 'potencia_max', 'grasa_corporal', 'vo2max', 'comentario'
    ];
}