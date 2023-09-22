import React, { useState } from 'react';
import { Button, notification, Modal } from 'antd';
import { EditOutlined, DeleteOutlined} from '@ant-design/icons';
import 'antd/dist/antd.css';
import { useLang } from '../../Context/LangContext';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

export default function DetailSalon (props) {
    const [isEditting, setIsEditting] = useState(false);
    const { lang } = useLang();
    const [category, setCategory] = useState(props[0].category);

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
        deleteSalon(record);
    };

    const deleteSalon = (record) => {
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
        >
            <Head title="Salon Detail" />
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
                </div>
            </div>
        </Authenticated>
    )
}
