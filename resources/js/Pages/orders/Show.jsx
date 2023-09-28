import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Button from '@/Components/Button';
import { Descriptions, Table, Tag, PageHeader } from 'antd';
import { useLang } from '../../Context/LangContext';

export default function Index(props) {

    const [order, setOrder] = useState(props[0].order);

    const { lang } = useLang();

    const columns = [
        {
            title: lang.get('strings.Product-Name'),
            dataIndex: 'name',
        },
        {
            title: lang.get('strings.Product-Cost'),
            dataIndex: 'cost',
        },
        {
            title: lang.get('strings.Quantity'),
            dataIndex: 'quantity',
        },
        {
            title: lang.get('strings.Status'),
            dataIndex: 'status',
        },
        {
            title: lang.get('strings.Creation-Time'),
            dataIndex: 'creation_time',
        },
        {
            title: lang.get('strings.Implement-Staff'),
            dataIndex: 'staff_name',
        },
        {
            title: lang.get('strings.Action'),
            render: (text, record) => {
                return (
                    <div>
                        <Button className="hover:bg-slate-300 hover:text-gray-950">{lang.get('strings.Edit')}</Button>
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{lang.get('strings.List-Order')}</h2>}
        >
            <Head title={lang.get('strings.Show-Order')} />

            <div className="py-12">
                <PageHeader ghost={false} title={lang.get('strings.Show-Order')} subTitle={lang.get("strings.Order-Information")} >
                    <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label={lang.get('strings.Customer-Name')}>{order.customer === null ? '' : order.customer.name}</Descriptions.Item>
                            <Descriptions.Item label={lang.get('strings.Customer-Phone')}>{order.customer === null ? '' :order.customer.phone} </Descriptions.Item>
                            <Descriptions.Item label={lang.get('strings.Time-Order')}>{order.time_order}</Descriptions.Item>
                            <Descriptions.Item label={lang.get('strings.Serial')}>{order.serial}</Descriptions.Item>
                            <Descriptions.Item label={lang.get('strings.Status')}>{order.status}</Descriptions.Item>
                        </Descriptions>
                    </div>
                </PageHeader>
            </div>

            <div className="py-12 mt-4">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <Table
                        bordered
                        columns={columns}
                        dataSource={order.products}
                        onChange={onTableChange} />
                </div>
            </div>
        </Authenticated>
    );
}
