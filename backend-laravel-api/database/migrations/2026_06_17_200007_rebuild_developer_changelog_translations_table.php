<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('developer_changelog_translations');

        Schema::create('developer_changelog_translations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('changelog_id')->constrained('developer_changelog')->cascadeOnDelete();
            $table->string('locale', 2);
            $table->string('title');
            $table->text('body')->nullable();
            $table->unique(['changelog_id', 'locale']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('developer_changelog_translations');
    }
};
