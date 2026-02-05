@extends('layouts.app')
@section('content')
<div class="container">
 <h1>Editar artículo</h1>
 <form action="{{ route('articles.update', $article) }}" method="POST">
 @csrf
 @method('PUT')
 <div class="mb-3">
 <label>Título</label>
 <input name="title" class="form-control" value="{{ old('title', $article->title) }}">
 @error('title')<div class="text-danger">{{ $message }}</div>@enderror
 </div>
 <div class="mb-3">
 <label>Contenido</label>
 <textarea name="body" rows="6" class="form-control">{{ old('body', $article->body) }}</textarea>
 @error('body')<div class="text-danger">{{ $message }}</div>@enderror
 </div>
 <button type="submit" class="btn btn-success">Actualizar</button>
 </form>
</div>
@endsection