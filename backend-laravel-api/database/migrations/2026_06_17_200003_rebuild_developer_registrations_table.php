<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('developer_registrations');

        Schema::create('developer_registrations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('contact_name');
            $table->string('email');
            $table->string('organization_name')->nullable();
            $table->string('organization_type');
            $table->text('use_case')->nullable();
            $table->enum('status', ['pending', 'reviewing', 'approved', 'rejected', 'contacted'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->string('sandbox_credentials')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamp('credentials_sent_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('is_read');
            $table->index('email');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('developer_registrations');
    }
};
