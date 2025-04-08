<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSongRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return !is_null(auth()->user());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'spotify_id' => ['required','string'],
            'title' => ['required','string'],
            'artist_id' => ['required','string'],
            'genre_id' => ['required','string'],
            'year' => ['required','integer'],
            'duration' => ['required','integer'],
            'cover_url' => ['required','string'],
            'album_id' => ['required','string'],
        ];
    }
}
