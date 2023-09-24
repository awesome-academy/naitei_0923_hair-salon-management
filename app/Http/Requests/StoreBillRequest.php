<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreBillRequest extends FormRequest
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
            'total' => 'numeric|min:0|max:1000000000',
            'payment_method' => 'in:CARD,BANK-TRANSFER,CASH',
            'cash_money' => 'numeric|min:0|max:1000000000|gte:total',
            'change_money' => 'numeric|min:0|max:1000000000',
        ];
    }
}
