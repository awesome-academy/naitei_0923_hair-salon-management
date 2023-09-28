import React, {useState} from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { useLang } from '../../Context/LangContext';
import { Button, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Inertia } from '@inertiajs/inertia'
import 'antd/dist/antd.css';

export default function Show(props) {

    const [product, setProduct] = useState(props[0].product);
    const { lang } = useLang();

    const editProduct = () => {
        Inertia.get(route('products.edit', { product: product.id }));
    };

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
        >
            <Head title="Staff" />

            <div className="py-12">
                <div className="bg-white w-full shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-7 sm:px-6">
                        <div className='flex justify-between'>
                            <h3 className="text-2xl leading-6 font-medium text-gray-900">
                                {lang.get('strings.Product')}: {product.name}
                            </h3>
                            <Button type="primary" shape="round" icon={<EditOutlined />} size={'large'} onClick={editProduct}>
                                {lang.get('strings.Edit')}
                            </Button>
                        </div>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    {lang.get('strings.Category')}:
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {product.category}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    {lang.get('strings.Unit')}:
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {product.unit}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    {lang.get('strings.Cost-Per-Unit')}:
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {product.cost}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    {lang.get('strings.Description')}:
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {product.description}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    {lang.get('strings.Status')}:
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                     {product.is_active === 1 ? <Tag color="#108ee9">{lang.get('strings.Active')}</Tag> : <Tag color="#f50">{lang.get('strings.Inactive')}</Tag>}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    {lang.get('strings.Creation-Time')}:
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {product.created_at}
                                </dd>
                            </div>
                             <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-md font-medium text-gray-500">
                                    {lang.get('strings.Updated-At')}:
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {product.updated_at}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
