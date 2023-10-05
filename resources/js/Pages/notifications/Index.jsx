import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { Card } from 'antd';
import { useLang } from '../../Context/LangContext';
import { Inertia } from "@inertiajs/inertia";

export default function Index(props) {
    const { lang } = useLang();
    const removeNotification = (id) => {
        Inertia.delete(route('notifications.destroy', {id}), {}, {
            onSuccess: () => {},
            onError: () => {},
        });
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
        >
            <Head title="Notification" />

            <div className="py-12 rounded">
                <div className="w-full sm:px-6 lg:px-8">
                    <div className="text-2xl mb-5">Notifications</div>
                    <div className="w-full overflow-hidden sm:rounded-lg">
                        {
                            props.notifications.map((notification, index) => {
                                return (
                                    <Card
                                        title={notification.data.title}
                                        style={{
                                            width: '100%',
                                            marginBottom: 20,
                                        }}
                                        extra={<div onClick={() => {removeNotification(notification.id)}} className="cursor:pointer text-rose-600">{lang.get('strings.Remove')}</div>}
                                        headStyle={{
                                            backgroundColor: '#fff7e6',
                                            fontSize: 18,
                                            fontWeight: 600,
                                        }}
                                    >
                                        <p className="mb-3">{notification.data.message}</p>
                                        <i>{notification.creation_time}</i>
                                    </Card>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
