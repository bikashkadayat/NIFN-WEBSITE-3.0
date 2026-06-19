<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('developer_sdk_translations');

        Schema::create('developer_sdk_translations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('sdk_id')->constrained('developer_sdks')->cascadeOnDelete();
            $table->string('locale', 2);
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('installation_code')->nullable();
            $table->text('usage_code')->nullable();
            $table->unique(['sdk_id', 'locale']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('developer_sdk_translations');
    }
};
