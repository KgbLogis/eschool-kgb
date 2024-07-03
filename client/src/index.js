import React from 'react';
import { createRoot  } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { ConfigProvider } from 'antd';
import './index.css';
import './antd.css';
import App from './App';
import { client } from 'configs/ApolloConfig';
import { UserContextProvider } from 'hooks/UserContextProvider';
import { IntlProvider } from "react-intl";
import 'braft-editor/dist/index.css';
import 'moment/locale/mn';
import AppLocale from "lang";
import moment from "moment";
// import "assets/icons/remixicon.css";
// import "assets/css/light-theme.css";

const storageLang = localStorage.getItem('locale')
const currentAppLocale = AppLocale[storageLang]
moment.locale(currentAppLocale.locale);
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <ConfigProvider locale={currentAppLocale.antd}>
        <ApolloProvider client={client}>
            <UserContextProvider>
                <UserContextProvider>
                    <IntlProvider
                        locale={currentAppLocale.locale}
                        messages={currentAppLocale.messages}
                    >
                        <App />
                    </IntlProvider>
                </UserContextProvider>
            </UserContextProvider>
        </ApolloProvider>
    </ConfigProvider>
);