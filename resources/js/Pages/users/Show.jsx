import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { Table, Button, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useLang } from '../../Context/LangContext';
import { Inertia } from '@inertiajs/inertia' 
import 'antd/dist/antd.css';

export default function Show(props) {
    const [user, setUser] = useState(props[0].user);
    const [userSalons, setUserSalons] = useState(props[0].userSalons);
    const { lang } = useLang();

    const salonRolecolumns = [
        {
            title: lang.get('strings.Salon'),
            dataIndex: 'salon_name',
            key: 'salon',
        },
        {
            title: lang.get('strings.Role'),
            dataIndex: 'role_name',
            key: 'role',
        },
    ];

    const editUser = () => {
        Inertia.get(route('users.edit', { user: user.id }));
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
        >
            <Head title="User" />

            <div className="py-12">
                <div className='w-1/2'>
                    <p className="mb-6 text-xl text-black px-2">{lang.get('strings.Role-In-Salons')}</p>
                    <Table dataSource={userSalons} columns={salonRolecolumns} bordered />;
                </div>
                <div className='w-full'>
                    <p className="mb-6 text-xl text-black px-2">{lang.get('strings.Profile')}</p>
                    <div className="bg-white w-full shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-7 sm:px-6">
                            <div className='flex justify-between'>
                                <h3 className="text-2xl leading-6 font-medium text-gray-900">
                                    {lang.get('strings.Fullname')}: {user.first_name + ' ' + user.last_name}
                                </h3>
                                <Button type="primary" shape="round" icon={<EditOutlined />} size={'large'} onClick={editUser}>
                                    {lang.get('strings.Edit')}
                                </Button>
                            </div>
                        </div>
                        <div class="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-md font-medium text-gray-500">
                                        {lang.get('strings.First-Name')}:
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.first_name}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-md font-medium text-gray-500">
                                        {lang.get('strings.Last-Name')}:
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.last_name}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-md font-medium text-gray-500">
                                        {lang.get('strings.Email')}:
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.email}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-md font-medium text-gray-500">
                                        {lang.get('strings.Phone')}:
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.phone}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-md font-medium text-gray-500">
                                        {lang.get('strings.Status')}:
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.is_active === 'True' ? <Tag color="#108ee9">{lang.get('strings.Active')}</Tag> : <Tag color="#f50">{lang.get('strings.Inactive')}</Tag>}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-md font-medium text-gray-500">
                                        {lang.get('strings.Created-at')}:
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.created_at}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-md font-medium text-gray-500">
                                        {lang.get('strings.Verified-at')}:
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.email_verified_at}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-md font-medium text-gray-500">
                                        {lang.get('strings.Updated-at')}:
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.updated_at}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
