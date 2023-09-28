import React, { useState, useEffect } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import Button from '@/Components/Button';
import { Head } from '@inertiajs/inertia-react';
import { useLang } from '../Context/LangContext';
import CustomTable from '@/Components/CustomeTable';
import { Input, notification, Tag } from 'antd';
import { Inertia } from '@inertiajs/inertia'
import 'antd/dist/antd.css';

export default function Registrations(props) {

    const [registrations, setRegistrations] = useState(props.registrations);
    const [searchValue, setSearchValue] = useState('');
    const { lang } = useLang();
    const { Search } = Input;

    useEffect(() => {
        setRegistrations(props.registrations.filter(item => (
            item.id.toString().includes(searchValue.toString()) ||
            item.phone.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.salon_name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.address.toLowerCase().includes(searchValue.toLowerCase())
        )));
    }, [searchValue])

    const accept = (e, record) => {

        e.preventDefault();
        Inertia.post('/salons', record, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Accepted'),
                    lang.get('strings.Accepted-Salon-Added')
                );
            },
            onError: (error) => {
                openNotification('error',
                    lang.get('strings.Somethings-went-wrong'),
                    error.store
                );
            }
        });
    }

    const reject = (e, record) => {
        e.preventDefault();

        Inertia.put(route('registrations.reject', { registration: record }), record, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Rejected'),
                    lang.get('strings.Salon-Rejected')
                );
            },
            onError: (error) => {
                openNotification('error',
                    lang.get('strings.Somethings-went-wrong'),
                    error.reject
                );
            }
        });
    }

    const searchChangeHandler = (e) => {
        e.preventDefault();

        setSearchValue(e.target.value);
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone',
        },
        {
            title: 'Salon Name',
            dataIndex: 'salon_name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Staff Number',
            dataIndex: 'staffs_number',
            align: 'center',
            sorter: (a, b) => a.staffs_number - b.staffs_number,
        },
        {
            title: 'Seat Number',
            dataIndex: 'seats_number',
            align: 'center',
            sorter: (a, b) => a.seats_number - b.seats_number,
        },
        {
            title: 'Registration Package',
            dataIndex: 'registration_package',
        },
        {
            title: 'Action',
            filters: [
                {
                    text: 'Waiting',
                    value: 'Waiting',
                },
                {
                    text: 'Accepted',
                    value: 'Accepted',
                },
                {
                    text: 'Rejected',
                    value: 'Rejected',
                },
            ],
            onFilter: (value, record) => record.status === value,
            render: (text, record) => {
                return (
                    record.status === 'Accepted' ?
                        <div>
                            <Tag color="#108ee9">{lang.get('strings.Accepted')}</Tag>
                        </div> : (
                            record.status === 'Rejected' ?
                                <div>
                                    <Tag color="#f50">{lang.get('strings.Rejected')}</Tag>
                                </div> :
                                <div className='flex gap-x-1.5'>
                                    <form onSubmit={(e) => { accept(e, record) }}>
                                        <div>
                                            <Button disabled={true} type="submit" className="hover:bg-slate-300 hover:text-gray-950">{lang.get('strings.Accept')}
                                            </Button>
                                        </div>
                                    </form>
                                    <form onSubmit={(e) => { reject(e, record) }}>
                                        <div>
                                            <Button type="submit" className="hover:bg-slate-300 hover:text-gray-950">{lang.get('strings.Reject')}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                        )
                )
            }
        },
    ];

    const onTableChange = (pagination, filters, sorter, extra) => {

    };

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
            <Head title="Registrations" />
            <div className="py-12">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold text-2xl text-gray-800 leading-tight'>{lang.get('strings.Registrations')}</h2>
                </div>
                <div className="flex justify-end w-full mr:3 mb-8 sm:px-6 lg:px-8">
                    <Search placeholder="input id, salon name, address"
                        enterButton bordered
                        size="large"
                        allowClear
                        onChange={ searchChangeHandler }
                        style={{
                            width: 304,
                        }} />

                </div>
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <CustomTable
                        bordered
                        columns={columns}
                        dataSource={registrations}
                        onChange={onTableChange}
                        onRow={(record, index) => ({
                            style: {
                                background: record.status === 'Accepted' ? '#e6f4ff' : (record.status === 'Rejected' ? '#fff1f0' : '#feffe6'),
                            }
                        })}
                    />
                </div>
            </div>
        </Authenticated>
    );
}
