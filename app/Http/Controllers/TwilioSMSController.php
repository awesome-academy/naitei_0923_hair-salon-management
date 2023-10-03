<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Twilio\Rest\Client;

class TwilioSMSController extends Controller
{
    public function index()
    {
        $sid = getenv("TWILIO_SID");
        $token = getenv("TWILIO_TOKEN");
        $twilio = new Client($sid, $token);

        $verification = $twilio->verify->v2->services("VA1b205eb22b870ef00da6060e37e3f686")
            ->verifications
            ->create("+15625394625", "sms");
    }
}
