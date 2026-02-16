<?php 

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Contraseña común para todos: 'password'
        $password = Hash::make('password');

        // 1. Crear Ciclistas
        DB::table('ciclista')->insert([
            ['nombre' => 'Juan', 'apellidos' => 'Pérez', 'fecha_nacimiento' => '1990-05-10', 'peso_base' => 70.5, 'altura_base' => 175, 'email' => 'test1@prueba.com', 'password' => $password],
            ['nombre' => 'Ana', 'apellidos' => 'Rodríguez', 'fecha_nacimiento' => '1992-08-20', 'peso_base' => 60.0, 'altura_base' => 165, 'email' => 'test2@prueba.com', 'password' => $password],
        ]);

        // (Aquí puedes añadir el resto de tablas: bicicletas, entrenamientos...
        //  pero con esto ya te vale para el Login).
    }
}