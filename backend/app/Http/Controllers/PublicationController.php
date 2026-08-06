<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicationController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(\App\Models\Publication::orderBy('created_at', 'desc')->get());
    }

    public function create(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'category_en' => 'required|string|max:255',
            'read_time' => 'required|string',
            'read_time_en' => 'required|string',
            'summary' => 'required|string',
            'summary_en' => 'required|string',
            'content' => 'required|string',
            'content_en' => 'required|string',
            'tags' => 'nullable|array',
        ]);

        $project = \App\Models\Publication::create($validatedData);

        return response()->json($project, 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'category_en' => 'required|string|max:255',
            'read_time' => 'required|string',
            'read_time_en' => 'required|string',
            'summary' => 'required|string',
            'summary_en' => 'required|string',
            'content' => 'required|string',
            'content_en' => 'required|string',
            'tags' => 'nullable|array',
        ]);

        $project = \App\Models\Publication::findOrFail($id);
        $project->update($validatedData);

        return response()->json($project, 200);
    }

    public function delete($id): JsonResponse
    {
        $project = \App\Models\Publication::findOrFail($id);
        $project->delete();

        return response()->json(null, 204);
    }
}
