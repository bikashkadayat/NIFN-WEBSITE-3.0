<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('news_category_translations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('category_id')->constrained('news_categories')->cascadeOnDelete();
            $table->string('locale', 2);
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->unique(['slug', 'locale']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news_category_translations');
    }
};
