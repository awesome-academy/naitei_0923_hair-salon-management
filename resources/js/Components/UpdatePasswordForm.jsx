import React, { useState } from 'react';
import { Inertia } from "@inertiajs/inertia";

const UpdatePasswordForm = ({locale}) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordUpdated, setPasswordUpdated] = useState(false);

    const handleCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        Inertia.put(route('password.update'), {current_password: currentPassword, password: newPassword, password_confirmation: confirmPassword}, {
            onSuccess: () => {},
            onError: () => {}
        });

        setPasswordUpdated(true);
    };

    return (
        <section>
            <header>
                <h2 className="text-lg font-medium text-black">
                    {locale.updatePassword}
                </h2>

                <p className="mt-1 text-sm text-black">
                    {locale.ensureLongPassword}
                </p>
            </header>

            <form onSubmit={handleFormSubmit} className="mt-6 space-y-6">
                <div>
                    <label htmlFor="current_password">{locale.currentPassword}</label>
                    <input
                        id="current_password"
                        name="current_password"
                        type="password"
                        className="mt-1 block w-full"
                        value={currentPassword}
                        onChange={handleCurrentPasswordChange}
                        autoComplete="current-password"
                    />
                    {/* Add code to display input errors */}
                </div>

                <div>
                    <label htmlFor="password">{locale.newPassword}</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className="mt-1 block w-full"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        autoComplete="new-password"
                    />
                    {/* Add code to display input errors */}
                </div>

                <div>
                    <label htmlFor="password_confirmation">{locale.confirmPassword}</label>
                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        className="mt-1 block w-full"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        autoComplete="new-password"
                    />
                    {/* Add code to display input errors */}
                </div>

                <div className="flex items-center gap-4">
                    <button type="submit" className="bg-sky-600 px-5 py-2 rounded hover:bg-slate-800 hover:text-white">{locale.save}</button>

                    {passwordUpdated && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {locale.saved}
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
};

export default UpdatePasswordForm;
