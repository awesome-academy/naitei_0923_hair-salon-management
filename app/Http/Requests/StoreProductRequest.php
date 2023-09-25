<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'string|required|max:255',
            'unit' => 'string|required|max:30',
            'cost' => 'numeric|required',
            'quantity' => 'numeric|required',
            'description' => 'string|required|max:500',
            'category' => 'numeric|required|exists:categories,id',
            'is_active' => 'numeric|required',
        ];
    }
}
