import React, { useState, useMemo, useEffect } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, useForm } from '@inertiajs/inertia-react';
import { useLang } from '../Context/LangContext';
import LineChart from '@/Components/LineChart';
import ColumnChart from '@/Components/ColumnChart';
import CustomModal from '@/Components/CustomModal';
import CustomTable from '@/Components/CustomeTable';
import { Button, Select, Form, Input, notification, DatePicker, Progress } from 'antd';
import { EditOutlined, DollarCircleOutlined, UserOutlined} from '@ant-design/icons';
import { Inertia } from '@inertiajs/inertia'
import axios from "axios";
import moment from 'moment';
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
    const { RangePicker } = DatePicker;
    const [today, setToday] = useState(props[0].today);
    const [firstDayInMonth, setFirstDayInMonth] = useState(props[0].firstDayInMonth);

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
                            min={1}
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

    const [dataRevenue, setDataRevenue] = useState([]);
    const [dayPicked, setDayPicked] = useState(0);
    const [revenueTotal, setRevenueTotal] = useState(0);
    const [customerTotal, setCustomerTotal] = useState(0);
    const [percentCustomerReturn, setPercentCustomerReturn] = useState(0);
    const [dataProducts, setDataProducts] = useState([]);

    useEffect(() => {
        updateDatePicker([moment(firstDayInMonth, 'YYYY-MM-DD'), moment(today, 'YYYY-MM-DD')]);
    }, []); 
    
    const updateDatePicker = (dates) => {
        const [startDate, endDate] = dates;
        const formattedStartDate = startDate.format('DD-MM-YYYY');
        const formattedEndDate = endDate.format('DD-MM-YYYY');
        axios.get(route('dashboard.getData', {startDate: formattedStartDate, endDate: formattedEndDate}))
            .then((response) => {
                console.log(response.data);
                setDataRevenue(updateRevenueData(response.data, startDate, endDate));
            })
            .catch((error) => {
                console.error(error);
            });
    };
    
    const updateRevenueData = (bills, startDate, endDate) => {
        const productsAll = [];
        const totalByDate = [];
        const customerAll = [];
        const customerUnique = [];

        bills.forEach(bill => {
            const date = bill.date;
            const total = bill.total;
            const customer_id = bill.customer_id
            if (totalByDate[date]) {
                totalByDate[date] += total;
            } else {
                totalByDate[date] = total;
            };
            if (customerAll[date]) {
                if (!customerAll[date].includes(customer_id)) {
                    customerAll[date].push(customer_id);
                }
            } else {
                customerAll[date] = [];
                customerAll[date].push(customer_id);
            };
            if (!customerUnique.includes(customer_id)) {
                customerUnique.push(customer_id);
            };
            bill.order.products.forEach(product => {
                if (productsAll[product.name]) {     
                    productsAll[product.name].quantity += product.pivot.quantity;
                } else {
                    productsAll[product.name] = {
                        cost: product.cost,
                        quantity: product.pivot.quantity,
                        inventory: product.quantity,
                    };
                }
            });
        });

        const revenueByDay = [];
        var day = 0;
        var revenueAll = 0;
        var customerCount = 0;
        const currentDate = new Date(startDate.format('YYYY-MM-DD'));
        while (currentDate <= new Date(endDate.format('YYYY-MM-DD'))) {
            day++;
            const formattedDate = formatDate(currentDate);
            if (totalByDate[formattedDate]) {
                revenueAll += totalByDate[formattedDate];
                customerCount += customerAll[formattedDate].length;
                revenueByDay.push(
                    {
                        date: formattedDate,
                        revenue: totalByDate[formattedDate],
                        customer: customerAll[formattedDate].length
                    }
                );
            } else {
                revenueByDay.push(
                    {
                        date: formattedDate,
                        revenue: 0,
                        customer: 0
                    }
                );
            }
            currentDate.setDate(currentDate.getDate() + 1); 
        }
        setDayPicked(day);
        setRevenueTotal(revenueAll);
        setCustomerTotal(customerCount);
        setPercentCustomerReturn(parseFloat((((customerCount - customerUnique.length) / customerCount) * 100).toFixed(0)) || '0');

        const productsSortQuantity = Object.entries(productsAll).sort((a, b) => b[1].quantity - a[1].quantity);
        const productsDataChart = []
        productsSortQuantity.forEach(product => {
            productsDataChart.push({
                product: product[0],
                sales: product[1].quantity,
                revenue: product[1].quantity * product[1].cost,
                percentRenvenue: parseFloat((((product[1].quantity * product[1].cost) / revenueAll) * 100).toFixed(2)),
                inventory: product[1].inventory
            })
        })
        setDataProducts(productsDataChart);
        
        return revenueByDay;
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${day}-${month}-${year}`;
    }

    const columns = [
        {
            title: lang.get('strings.Name'),
            dataIndex: 'product',
        },
        {
            title: lang.get('strings.Sales'),
            dataIndex: 'sales',
        },
        {
            title: lang.get('strings.Revenue'),
            dataIndex: 'revenue',
        },
        {
            title: lang.get('strings.%-Renvenue'),
            dataIndex: 'percentRenvenue',
        },
        {
            title: lang.get('strings.Inventory'),
            dataIndex: 'inventory',
        },
    ];

    const onTableChange = (pagination, filters, sorter, extra) => { };

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
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
            <div className="w-1/2 flex gap-3 px-3 justify-start items-center mt-7">
                <div className='text-slate-800 text-base'>{lang.get("strings.Select-Date")}: </div>
                <RangePicker onChange={(dates) => updateDatePicker(dates)} defaultValue={[moment(firstDayInMonth, 'YYYY-MM-DD'),moment(today, 'YYYY-MM-DD')]} />
            </div>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-xl p-8 my-4">
                <div>
                    <LineChart data={dataRevenue} nameChart={'Revenue vs Customer'} xField={'date'} yField={['revenue', 'customer']}/>
                </div>
                <div className='grid grid-cols-2 gap-1'>
                    <div className="flex flex-col items-center">
                        <h1 className="mb-10 mt-8 text-2xl font-bold">{lang.get('strings.Revenue-Total')}</h1>
                        <Progress type="circle" percent={100} format={() => dayPicked + ' '+lang.get('strings.Days')} width={200} />
                        <h1 className="pt-10 text-4xl font-bold">
                            <span className='text-rose-600 text-4xl'>$ {revenueTotal}</span>
                        </h1>
                    </div>
                    <div className="flex flex-col items-center">
                        <h1 className="mb-10 mt-8 text-2xl font-bold">{lang.get('strings.Customers-Return-Percent')}</h1>
                        <Progress type="circle" percent={percentCustomerReturn} format={() => percentCustomerReturn + ' '+lang.get('strings.%')} width={200} />
                        <div className="pt-10">
                            <div className='flex gap-2 items-center'>
                                <div className='text-lg'>{lang.get("strings.Customer-Total")}</div>
                                <div className='flex items-center'>
                                    <span className='text-rose-600 text-lg'>{customerTotal}</span>
                                    <UserOutlined style={{ color: '#1890ff', fontSize: 18 }}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-xl p-8 my-4">
                <div>
                    <ColumnChart data={dataProducts} nameChart={'Products'} xField={'product'} yField={['sales','revenue']}/>
                </div>
                <div className="flex flex-col items-center">
                    <h1 className="mb-10 mt-8 text-2xl font-bold">{lang.get('strings.Best-Sale')}</h1>
                    <CustomTable
                        bordered
                        columns={columns}
                        dataSource={dataProducts.slice(0, 6)}
                        onChange={onTableChange}
                        pagination={false}
                    />
                </div>
            </div>
        </Authenticated>
    );
}
