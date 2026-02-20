<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Ciclista;
use App\Models\PlanEntrenamiento;
use App\Models\SesionEntrenamiento;
use App\Models\BloqueEntrenamiento;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $ciclista = Ciclista::updateOrCreate(
            ['email' => 'migue@test.com'],
            [
                'nombre' => 'Raul',
                'apellidos' => 'Ciclista',
                'fecha_nacimiento' => '1998-05-14',
                'peso_base' => 72.40,
                'altura_base' => 178,
                'password' => Hash::make('123456'),
            ]
        );

        $plan = PlanEntrenamiento::updateOrCreate(
            [
                'id_ciclista' => $ciclista->id,
                'nombre' => 'Plan Base 4 Semanas',
            ],
            [
                'descripcion' => 'Trabajo de base aeróbica y técnica.',
                'fecha_inicio' => '2026-02-01',
                'fecha_fin' => '2026-02-28',
                'objetivo' => 'Mejorar resistencia',
                'activo' => true,
            ]
        );

        $sesion1 = SesionEntrenamiento::updateOrCreate(
            [
                'id_plan' => $plan->id,
                'fecha' => '2026-02-18',
                'nombre' => 'Rodaje Z2',
            ],
            [
                'descripcion' => 'Rodaje continuo suave.',
                'completada' => true,
            ]
        );

        $sesion2 = SesionEntrenamiento::updateOrCreate(
            [
                'id_plan' => $plan->id,
                'fecha' => '2026-02-20',
                'nombre' => 'Series Umbral',
            ],
            [
                'descripcion' => 'Series a ritmo de umbral.',
                'completada' => false,
            ]
        );

        $bloque1 = BloqueEntrenamiento::updateOrCreate(
            [
                'id_ciclista' => $ciclista->id,
                'nombre' => 'Calentamiento',
            ],
            [
                'descripcion' => 'Subida progresiva de intensidad.',
                'tipo' => 'resistencia',
                'duracion_estimada' => 15,
                'potencia_pct_min' => 50,
                'potencia_pct_max' => 65,
                'pulso_pct_max' => 70,
                'pulso_reserva_pct' => 55,
                'comentario' => 'Cadencia alta',
            ]
        );

        $bloque2 = BloqueEntrenamiento::updateOrCreate(
            [
                'id_ciclista' => $ciclista->id,
                'nombre' => 'Trabajo principal',
            ],
            [
                'descripcion' => 'Bloque principal de la sesión.',
                'tipo' => 'umbral',
                'duracion_estimada' => 20,
                'potencia_pct_min' => 90,
                'potencia_pct_max' => 100,
                'pulso_pct_max' => 92,
                'pulso_reserva_pct' => 80,
                'comentario' => 'Controlar pulso',
            ]
        );

        $bloque3 = BloqueEntrenamiento::updateOrCreate(
            [
                'id_ciclista' => $ciclista->id,
                'nombre' => 'Enfriamiento',
            ],
            [
                'descripcion' => 'Vuelta a la calma.',
                'tipo' => 'recuperacion',
                'duracion_estimada' => 10,
                'potencia_pct_min' => 45,
                'potencia_pct_max' => 55,
                'pulso_pct_max' => 65,
                'pulso_reserva_pct' => 40,
                'comentario' => 'Pedaleo muy suave',
            ]
        );

        $sesion1->bloques()->syncWithoutDetaching([
            $bloque1->id => ['orden' => 1, 'repeticiones' => 1],
            $bloque2->id => ['orden' => 2, 'repeticiones' => 2],
            $bloque3->id => ['orden' => 3, 'repeticiones' => 1],
        ]);

        $sesion2->bloques()->syncWithoutDetaching([
            $bloque1->id => ['orden' => 1, 'repeticiones' => 1],
            $bloque2->id => ['orden' => 2, 'repeticiones' => 3],
            $bloque3->id => ['orden' => 3, 'repeticiones' => 1],
        ]);

        $this->call(EntrenamientoSeeder::class);
    }
}
