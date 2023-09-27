import React from 'react';
import Button from '@/Components/Button';
import Guest from '@/Layouts/Guest';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import { useLang } from "@/Context/LangContext";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm();
    const { lang } = useLang();

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <Guest>
            <Head title={lang.get('strings.Email-Verification')} />

            <div className="mb-4 text-sm text-gray-600">
                {lang.get('strings.Verify-Email-Description')}
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {lang.get('strings.Sent-Verification-Email-Description')}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <Button processing={processing}>{lang.get('strings.Resend-Verification-Email')}</Button>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="underline text-sm text-gray-600 hover:text-gray-900"
                    >
                        {lang.get('strings.Logout')}
                    </Link>
                </div>
            </form>
        </Guest>
    );
}
