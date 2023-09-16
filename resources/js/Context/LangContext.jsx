import React, { createContext, useContext, useState } from 'react';
import Lang from 'lang.js';
import messages from '../../../public/messages.json';

const LangContext = createContext();

export const LangProvider = ({ children }) => {

    const initialLocale = localStorage.getItem('locale') || 'en';

    const [locale, setLocale] = useState(initialLocale);

    const [lang, setLang] = useState(new Lang({
        messages: messages,
        locale: locale, // Use the locale state here
    }));

    const changeLocale = (newLocale) => {
        setLocale(newLocale);
        lang.setLocale(newLocale);
    };

    return (
        <LangContext.Provider value={{ lang, changeLocale }}>
            {children}
        </LangContext.Provider>
    );
};

export const useLang = () => {
    return useContext(LangContext);
};
