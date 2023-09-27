import React from 'react';
import { useLang } from "@/Context/LangContext";

export default function ValidationErrors({ errors }) {
    const { lang } = useLang()

    return (
        Object.keys(errors).length > 0 && (
            <div className="mb-4">
                <div className="font-medium text-red-600">{lang.get('strings.Whoops!')} {lang.get('strings.Somethings-went-wrong')}</div>

                <ul className="mt-3 list-disc list-inside text-sm text-red-600">
                    {Object.keys(errors).map(function (key, index) {
                        return <li key={index}>{errors[key]}</li>;
                    })}
                </ul>
            </div>
        )
    );
}
