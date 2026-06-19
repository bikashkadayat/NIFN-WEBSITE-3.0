<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tag_translations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tag_id')->constrained('tags')->cascadeOnDelete();
            $table->string('locale', 2);
            $table->string('name');
            $table->string('slug');
            $table->unique(['slug', 'locale']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tag_translations');
    }
};
