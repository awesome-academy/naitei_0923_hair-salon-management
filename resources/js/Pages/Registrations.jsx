import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { useLang } from '../Context/LangContext';
import { Table } from 'antd';
import { Inertia } from '@inertiajs/inertia'

export default function Registrations(props) {

    const [registrations, setRegistrations] = useState(props.registrations);
    const { lang } = useLang();

    const submit = (e, record) => {
        e.preventDefault();

        Inertia.post('/salons', record)
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone',
        },
        {
            title: 'Salon Name',
            dataIndex: 'salon_name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Staff Number',
            dataIndex: 'staffs_number',
        },
        {
            title: 'Seat Number',
            dataIndex: 'seats_number',
        },
        {
            title: 'Registration Package',
            dataIndex: 'registration_package',
        },
        {
            title: 'Action',
            render: (text, record) => {
                return (
                    <form onSubmit={(e) => { submit(e, record) }}>
                        <div>
                            <button type="submit" className="hover:bg-slate-300 hover:text-gray-950">{lang.get('strings.Accept')}
                            </button>
                        </div>
                    </form>

                )
            }
        },
    ];

    const onTableChange = (pagination, filters, sorter, extra) => {

    };

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{lang.get('strings.Registrations')}</h2>}
        >
            <Head title="Registrations" />

            <div className="py-12">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <Table
                        bordered
                        columns={columns}
                        dataSource={registrations}
                        onChange={onTableChange} />
                </div>
            </div>
        </Authenticated>
    );
}
