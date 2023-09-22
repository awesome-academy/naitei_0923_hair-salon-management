import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { useLang } from '../Context/LangContext';
import { Inertia } from '@inertiajs/inertia'

export default function SelectWorkingSalon(props) {

    const { lang } = useLang();

    const selectSalon = (id) => {
        Inertia.post(route('selectSalon.select'), {id});
    };

    return (
        <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">

            <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                <div className="text-center justify-center pt-8 sm:justify-start sm:pt-0">
                    <p className="text-4xl text-black dark:text-slate-50">{lang.get('strings.Please-Select-Salon')}</p>
                </div>
                <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow sm:rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {props.mySalons.map(salon => {

                            return (
                                <div className="p-20 border-t border-gray-200 md:border-t-0 md:border-l hover:cursor-pointer">
                                    <div className="text-center">
                                        <div className="w-full h-full hover:text-black ml-4 text-2xl leading-7 font-semibold" onClick={() => {selectSalon(salon.id)}}>
                                            {salon.name}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
