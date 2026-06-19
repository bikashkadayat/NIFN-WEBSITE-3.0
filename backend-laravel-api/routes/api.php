<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BannerController;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\V1\ContentController;
use App\Http\Controllers\Api\V1\DeveloperPortalController;
use App\Http\Controllers\Api\V1\DeveloperRegistrationController;
use App\Http\Controllers\Api\V1\DownloadController;
use App\Http\Controllers\Api\V1\GalleryController;
use App\Http\Controllers\Api\V1\MenuController;
use App\Http\Controllers\Api\V1\NewsCategoryController;
use App\Http\Controllers\Api\V1\NewsController;
use App\Http\Controllers\Api\V1\NewsletterController;
use App\Http\Controllers\Api\V1\PopupNoticeController;
use App\Http\Controllers\Api\V1\SearchController;
use App\Http\Controllers\Api\V1\SettingController;
use App\Http\Controllers\Api\V1\SitemapController;
use App\Http\Controllers\Api\V1\Admin;
use Illuminate\Support\Facades\Route;

// ─── Auth ────────────────────────────────────────────────────────────────────
Route::prefix('v1/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// ─── Public v1 ───────────────────────────────────────────────────────────────
Route::prefix('v1')->group(function () {

    // Banners
    Route::get('/banners', [BannerController::class, 'index']);

    // News — categories BEFORE /{slug}
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/categories', [NewsCategoryController::class, 'index']);
    Route::get('/news/{slug}', [NewsController::class, 'show'])->name('api.news.show');

    // Galleries
    Route::get('/galleries', [GalleryController::class, 'index']);
    Route::get('/galleries/{slug}', [GalleryController::class, 'show']);

    // Content
    Route::get('/content/{slug}', [ContentController::class, 'show']);

    // Menus
    Route::get('/menus/{location}', [MenuController::class, 'show']);

    // Settings — public BEFORE /{key}
    Route::get('/settings/public', [SettingController::class, 'public']);

    // Popup notices — active BEFORE /{id}
    Route::get('/popup-notices/active', [PopupNoticeController::class, 'active']);

    // Downloads
    Route::get('/downloads', [DownloadController::class, 'index']);
    Route::get('/downloads/{id}/file', [DownloadController::class, 'file']);

    // Search
    Route::get('/search', [SearchController::class, 'index']);

    // Contact
    Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:contact');

    // Newsletter
    Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);
    Route::get('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe']);

    // Developer registrations
    Route::post('/developer-registrations', [DeveloperRegistrationController::class, 'store'])->middleware('throttle:5,1');
    Route::post('/developer/register', [DeveloperRegistrationController::class, 'store'])->middleware('throttle:5,1');

    // Sitemap
    Route::get('/sitemap/news', [SitemapController::class, 'news']);
    Route::get('/sitemap/galleries', [SitemapController::class, 'galleries']);

    // ─── Developer Portal (public) ────────────────────────────────────────
    Route::prefix('developer')->group(function () {
        Route::get('/navigation', [DeveloperPortalController::class, 'navigation']);
        Route::get('/pages', [DeveloperPortalController::class, 'pages']);
        Route::get('/pages/{slug}', [DeveloperPortalController::class, 'page']);
        Route::get('/sdks', [DeveloperPortalController::class, 'sdks']);
        Route::get('/changelog', [DeveloperPortalController::class, 'changelog']);
        Route::get('/settings', [DeveloperPortalController::class, 'settings']);
        Route::post('/register', [DeveloperPortalController::class, 'register']);
    });
});

