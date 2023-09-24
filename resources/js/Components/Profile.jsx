import React, { useState } from 'react';
import { Button, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Inertia } from '@inertiajs/inertia'
import 'antd/dist/antd.css';

const Profile = (props) => {
    const [staff, setStaff] = useState(props.staff);
    const locale = props.locale;

    const editUser = (e) => {
        Inertia.get(route('staffs.edit', { staff: staff.id }))
    };

    return (
        <div className="bg-white w-full shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-7 sm:px-6">
                <div className='flex justify-between'>
                    <h3 className="text-2xl leading-6 font-medium text-gray-900">
                        {locale.staff}: {staff.first_name + ' ' + staff.last_name}
                    </h3>
                    <Button type="primary" shape="round" icon={<EditOutlined />} size={'large'} onClick={editUser}>
                        {locale.edit}
                    </Button>
                </div>
            </div>
            <div class="border-t border-gray-200">
                <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-md font-medium text-gray-500">
                            {locale.firstName}:
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {staff.first_name}
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-md font-medium text-gray-500">
                            {locale.lastName}:
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {staff.last_name}
                        </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-md font-medium text-gray-500">
                            {locale.email}:
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {staff.email}
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-md font-medium text-gray-500">
                            {locale.phone}:
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {staff.phone}
                        </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-md font-medium text-gray-500">
                            {locale.role}:
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {staff.salon_role}
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-md font-medium text-gray-500">
                            {locale.status}:
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {staff.is_active === 'True' ? <Tag color="#108ee9">{locale.active}</Tag> : <Tag color="#f50">{locale.inactive}</Tag>}
                        </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-md font-medium text-gray-500">
                            {locale.createdAt}:
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {staff.created_at}
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-md font-medium text-gray-500">
                            {locale.verifiedAt}:
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {staff.email_verified_at}
                        </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-md font-medium text-gray-500">
                            {locale.updatedAt}:
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {staff.updated_at}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}

export default Profile;
