import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { Button, notification, Modal, Input, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLang } from '../../Context/LangContext';
import CustomTable from '@/Components/CustomeTable';
import { Inertia } from '@inertiajs/inertia';
import 'antd/dist/antd.css';

export default function Salons(props) {
    const [salons, setSalons] = useState(props[0].salons);
    const [searchValue, setSearchValue] = useState('');
    const { Search } = Input;
    const { lang } = useLang();

    const filters_package = salons.map(
        salon => {
            return {
                text: salon.package.name + ' - ' + salon.package.id,
                value: salon.package.id,
            }
        }
    ).filter(
        (item, index, self) => {
            return self.findIndex((otherItem) => otherItem.text === item.text) === index;
        }
    );

    const filters_active = salons.map(
        salon => {
            return {
                text: salon.is_active,
                value: salon.is_active,
            }
        }
    ).filter(
        (item, index, self) => {
            return self.findIndex((otherItem) => otherItem.text === item.text) === index;
        }
    );

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: lang.get('strings.Salon-Name'),
            dataIndex: 'name',
        },
        {
            title: lang.get('strings.Address'),
            dataIndex: 'address',
        },
        {
            title: lang.get('strings.Owner-Email'),
            dataIndex: 'owner_email',
        },
        {
            title: lang.get('strings.Registration-Package'),
            dataIndex: 'package_id',
            filters: filters_package,
            onFilter: (value, record) => record.package_id === value,
        },
        {
            title: lang.get('strings.Staff-Number'),
            dataIndex: 'num_staffs',
            sorter: (a, b) => a.num_staffs - b.num_staffs,
        },
        {
            title: lang.get('strings.Customer-Number'),
            dataIndex: 'num_customers',
            sorter: (a, b) => a.num_customers - b.num_customers,
        },
        {
            title: lang.get('strings.Active'),
            dataIndex: 'is_active',
            filters: filters_active,
            onFilter: (value, record) => record.is_active === value,
        },
        {
            title: lang.get('strings.Action'),
            render: (text, record) => {
                return (
                    <div className='flex gap-2'>
                        <div className='pb-2'>
                            <a href={route('salons.edit', {salon : record.id})}>
                                <Tooltip title="Edit">
                                    <EditOutlined style={{ fontSize: 19, color: '#1c5dfd' }}/>
                                </Tooltip>
                            </a>
                        </div>
                        <div className='pb-2'>
                            <a href={route('salons.show', {salon : record.id})}>
                                <Tooltip title="View">
                                    <EyeOutlined style={{ fontSize: 19 }} />
                                </Tooltip>
                            </a>
                        </div>
                        <div className='pb-2'>
                            <Tooltip title="Delete">
                                    <DeleteOutlined style={{ fontSize: 19, color: '#e80101' }} onClick={() => showDeleteModal(record)} />
                            </Tooltip>
                        </div>
                    </div>
                )
            }
        },
    ];

    const onTableChange = (pagination, filters, sorter, extra) => {};

    const onSearch = (value, _e, info) => {
        setSearchValue(value);
        setSalons(setSalonSearchValue(value, searchValue));
    };

    const setSalonSearchValue = (value, valuePrev) => {
        if (valuePrev !== '' && value !== '') {
            const salonsSearched = [];
            props[0].salons.forEach( (salon) => {
                if (salon.id == value
                    || salon.name.includes(value)
                    || salon.owner_email.includes(value)
                ) {
                    salonsSearched.push(salon);
                };
            });
            return salonsSearched;
        } else {
            if (value === '') {
                return props[0].salons;
            } else {
                const salonsSearched = [];
                salons.forEach( (salon) => {
                    if (salon.id == value
                        || salon.name.includes(value)
                        || salon.owner_email.includes(value)
                    ) {
                        salonsSearched.push(salon);
                    };
                });
                return salonsSearched;
            }
        }
    };

    const showDeleteModal = (record) => {
        const modalDelete = Modal.warning();
        modalDelete.update({
            title: "Delete Salon",
            closable: true,
            okText: "Delete",
            onOk: () => handleOkDeleteModal(modalDelete, record),
            content:(
                <>
                    <h2 style={{color: '#FF3355'}}>{lang.get('strings.Confirm-Delete-Salon')}</h2>
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
            <Head title="Salons" />
            <div className="py-12">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold text-2xl text-gray-800 leading-tight'>{lang.get('strings.Salons')}</h2>
                </div>
                <div className="flex justify-end w-full mr:3 mb-8 sm:px-6 lg:px-8">
                    <Search placeholder="input id, salon name, owner email"
                        onSearch={onSearch} enterButton bordered
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
                        dataSource={salons}
                        onChange={onTableChange} />
                </div>
            </div>
        </Authenticated>
    );
}
