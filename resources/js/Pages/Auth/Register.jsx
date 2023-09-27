import React, { useEffect } from 'react';
import Button from '@/Components/Button';
import Guest from '@/Layouts/Guest';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import ValidationErrors from '@/Components/ValidationErrors';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import { Select, notification } from 'antd';
import { useLang } from '../../Context/LangContext';

export default function Register(props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        password_confirmation: '',
        salonName: '',
        address: '',
        staffNumber: 0,
        seatNumber: 0,
        registrationPackage: '',
    });
    const { lang } = useLang();

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Registered'),
                    lang.get('strings.Please-wait')
                );
                reset();
            },
        });
    };

    const registrationPackages = props.packages.map(pk => { return { value: pk.id, label: pk.name } });

    const onSelectedPackageChange = (value) => {
        setData(prevData => { return { ...prevData, registrationPackage: value } });
    };

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    return (
        <Guest>
            <Head title={lang.get('strings.Register')} />

            <ValidationErrors errors={errors} />

            <form className="pb-20" onSubmit={submit}>
                <div className="mt-4">
                    <Label forInput="firstName" value={lang.get('strings.First-Name')} />

                    <Input
                        type="text"
                        name="firstName"
                        value={data.firstName}
                        className="mt-1 block w-full"
                        autoComplete="firstName"
                        isFocused={true}
                        handleChange={onHandleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="lastName" value={lang.get('strings.Last-Name')} />

                    <Input
                        type="text"
                        name="lastName"
                        value={data.lastName}
                        className="mt-1 block w-full"
                        autoComplete="lastName"
                        isFocused={true}
                        handleChange={onHandleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="email" value="Email" />

                    <Input
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        handleChange={onHandleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="phoneNumber" value={lang.get('strings.Phone')} />

                    <Input
                        type="text"
                        name="phoneNumber"
                        value={data.phoneNumber}
                        className="mt-1 block w-full"
                        autoComplete="phoneNumber"
                        handleChange={onHandleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="password" value={lang.get('strings.Password')} />

                    <Input
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        handleChange={onHandleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="password_confirmation" value={lang.get('strings.Confirm-Password')} />

                    <Input
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        handleChange={onHandleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="salonName" value={lang.get('strings.Salon-Name')}/>

                    <Input
                        type="text"
                        name="salonName"
                        value={data.salonName}
                        className="mt-1 block w-full"
                        autoComplete="salonName"
                        handleChange={onHandleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="address" value={lang.get('strings.Address')}/>

                    <Input
                        type="text"
                        name="address"
                        value={data.address}
                        className="mt-1 block w-full"
                        autoComplete="address"
                        handleChange={onHandleChange}
                        required
                    />
                </div>

                <div className="mt-4 flex gap-x-4">
                    <div className="w-1/3">
                        <Label forInput="staffNumber" value={lang.get('strings.Staff-Number')} />

                        <Input
                            type="number"
                            name="staffNumber"
                            value={data.staffNumber}
                            className="mt-1 block w-full"
                            autoComplete="staffNumber"
                            handleChange={onHandleChange}
                            required
                        />
                    </div>
                    <div className="w-1/3">
                        <Label forInput="seatNumber" value={lang.get('strings.Seat-Number')} />

                        <Input
                            type="number"
                            name="seatNumber"
                            value={data.seatNumber}
                            className="mt-1 block w-full"
                            autoComplete="seatNumber"
                            handleChange={onHandleChange}
                            required
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <Label className="mb-3" forInput="registrationPackage" value={lang.get('strings.Registration-Package')} />

                    <Select
                        placeholder="Select a package"
                        onChange={onSelectedPackageChange}
                        options={registrationPackages}
                        size='large'
                        className='w-1/3'
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link href={route('login')} className="underline text-sm text-gray-600 hover:text-gray-900">
                        {lang.get('strings.Already-registered')}
                    </Link>

                    <Button className="ml-4" processing={processing}>
                        {lang.get('Register')}
                    </Button>
                </div>
            </form>
        </Guest>
    );
}
