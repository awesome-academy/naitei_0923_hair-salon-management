import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import UpdateProfileInformationForm from '@/Components/UpdateProfileInformationForm';
import UpdatePasswordForm from '@/Components/UpdatePasswordForm';
import DeleteUserForm from '@/Components/DeleteUserForm';
import { useLang } from '../../Context/LangContext';

const EditProfilePage = (props) => {

    const { lang } = useLang();

    const locale = {
        profileInformation: lang.get('strings.Profile-Information'),
        updateInformationEmail: lang.get('strings.Update-Information-Email'),
        firstName: lang.get('strings.First-Name'),
        lastName: lang.get('strings.Last-Name'),
        save: lang.get('strings.Save'),
        saved: lang.get('strings.Saved'),
        updatePassword: lang.get('strings.Update-Password'),
        ensureLongPassword: lang.get('strings.Ensure-Secure-Password'),
        currentPassword: lang.get('strings.Current-Password'),
        newPassword: lang.get('strings.New-Password'),
        confirmPassword: lang.get('strings.Confirm-Password'),
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{lang.get('strings.Profile')}</h2>}
        >
            <Head title={lang.get('strings.Profile')} />

            <div className="py-12">
                <div className="w-full mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white bg-zinc-200	shadow sm:rounded-lg">
                        <div className="max-w-xl">
                            <UpdateProfileInformationForm user={props.auth.user} locale={locale} />
                        </div>
                    </div>

                    <div className="p-4 sm:p-8 bg-white bg-zinc-200	shadow sm:rounded-lg">
                        <div className="max-w-xl">
                            <UpdatePasswordForm user={props.auth.user} locale={locale} />
                        </div>
                    </div>

                    <div className="p-4 sm:p-8 bg-white bg-zinc-200 shadow sm:rounded-lg">
                        <div className="max-w-xl">
                            <DeleteUserForm user={props.auth.user} locale={locale} />
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
};

export default EditProfilePage;
