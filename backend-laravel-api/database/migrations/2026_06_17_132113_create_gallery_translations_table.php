<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_translations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('gallery_id')->constrained('galleries')->cascadeOnDelete();
            $table->string('locale', 2);
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->unique(['slug', 'locale']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_translations');
    }
};
