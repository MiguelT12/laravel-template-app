<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSesionBloqueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('sesion_bloque', function (Blueprint $table) {
        $table->id();
        $table->foreignId('id_sesion_entrenamiento')->constrained('sesion_entrenamiento')->onDelete('cascade');
        $table->foreignId('id_bloque_entrenamiento')->constrained('bloque_entrenamiento')->onDelete('cascade');
        
        $table->integer('orden');
        $table->integer('repeticiones')->default(1);
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sesion_bloque');
    }
}
