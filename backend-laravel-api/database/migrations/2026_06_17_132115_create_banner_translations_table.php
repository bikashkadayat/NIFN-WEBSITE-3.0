<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banner_translations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('banner_id')->constrained('banners')->cascadeOnDelete();
            $table->string('locale', 2);
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('primary_button_text')->nullable();
            $table->string('secondary_button_text')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banner_translations');
    }
};
