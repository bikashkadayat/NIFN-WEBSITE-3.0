<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreContentRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'slug'                     => ['required', 'string', 'unique:contents,slug'],
            'portal_type'              => ['nullable', 'string', 'in:website,developer,admin'],
            'featured_image_id'        => ['nullable', 'uuid', 'exists:media,id'],
            'is_published'             => ['boolean'],
            'sort_order'               => ['nullable', 'integer', 'min:0'],
            'translations'             => ['required', 'array'],
            'translations.*.locale'    => ['required', 'string', 'size:2'],
            'translations.*.title'     => ['required', 'string', 'max:255'],
            'translations.*.body'      => ['nullable', 'string'],
            'translations.*.excerpt'   => ['nullable', 'string'],
            'translations.*.seo_title' => ['nullable', 'string', 'max:255'],
            'translations.*.seo_description' => ['nullable', 'string'],
            'translations.*.seo_keywords'    => ['nullable', 'string'],
        ];
    }
}
