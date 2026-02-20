<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Ciclista;
use App\Models\Bicicleta;
use App\Models\PlanEntrenamiento;
use App\Models\SesionEntrenamiento;
use App\Models\Entrenamiento;
use Carbon\Carbon;

class EntrenamientoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $ciclista = Ciclista::where('email', 'demo@cicloapp.test')->first();

        if (!$ciclista) {
            return;
        }

        DB::table('tipo_componente')->updateOrInsert(
            ['nombre' => 'Cadena'],
            ['descripcion' => 'Cadena de transmisión']
        );

        DB::table('tipo_componente')->updateOrInsert(
            ['nombre' => 'Cassette'],
            ['descripcion' => 'Piñonera trasera']
        );

        $bicicleta = Bicicleta::updateOrCreate(
            ['nombre' => 'Orbea Orca'],
            [
                'tipo' => 'carretera',
                'comentario' => 'Bicicleta principal de entrenamiento',
            ]
        );

        $plan = PlanEntrenamiento::where('id_ciclista', $ciclista->id)->first();
        $sesion = $plan
            ? SesionEntrenamiento::where('id_plan', $plan->id)->orderBy('id')->first()
            : null;

        Entrenamiento::updateOrCreate(
            [
                'id_ciclista' => $ciclista->id,
                'fecha' => '2026-02-18 10:00:00',
            ],
            [
                'id_bicicleta' => $bicicleta->id,
                'id_sesion' => $sesion ? $sesion->id : null,
                'duracion' => '01:25:00',
                'kilometros' => 42.80,
                'recorrido' => 'Ruta llana + repechos',
                'pulso_medio' => 146,
                'pulso_max' => 171,
                'potencia_media' => 205,
                'potencia_normalizada' => 224,
                'velocidad_media' => 30.20,
                'puntos_estres_tss' => 71.50,
                'factor_intensidad_if' => 0.82,
                'ascenso_metros' => 420,
                'comentario' => 'Buenas sensaciones',
            ]
        );

        DB::table('historico_ciclista')->updateOrInsert(
            [
                'id_ciclista' => $ciclista->id,
                'fecha' => '2026-02-01',
            ],
            [
                'peso' => 72.40,
                'ftp' => 255,
                'pulso_max' => 188,
                'pulso_reposo' => 52,
                'potencia_max' => 980,
                'grasa_corporal' => 13.50,
                'vo2max' => 58.2,
                'comentario' => 'Medición de inicio de bloque',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        );
    }
}
