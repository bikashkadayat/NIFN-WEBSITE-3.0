<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Rename old column names to the correct ones, add missing columns.
        // Uses raw SQL for column renames (most reliable across DB drivers).

        if (Schema::hasColumn('developer_registrations', 'name') && ! Schema::hasColumn('developer_registrations', 'contact_name')) {
            DB::statement('ALTER TABLE developer_registrations RENAME COLUMN "name" TO contact_name');
        }

        if (Schema::hasColumn('developer_registrations', 'organization') && ! Schema::hasColumn('developer_registrations', 'organization_name')) {
            DB::statement('ALTER TABLE developer_registrations RENAME COLUMN organization TO organization_name');
        }

        if (Schema::hasColumn('developer_registrations', 'institution_type') && ! Schema::hasColumn('developer_registrations', 'organization_type')) {
            DB::statement('ALTER TABLE developer_registrations RENAME COLUMN institution_type TO organization_type');
        }

        if (Schema::hasColumn('developer_registrations', 'message') && ! Schema::hasColumn('developer_registrations', 'use_case')) {
            DB::statement('ALTER TABLE developer_registrations RENAME COLUMN message TO use_case');
        }

        Schema::table('developer_registrations', function (Blueprint $table) {
            if (! Schema::hasColumn('developer_registrations', 'admin_notes')) {
                $table->text('admin_notes')->nullable()->after('status');
            }
            if (! Schema::hasColumn('developer_registrations', 'sandbox_credentials')) {
                $table->text('sandbox_credentials')->nullable()->after('admin_notes');
            }
            if (! Schema::hasColumn('developer_registrations', 'is_read')) {
                $table->boolean('is_read')->default(false)->after('sandbox_credentials');
            }
            if (! Schema::hasColumn('developer_registrations', 'read_at')) {
                $table->timestamp('read_at')->nullable()->after('is_read');
            }
            if (! Schema::hasColumn('developer_registrations', 'credentials_sent_at')) {
                $table->timestamp('credentials_sent_at')->nullable()->after('read_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('developer_registrations', function (Blueprint $table) {
            $table->dropColumnIfExists('admin_notes');
            $table->dropColumnIfExists('sandbox_credentials');
            $table->dropColumnIfExists('is_read');
            $table->dropColumnIfExists('read_at');
            $table->dropColumnIfExists('credentials_sent_at');
        });

        if (Schema::hasColumn('developer_registrations', 'contact_name')) {
            DB::statement('ALTER TABLE developer_registrations RENAME COLUMN contact_name TO "name"');
        }
        if (Schema::hasColumn('developer_registrations', 'organization_name')) {
            DB::statement('ALTER TABLE developer_registrations RENAME COLUMN organization_name TO organization');
        }
        if (Schema::hasColumn('developer_registrations', 'organization_type')) {
            DB::statement('ALTER TABLE developer_registrations RENAME COLUMN organization_type TO institution_type');
        }
        if (Schema::hasColumn('developer_registrations', 'use_case')) {
            DB::statement('ALTER TABLE developer_registrations RENAME COLUMN use_case TO message');
        }
    }
};
