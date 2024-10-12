import React from 'react';
import './Nav.scss';
import { Link, NavLink, useParams } from 'react-router-dom';
import { UserData } from '../../modules/login/login.type';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../languageSwitcher/languageSwitcher';

type NavProps = {
    userInfo: UserData | null;
    logout: () => void;
};
export const Nav: React.FC<NavProps> = ({ userInfo, logout }): JSX.Element => {
    const { t } = useTranslation();
    const { activeNav } = useParams();
    console.log(activeNav);
    return (
        <nav>
            <NavLink
                to="/home"
                className={({ isActive }) => (isActive ? 'active-tab' : '')}
            >
                {t('Header.MenuItems.Home')}
            </NavLink>
            <NavLink
                to="/reading"
                className={({ isActive }) => (isActive ? 'active-tab' : '')}
            >
                {t('Header.MenuItems.Reading')}
            </NavLink>
            <NavLink
                to="/listening"
                className={({ isActive }) => (isActive ? 'active-tab' : '')}
            >
                {t('Header.MenuItems.Listening')}
            </NavLink>
            <NavLink
                to="/words"
                className={({ isActive }) => (isActive ? 'active-tab' : '')}
            >
                {t('Header.MenuItems.Words')}
            </NavLink>
            <NavLink
                to="/quiz"
                className={({ isActive }) => (isActive ? 'active-tab' : '')}
            >
                {t('Header.MenuItems.Quiz')}
            </NavLink>
            <LanguageSwitcher></LanguageSwitcher>
            {userInfo ? (
                <div className="user-info">
                    <div className="user-icon">
                        {userInfo?.name[0]?.toUpperCase()}
                    </div>
                    <div className="user-dropdown">
                        <span onClick={logout}>
                            {t('Header.MenuItems.Logout')}
                        </span>
                        <Link to="/news">Nachrichten</Link>
                    </div>
                </div>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    );
};
