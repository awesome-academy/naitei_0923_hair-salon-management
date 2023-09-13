import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Button from '@/Components/Button';
import { Table } from 'antd';
import { useLang } from '../../Context/LangContext';


export default function Salons(props) {

    const [salons, setSalons] = useState(props[0].salons);
    const { lang } = useLang();

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: lang.get('strings.Salon-Name'),
            dataIndex: 'name',
        },
        {
            title: lang.get('strings.Address'),
            dataIndex: 'address',
        },
        {
            title: lang.get('strings.Owner-Email'),
            dataIndex: 'owner_email',
        },
        {
            title: lang.get('strings.Registration-Package'),
            dataIndex: 'registration_package',
        },
        {
            title: lang.get('strings.Staff-Number'),
            dataIndex: 'num_staffs',
        },
        {
            title: lang.get('strings.Customer-Number'),
            dataIndex: 'num_customers',
        },
        {
            title: lang.get('strings.Action'),
            render: (text, record) => {
                return (
                    <div>
                        <Button className="hover:bg-slate-300 hover:text-gray-950">{lang.get('strings.Detail')}</Button>
                    </div>
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{lang.get('strings.Salons')}</h2>}
        >
            <Head title="Salons" />

            <div className="py-12">
            <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <Table 
                        bordered
                        columns={columns} 
                        dataSource={salons} 
                        onChange={onTableChange} />
                </div>
            </div>
        </Authenticated>
    );
}
