@extends('layouts.app')
@section('content')
    <div class="container">
        <h1>Artículos</h1>
            <a href="{{ route('articles.create') }}" class="btn btn-primary">Crear artículo</a>
            @foreach($articles as $article)
        <div class="card mt-3">
        <div class="card-body">
            <h3><a href="{{ route('articles.show', $article) }}">{{ $article->title }}</a></h3>
            <p>{{ Str::limit($article->body, 150) }}</p>
        </div>
        </div>
            @endforeach
        <div class="mt-3">
            {{ $articles->links() }}
        </div>
    </div>
@endsection