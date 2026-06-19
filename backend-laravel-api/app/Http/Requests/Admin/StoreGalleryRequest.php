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
            'translations.*.locale'    => ['required', 'string', 'size:2'],
            'translations.*.title'     => ['required', 'string', 'max:255'],
            'translations.*.slug'      => ['required', 'string', 'max:255'],
            'translations.*.description' => ['nullable', 'string'],
        ];
    }
}
