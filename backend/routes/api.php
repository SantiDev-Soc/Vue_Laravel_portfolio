<?php
declare(strict_types=1);

use App\Http\Controllers\CertificationController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HealtController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', static function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Ruta de verificación de estado
Route::get('/health', [HealtController::class, 'check']);

// Route check dashboard admin
Route::post('/login', [UserController::class, 'login']);

// Publication routes
Route::post('/publication/create', [PublicationController::class, 'create']);
Route::put('/publication/update/{id}', [PublicationController::class, 'update']);
Route::delete('/publication/delete/{id}', [PublicationController::class, 'delete']);

// Project routes
Route::post('/projects/create', [ProjectController::class, 'create']);
Route::put('/projects/update/{id}', [ProjectController::class, 'update']);
Route::delete('/projects/delete/{id}', [ProjectController::class, 'delete']);

// Contact routes
Route::post('/contacts/create', [ContactController::class, 'create']);
Route::put('/contacts/update/{id}', [ContactController::class, 'update']);
Route::delete('/contacts/delete/{id}', [ContactController::class, 'delete']);

// Certification routes
Route::post('/certification/create', [CertificationController::class, 'create']);
Route::put('/certification/update/{id}', [CertificationController::class, 'update']);
Route::delete('/certification/delete/{id}', [CertificationController::class, 'delete']);

// Obtener listados (GET)
Route::get('/publications', [PublicationController::class, 'index']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/certifications', [CertificationController::class, 'index']);
Route::get('/contacts', [ContactController::class, 'index']);
