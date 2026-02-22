<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBloqueEntrenamientoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('bloque_entrenamiento', function (Blueprint $table) {

        $table->id();

        // Relación con ciclista
        $table->unsignedBigInteger('id_ciclista');

        $table->string('nombre', 100);
        $table->string('descripcion')->nullable();
        $table->string('tipo');
        $table->integer('duracion_estimada')->nullable();

        $table->decimal('potencia_pct_min', 5, 2)->nullable();
        $table->decimal('potencia_pct_max', 5, 2)->nullable();
        $table->decimal('pulso_pct_max', 5, 2)->nullable();
        $table->decimal('pulso_reserva_pct', 5, 2)->nullable();
        $table->string('comentario')->nullable();

        $table->timestamps();

        // Claves foráneas
        $table->foreign('id_ciclista')
              ->references('id')
              ->on('ciclista')
              ->onDelete('cascade');
    });
}
}
