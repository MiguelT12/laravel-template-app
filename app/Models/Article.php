<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory; // ± IMPORTANTE
use Illuminate\Database\Eloquent\Model;
class Article extends Model
{
 protected $fillable = [
 'title',
 'body',
 'published_at',
 ];
 protected $dates = [
 'published_at',
 ];
}
?>