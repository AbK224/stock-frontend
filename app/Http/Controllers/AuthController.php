<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

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
            return response()->json(['message' => "Mot de passe ou nom d'utilsateur incorrect"], 401);
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
    
    /* // Redirection vers le fournisseur OAuth (google, facebook, linkedin)
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider) ->redirect();
    }
    // Gestion du callback du fournisseur OAuth
    public function handleProviderCallback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Authentication failed'], 401);
        }
        // Vérifiez si l'utilisateur existe déjà
        $user = User::where('email', $socialUser->getEmail())->first();
        if (!$user) {
            // Si l'utilisateur n'existe pas, créez-en un nouveau
            $user = User::create([
                'name' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                'password' => Hash::make(uniqid()), // Génère un mot de passe aléatoire
            ]); 
        }
        // Créez un token pour l'utilisateur
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }      
            */
}    