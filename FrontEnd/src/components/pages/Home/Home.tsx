import React from 'react';
import './Home.scss';

export const Home: React.FC = (): JSX.Element => {
    const getUser = localStorage.getItem('userInfo');
    const user = getUser ? JSON.parse(getUser) : null;
    return <div className="home">Hos Geldiniz, {user?.name ?? ''}</div>;
};
