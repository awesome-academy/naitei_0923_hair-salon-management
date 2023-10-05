import React, { useState, useEffect } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { useLang } from '../../Context/LangContext';
import CustomTable from '@/Components/CustomeTable';
import { Input, Modal, notification, Tag, Button, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Inertia } from '@inertiajs/inertia'
import 'antd/dist/antd.css';

export default function Users(props) {
    const [users, setUsers] = useState(props.users);
    const [deletedUserId, setDeletedUserId] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { lang } = useLang();
    const { Search } = Input;

    useEffect(() => {
        setUsers(props.users.filter(item => (
            item.id.toString().includes(searchValue.toString()) ||
            item.phone.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.first_name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.last_name.toLowerCase().includes(searchValue.toLowerCase())
        )));
    }, [searchValue]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: lang.get('strings.First-Name'),
            dataIndex: 'first_name',
        },
        {
            title: lang.get('strings.Last-Name'),
            dataIndex: 'last_name',
        },
        {
            title: lang.get('strings.Email'),
            dataIndex: 'email',
        },
        {
            title: lang.get('strings.Phone'),
            dataIndex: 'phone',
        },
        {
            title: lang.get('strings.Salon'),
            render: (_, { salon_names }) => (
                <>
                    {salon_names.map((salon, id) => {
                        return (
                            <Tag key={id} color="#108ee9">
                                {salon}
                            </Tag>
                        );
                    })}
                </>
            )

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
                                <EditOutlined style={{ fontSize: 19, color: '#1c5dfd' }} onClick={() => { editUser(record.id) }} />
                            </Tooltip>
                            <Tooltip title="View">
                                <EyeOutlined style={{ fontSize: 19 }} onClick={
                                    () => {
                                        Inertia.get(route('users.show', record), {}, {
                                            onError: () => { },
                                            onSuccess: () => { },
                                        })
                                    }} />
                            </Tooltip>
                            <Tooltip title="Delete">
                                <DeleteOutlined style={{ fontSize: 19, color: '#e80101' }} onClick={() => showModal(record.id)} />
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
        setDeletedUserId(id);
        setIsDeleteModalOpen(true);
    };

    const handleOk = (id) => {
        Inertia.delete(route('users.destroy', { user: id }), {}, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Delete'),
                    lang.get('strings.User-Deleted-Noti')
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

    const editUser = (id) => {
        Inertia.get(route('users.edit', { user: id }));
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
        >
            <Head title="Dashboard" />
            <Modal
                title="Delete User"
                open={isDeleteModalOpen}
                onOk={() => { handleOk(deletedUserId) }}
                onCancel={handleCancel}
            >
                <p className="font-semibold text-xl text-rose-600 leading-tight">{lang.get('strings.Delete-User-Confirm')}</p>
            </Modal>
            <div className="py-12">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold text-2xl text-gray-800 leading-tight'>{lang.get('strings.Users')}</h2>
                </div>
                <div className="flex gap-4 justify-end w-full mr:3 mb-8 sm:px-6 lg:px-8 mt-8">
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
                        dataSource={users}
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
