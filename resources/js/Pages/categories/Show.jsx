import React, { useState, useEffect } from 'react';
import { Input, Button, notification, Modal, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, EyeOutlined, MinusCircleOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { useLang } from '../../Context/LangContext';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import CustomTable from '@/Components/CustomeTable';

export default function DetailCategory (props) {
    const [isEditting, setIsEditting] = useState(false);
    const { lang } = useLang();
    const { Search } = Input;

    const [category, setCategory] = useState(props[0].category);
    const [products, setProducts] = useState(props[0].category.products);
    const [searchValue, setSearchValue] = useState('');
    const [deletedProductId, setDeletedProductId] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        setProducts(props[0].category.products.filter(item => (
            item.id.toString().includes(searchValue.toString()) ||
            item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.unit.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.description.toLowerCase().includes(searchValue.toLowerCase())
        )));
    }, [searchValue]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
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
                        {record.is_active === 'False' ?
                            <div>
                                <Tag color="#f50">{lang.get('strings.Inactive')}</Tag>
                            </div> :
                            <div className="flex gap-3 justify-center">
                                <Tooltip title="Edit">
                                    <EditOutlined style={{ fontSize: 19 }} onClick={() => { editProduct(record.id) }} />
                                </Tooltip>
                                <Tooltip title="View">
                                    <EyeOutlined style={{ fontSize: 19 }} onClick={
                                        () => {
                                            Inertia.get(route('products.show', record, {
                                                onError: () => {},
                                                onSuccess: () => {},
                                            }))
                                        }} />
                                </Tooltip>
                                <Tooltip title="Inactive">
                                    <MinusCircleOutlined style={{ fontSize: 19 }} onClick={() => {showModal(record.id)}} />
                                </Tooltip>
                            </div>
                        }
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
        Inertia.put(route('products.inactive', { product: deletedProductId }), {}, {
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

    const editCategory = (e) => {
        
    };

    const showDeleteModal = (record) => {
        const modalDelete = Modal.warning();
        modalDelete.update({
            title: lang.get('strings.Delete-Category'),
            closable: true,
            okText: lang.get('strings.Delete'),
            onOk: () => handleOkDeleteModal(modalDelete, record),
            content:(
                <>
                    <h2 style={{color: '#FF3355'}}>{lang.get('strings.Delete-Category-Confirm')}</h2>
                    <h4>
                        <b>{lang.get('ID')}:</b> {record.id}
                    </h4>
                    <h4>
                        <b>{lang.get('Name')}:</b> {record.name}
                    </h4>
                </>
            ),
        })
    };
  
    const handleOkDeleteModal = (modalDelete, record) => {
        modalDelete.destroy();
        deleteCategory(record);
    };

    const deleteCategory = (record) => {
        Inertia.delete(route('categories.destroy', { category: category.id }), record, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Delete'),
                    lang.get('strings.Category-Deleted-Noti')
                );
            },
            onError: (error) => {
                openNotification('error',
                    lang.get('strings.Somethings-went-wrong'),
                    error.unactive
                );
            }
        });
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
        >
            <Head title="Salon Detail" />
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
                    <h2 className='font-semibold text-2xl text-gray-800 leading-tight'>{lang.get('strings.Detail-Category')}</h2>
                </div> 
                <div className="bg-white w-full shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-7 sm:px-6">
                        <div className='flex justify-between'>
                            <h3 className="text-2xl leading-6 font-semibold text-sky-900 max-w-2xl">
                                {category.name}
                            </h3>
                            <div className='flex space-x-4'>
                                <a href={route('categories.edit', {category : category.id})}>
                                    <Button type="primary" shape="round" icon={<EditOutlined />} size={'large'} onClick={editCategory}>
                                        {lang.get('strings.Edit')}
                                    </Button>
                                </a>
                                <Button danger type="primary" shape="round" icon={<DeleteOutlined />} size={'large'} onClick={() => showDeleteModal(category)} >
                                    {lang.get('strings.Delete')}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div class="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    <b>{lang.get('strings.ID')}:</b>
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {category.id}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    <b>{lang.get('strings.Active')}:</b>
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {category.is_active}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    <b>{lang.get('strings.Product-Type')}:</b>
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {category.product_type}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    <b>{lang.get('strings.Product-Number')}:</b>
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {category.product_number}
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div className="px-4 py-7 sm:px-6">
                        <div className='flex justify-between'>
                            <h3 className="text-2xl leading-6 font-semibold text-sky-900 max-w-2xl">
                                {lang.get('strings.Products')}
                            </h3>
                            <div className='flex space-x-4'>
                                <Button
                                    icon={<PlusCircleOutlined />}
                                    type="primary"
                                    shape="round"
                                    size={"large"}
                                    onClick={createProduct}
                                >
                                    {lang.get('strings.Create-Product')}
                                </Button>
                                <Search placeholder="input id, name, description or unit"
                                    onChange={searchChangeHandler}
                                    enterButton
                                    bordered
                                    size="large"
                                    allowClear
                                    style={{
                                        width: 304,
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                    <div class="border-t border-gray-200">
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
                </div>
            </div>
        </Authenticated>
    )
}
