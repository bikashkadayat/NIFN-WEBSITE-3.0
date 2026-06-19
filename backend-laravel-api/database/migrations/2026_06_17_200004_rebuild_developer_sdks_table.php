<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('developer_sdk_translations');
        Schema::dropIfExists('developer_sdks');

        Schema::create('developer_sdks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('language');
            $table->string('package_name')->nullable();
            $table->string('status')->default('stable');
            $table->string('maintainer')->nullable();
            $table->string('license')->nullable();
            $table->string('runtime')->nullable();
            $table->string('documentation_url')->nullable();
            $table->string('github_url')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('developer_sdks');
    }
};
