import React, { useState } from 'react';
import { Inertia } from "@inertiajs/inertia";

const DeleteUserForm = () => {
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleDeleteAccount = (e) => {
        e.preventDefault();

        Inertia.delete(route('profile.destroy', {password}), {
            onSuccess: () => {},
            onError: () => {},
        })

        setShowModal(false);
    };

    return (
        <section className="space-y-6">
            <header>
                <h2 className="text-lg font-medium text-black">
                    Delete Account
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
                </p>
            </header>

            <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(true)}
            >
                Delete Account
            </button>

            {showModal && (
                <div className="modal">
                    <form onSubmit={handleDeleteAccount} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Are you sure you want to delete your account?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.
                        </p>

                        <div className="mt-6">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="mt-1 block w-3/4"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            {/* Add code to display input errors */}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="bg-red-500 text-white px-4 py-2 ml-3 rounded"
                            >
                                Delete Account
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
};

export default DeleteUserForm;
