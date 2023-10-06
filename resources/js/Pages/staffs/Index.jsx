import React, { useState, useEffect } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { useLang } from '../../Context/LangContext';
import CustomTable from '@/Components/CustomeTable';
import { Input, Modal, notification, Tag, Button, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Inertia } from '@inertiajs/inertia'
import 'antd/dist/antd.css';

export default function Staffs(props) {

    const [staffs, setStaffs] = useState(props[0].staffs);
    const [searchValue, setSearchValue] = useState('');
    const [deletedStaffId, setDeletedStaffId] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { lang } = useLang();
    const { Search } = Input;

    useEffect(() => {
        setStaffs(props[0].staffs.filter(item => (
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
            title: lang.get('strings.Role'),
            dataIndex: 'role',
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
                                        Inertia.get(route('staffs.show', record, {
                                            onError: () => { },
                                            onSuccess: () => { },
                                        }))
                                    }} />
                            </Tooltip>
                            <Tooltip title="Inactive">
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
        setDeletedStaffId(id);
        setIsDeleteModalOpen(true);
    };

    const handleOk = () => {
        Inertia.delete(route('staffs.destroy', { staff: deletedStaffId }), {}, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Delete'),
                    lang.get('strings.Staff-Deleted-Noti')
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
        Inertia.get(route('staffs.edit', { staff: id }))
    }

    const createStaff = () => {
        Inertia.get(route('staffs.create'))
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
        >
            <Head title="Dashboard" />
            <Modal
                title="Delete User"
                open={isDeleteModalOpen}
                onOk={() => { handleOk() }}
                onCancel={handleCancel}
            >
                <p className="font-semibold text-xl text-rose-600 leading-tight">{lang.get('strings.Delete-Staff-Confirm')}</p>
            </Modal>
            <div className="py-12">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold text-2xl text-gray-800 leading-tight'>{lang.get('strings.Staffs')}</h2>
                </div>
                <div className="flex gap-4 justify-between w-full mr:3 mb-8 sm:px-6 lg:px-8 mt-8">
                    <Button
                        icon={<PlusCircleOutlined />}
                        type="primary"
                        shape="round"
                        size={"large"}
                        onClick={createStaff}
                    >{lang.get('strings.Create-Staff')}</Button>
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
                        dataSource={staffs}
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
