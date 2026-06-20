<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNewsRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'category_id'              => ['nullable', 'uuid', 'exists:news_categories,id'],
            'featured_image_id'        => ['nullable', 'uuid', 'exists:media,id'],
            'is_published'             => ['boolean'],
            'is_featured'              => ['boolean'],
            'is_breaking'              => ['boolean'],
            'published_at'             => ['nullable', 'date'],
            'tag_ids'                  => ['nullable', 'array'],
            'tag_ids.*'                => ['uuid', 'exists:tags,id'],
            'translations'             => ['sometimes', 'array'],
            'translations.*.locale'    => ['required_with:translations', 'string', 'size:2'],
            'translations.*.title'     => ['required_with:translations', 'string', 'max:255'],
            'translations.*.slug'      => ['nullable', 'string', 'max:255'],
            'translations.*.excerpt'   => ['nullable', 'string'],
            'translations.*.body'      => ['nullable', 'string'],
            'translations.*.seo_title' => ['nullable', 'string', 'max:255'],
            'translations.*.seo_description' => ['nullable', 'string'],
            'translations.*.seo_keywords'    => ['nullable', 'string'],
        ];
    }
}
