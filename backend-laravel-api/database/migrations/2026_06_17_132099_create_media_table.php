<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('original_name');
            $table->string('file_path');
            $table->string('mime_type');
            $table->string('disk')->default('public');
            $table->unsignedInteger('original_width')->nullable();
            $table->unsignedInteger('original_height')->nullable();
            $table->unsignedBigInteger('file_size')->default(0);
            $table->string('alt_text')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
