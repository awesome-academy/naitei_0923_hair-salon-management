<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules;

class StoreUserRequest extends FormRequest
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
            'first_name' => 'string|required|max:255',
            'last_name' => 'string|required|max:255',
            'email' => 'email|required|unique:users,email|max:255',
            'phone' => 'string|required|unique:users,phone|max:30',
            'password' => ['required', Rules\Password::defaults()],
            'salon_role' => 'numeric|required|exists:salon_roles,id',
            'is_active' => 'numeric|required',
        ];
    }
}
