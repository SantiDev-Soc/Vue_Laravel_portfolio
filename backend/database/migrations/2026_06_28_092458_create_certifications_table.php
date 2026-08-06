<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('certifications', static function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('title');
            $table->string('title_en');
            $table->string('issuer');
            $table->date('date');
            $table->string('status');
            $table->string('verification_link')->nullable();
            $table->text('description');
            $table->text('description_en')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certifications');
    }
};
