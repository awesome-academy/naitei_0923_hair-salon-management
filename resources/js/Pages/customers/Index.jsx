import React, { useState, useEffect } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, useForm } from '@inertiajs/inertia-react';
import { useLang } from '../../Context/LangContext';
import CustomTable from '@/Components/CustomeTable';
import { Checkbox, Input, Modal, notification, Button, Form } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Inertia } from '@inertiajs/inertia'
import 'antd/dist/antd.css';

export default function Staffs(props) {

    const [customers, setCustomers] = useState(props[0].customers);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(false);
    const { lang } = useLang();
    const { confirm } = Modal;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [modalTitle, setModalTitle] = useState('');
    const [editMode, setEditMode] = useState(false);
    const { Search } = Input;
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        setCustomers(props[0].customers.filter(item => (
            item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.phone.toLowerCase().includes(searchValue.toLowerCase())
        )));
    }, [searchValue]);

    const searchChangeHandler = (e) => {
        e.preventDefault();

        setSearchValue(e.target.value);
    }

    const filters_active = [
        { text: lang.get('strings.Yes'), value: true },
        { text: lang.get('strings.No'), value: false },
    ];

    const showModal = () => {
        setModalTitle(lang.get('strings.Modal-Create-Customer'))
        setIsModalOpen(true);
    };

    const handleEditOk = (values) => {
        Inertia.put(route('customers.update', { customer: values.id }), { ...values }, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Edited'),
                    lang.get('strings.Successfully-Edited-Customer')
                );
            },
        });

        setIsModalOpen(false);
        setEditMode(false);
    }

    const handleSubmitModal = (values) => {
        if (editMode) {
            handleEditOk(values);
        } else {
            setPhoneNumber(values.phone);
            setName(values.name);
            setIsActive(values.is_active);
            Inertia.post(route('customers.sendOTP'), { phoneNumber: values.phone }, {
                onError: () => { },
                onSuccess: () => { },
            });
            setOtpModalOpen(true);
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditMode(false);
    };

    const showModalEditCustomer = (values) => {
        setEditMode(true);
        setModalTitle(lang.get('strings.Modal-Edit-Customer'))
        setIsModalOpen(true);
        form.setFieldsValue(values);
    };

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const showDeleteConfirm = (record) => {
        confirm({
            title: lang.get('strings.Delete-Customer'),
            icon: <ExclamationCircleOutlined />,
            content: (
                <>
                    <h2 className="text-rose-600">{lang.get('strings.Message-Confirm-Delete')}</h2>
                    <h4>
                        <b>{lang.get('strings.Customer-Name')}:</b> {record.name}
                    </h4>
                    <h4>
                        <b>{lang.get('strings.Customer-Phone')}:</b> {record.phone}
                    </h4>
                </>
            ),
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                Inertia.delete(route('customers.destroy', { customer: record.id }), {
                    onSuccess: () => {
                        openNotification('success',
                            lang.get('strings.Successfully-Deleted'),
                            lang.get('strings.Successfully-Deleted-Customer'),
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

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const tailLayout = {
        wrapperCol: {
            offset: 10,
            span: 16,
        },
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: lang.get('strings.Customer-Name'),
            dataIndex: 'name',
        },
        {
            title: lang.get('strings.Customer-Phone'),
            dataIndex: 'phone',
        },
        {
            title: lang.get('strings.Active'),
            align: 'center',
            filters: filters_active,
            onFilter: (value, record) => {
                if (record.is_active == value) {
                    return true;
                }
            },
            render: (record) => {
                return (
                    <Checkbox checked={record.is_active} />
                )
            }
        },
        {
            title: lang.get('strings.Action'),
            align: 'center',
            render: (text, record) => {
                return (
                    <div className="flex gap-3 justify-center">
                        <EditOutlined style={{ fontSize: 19, color: '#1c5dfd' }} onClick={
                            () => {
                                showModalEditCustomer(record);
                            }} />
                        <EyeOutlined style={{ fontSize: 19 }} onClick={
                            () => {
                                Inertia.get(route('customers.show', { customer: record.id }));
                            }} />
                        <DeleteOutlined style={{ fontSize: 19, color: '#e80101' }} onClick={() => {
                            showDeleteConfirm(record)
                        }} />
                    </div>
                )
            }
        },
    ];

    const onTableChange = (pagination, filters, sorter, extra) => { };

    const checkOTP = (values) => {
        Inertia.post(route('customers.checkOTP'), { OTP: values.OTP, phoneNumber, name, isActive: isActive }, {
            onSuccess: (response) => {
                openNotification('success',
                    lang.get('strings.Successfully-Created'),
                    lang.get('strings.Successfully-Created-Customer')
                );
            },
            onError: (error) => {
            }
        })
        setOtpModalOpen(false);
        setIsModalOpen(false);
    }

    const otpModalClose = () => {
        setOtpModalOpen(false);
    }
    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{lang.get('strings.List-Customers')}</h2>}
        >
            <Head title={lang.get('strings.List-Customers')} />

            <div className="py-12">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold text-2xl text-gray-800 leading-tight'>{lang.get('strings.List-Customers')}</h2>
                </div>
                <div className="flex gap-4 justify-between w-full mr:3 mb-8 sm:px-6 lg:px-8 mt-8">
                    <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size={'large'} onClick={showModal}>
                        {lang.get('strings.Create-Customer')}
                    </Button>
                    <Search placeholder="input name or phone" onChange={searchChangeHandler}
                        enterButton bordered size="large" allowClear style={{ width: 304 }} />
                </div>
                <div className="flex justify-end px-8">
                    <Modal title="OTP" open={otpModalOpen} onCancel={otpModalClose} footer={null}>
                        <Form
                            name="basic"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                maxWidth: 600,
                            }}
                            onFinish={checkOTP}
                        >
                            <Form.Item
                                label="sent OTP"
                                name="OTP"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input sent otp!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    {lang.get('strings.Submit')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal title={modalTitle} open={isModalOpen} onCancel={handleCancel} footer={null}>
                        <Form {...layout} form={form} name="control-hooks" onFinish={handleSubmitModal}>
                            <Form.Item name="id" className="hidden">
                                <Input hidden={true} />
                            </Form.Item>
                            <Form.Item
                                name="name"
                                label={lang.get('strings.Customer-Name')}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label={lang.get('strings.Customer-Phone')}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name="is_active" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                                <Checkbox> {lang.get('strings.Active-Account-Customer')} </Checkbox>
                            </Form.Item>

                            <Form.Item {...tailLayout}>
                                <Button key="back" className="mr-4" >
                                    {lang.get('strings.Cancel')}
                                </Button>
                                <Button htmlType="submit" type="primary">
                                    {lang.get('strings.Submit')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <CustomTable
                        bordered
                        columns={columns}
                        dataSource={customers}
                        onChange={onTableChange} />
                </div>
            </div>
        </Authenticated>
    );
}
