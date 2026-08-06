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
        Schema::create('publications', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('title');
            $table->string('title_en')->nullable();
            $table->string('category');
            $table->string('category_en')->nullable();
            $table->string('read_time');
            $table->string('read_time_en')->nullable();
            $table->text('summary');
            $table->text('summary_en')->nullable();
            $table->text('content');
            $table->text('content_en')->nullable();
            $table->json('tags')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};
