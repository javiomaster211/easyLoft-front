import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import 'antd/dist/reset.css'; // Reset CSS de Ant Design
import App from './App.tsx';
import './index.css';
import { antdTheme } from './theme/antd-config';

// Configurar dayjs en español
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={antdTheme} locale={esES}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
