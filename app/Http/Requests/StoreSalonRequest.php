<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreSalonRequest extends FormRequest
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
            'email' => 'email|required|unique:users,email|max:255',
            'phone' => 'string|required|unique:users,phone|max:30',
            'password' => 'string|required',
            'salon_name' => 'string|required|max:255',
            'first_name' => 'string|required|max:255',
            'last_name' => 'string|required|max:255',
            'address' => 'string|required|max:255',
            'package_id' => 'numeric|required|exists:packages,id',
        ];
    }
}
