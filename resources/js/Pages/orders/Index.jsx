import React, { useEffect, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import CustomTable from '@/Components/CustomeTable';
import { Input, Modal, Select, Tag, notification, Checkbox } from 'antd';
import { useLang } from '../../Context/LangContext';
import { DeleteOutlined, FileDoneOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Inertia } from "@inertiajs/inertia";
import 'antd/dist/antd.css';

export default function Index(props) {

    const [orders, setOrders] = useState(props[0].orders);
    const { lang } = useLang();
    const { confirm } = Modal;
    const [searchValue, setSearchValue] = useState('');
    const { Search } = Input;

    useEffect(() => {
        setOrders(props[0].orders.filter(item => (
            item.serial.toString().includes(searchValue.toString()) ||
            item.customer === null ? true : item.customer.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.products.some((product) =>
                product.name.toLowerCase().includes(searchValue.toLowerCase())
            )
        )));
    }, [searchValue]);

    const searchChangeHandler = (e) => {
        e.preventDefault();

        setSearchValue(e.target.value);
    }

    const filters_status = orders.map(
        order => {
            return {
                text: order.status,
                value: order.status,
            }
        }
    ).filter(
        (item, index, self) => {
            return self.findIndex((otherItem) => otherItem.text === item.text) === index;
        }
    );

    const filters_active = [
        { text: lang.get('strings.Yes'), value: true },
        { text: lang.get('strings.No'), value: false },
    ];

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const orderStatusChange = (orderId, value) => {
        Inertia.put(route('orders.update', { order: orderId , status: value}), {} , {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Updated'),
                    lang.get('strings.Order-Successfully-Updated')
                );
            },
            onError: (error) => {
                openNotification('error',
                    lang.get('strings.Somethings-went-wrong'),
                    error.update,
                );
            },
        });
    }

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
                            lang.get('strings.Order-Deleted'),
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
                            <Tag key={productName} color="#4a98ff">
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
            filters: filters_status,
            onFilter: (value, record) => record.status === value,
            render: (_, record ) => {
                return (
                    <Select
                        defaultValue={false}
                        value={record.status}
                        style={{
                            width: 120,
                        }}
                        onChange={(value) => {orderStatusChange(record.id, value)}}
                        options={[
                            {
                                label: 'Prepare',
                                value: 'Prepare'
                            },
                            {
                                label: 'In Process',
                                value: 'In Process'
                            },
                            {
                                label: 'Done',
                                value: 'Done'
                            },
                            {
                                label: 'Cancel',
                                value: 'Cancel'
                            },
                        ]}
                    />
                )
            }
        },
        {
            title: lang.get('strings.Pay-Order'),
            align: 'center',
            filters: filters_active,
            onFilter: (value, record) => {
                if (record.pay_order == value) {
                    return true;
                }
            },
            render: (record) => {
                return (
                    <Checkbox checked={record.pay_order} />
                )
            }
        },
        {
            title: lang.get('strings.Action'),
            align: 'center',
            render: (text, record) => {
                return (
                    <div className="flex gap-3 justify-center">
                        <EyeOutlined style={{ fontSize: 19 }} title={lang.get('strings.Detail')} onClick={
                            () => {
                                Inertia.get(route('orders.show', { order: record.id }));
                            }} />
                        <FileDoneOutlined style={{ fontSize: 19, color: '#1c5dfd' }} title={lang.get('strings.Detail-Bill')} onClick={
                            () => {
                                Inertia.get(route('bills.show', { order: record.id }));
                            }} />
                        <DeleteOutlined style={{ fontSize: 19, color: '#e80101' }} title={lang.get('strings.Delete')} onClick={() => {
                            showDeleteConfirm(record.id)
                        }} />
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
            <Head title={lang.get('strings.List-Order')} />

            <div className="py-12">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold text-2xl text-gray-800 leading-tight'>{lang.get('strings.List-Order')}</h2>
                </div>
                <div className="flex justify-end w-full mr:3 mb-8 sm:px-6 lg:px-8">
                    <Search placeholder="input serial, customer name, ordered products" onChange={searchChangeHandler}
                            enterButton bordered size="large" allowClear style={{ width: 304 }} />
                </div>
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <CustomTable
                        bordered
                        columns={columns}
                        dataSource={orders.map(order => { return { ...order, customer: order.customer === null ? '' : order.customer.name } })}
                        onChange={onTableChange} />
                </div>
            </div>
        </Authenticated>
    );
}
