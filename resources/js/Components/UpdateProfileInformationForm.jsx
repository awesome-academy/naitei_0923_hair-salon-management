import React, { useState } from 'react';
import { Inertia } from "@inertiajs/inertia";
import { Button } from 'antd';

const UpdateProfileInformationForm = ({ user, locale }) => {
    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);
    const [email, setEmail] = useState(user.email);
    const [verificationSent, setVerificationSent] = useState(false);
    const [profileUpdated, setProfileUpdated] = useState(false);

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        Inertia.put(route('profile.update', {id: user.id}), {firstName, lastName, email}, {
            onSuccess: () => {},
            onError: () => {},
        })
        
        setProfileUpdated(true);
    };

    const handleSendVerification = (e) => {
        e.preventDefault();
        // Add code to send email verification
        // Once the verification is sent, you can set verificationSent to true.
        setVerificationSent(true);
    };

    return (
        <section>
            <header>
                <h2 className="text-lg font-medium text-black">
                    {locale.profileInformation}
                </h2>

                <p className="mt-1 text-sm text-black">
                    {locale.updateInformationEmail}
                </p>
            </header>

            <form id="send-verification" onSubmit={handleSendVerification}>
                <input type="hidden" name="_token" value="{/* Add CSRF token value here */}" />
            </form>

            <form onSubmit={handleFormSubmit} className="mt-6 space-y-6">
                <div>
                    <label htmlFor="name">{locale.firstName}</label>
                    <input
                        id="firstName"
                        name="lastName"
                        type="text"
                        className="mt-1 block w-full"
                        value={firstName}
                        onChange={handleFirstNameChange}
                        required
                        autoFocus
                        autoComplete="firstName"
                    />
                </div>

                <div>
                    <label htmlFor="name">{locale.lastName}</label>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        className="mt-1 block w-full"
                        value={lastName}
                        onChange={handleLastNameChange}
                        required
                        autoComplete="lastName"
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        autoComplete="username"
                    />
                    {/* Add code to display input errors */}
                </div>

                <div className="flex items-center gap-4">
                    <button type="submit" className="bg-sky-600 px-5 py-2 rounded hover:bg-slate-800 hover:text-white">{locale.save}</button>

                    {profileUpdated && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {locale.saved}
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
};

export default UpdateProfileInformationForm;
