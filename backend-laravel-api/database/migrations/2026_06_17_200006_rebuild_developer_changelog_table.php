<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('developer_changelog_translations');
        Schema::dropIfExists('developer_changelog');

        Schema::create('developer_changelog', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('version')->unique();
            $table->date('release_date');
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('developer_changelog');
    }
};
