<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('popup_notice_translations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('popup_notice_id')->constrained('popup_notices')->cascadeOnDelete();
            $table->string('locale', 2);
            $table->string('title')->nullable();
            $table->text('body')->nullable();
            $table->string('button_text')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('popup_notice_translations');
    }
};
