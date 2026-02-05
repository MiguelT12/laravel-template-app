@extends('layouts.app')
@section('content')
<div class="container">
 <h1>Crear artículo</h1>
 <form action="{{ route('articles.store') }}" method="POST">
 @csrf
 <div class="mb-3">
 <label>Título</label>
 <input name="title" class="form-control" value="{{ old('title') }}">
 @error('title')<div class="text-danger">{{ $message }}</div>@enderror
 </div>
 <div class="mb-3">
 <label>Contenido</label>
 <textarea name="body" rows="6" class="form-control">{{ old('body') }}</textarea>
 @error('body')<div class="text-danger">{{ $message }}</div>@enderror
 </div>
 <div class="mb-3">
 <label>Publicado (opcional)</label>
 <input type="datetime-local" name="published_at" class="form-control" value="{{ old('published_at') }}">
 </div>
 <button type="submit" class="btn btn-success">Guardar</button>
 </form>
</div>
@endsection