import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { Descriptions, Table, Tag, PageHeader, Button } from 'antd';
import { useLang } from '../../Context/LangContext';
import { Inertia } from "@inertiajs/inertia";

export default function Index(props) {

    const [customer, setCustomer] = useState(props[0].customer);

    const { lang } = useLang();

    const columns = [
        {
            title: lang.get('strings.Creation-Time'),
            dataIndex: 'creation_time',
        },
        {
            title: lang.get('strings.Status'),
            dataIndex: 'status',
        },
        {
            title: lang.get('strings.Action'),
            render: (text, record) => {
                return (
                    <div>
                        <Button className="hover:bg-slate-300 hover:text-gray-950" onClick={
                            () => {
                                Inertia.get(route('orders.show', { order : record.id }));
                            }}
                        >
                            { lang.get('strings.Detail') }
                        </Button>
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
            notificationNumber={props.unreadNotificationsCount}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{lang.get('strings.Customer-Information')}</h2>}
        >
            <Head title={lang.get('strings.Customer-Information')} />

            <div className="py-12">
                <PageHeader ghost={false} title={lang.get('strings.Customer-Information')} subTitle={lang.get("strings.Customer-Information")} >
                    <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label={lang.get('strings.Customer-Name')}>{customer.name}</Descriptions.Item>
                            <Descriptions.Item label={lang.get('strings.Customer-Phone')}>{customer.phone} </Descriptions.Item>
                            <Descriptions.Item label={lang.get('strings.Active')}>{customer.active}</Descriptions.Item>
                        </Descriptions>
                    </div>
                </PageHeader>
            </div>

            <div className="py-12 mt-4">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h4 className='font-semibold text-2xl text-gray-800 leading-tight'>{lang.get('strings.History-Orders')}</h4>
                </div>
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <Table
                        bordered
                        columns={columns}
                        dataSource={customer.orders}
                        onChange={onTableChange} />
                </div>
            </div>
        </Authenticated>
    );
}
