import React, { useState } from 'react';
import { Button, notification, Modal, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { useLang } from '../../Context/LangContext';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

export default function DetailSalon(props) {
    const [isEditting, setIsEditting] = useState(false);
    const { lang } = useLang();
    const [salon, setSalon] = useState(props[0].salon);

    const editSalon = (e) => {

    };

    const showDeleteModal = (record) => {
        const modalDelete = Modal.warning();
        modalDelete.update({
            title: lang.get('strings.Delete-Salon'),
            closable: true,
            okText: lang.get('strings.Delete'),
            onOk: () => handleOkDeleteModal(modalDelete, record),
            content: (
                <>
                    <h2 style={{ color: '#FF3355' }}>{lang.get('strings.Confirm-Delete-Salon')}</h2>
                    <h4>
                        <b>{lang.get('Salon-ID')}:</b> {record.id}
                    </h4>
                    <h4>
                        <b>{lang.get('Salon-Name')}:</b> {record.name}
                    </h4>
                </>
            ),
        })
    };

    const handleOkDeleteModal = (modalDelete, record) => {
        modalDelete.destroy();
        deleteSalon(record);
    };

    const deleteSalon = (record) => {
        Inertia.delete(route('salons.destroy', { salon: record.id }), record, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Deleted'),
                    lang.get('strings.Salon-Deleteted')
                );
            },
            onError: () => {
                openNotification('error',
                    lang.get('strings.Somethings-went-wrong'),
                    lang.get('strings.Error-When-Update-To-DB')
                );
            }
        });
    }

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
        >
            <Head title="Salon Detail" />
            <div className="py-12">
                <div className='sm:px-4 lg:px-6 w-full'>
                    <h2 className='font-semibold text-2xl text-gray-800 leading-tight'>{lang.get('strings.Detail-Salon')}</h2>
                </div>
                <div className="bg-white w-full shadow overflow-hidden sm:rounded-lg">
                    <div className="px-5 py-7 sm:px-6">
                        <div className='flex justify-between'>
                            <h3 className="text-2xl leading-6 font-semibold text-sky-900 max-w-2xl">
                                {salon.name}
                            </h3>
                            <div className='flex space-x-4'>
                                <a href={route('salons.edit', { salon: salon.id })}>
                                    <Button type="primary" shape="round" icon={<EditOutlined />} size={'large'} onClick={editSalon}>
                                        {lang.get('strings.Edit')}
                                    </Button>
                                </a>
                                <Button danger type="primary" shape="round" icon={<DeleteOutlined />} size={'large'} onClick={() => showDeleteModal(salon)} >
                                    {lang.get('strings.Delete')}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div class="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    <b>{lang.get('strings.Salon-ID')}:</b>
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {salon.id}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    <b>{lang.get('strings.Address')}:</b>
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {salon.address}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    <b>{lang.get('strings.Registration-Package')}:</b>
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {salon.package.name}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    <b>{lang.get('strings.Staff-Number')}:</b>
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {salon.num_staffs + ' / ' + salon.package.staff_number}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    <b>{lang.get('strings.Customer-Number')}:</b>
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {salon.num_customers + ' / ' + salon.package.customer_number}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    <b>{lang.get('strings.Status')}:</b>
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {salon.is_active === 'True' ? <Tag color="#108ee9">{lang.get('strings.Active')}</Tag>
                                        : <Tag size="large" color="#f50">{lang.get('strings.Inactive')}</Tag>}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    <b>{lang.get('strings.Creation-Time')}:</b>
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {salon.created_time}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}