// ─── Admin (authenticated) ───────────────────────────────────────────────────
Route::prefix('v1/admin')->middleware('auth:sanctum')->group(function () {

    // Content
    Route::apiResource('contents', Admin\ContentController::class);

    // News
    Route::apiResource('news', Admin\NewsController::class);

    // News categories & tags
    Route::apiResource('news-categories', Admin\NewsCategoryController::class);
    Route::apiResource('tags', Admin\TagController::class);

    // Galleries
    Route::apiResource('galleries', Admin\GalleryController::class);
    Route::get('galleries/{gallery}/images', [Admin\GalleryImageController::class, 'index']);
    Route::post('galleries/{gallery}/images', [Admin\GalleryImageController::class, 'store']);
    Route::post('galleries/{gallery}/images/reorder', [Admin\GalleryImageController::class, 'reorder']);
    Route::delete('galleries/{gallery}/images/{image}', [Admin\GalleryImageController::class, 'destroy']);

    // Banners
    Route::apiResource('banners', Admin\BannerController::class);

    // Downloads
    Route::apiResource('downloads', Admin\DownloadController::class);
    Route::apiResource('download-categories', Admin\DownloadCategoryController::class);
    Route::apiResource('content-categories', Admin\ContentCategoryController::class);

    // Popup notices
    Route::apiResource('popup-notices', Admin\PopupNoticeController::class);

    // Menus
    Route::apiResource('menus', Admin\MenuController::class);
    Route::get('menus/{menu}/items', [Admin\MenuItemController::class, 'index']);
    Route::post('menus/{menu}/items', [Admin\MenuItemController::class, 'store']);
    Route::post('menus/{menu}/items/reorder', [Admin\MenuItemController::class, 'reorder']);
    Route::put('menus/{menu}/items/{item}', [Admin\MenuItemController::class, 'update']);
    Route::delete('menus/{menu}/items/{item}', [Admin\MenuItemController::class, 'destroy']);

    // Settings
    Route::get('settings', [Admin\SettingController::class, 'index']);
    Route::post('settings/batch', [Admin\SettingController::class, 'batchUpdate']);
    Route::put('settings/{key}', [Admin\SettingController::class, 'update']);

    // Users
    Route::apiResource('users', Admin\UserController::class);

    // Media
    Route::get('media', [Admin\MediaController::class, 'index']);
    Route::post('media', [Admin\MediaController::class, 'store']);
    Route::get('media/{media}', [Admin\MediaController::class, 'show']);
    Route::put('media/{media}', [Admin\MediaController::class, 'update']);
    Route::delete('media/{media}', [Admin\MediaController::class, 'destroy']);

    // Contact submissions
    Route::get('contact-submissions', [Admin\ContactSubmissionController::class, 'index']);
    Route::get('contact-submissions/{id}', [Admin\ContactSubmissionController::class, 'show']);
    Route::post('contact-submissions/{id}/mark-read', [Admin\ContactSubmissionController::class, 'markRead']);
    Route::delete('contact-submissions/{id}', [Admin\ContactSubmissionController::class, 'destroy']);

    // Newsletter subscribers
    Route::get('newsletter-subscribers', [Admin\NewsletterSubscriberController::class, 'index']);
    Route::get('newsletter-subscribers/export', [Admin\NewsletterSubscriberController::class, 'export']);
    Route::post('newsletter-subscribers/{id}/unsubscribe', [Admin\NewsletterSubscriberController::class, 'unsubscribe']);
    Route::delete('newsletter-subscribers/{id}', [Admin\NewsletterSubscriberController::class, 'destroy']);

    // Developer registrations
    Route::get('developer-registrations/unread-count', [Admin\DeveloperRegistrationController::class, 'unreadCount']);
    Route::apiResource('developer-registrations', Admin\DeveloperRegistrationController::class);
    Route::post('developer-registrations/{id}/mark-read', [Admin\DeveloperRegistrationController::class, 'markRead']);
    Route::post('developer-registrations/{id}/mark-reviewed', [Admin\DeveloperRegistrationController::class, 'markReviewed']);
    Route::post('developer-registrations/{id}/status', [Admin\DeveloperRegistrationController::class, 'updateStatus']);

    // Activity logs (read-only)
    Route::get('activity-logs', [Admin\ActivityLogController::class, 'index']);
    Route::get('activity-logs/{id}', [Admin\ActivityLogController::class, 'show']);

    // Dashboard stats
    Route::get('dashboard/stats', function () {
        $stats = [
            'total_contents'     => \App\Models\Content::count(),
            'total_news'         => \App\Models\News::where('is_published', true)->count(),
            'total_users'        => \App\Models\User::count(),
            'total_media'        => \DB::table('media')->count(),
            'total_downloads'    => \DB::table('downloads')->count(),
            'total_contacts'     => \DB::table('contact_submissions')->count(),
            'total_galleries'    => \DB::table('galleries')->count(),
            'total_subscribers'  => \DB::table('newsletter_subscribers')->where('is_active', true)->count(),
            'unread_contacts'    => \DB::table('contact_submissions')->where('is_read', false)->count(),
            'recent_activities' => \DB::table('activity_logs')
                ->leftJoin('users', 'activity_logs.user_id', '=', 'users.id')
                ->orderBy('activity_logs.created_at', 'desc')
                ->limit(10)
                ->select('activity_logs.*', 'users.name as user_name')
                ->get()
                ->map(fn($a) => [
                    'id'           => $a->id,
                    'user_name'    => $a->user_name ?? 'System',
                    'action'       => $a->action ?? 'updated',
                    'subject_type' => $a->model_type ?? '',
                    'description'  => $a->description ?? '',
                    'created_at'   => $a->created_at,
                ]),
        ];
        return response()->json(['data' => $stats]);
    });

    // Reports stats
    Route::get('reports/stats', function () {
        return response()->json(['data' => [
            'total_contents'  => \App\Models\Content::count(),
            'total_news'      => \App\Models\News::count(),
            'total_users'     => \App\Models\User::count(),
            'total_downloads' => \DB::table('downloads')->count(),
            'total_contacts'  => \DB::table('contact_submissions')->count(),
            'total_galleries' => \DB::table('galleries')->count(),
        ]]);
    });

    // Notifications
    Route::get('notifications', function () {
        return response()->json(['data' => []]);
    });
});

// ─── Health check ─────────────────────────────────────────────────────────────
Route::get('/health', function () {
    return response()->json([
        'status'    => 'ok',
        'timestamp' => now()->toISOString(),
        'version'   => '1.0.0',
    ]);
});
