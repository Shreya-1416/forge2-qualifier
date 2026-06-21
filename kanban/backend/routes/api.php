<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\KanbanController;

Route::get('/boards', [KanbanController::class, 'index']);
Route::get('/seed', [KanbanController::class, 'seed']);

Route::post('/cards', [KanbanController::class, 'store']);
Route::put('/cards/{id}', [KanbanController::class, 'update']);
Route::delete('/cards/{id}', [KanbanController::class, 'destroy']);

Route::put('/cards/{id}/move', [KanbanController::class, 'move']);