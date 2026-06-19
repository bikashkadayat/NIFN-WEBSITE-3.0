<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreDownloadRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'category_id'              => ['nullable', 'uuid', 'exists:download_categories,id'],
            'file'                     => ['required', 'file', 'max:51200'],
            'thumbnail_id'             => ['nullable', 'uuid', 'exists:media,id'],
            'sort_order'               => ['nullable', 'integer', 'min:0'],
            'is_active'                => ['boolean'],
            'translations'             => ['required', 'array'],
            'translations.*.locale'    => ['required', 'string', 'size:2'],
            'translations.*.title'     => ['required', 'string', 'max:255'],
            'translations.*.description' => ['nullable', 'string'],
        ];
    }
}
