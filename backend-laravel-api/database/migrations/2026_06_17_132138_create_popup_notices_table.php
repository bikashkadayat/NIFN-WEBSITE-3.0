<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('popup_notices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('image_id')->nullable()->constrained('media')->nullOnDelete();
            $table->string('type')->default('info');
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->string('display_frequency')->default('once_session');
            $table->string('button_link')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('popup_notices');
    }
};
