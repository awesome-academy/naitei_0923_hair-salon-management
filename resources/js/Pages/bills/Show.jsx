import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { Descriptions, Table, Badge, PageHeader, Button, Form, Input, notification, Select } from 'antd';
import { useLang } from '../../Context/LangContext';
import { Inertia } from "@inertiajs/inertia";

export default function Index(props) {

    const [order, setOrder] = useState(props[0].order);
    const [formHidden, setFormHidden ] = useState(true);
    const [form] = Form.useForm();
    const [isCashMoneyDisabled, setIsCashMoneyDisabled] = useState(false);
    const { lang } = useLang();

    if (order.bill === null) {
        order.bill = {
            payment_method : '',
            total : '',
            cash : '',
            change : '',
            status : "Unpaid",
        };
    }

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const openFormPayOrder = () => {
        const unFinishProducts =  order.products.some((product) => {
            return product.status !== 'Done' && product.status !== 'Cancel' ;
        });

        if (unFinishProducts) {
            openNotification('error',
                lang.get('strings.Unachievable'),
                lang.get('strings.Error-Payment-When-Products-Not-Done')
            );
        } else if (order.status !== 'Done') {
            openNotification('error',
                lang.get('strings.Unachievable'),
                lang.get('strings.Error-Payment-When-Order-Not-Done')
            );
        } else if (order.bill.status === 'Paid') {
            openNotification('error',
                lang.get('strings.Unachievable'),
                lang.get('strings.Error-Payment-When-Paid')
            );
        } else setFormHidden(false);
    }

    const onFinish = (values) => {
        values.cash_money = parseInt(values.cash_money);

        Inertia.post(route('bills.store', { order: order.id }), {...values}, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Payment-Successful'),
                    lang.get('strings.Order-Payment-Successful')
                );
            },
            onError: (error) => {
                openNotification('error',
                    lang.get('strings.Product-Not-Enough-Quantity'),
                    error.store
                );
            }
        });
    }

    const onPaymentMethodChange = (value) => {
        switch (value) {
            case 'CARD':
            case 'BANK-TRANSFER':
                form.setFieldsValue({ cash_money: order.total_payable, change_money: 0  });
                setIsCashMoneyDisabled(true);
                return;
            case 'CASH':
                setIsCashMoneyDisabled(false);
                return;
        }
    }

    const calculateChangeMoney = (cash) => {
        form.setFieldsValue({ cash_money: cash, change_money: cash - order.total_payable })
    }

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 8,
        },
    };

    const tailLayout = {
        wrapperCol: {
            offset: 15,
            span: 16,
        },
    };

    const columns = [
        {
            title: lang.get('strings.Product-Name'),
            dataIndex: 'name',
        },
        {
            title: lang.get('strings.Creation-Time'),
            align: 'center',
            dataIndex: 'creation_time',
        },
        {
            title: lang.get('strings.Status'),
            align: 'center',
            dataIndex: 'status',
        },
        {
            title: lang.get('strings.Product-Cost'),
            align: 'center',
            dataIndex: 'cost',
        },
        {
            title: lang.get('strings.Quantity'),
            align: 'center',
            dataIndex: 'quantity',
        },
        {
            title: lang.get('strings.Total'),
            align: 'center',
            dataIndex: 'total',
        },
    ];

    const onTableChange = (pagination, filters, sorter, extra) => {

    };

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
        >
            <Head title={lang.get('strings.Customer-Information')} />

            <div className="py-12">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h4 className='font-semibold text-2xl text-gray-800 leading-tight'>{lang.get('strings.Bill-Information')}</h4>
                </div>
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <Descriptions title={lang.get('strings.Order-Information')} layout="vertical" bordered>
                        <Descriptions.Item label={lang.get('strings.Customer-Name')}>{order.customer === null ? '' : order.customer.name}</Descriptions.Item>
                        <Descriptions.Item label={lang.get('strings.Customer-Phone')}>{order.customer === null ? '' : order.customer.phone}</Descriptions.Item>
                        <Descriptions.Item label={lang.get('strings.Active-Account-Customer')}>{order.customer === null ? '' : order.customer.is_active}</Descriptions.Item>
                        <Descriptions.Item label={lang.get('strings.Time-Order')}>{order.created_time_order}</Descriptions.Item>
                        <Descriptions.Item label={lang.get('strings.Order-Status')} span={2}>
                            <Badge status="default" text={order.status} />
                        </Descriptions.Item>
                        <Descriptions.Item label={lang.get('strings.Payment-Method')}>{order.bill.payment_method}</Descriptions.Item>
                        <Descriptions.Item label={lang.get('strings.Payment-Status')} span={2}>
                            <Badge status="default" text={order.bill.status} />
                        </Descriptions.Item>
                        <Descriptions.Item label={lang.get('strings.Total-Payment')}>{order.bill.total}</Descriptions.Item>
                        <Descriptions.Item label={lang.get('strings.Cash-Money')}>{order.bill.cash}</Descriptions.Item>
                        <Descriptions.Item label={lang.get('strings.Change-Money')}>{order.bill.change}</Descriptions.Item>
                    </Descriptions>
                </div>
                <PageHeader ghost={false} title={lang.get('strings.Ordered-Product')} subTitle={lang.get("strings.Product-Order-History")} >
                    <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                        <Table
                            bordered
                            columns={columns}
                            dataSource={order.products}
                            onChange={onTableChange} />
                    </div>
                </PageHeader>
                <div className='sm:px-6 lg:px-8 w-full text-center'>
                    <div className="flex justify-center items-center">
                        <h4 className='font-semibold text-2xl text-rose-600 leading-tight'>{lang.get('strings.Total-Payable')} : {order.total_payable}</h4>
                        <Button type="primary" danger className="ml-8" onClick={openFormPayOrder}>
                            {lang.get('strings.Pay-Order')}
                        </Button>
                    </div>
                </div>
                <Form {...layout} className="pt-4" form={form} name="control-hooks" onFinish={onFinish} hidden={formHidden}>
                    <Form.Item
                        name="total"
                        label={lang.get('strings.Total-Payment')}
                        initialValue={order.total_payable}
                    >
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item name="payment_method" label={lang.get('strings.Payment-Method')} rules={[{ required: true }]}>
                        <Select
                            placeholder={lang.get('strings.Select-Payment-Method')}
                            onChange={onPaymentMethodChange}
                            allowClear
                        >
                            <Option value="CARD">{lang.get('strings.CARD')}</Option>
                            <Option value="BANK-TRANSFER">{lang.get('strings.BANK-TRANSFER')}</Option>
                            <Option value="CASH">{lang.get('strings.CASH')}</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="cash_money"
                        label={lang.get('strings.Cash-Money')}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input onChange={(e) => calculateChangeMoney(e.target.value)} disabled={isCashMoneyDisabled}/>
                    </Form.Item>
                    <Form.Item
                        name="change_money"
                        label={lang.get('strings.Change-Money')}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button htmlType="submit" danger type="primary">
                            {lang.get('strings.Submit')}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Authenticated>
    );
}
