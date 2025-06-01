import React from 'react';
import { Nav } from './Nav';
import './Header.scss';
import { useUser } from '../../context/userContext/userContext';
import { logo } from '../../images/image';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
    //
};
export const Header: React.FC<HeaderProps> = (props): JSX.Element => {
    const { userData, logout } = useUser();
    const navigate = useNavigate();

    return (
        <div className="header-wrapper">
            <div className="company" onClick={() => navigate('home')}>
                <img className="logo" src={logo} alt="" />
            </div>

            <Nav userInfo={userData} logout={logout} />
        </div>
    );
};
