<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Inscription
    public function register(Request $request)
    {
        $request -> validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users', // Assurez-vous que l'email est unique
            'password' => 'required|string|min:8|confirmed', // Le mot de passe doit être confirmé
        ]);
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        // Créez un token pour l'utilisateur
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'user' => $user,
            'access_token' => $token,
        ], 201);
    }
    // Connexion
    public function login(Request $request)
    {
        $request -> validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        if (!Auth::attempt($request->only('email', 'password'))) { // si les informations d'identification sont incorrectes
            return response()->json(['message' => 'Invalid login details'], 401);
        }
        $user = User::where('email', $request->email)->firstOrFail(); // Récupère l'utilisateur par email
        // Créez un token pour l'utilisateur
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'access_token' => $token,// Correction ici
            'token_type' => 'Bearer',// Ajouté pour spécifier le type de token
        ]);

        }
    // Déconnexion
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete(); // Supprime le token actuel
        return response()->json(['message' => 'Successfully logged out']);
    }    
}    