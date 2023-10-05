import React, { useState, useEffect } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { useLang } from '../../Context/LangContext';
import CustomTable from '@/Components/CustomeTable';
import { Input, Modal, notification, Tag, Button, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined, PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Inertia } from '@inertiajs/inertia'
import 'antd/dist/antd.css';

export default function Products(props) {

    const [products, setProducts] = useState(props[0].products);
    const [searchValue, setSearchValue] = useState('');
    const [deletedProductId, setDeletedProductId] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { lang } = useLang();
    const { Search } = Input;

    useEffect(() => {
        setProducts(props[0].products.filter(item => (
            item.id.toString().includes(searchValue.toString()) ||
            item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.unit.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.description.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.category.toLowerCase().includes(searchValue.toLowerCase())
        )));
    }, [searchValue]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: lang.get('strings.Category'),
            dataIndex: 'category',
        },
        {
            title: lang.get('strings.Name'),
            dataIndex: 'name',
        },
        {
            title: lang.get('strings.Unit'),
            dataIndex: 'unit',
        },
        {
            title: lang.get('strings.Cost-Per-Unit'),
            dataIndex: 'cost',
        },
        {
            title: lang.get('strings.Description'),
            dataIndex: 'description',
            align: 'center'
        },
        {
            title: lang.get('strings.Quantity'),
            dataIndex: 'quantity',
        },
        {
            title: lang.get('strings.Action'),
            align: 'center',
            filters: [
                {
                    text: 'False',
                    value: 'False',
                },
                {
                    text: 'True',
                    value: 'True',
                },
            ],
            onFilter: (value, record) => record.is_active === value,
            render: (text, record) => {
                return (
                    <div>
                        <div className="flex gap-3 justify-center">
                            <Tooltip title="Edit">
                                <EditOutlined style={{ fontSize: 19, color: '#1c5dfd' }} onClick={() => { editProduct(record.id) }} />
                            </Tooltip>
                            <Tooltip title="View">
                                <EyeOutlined style={{ fontSize: 19 }} onClick={
                                    () => {
                                        Inertia.get(route('products.show', record, {
                                            onError: () => { },
                                            onSuccess: () => { },
                                        }))
                                    }} />
                            </Tooltip>
                            <Tooltip title="Inactive">
                                <DeleteOutlined style={{ fontSize: 19, color: '#e80101' }} onClick={() => { showModal(record.id) }} />
                            </Tooltip>
                        </div>
                    </div>
                )
            }
        },
    ];

    const onTableChange = (pagination, filters, sorter, extra) => { };

    const searchChangeHandler = (e) => {
        e.preventDefault();

        setSearchValue(e.target.value);
    }

    const showModal = (id) => {
        setDeletedProductId(id);
        setIsDeleteModalOpen(true);
    };

    const handleOk = () => {
        Inertia.delete(route('products.destroy', { product: deletedProductId }), {}, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Delete'),
                    lang.get('strings.Product-Deleted-Noti')
                );
            },
            onError: (error) => {
                openNotification('error',
                    lang.get('strings.Somethings-went-wrong'),
                    error.unactive
                );
            }
        })

        setIsDeleteModalOpen(false);
    };

    const handleCancel = () => {
        setIsDeleteModalOpen(false);
    };

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const createProduct = () => {
        Inertia.get(route('products.create'));
    }

    const editProduct = (id) => {
        Inertia.get(route('products.edit', { product: id }));
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
        >
            <Head title="Dashboard" />
            <Modal
                title="Delete Product"
                open={isDeleteModalOpen}
                onOk={() => { handleOk() }}
                onCancel={handleCancel}
            >
                <p className="font-semibold text-xl text-rose-600 leading-tight">Are you sure to delete this product ?</p>
            </Modal>
            <div className="py-12">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold text-2xl text-gray-800 leading-tight'>{lang.get('strings.Products')}</h2>
                </div>
                <div className="flex justify-between mt-8 w-full mr:3 mb-8 sm:px-6 lg:px-8">
                    <Button
                        icon={<PlusCircleOutlined />}
                        type="primary"
                        shape="round"
                        size={"large"}
                        onClick={createProduct}
                    >{lang.get('strings.Create-Product')}</Button>
                    <Search placeholder="input id, phone, email or name"
                        onChange={searchChangeHandler}
                        enterButton
                        bordered
                        size="large"
                        allowClear
                        style={{
                            width: 304,
                        }} />

                </div>
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <CustomTable
                        bordered
                        columns={columns}
                        dataSource={products}
                        onChange={onTableChange}
                        onRow={(record, index) => ({
                            style: {
                                background: record.is_active === 'True' ? '#e6f4ff' : '#fff1f0',
                            }
                        })}
                    />

                </div>
            </div>
        </Authenticated>
    );
}
