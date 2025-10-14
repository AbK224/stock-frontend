<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;


/* Route::get('/ping', function () {
    return response()->json(['ping' => 'pong']);
}); 
*/

Route::post('/register', [AuthController::class, 'register']); // Route pour l'inscription
Route::post('/login', [AuthController::class, 'login']);// Route pour la connexion
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');// Route pour la déconnexion, protégée par le middleware auth:sanctum
// Route protégée pour obtenir les informations de l'utilisateur authentifié
Route::middleware('auth:sanctum')->get('/user', function (Request $request) { 
    return $request->user();
});
// Route pour rediriger vers le fournisseur OAuth
Route::get('/auth/{provider}', [AuthController::class, 'redirectToProvider']); // Route pour rediriger vers le fournisseur OAuth
Route::get('/auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']); // Route pour gérer le callback OAuth


