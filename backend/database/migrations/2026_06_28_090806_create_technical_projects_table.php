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
        Schema::create('technical_projects', static function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('title');
            $table->string('title_en')->nullable();
            $table->text('description')->nullable();
            $table->text('description_en');
            $table->string('status')->nullable();
            $table->string('status_en');
            $table->string('link_label')->nullable();
            $table->string('link_label_en');
            $table->string('link_url')->nullable();
            $table->string('category')->nullable();
            $table->json('technologies')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('technical_projects');
    }
};
