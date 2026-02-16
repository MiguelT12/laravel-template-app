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
        $table->string('nombre', 100);
        $table->string('descripcion')->nullable();
        // Enum según tu SQL
        $table->enum('tipo', ['rodaje', 'intervalos', 'fuerza', 'recuperacion', 'test']);
        
        $table->time('duracion_estimada')->nullable();
        $table->decimal('potencia_pct_min', 5, 2)->nullable();
        $table->decimal('potencia_pct_max', 5, 2)->nullable();
        $table->decimal('pulso_pct_max', 5, 2)->nullable();
        $table->decimal('pulso_reserva_pct', 5, 2)->nullable();
        $table->string('comentario')->nullable();
        
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
        Schema::dropIfExists('bloque_entrenamiento');
    }
}
