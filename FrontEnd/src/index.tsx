import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App, { loadConfig } from './App';
import { BrowserRouter } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
loadConfig().then(() => {
    const root = ReactDOM.createRoot(document.getElementById('myApp')!);
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>
    );
});
