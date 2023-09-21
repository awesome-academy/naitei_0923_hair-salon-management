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
    const { lang } = useLang();
    const { confirm } = Modal;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { post } = useForm();
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = (values) => {
        Inertia.post(route('customers.store'), {...values}, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Created'),
                    lang.get('strings.Successfully-Created-Customer')
                );
            },
        });

        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
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
                        <EditOutlined style={{ fontSize: 19 }} />
                        <EyeOutlined style={{ fontSize: 19 }} onClick={
                            () => {
                                Inertia.get(route('customers.show', { customer : record.id }));
                            }} />
                        <DeleteOutlined style={{ fontSize: 19 }} onClick={() => {
                            showDeleteConfirm(record)
                        }} />
                    </div>
                )
            }
        },
    ];

    const onTableChange = (pagination, filters, sorter, extra) => { };

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
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
                </div>
                <div className="flex justify-end px-8">
                    <Modal title={lang.get('strings.Modal-Create-Customer')} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
                        <Form {...layout} form={form} name="control-hooks" onFinish={handleOk}>
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
                            <Form.Item name="is_active" valuePropName="checked"  wrapperCol={{ offset: 8, span: 16 }}>
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
