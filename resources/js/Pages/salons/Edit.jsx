import React, { useState } from 'react';
import { Button, notification, Modal, Form, Select, Input, InputNumber, Radio } from 'antd';
import 'antd/dist/antd.css';
import { useLang } from '../../Context/LangContext';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

export default function DetailSalon (props) {
    const { lang } = useLang();
    const salon = props[0].salon;
    const packages = props[0].packages;
    const salonActives = props[0].salon_active;

    const packages_option = packages.map(
        (packages_option) => {
            return {
                label: packages_option.name,
                value: packages_option.id,
            }
        }
    )

    const actives_option = salonActives.map(
        (active_option, index) => {
            return {
                label: active_option,
                value: index,
            }
        }
    )

    const [valuePackage, setValuePackage] = useState(salon.package_id);
    const [valueActive, setValueActive] = useState(salon.is_active);
   
    const onChangePackage = ({ target: { value } }) => {
        setValuePackage(value);
    };
    const onChangeActive = ({ target: { value } }) => {
        setValueActive(value);
    };

    const onFinish = (values) => {
        Inertia.put(route('salons.update',{salon: values}), values);
    };
    
    const onFinishFailed = (errorInfo) => {
    };

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
        >
            <Head title="Edit Salon" />
            <div className="py-12">
                <div className='sm:px-6 pb-6 lg:px-8 w-full'>
                    <h2 className='font-semibold text-2xl text-gray-800 leading-tight'>{lang.get('strings.Edit-Salon')}</h2>
                </div> 
                <div className="bg-white w-full shadow overflow-hidden pt-10 pb-4 border sm:rounded-lg">
                    <Form
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 14,
                        }}
                        layout="horizontal"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item 
                            label={lang.get('strings.Salon-ID')}
                            name = "id"
                            initialValue={salon.id}
                        >
                            <Input disabled={true}/>
                        </Form.Item>
                        <Form.Item 
                            label={lang.get('strings.Name')}
                            name = "name"
                            rules={[
                                {
                                  required: true,
                                  message: lang.get('strings.Input-Shop-Name-Err'),
                                },
                            ]}
                            initialValue={salon.name}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item 
                            label={lang.get('strings.Owner-Email')}
                            name = "owner_email"
                            initialValue={salon.owner_email}
                        >
                            <Input disabled={true}/>
                        </Form.Item>
                        <Form.Item 
                            label={lang.get('strings.Address')}
                            name = "address"
                            rules={[
                                {
                                  required: true,
                                  message: lang.get('strings.Input-Address-Err'),
                                },
                            ]}
                            initialValue={salon.address}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item 
                            label={lang.get('strings.Package')}
                            name = "package_id"
                            required
                            initialValue={valuePackage}
                        >
                            <Radio.Group options={packages_option} onChange={onChangePackage} value={valuePackage} optionType="button" />
                        </Form.Item>
                        <Form.Item 
                            label={lang.get('strings.Active')}
                            name = "active"
                            required
                            initialValue={valueActive}
                        >
                            <Radio.Group options={actives_option} onChange={onChangeActive} value={valueActive} optionType="button" />
                        </Form.Item>
                        <Form.Item 
                            wrapperCol={{
                                offset: 20,
                                span: 4,
                            }}
                        >
                            <Button type="primary" htmlType="submit" shape="round" size={'large'} className=" hover:bg-slate-300 hover:text-gray-950">
                                {lang.get('strings.Submit')}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Authenticated>
    )
}
