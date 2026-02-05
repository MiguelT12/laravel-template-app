<?php
namespace App\Http\Controllers;
use App\Models\Article;
use Illuminate\Http\Request;
class ArticleController extends Controller
{
 public function index()
 {
 $articles = Article::orderBy('created_at', 'desc')->paginate(10);
 return view('articles.index', compact('articles'));
 }
 public function create()
 {
 return view('articles.create');
 }
 public function store(Request $request)
 {
 $data = $request->validate([
 'title' => 'required|string|max:255',
 'body' => 'required|string',
 'published_at' => 'nullable|date',
 ]);
 Article::create($data);
 return redirect()->route('articles.index')->with('success', 'Artículo creado.');
 }
 public function show(Article $article)
 {
 return view('articles.show', compact('article'));
 }
 public function edit(Article $article)
 {
 return view('articles.edit', compact('article'));
 }
 public function update(Request $request, Article $article)
 {
 $data = $request->validate([
 'title' => 'required|string|max:255',
 'body' => 'required|string',
 'published_at' => 'nullable|date',
 ]);
 $article->update($data);
 return redirect()->route('articles.index')->with('success', 'Artículo actualizado.');
 }
 public function destroy(Article $article)
 {
 $article->delete();
 return redirect()->route('articles.index')->with('success', 'Artículo eliminado.');
 }
}