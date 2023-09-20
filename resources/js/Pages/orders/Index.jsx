import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { Table, Modal, Button, Tag } from 'antd';
import { useLang } from '../../Context/LangContext';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Inertia } from "@inertiajs/inertia";

export default function Index(props) {

    const [orders, setOrders] = useState(props[0].orders);
    const { lang } = useLang();
    const { confirm } = Modal;

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: lang.get('strings.Delete-Order'),
            icon: <ExclamationCircleOutlined />,
            content: lang.get('strings.Message-Confirm-Delete'),
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                Inertia.delete(route('orders.destroy', { order: id }), {
                    onSuccess: () => {
                        openNotification('success',
                            lang.get('strings.Successfully-Deleted'),
                            lang.get('strings.Salon-Deleteted'),
                        );
                    },

                    onError: () => {
                        openNotification('error',
                            lang.get('strings.Somethings-went-wrong'),
                            lang.get('strings.Error-When-Update-To-DB')
                        );
                    }
                });
            },
            onCancel() {
            },
        });
    };

    const columns = [
        {
            title: lang.get('strings.Serial'),
            dataIndex: 'serial',
        },
        {
            title: lang.get('strings.Customer-Name'),
            dataIndex: 'customer',
        },
        {
            title: lang.get('strings.Time-Order'),
            dataIndex: 'time_arrive',
        },
        {
            title: lang.get('strings.Ordered-Product'),
            render: (_, { products }) => (
                <>
                    {products.map(product => product.name).map((productName) => {
                        return (
                            <Tag key={productName}>
                                {productName}
                            </Tag>
                        );
                    })}
                </>
            )

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
                        <a href={ route('orders.show', { order : record.id }) }>
                            <Button className="hover:bg-slate-300 hover:text-gray-950"> {lang.get('strings.Detail')} </Button>
                        </a>
                        <Button className="ml-4 hover:bg-slate-300 hover:text-gray-950" onClick={() => {
                            showDeleteConfirm(record.id)
                        }} type="primary" danger ghost>
                            {lang.get('strings.Delete')}
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{lang.get('strings.List-Order')}</h2>}
        >
            <Head title={lang.get('strings.List-Order')} />

            <div className="py-12">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <Table
                        bordered
                        columns={columns}
                        dataSource={orders.map(order => { return {...order, customer:order.customer.name}})}
                        onChange={onTableChange} />
                </div>
            </div>
        </Authenticated>
    );
}
