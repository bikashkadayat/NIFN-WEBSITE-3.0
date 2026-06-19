<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreBannerRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'image_id'                         => ['nullable', 'uuid', 'exists:media,id'],
            'text_alignment'                   => ['nullable', 'in:left,center,right'],
            'overlay_opacity'                  => ['nullable', 'integer', 'min:0', 'max:100'],
            'primary_button_link'              => ['nullable', 'string', 'max:500'],
            'secondary_button_link'            => ['nullable', 'string', 'max:500'],
            'sort_order'                       => ['nullable', 'integer', 'min:0'],
            'is_active'                        => ['boolean'],
            'translations'                     => ['required', 'array'],
            'translations.*.locale'            => ['required', 'string', 'size:2'],
            'translations.*.title'             => ['nullable', 'string', 'max:255'],
            'translations.*.subtitle'          => ['nullable', 'string', 'max:500'],
            'translations.*.primary_button_text'   => ['nullable', 'string', 'max:100'],
            'translations.*.secondary_button_text' => ['nullable', 'string', 'max:100'],
        ];
    }
}
