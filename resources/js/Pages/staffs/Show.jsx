import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Profile from '@/Components/Profile';
import { useLang } from '../../Context/LangContext';

export default function Show(props) {

    const [staff, setStaff] = useState(props[0].staff);
    const { lang } = useLang();

    const locale = {
        fullname : lang.get('strings.Fullname'),
        phone: lang.get('strings.Phone'),
        email: lang.get('strings.Email'),
        status: lang.get('strings.Status'),
        verifiedAt: lang.get('strings.Verified_at'),
        createdAt: lang.get('strings.Created_at'),
        updatedAt: lang.get('strings.Updated_at'),
        edit: lang.get('strings.Edit'),
        active: lang.get('strings.Active'),
        inactive: lang.get('strings.Inactive'),
        firstName: lang.get('strings.First-Name'),
        lastName: lang.get('strings.Last-Name'),
        staff: lang.get('strings.Staff'),
        role: lang.get('strings.Role'),
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
        >
            <Head title="Staff" />

            <div className="py-12">
                <Profile locale={locale} staff={staff} />
            </div>
        </Authenticated>
    );
}
