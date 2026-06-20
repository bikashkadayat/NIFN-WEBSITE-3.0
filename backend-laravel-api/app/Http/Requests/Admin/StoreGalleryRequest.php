<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreGalleryRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'cover_image_id'           => ['nullable', 'uuid', 'exists:media,id'],
            'is_published'             => ['boolean'],
            'sort_order'               => ['nullable', 'integer', 'min:0'],
            'event_date'               => ['nullable', 'date'],
            'translations'             => ['required', 'array'],
            'slug'                     => ['nullable', 'string', 'max:255'],
            'translations.*.locale'    => ['required', 'string', 'size:2'],
            'translations.*.title'     => ['nullable', 'string', 'max:255'],
            'translations.*.slug'      => ['nullable', 'string', 'max:255'],
            'translations.*.description' => ['nullable', 'string'],
        ];
    }
}
