<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(\App\Models\Technical_projects::orderBy('created_at', 'desc')->get());
    }

    public function create(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'title' => 'required|string',
            'title_en' => 'required|string',
            'description' => 'required|string',
            'description_en' => 'required|string',
            'status' => 'required|string',
            'status_en' => 'required|string',
            'technologies' => 'nullable|array',
            'link_label' => 'required|string',
            'link_label_en' => 'required|string',
            'link_url' => 'required|string',
            'category' => 'required|string',
        ]);

        $project = \App\Models\Technical_projects::create($validatedData);

        return response()->json($project, 201);
    }

     public function update(Request $request, $id): JsonResponse
    {
        $validatedData = $request->validate([
            'title' => 'required|string',
            'title_en' => 'required|string',
            'description' => 'required|string',
            'description_en' => 'required|string',
            'status' => 'required|string',
            'status_en' => 'required|string',
            'technologies' => 'nullable|array',
            'link_label' => 'required|string',
            'link_label_en' => 'required|string',
            'link_url' => 'required|string',
            'category' => 'required|string',
        ]);

        $project = \App\Models\Technical_projects::findOrFail($id);
        $project->update($validatedData);

        return response()->json($project, 200);
    }

    public function delete($id): JsonResponse
    {
        $project = \App\Models\Technical_projects::findOrFail($id);
        $project->delete();

        return response()->json(null, 204);
    }
}
