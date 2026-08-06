<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CertificationController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(\App\Models\Certification::orderBy('created_at', 'desc')->get());
    }

    public function create(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'date' => 'required|date',
            'status' => 'required|string|max:50',
            'verification_link' => 'nullable|url|max:255',
            'description' => 'nullable|string|max:5000',
            'description_en' => 'nullable|string|max:5000',
        ]);

        $certification = \App\Models\Certification::create($validatedData);

        return response()->json($certification, 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $certification = \App\Models\Certification::findOrFail($id);

        if (!$certification) {
            return response()->json(['message' => 'Certification not found.'], 404);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'date' => 'required|string|max:100',
            'status' => 'required|string|max:50',
            'verification_link' => 'nullable|url|max:255',
            'description' => 'nullable|string|max:5000',
            'description_en' => 'nullable|string|max:5000',
        ]);

        $certification->update($validatedData);

        return response()->json(['message' => 'Certification updated successfully.'], 200);
    }

    public function delete($id): JsonResponse
    {
        $certification = \App\Models\Certification::findOrFail($id);

        if (!$certification) {
            return response()->json(['message' => 'Certification not found.'], 404);
        }

        $certification->delete();

        return response()->json(['message' => 'Certification deleted successfully.'], 200);
    }

}
