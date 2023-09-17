import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { useLang } from '../../Context/LangContext';

export default function Show(props) {

    const [salon, setSalon] = useState(props[0].salon);
    const { lang } = useLang();

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{lang.get('strings.Detail-Salon')}</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">{salon.id}</div>
                        <div className="p-6 bg-white border-b border-gray-200">{salon.name}</div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
