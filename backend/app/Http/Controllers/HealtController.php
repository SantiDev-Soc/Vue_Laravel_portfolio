<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealtController extends Controller
{
    public function check(): JsonResponse
    {
        try {
            DB::connection()->getPdo();
            $databaseStatus = 'connected';
        } catch (\Exception $e) {
            $databaseStatus = 'disconnected';
        }

        return response()->json([
            'status' => 'connected',
            'database' => $databaseStatus,
            'timestamp' => now()->toIso8601String(),
            'app' => 'Santi Portfolio Engine API v1.0'
        ], 200);
    }
}
