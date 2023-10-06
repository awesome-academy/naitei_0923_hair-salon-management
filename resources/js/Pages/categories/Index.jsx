import React, { useState, useEffect } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { useLang } from '../../Context/LangContext';
import CustomTable from '@/Components/CustomeTable';
import { Input, Modal, notification, Tag, Button, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined, MinusCircleOutlined, PlusCircleOutlined, DeleteOutlined} from '@ant-design/icons';
import { Inertia } from '@inertiajs/inertia'
import 'antd/dist/antd.css';

export default function Categories(props) {

    const [categories, setCategories] = useState(props[0].categories);
    const [searchValue, setSearchValue] = useState('');
    const [deletedCategoryId, setDeletedCategoryId] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { lang } = useLang();
    const { Search } = Input;

    useEffect(() => {
        setCategories(props[0].categories.filter(item => (
            item.id.toString().includes(searchValue.toString()) ||
            item.name.toLowerCase().includes(searchValue.toLowerCase())
        )));
    }, [searchValue]);

    const columns = [
        {
            title: lang.get('strings.ID'),
            dataIndex: 'id',
        },
        {
            title: lang.get('strings.Name'),
            dataIndex: 'name',
        },
        {
            title: lang.get('strings.Product-Type'),
            dataIndex: 'product_type',
        },
        {
            title: lang.get('strings.Product-Number'),
            dataIndex: 'product_number',
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
                                    <EditOutlined style={{ fontSize: 19, color: '#1c5dfd' }} onClick={() => { editCategory(record.id) }} />
                                </Tooltip>
                                <Tooltip title="View">
                                    <EyeOutlined style={{ fontSize: 19 }} onClick={
                                        () => {
                                            Inertia.get(route('categories.show', record, {
                                                onError: () => { },
                                                onSuccess: () => { },
                                            }))
                                        }} />
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <DeleteOutlined style={{ fontSize: 19, color: '#e80101' }} onClick={() => showModal(record.id)} />
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
        setDeletedCategoryId(id);
        setIsDeleteModalOpen(true);
    };

    const handleOk = () => {
        Inertia.delete(route('categories.destroy', { category: deletedCategoryId }), {}, {
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

    const editCategory = (id) => {
        Inertia.get(route('categories.edit', { category: id }))
    }

    const createCategory = () => {
        Inertia.get(route('categories.create'))
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
        >
            <Head title="Dashboard" />
            <Modal
                title= {lang.get('strings.Delete-Category')}
                open={isDeleteModalOpen}
                onOk={() => { handleOk() }}
                onCancel={handleCancel}
            >
                <p className="font-semibold text-xl text-rose-600 leading-tight">{lang.get('strings.Delete-Category-Confirm')}</p>
            </Modal>
            <div className="py-12">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold text-2xl text-gray-800 leading-tight'>{lang.get('strings.Categories')}</h2>
                </div>
                <div className="flex gap-4 justify-between w-full mr:3 mb-8 sm:px-6 lg:px-8 mt-8">
                    <Button
                        icon={<PlusCircleOutlined />}
                        type="primary"
                        shape="round"
                        size={"large"}
                        onClick={createCategory}
                    >{lang.get('strings.Create-Category')}</Button>
                    <Search placeholder="input id, name"
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
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <CustomTable
                        bordered
                        columns={columns}
                        dataSource={categories}
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
