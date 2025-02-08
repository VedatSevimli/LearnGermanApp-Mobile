import React from 'react';
import { Nav } from './Nav';
import logo from '../../images/language_svgrepo_com.svg';
import './Header.scss';
import { useUser } from '../../context/userContext/userContext';

type HeaderProps = {
    //
};
export const Header: React.FC<HeaderProps> = (props): JSX.Element => {
    const { userData, logout } = useUser();

    return (
        <div className="header-wrapper">
            <div className="company">
                <img className="logo" src={logo} alt="" />
            </div>

            <Nav userInfo={userData} logout={logout} />
        </div>
    );
};
