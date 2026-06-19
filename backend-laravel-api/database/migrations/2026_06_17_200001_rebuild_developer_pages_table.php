<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('developer_page_translations');
        Schema::dropIfExists('developer_pages');

        Schema::create('developer_pages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('parent_id')->nullable();
            $table->string('category')->nullable();
            $table->string('icon')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });

        Schema::table('developer_pages', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('developer_pages')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('developer_pages');
    }
};
