<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('image_id')->nullable()->constrained('media')->nullOnDelete();
            $table->string('text_alignment')->default('center');
            $table->unsignedInteger('overlay_opacity')->default(50);
            $table->string('primary_button_link')->nullable();
            $table->string('secondary_button_link')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
