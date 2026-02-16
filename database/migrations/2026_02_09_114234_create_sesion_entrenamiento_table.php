<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSesionEntrenamientoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('sesion_entrenamiento', function (Blueprint $table) {
        $table->id();
        $table->foreignId('id_plan')->constrained('plan_entrenamiento')->onDelete('cascade');
        
        $table->date('fecha');
        $table->string('nombre', 100)->nullable();
        $table->string('descripcion')->nullable();
        $table->boolean('completada')->default(false);
        
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
        Schema::dropIfExists('sesion_entrenamiento');
    }
}
