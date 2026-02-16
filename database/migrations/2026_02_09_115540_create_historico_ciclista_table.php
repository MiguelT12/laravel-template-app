<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHistoricoCiclistaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('historico_ciclista', function (Blueprint $table) {
        $table->id();
        // Clave foránea a ciclista
        $table->foreignId('id_ciclista')->constrained('ciclista')->onDelete('cascade');
        
        $table->date('fecha');
        $table->decimal('peso', 5, 2)->nullable();
        $table->integer('ftp')->nullable();
        $table->integer('pulso_max')->nullable();
        $table->integer('pulso_reposo')->nullable();
        $table->integer('potencia_max')->nullable();
        $table->decimal('grasa_corporal', 4, 2)->nullable();
        $table->decimal('vo2max', 4, 1)->nullable();
        $table->string('comentario')->nullable();

        $table->timestamps();

        // Evitar duplicados de fecha para el mismo ciclista
        $table->unique(['id_ciclista', 'fecha']);
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('historico_ciclista');
    }
}
