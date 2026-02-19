<?php

use Illuminate\Database\Seeder;
use App\Models\Ciclista;
use App\Models\PlanEntrenamiento;
use App\Models\BloqueEntrenamiento;
use App\Models\SesionEntrenamiento;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // 1. CREAR CICLISTA (Tu usuario para entrar)
        $ciclista = Ciclista::create([
            'nombre' => 'Migue',
            'apellidos' => 'Prueba',
            'email' => 'migue@test.com',
            'password' => Hash::make('123456'), // Contraseña encriptada
            'fecha_nacimiento' => '1995-05-15',
            'peso_base' => 70.5,
            'altura_base' => 178
        ]);

        // 2. CREAR BLOQUES DE ENTRENAMIENTO (Los tipos de ejercicio) [cite: 124]
        $bloqueCalentamiento = BloqueEntrenamiento::create([
            'id_ciclista' => $ciclista->id,  
            'nombre' => 'Calentamiento Estándar',
            'descripcion' => 'Rodar suave incrementando cadencia',
            'tipo' => 'Calentamiento',
            'duracion_estimada' => 20,
            'potencia_pct_min' => 45,
            'potencia_pct_max' => 55
        ]);

        $bloqueSeries = BloqueEntrenamiento::create([
            'id_ciclista' => $ciclista->id,  
            'nombre' => 'Series Umbral',
            'descripcion' => 'Intervalos de alta intensidad',
            'tipo' => 'Series',
            'duracion_estimada' => 40,
            'potencia_pct_min' => 95,
            'potencia_pct_max' => 105
        ]);

        // 3. CREAR UN PLAN DE ENTRENAMIENTO [cite: 125-127]
        $plan = PlanEntrenamiento::create([
            'id_ciclista' => $ciclista->id,
            'nombre' => 'Pretemporada 2026',
            'descripcion' => 'Plan base para coger fondo',
            'fecha_inicio' => '2026-01-01',
            'fecha_fin' => '2026-03-31',
            'objetivo' => 'Mejorar resistencia aeróbica',
            'activo' => true
        ]);

        // 4. CREAR SESIONES DENTRO DEL PLAN [cite: 124]
        // Sesión 1
        $sesion1 = SesionEntrenamiento::create([
            'id_plan' => $plan->id,
            'fecha' => '2026-01-19',
            'nombre' => 'Sesión 1: Activación',
            'descripcion' => 'Primera toma de contacto',
            'completada' => false
        ]);

        // Sesión 2
        $sesion2 = SesionEntrenamiento::create([
            'id_plan' => $plan->id,
            'fecha' => '2026-01-21',
            'nombre' => 'Sesión 2: Carga',
            'descripcion' => 'Empezamos con series',
            'completada' => false
        ]);

        // 5. VINCULAR BLOQUES A SESIONES (Tabla sesion_bloque) [cite: 121-122]
        // A la Sesión 1 le metemos un calentamiento y unas series
        $sesion1->bloques()->attach($bloqueCalentamiento->id, [
            'orden' => 1,
            'repeticiones' => 1,
            'duracion_real' => null 
        ]);

        $sesion1->bloques()->attach($bloqueSeries->id, [
            'orden' => 2,
            'repeticiones' => 2,
            'duracion_real' => null
        ]);
    }
}