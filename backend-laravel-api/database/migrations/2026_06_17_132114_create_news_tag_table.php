<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('news_tag', function (Blueprint $table) {
            $table->foreignUuid('news_id')->constrained('news')->cascadeOnDelete();
            $table->foreignUuid('tag_id')->constrained('tags')->cascadeOnDelete();
            $table->primary(['news_id', 'tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news_tag');
    }
};
