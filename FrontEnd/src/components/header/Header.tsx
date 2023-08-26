import React from 'react';
import { Nav } from './Nav';
import logo from '../../images/language-svgrepo-com.svg';
import './Header.scss';

type HeaderProps = {
    userInfo: any;
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};
export const Header: React.FC<HeaderProps> = ({
    userInfo,
    setAuthenticated
}): JSX.Element => {
    return (
        <div className="header-wrapper">
            <div className="company">
                <img className="logo" src={logo} alt="" />
            </div>

            <Nav userInfo={userInfo} setAuthenticated={setAuthenticated} />
        </div>
    );
};
