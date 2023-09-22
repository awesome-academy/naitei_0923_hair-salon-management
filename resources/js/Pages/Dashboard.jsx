import React, { useState, useMemo } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, useForm } from '@inertiajs/inertia-react';
import { useLang } from '../Context/LangContext';
import LineChart from '@/Components/LineChart';
import CustomModal from '@/Components/CustomModal';
import { Button, Select, Form, Input, notification } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Inertia } from '@inertiajs/inertia'
import 'antd/dist/antd.css';
import Label from '@/Components/Label';

export default function Dashboard(props) {
    const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);
    const [orderId, setOrderId] = useState(0);
    const [customerId, setCustomerId] = useState(0);
    const [selectQuantityModalOpen, setSelectQuantityModalOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productWithQuantity, setProductWithQuantity] = useState([]);
    const [nextOrder, setNextOrder] = useState(props[0].nextOrder);
    const { lang } = useLang();
    const [form] = Form.useForm();
    const [quantityForm] = Form.useForm();
    const showCreateOrderModal = () => {
        setCreateOrderModalOpen(true);

        setInitialValue();
    };

    const handleCancel = () => {
        setCreateOrderModalOpen(false);
        setSelectQuantityModalOpen(false);
    };

    const onFinish = (values) => {
        setCreateOrderModalOpen(false);
        setSelectQuantityModalOpen(true);
        setOrderId(values.orderId);
        setCustomerId(values.customerId);

        const selectedProducts = values.products; 

        const initialProductWithQuantity = selectedProducts.map(product => {
            return {
                id : product,
                quantity : 1,
            }
        })
        setProductWithQuantity(initialProductWithQuantity);
    };

    const setInitialValue = () => {
        form.setFieldsValue({
            orderId: nextOrder.order_id,
            customerId: nextOrder.customer_id,
        });
    };

    const options = [];
    for (let i = 0; i < nextOrder.products.length; i++) {
        options.push({
            label: nextOrder.products[i].name,
            value: nextOrder.products[i].id,
        });
    }

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const selectQuantityLayout = {
        labelCol: {
            span: 16,
        },
        wrapperCol: {
            span: 4,
        },
    };

    const tailLayout = {
        wrapperCol: {
            offset: 10,
            span: 16,
        },
    };

    const selectedProductsChange = (value) => {
        setSelectedProducts(value);
    }

    const selectQuantityFinish = (value) => {
        Inertia.post(route('orders.store'), { orderId: nextOrder.order_id, customerId: nextOrder.customer_id, products: value, salonId: props[0].selectedSalon }, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Registered'),
                    lang.get('strings.Order-Successfully-Created')
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

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const onQuantityChange = (productId, value) => {

        setProductWithQuantity(prev => {
            return prev.map(product => {
            if (product.id === productId) {
                return { ...product, quantity: parseInt(value) };
            }
            return product;})
        });
    }

    const modal = useMemo(() => {
        return <CustomModal
            forceRender
            open={createOrderModalOpen}
            title={lang.get('strings.Create-Order')}
            onCancel={handleCancel}
            footer={[]}
        >
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                <Form.Item
                    name="orderId"
                    label="Order ID"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    name="customerId"
                    label="Customer ID"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    name="products"
                    label="Products"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        style={{
                            width: '100%',
                            marginTop: 8,
                        }}
                        name="selectedProducts"
                        placeholder="Please select product"
                        onChange={selectedProductsChange}
                        options={options}
                    />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        {lang.get('strings.Create')}
                    </Button>
                    <Button htmlType="button" onClick={handleCancel}>
                        {lang.get('strings.Cancel')}
                    </Button>
                </Form.Item>
            </Form>
        </CustomModal>
    }, [createOrderModalOpen, lang]);

    const selectQuantityModal = useMemo(() => {
        return <CustomModal
            forceRender
            open={selectQuantityModalOpen}
            title={lang.get('strings.Select-Quantity')}
            onCancel={handleCancel}
            footer={[]}
        >
            <Form {...selectQuantityLayout} form={quantityForm} name="control-hooks" onFinish={selectQuantityFinish}>
                {selectedProducts.map(product => {
                    return <Form.Item
                        key={product}
                        name={product}
                        labelAlign="left"
                        label={<p className='text-lg'>{nextOrder.products.find(item => item.id === product).name}</p>}
                    >
                        <Input
                            type="number"
                            name={product}
                            className="mt-1 block w-full"
                            autoComplete={product}
                            onChange={(e) => onQuantityChange(product, e.target.value)} // Add this onChange handler
                            required
                            size="medium"
                        />
                    </Form.Item>
                })}
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        {lang.get('strings.Add')}
                    </Button>
                    <Button htmlType="button" onClick={handleCancel}>
                        {lang.get('strings.Cancel')}
                    </Button>
                </Form.Item>
            </Form>
        </CustomModal>
    }, [selectQuantityModalOpen, lang]);

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{lang.get('strings.dashboard')}</h2>}
        >
            <Head title="Dashboard" />
            {modal}
            {selectQuantityModal}
            <div className="py-6">
                <div className="flex justify-end px-8">
                    <Button type="primary" shape="round" icon={<EditOutlined />} size={'large'} onClick={showCreateOrderModal}>
                        {lang.get('strings.Create-Order')}
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <LineChart />
                </div>
            </div>
        </Authenticated>
    );
}
