<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreDownloadRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        // Frontend sends translations as a JSON string inside FormData
        if (is_string($this->input('translations'))) {
            $decoded = json_decode($this->input('translations'), true);
            if (is_array($decoded)) {
                $this->merge(['translations' => $decoded]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'category_id'                => ['nullable', 'uuid', 'exists:download_categories,id'],
            'file'                       => ['required', 'file', 'max:51200'],
            'thumbnail_id'               => ['nullable', 'uuid', 'exists:media,id'],
            'sort_order'                 => ['nullable', 'integer', 'min:0'],
            'is_active'                  => ['boolean'],
            'translations'               => ['required', 'array'],
            'translations.*.locale'      => ['required', 'string', 'size:2'],
            'translations.*.title'       => ['nullable', 'string', 'max:255'],
            'translations.*.description' => ['nullable', 'string'],
        ];
    }
}
