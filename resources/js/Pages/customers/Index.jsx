import React, { useState, useEffect } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { useLang } from '../../Context/LangContext';
import CustomTable from '@/Components/CustomeTable';
import { Checkbox, Input, Modal, notification } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Inertia } from '@inertiajs/inertia'
import 'antd/dist/antd.css';

export default function Staffs(props) {

    const [customers, setCustomers] = useState(props[0].customers);
    const { lang } = useLang();

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: lang.get('strings.Customer-Name'),
            dataIndex: 'name',
        },
        {
            title: lang.get('strings.Customer-Phone'),
            dataIndex: 'phone',
        },
        {
            title: lang.get('strings.Active'),
            align: 'center',
            render: (record) => {
                return (
                    <Checkbox checked={record.is_active} />
                )
            }
        },
        {
            title: lang.get('strings.Action'),
            align: 'center',
            render: (text, record) => {
                return (
                    <div className="flex gap-3 justify-center">
                        <EditOutlined style={{ fontSize: 19 }} />
                        <EyeOutlined style={{ fontSize: 19 }} onClick={
                            () => {
                                Inertia.get(route('customers.show', { customer : record.id }));
                            }} />
                        <DeleteOutlined style={{ fontSize: 19 }} />
                    </div>
                )
            }
        },
    ];

    const onTableChange = (pagination, filters, sorter, extra) => { };

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{lang.get('strings.List-Customers')}</h2>}
        >
            <Head title={lang.get('strings.List-Customers')} />

            <div className="py-12">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold text-2xl text-gray-800 leading-tight'>{lang.get('strings.List-Customers')}</h2>
                </div>
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <CustomTable
                        bordered
                        columns={columns}
                        dataSource={customers}
                        onChange={onTableChange} />
                </div>
            </div>
        </Authenticated>
    );
}
