import React, { useState, useEffect } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { Form, Input, Radio, Button, notification } from 'antd';
import { useLang } from '../../Context/LangContext';
import { Inertia } from '@inertiajs/inertia'
import 'antd/dist/antd.css';

export default function Create(props) {
    const { lang } = useLang();
    const [form] = Form.useForm();
    const category = props[0].category;
    const categoryActives = props[0].category_active;

    const actives_option = categoryActives.map(
        (active_option, index) => {
            return {
                label: active_option,
                value: index,
            }
        }
    )

    const [valueActive, setValueActive] = useState(category.is_active);
    const onChangeActive = ({ target: { value } }) => {
        setValueActive(value);
    };

    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 12,
        },
    };
    const tailLayout = {
        wrapperCol: {
            offset: 6,
            span: 12,
        },
    };

    const onFinish = (values) => {
        Inertia.put(route('categories.update', {id: category.id}), values, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Updated'),
                    lang.get('strings.User-Updated-Noti')
                );
            },
            onError: (error) => {
                openNotification('error',
                    lang.get('strings.Somethings-went-wrong'),
                    error.update
                );
            }
        })
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
            <Head title="Edit User" />

            <div className="py-12">
                <div className="w-full mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <h3 className="text-2xl leading-6 font-medium text-gray-900">
                            {lang.get('strings.Edit-Category')}
                        </h3>
                    </div>
                    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                        <Form.Item
                            name="id"
                            label= {lang.get('strings.ID')}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            initialValue = {category.id}
                        >
                            <Input disabled={true}/>
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label= {lang.get('strings.Name')}
                            rules={[
                                {
                                    required: true,
                                    message: lang.get('strings.Input-Category-Name-Err'),
                                },
                            ]}
                            initialValue = {category.name}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item 
                            label={lang.get('strings.Active')}
                            name = "active"
                            required
                            initialValue={valueActive}
                        >
                            <Radio.Group options={actives_option} onChange={onChangeActive} value={valueActive} optionType="button" />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                {lang.get('strings.Update')}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Authenticated>
    );
}
