import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Button from '@/Components/Button';
import { Descriptions, Table, Select, PageHeader, notification } from 'antd';
import { useLang } from '../../Context/LangContext';
import { Inertia } from "@inertiajs/inertia";

export default function Index(props) {

    const [order, setOrder] = useState(props[0].order);
    const { lang } = useLang();
    const orderProductStatusChange = (id, status) => {
        Inertia.put(route('orders.updateProduct', { id }), { status }, {
            onSuccess: () => { },
            onError: () => { },
        })
    }

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const staffChange = (id, value, prevStaff) => {
        if (prevStaff == null) {
            prevStaff = -1;
        }

        Inertia.put(route('orders.selectStaff', { id }), { staff: value, prevStaff: prevStaff }, {
            onSuccess: () => { },
            onError: () => { },
        })
    }
    const staffOptions = props[0].freeStaffs.map(staff => {
        return {
            label: staff.first_name + staff.last_name,
            value: staff.user_id
        }
    })

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
            render: (_, record) => {
                return (
                    <Select
                        defaultValue={record.status}
                        style={{
                            width: 120,
                        }}
                        onChange={(value) => { orderProductStatusChange(record.order_product_id, value) }}
                        options={[
                            {
                                label: lang.get('strings.Prepare'),
                                value: 'Prepare'
                            },
                            {
                                label: lang.get('strings.In-Process'),
                                value: 'In Process'
                            },
                            {
                                label: lang.get('strings.Done'),
                                value: 'Done'
                            },
                            {
                                label: lang.get('strings.Cancel'),
                                value: 'Cancel'
                            },
                        ]}
                    />
                )
            }
        },
        {
            title: lang.get('strings.Creation-Time'),
            dataIndex: 'creation_time',
        },
        {
            title: lang.get('strings.Implement-Staff'),
            dataIndex: 'staff_name',
            render: (_, record) => {
                return (
                    <Select
                        defaultValue={{
                            label: record.staff_name,
                            value: record.staff_id,
                        }}
                        style={{
                            width: 120,
                        }}
                        onChange={(value) => {
                            staffChange(record.order_product_id, value, record.staff_id);
                        }}
                        options={staffOptions}
                    />
                )
            }
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
                            <Descriptions.Item label={lang.get('strings.Customer-Phone')}>{order.customer === null ? '' : order.customer.phone} </Descriptions.Item>
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
                        onChange={onTableChange}
                        onRow={(record, index) => ({
                            style: {
                                background: record.status !== 'Cancel' ? '#fff' : '#fff1f0',
                            }
                        })}
                    />
                </div>
            </div>
        </Authenticated>
    );
}
