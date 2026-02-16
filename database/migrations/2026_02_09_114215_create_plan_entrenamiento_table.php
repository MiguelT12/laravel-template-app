<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlanEntrenamientoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('plan_entrenamiento', function (Blueprint $table) {
        $table->id();
        $table->foreignId('id_ciclista')->constrained('ciclista')->onDelete('cascade');
        
        $table->string('nombre', 100);
        $table->string('descripcion')->nullable();
        $table->date('fecha_inicio');
        $table->date('fecha_fin');
        $table->string('objetivo', 100)->nullable();
        $table->boolean('activo')->default(true);
        
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
        Schema::dropIfExists('plan_entrenamiento');
    }
}
