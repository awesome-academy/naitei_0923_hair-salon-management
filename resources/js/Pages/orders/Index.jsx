import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Button from '@/Components/Button';
import {Table, Tag} from 'antd';
import { useLang } from '../../Context/LangContext';


export default function Index(props) {

    const [orders, setOrders] = useState(props[0].orders);

    const { lang } = useLang();

    console.log(orders.map(order => { return {...order, customer:order.customer.name}}))

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
            dataIndex: 'created_at',
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
