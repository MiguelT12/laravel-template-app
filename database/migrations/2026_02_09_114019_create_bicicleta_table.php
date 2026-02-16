<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBicicletaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('bicicleta', function (Blueprint $table) {
        $table->id();
        $table->string('nombre', 50);
        $table->enum('tipo', ['carretera', 'mtb', 'gravel', 'rodillo']);
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
        Schema::dropIfExists('bicicleta');
    }
}
