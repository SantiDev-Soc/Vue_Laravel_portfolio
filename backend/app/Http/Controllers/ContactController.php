<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(\App\Models\Contact::orderBy('created_at', 'desc')->get());
    }

    public function create(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $contact = new \App\Models\Contact();
        $contact->name = $request->input('name');
        $contact->email = $request->input('email');
        $contact->subject = $request->input('subject');
        $contact->message = $request->input('message');
        $contact->save();

        return response()->json(['message' => 'Contact form submitted successfully.'], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $contact = \App\Models\Contact::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $contact->update($request->all());
        return response()->json(['message' => 'Contact updated successfully.'], 200);
    }

    public function delete(string $id): JsonResponse
    {
        $contact = \App\Models\Contact::findOrFail($id);

        if (!$contact) {
            return response()->json(['message' => 'Message not found.'], 404);
        }

        $contact->delete();
        return response()->json(['message' => 'Message deleted successfully.'], 200);
    }
}
