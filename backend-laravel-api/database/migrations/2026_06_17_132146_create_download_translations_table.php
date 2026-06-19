<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('download_translations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('download_id')->constrained('downloads')->cascadeOnDelete();
            $table->string('locale', 2);
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('download_translations');
    }
};
