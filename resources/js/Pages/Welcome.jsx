import React, { useState } from 'react';
import { Link, Head } from '@inertiajs/inertia-react';
import { LangProvider, useLang } from '../Context/LangContext';
import { Select } from 'antd';
import { Inertia } from "@inertiajs/inertia";

export default function Welcome(props) {
    const { lang, changeLocale } = useLang();
    const [selectedLocale, setSelectedLocale] = useState(lang.getLocale());

    const handleLocaleChange = (value) => {
        localStorage.removeItem("locale");
        localStorage.setItem("locale", value);

        setSelectedLocale(value);
        changeLocale(value);

        Inertia.get(route('locale', { lang: value } ));
    };
    return (
        <>
            <Head title="Welcome" />
            <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">

                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="text-center justify-center pt-8 sm:justify-start sm:pt-0">
                        <p className="text-4xl text-black dark:text-slate-50">{lang.get('strings.Welcome')}</p>
                    </div>

                    <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow sm:rounded-lg">
                        {props.auth.user ? (
                            <div className="w-full p-6 border-t border-gray-200 dark:border-gray-700 md:border-t-0 md:border-l">
                                <div className="text-center">
                                    <div className="ml-4 text-2xl leading-7 font-semibold">
                                        <a
                                            href={route('dashboard')}
                                            className="underline text-gray-900 dark:text-white"
                                        >
                                            {lang.get('strings.View-My-Dashboard')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="p-6 border-t border-gray-200 dark:border-gray-700 md:border-t-0 md:border-l">
                                    <div className="text-center">
                                        <div className="ml-4 text-2xl leading-7 font-semibold">
                                            <a
                                                href={route('login')}
                                                className="underline text-gray-900 dark:text-white"
                                            >
                                                {lang.get('strings.Login')}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="ml-12">
                                        <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                                            {lang.get('strings.Login-Description')}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="text-center">
                                        <div className="ml-4 text-2xl leading-7 font-semibold">
                                            <a
                                                href={route('register')}
                                                className="underline text-gray-900 dark:text-white"
                                            >
                                                {lang.get('strings.Register')}

                                            </a>
                                        </div>
                                    </div>

                                    <div className="ml-12">
                                        <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                                            {lang.get('strings.Register-Description')}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mt-4 sm:items-center sm:justify-between">
                        <div className="text-center text-sm text-gray-500 sm:text-left">
                            <div className="flex items-center">
                                <svg
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="-mt-px w-5 h-5 text-gray-400"
                                >
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>

                                <a href="https://laravel.bigcartel.com" className="ml-1 underline">
                                    {lang.get('strings.Shop')}
                                </a>
                            </div>
                        </div>

                        <div className="ml-4 text-center text-sm text-gray-500 sm:text-right sm:ml-0">
                            {lang.get('strings.Powered-by-Hedspi-Team')}
                        </div>
                    </div>
                </div>
                <footer className="bg-white shadow dark:bg-gray-200 fixed bottom-0 left-0 z-20 w-full">
                        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                                <Select
                                    defaultValue="English"
                                    style={{
                                        width: 120,
                                    }}
                                    value={selectedLocale}
                                    onChange={handleLocaleChange}
                                    options={[
                                        {
                                            value: 'en',
                                            label: 'English',
                                        },
                                        {
                                            value: 'vi',
                                            label: 'Tiếng Việt',
                                        },
                                    ]}
                                />
                            </span>
                        </div>
                    </footer>
            </div>
        </>
    );
}
