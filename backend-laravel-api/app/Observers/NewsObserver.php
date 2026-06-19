<?php

namespace App\Observers;

use App\Models\ActivityLog;
use App\Models\News;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class NewsObserver
{
    public function created(News $news): void
    {
        $this->log('created', $news);
    }

    public function updated(News $news): void
    {
        $this->log('updated', $news, $news->getDirty());
    }

    public function deleted(News $news): void
    {
        $this->log('deleted', $news);
    }

    private function log(string $action, News $news, array $changes = []): void
    {
        try {
            ActivityLog::create([
                'user_id'    => Auth::id(),
                'action'     => $action,
                'model_type' => News::class,
                'model_id'   => $news->id,
                'changes'    => empty($changes) ? null : $changes,
                'ip_address' => Request::ip(),
                'user_agent' => Request::userAgent(),
            ]);
        } catch (\Throwable) {
        }
    }
}
