<?php
use Illuminate\Database\Seeder;
use App\Models\Article;
class ArticleSeeder extends Seeder
{
 public function run()
 {
 factory(Article::class, 10)->create(); // ± sintaxis correcta Laravel 7
 }
}