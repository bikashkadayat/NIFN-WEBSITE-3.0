<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('developer_page_translations');

        Schema::create('developer_page_translations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('page_id')->constrained('developer_pages')->cascadeOnDelete();
            $table->string('locale', 2);
            $table->string('title');
            $table->string('slug')->nullable();
            $table->text('body')->nullable();
            $table->text('excerpt')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description')->nullable();
            $table->string('seo_keywords')->nullable();
            $table->unique(['page_id', 'locale']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('developer_page_translations');
    }
};
