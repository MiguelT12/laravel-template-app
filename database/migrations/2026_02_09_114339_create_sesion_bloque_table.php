<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSesionBloqueTable extends Migration
{
    public function up()
    {
        Schema::create('sesion_bloque', function (Blueprint $table) {
            $table->id();
            
            // Claves foráneas limpias
            $table->foreignId('id_sesion_entrenamiento')->constrained('sesion_entrenamiento')->onDelete('cascade');
            $table->foreignId('id_bloque_entrenamiento')->constrained('bloque_entrenamiento')->onDelete('cascade');
            
            // Datos extra
            $table->integer('orden')->nullable();
            $table->integer('repeticiones')->nullable();
            $table->integer('duracion_real')->nullable();
            $table->integer('potencia_real')->nullable();
            $table->integer('pulso_real')->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sesion_bloque');
    }
}