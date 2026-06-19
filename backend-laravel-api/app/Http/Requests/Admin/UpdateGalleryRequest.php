<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGalleryRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'cover_image_id'           => ['nullable', 'uuid', 'exists:media,id'],
            'is_published'             => ['boolean'],
            'sort_order'               => ['nullable', 'integer', 'min:0'],
            'event_date'               => ['nullable', 'date'],
            'translations'             => ['sometimes', 'array'],
            'translations.*.locale'    => ['required_with:translations', 'string', 'size:2'],
            'translations.*.title'     => ['required_with:translations', 'string', 'max:255'],
            'translations.*.slug'      => ['required_with:translations', 'string', 'max:255'],
            'translations.*.description' => ['nullable', 'string'],
        ];
    }
}
