@extends('layouts.app')
@section('content')
<div class="container">
 <h1>{{ $article->title }}</h1>
 <p>{{ $article->body }}</p>
 <a href="{{ route('articles.edit', $article) }}" class="btn btn-primary">Editar</a>
 <form action="{{ route('articles.destroy', $article) }}" method="POST" style="display:inline-block;">
 @csrf
 @method('DELETE')
 <button class="btn btn-danger">Eliminar</button>
 </form>
</div>
@endsection