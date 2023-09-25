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

export default function Dashboard(props) {
    const [createInstantOrderModalOpen, setCreateInstantOrderModalOpen] = useState(false);
    const [createCustomerOrderModalOpen, setCreateCustomerOrderModalOpen] = useState(false);
    const [customerId, setCustomerId] = useState(-1);
    const [selectQuantityModalOpen, setSelectQuantityModalOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productWithQuantity, setProductWithQuantity] = useState([]);
    const [nextOrder, setNextOrder] = useState(props[0].nextOrder);
    const { lang } = useLang();
    const [instantForm] = Form.useForm();
    const [customerForm] = Form.useForm();
    const [quantityForm] = Form.useForm();
    const customers = props[0].customers.map(customer => { return { label: customer.phone, value: customer.id } });

    const showCreateInstantOrderModal = () => {
        setCreateInstantOrderModalOpen(true);

        setInstantInitialValue();
    };

    const showCreateCustomerOrderModal = () => {
        setCreateCustomerOrderModalOpen(true);

        setCustomerInitialValue();
    }

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleCancel = () => {
        setCreateInstantOrderModalOpen(false);
        setCreateCustomerOrderModalOpen(false);
        setSelectQuantityModalOpen(false);
    };

    const onInstantOrderFinish = (values) => {
        setCreateInstantOrderModalOpen(false);
        setSelectQuantityModalOpen(true);

        const selectedProducts = values.products;

        const initialProductWithQuantity = selectedProducts.map(product => {
            return {
                id: product,
                quantity: 1,
            }
        })
        setProductWithQuantity(initialProductWithQuantity);
    };

    const setInstantInitialValue = () => {
        instantForm.setFieldsValue({
            serial: nextOrder.next_serial
        });
    };

    const setCustomerInitialValue = () => {
        customerForm.setFieldsValue({
            serial: nextOrder.next_serial,
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

    const onCustomerOrderFinish = (value) => {
        setCreateCustomerOrderModalOpen(false);
        setSelectQuantityModalOpen(true);
        setCustomerId(value.customer_id);
    }


    const selectQuantityFinish = (value) => {
        Inertia.post(route('orders.store'), { products: value, customerId: customerId, salonId: props[0].salon }, {
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
                return product;
            })
        });
    }

    const instantModal = useMemo(() => {
        return <CustomModal
            forceRender
            open={createInstantOrderModalOpen}
            title={lang.get('strings.Create-Instant-Order')}
            onCancel={handleCancel}
            footer={[]}
        >
            <Form {...layout} form={instantForm} name="control-hooks" onFinish={onInstantOrderFinish}>
                <Form.Item
                    name="serial"
                    label="Today serial"
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
    }, [createInstantOrderModalOpen, lang]);


    const customerModal = useMemo(() => {
        return <CustomModal
            forceRender
            open={createCustomerOrderModalOpen}
            title={lang.get('strings.Create-Customer-Order')}
            onCancel={handleCancel}
            footer={[]}
        >
            <Form {...layout} form={customerForm} name="control-hooks" onFinish={onCustomerOrderFinish}>
                <Form.Item
                    name="serial"
                    label="Today serial"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    name="customer_id"
                    label="Customer"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Input phone number"
                        optionFilterProp="children"
                        filterOption={filterOption}
                        options={customers}
                    />
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
    }, [createCustomerOrderModalOpen, lang]);

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
    }, [selectQuantityModalOpen, lang, customerId]);

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{lang.get('strings.dashboard')}</h2>}
        >
            <Head title="Dashboard" />
            {instantModal}
            {customerModal}
            {selectQuantityModal}
            <div className="py-6">
                <div className="flex justify-end px-8 gap-2">
                    <Button type="primary" shape="round" icon={<EditOutlined />} size={'large'} onClick={showCreateInstantOrderModal}>
                        {lang.get('strings.Create-Instant-Order')}
                    </Button>
                    <Button style={{ background: "#bae637", border: 'none', color: '#000' }} type="primary" shape="round" icon={<EditOutlined />} size={'large'} onClick={showCreateCustomerOrderModal}>
                        {lang.get('strings.Create-Customer-Order')}
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
