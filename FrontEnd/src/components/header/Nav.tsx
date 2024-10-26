import React from 'react';
import './Nav.scss';
import { Link, NavLink } from 'react-router-dom';
import { UserData } from '../../modules/login/login.type';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../languageSwitcher/languageSwitcher';
import { useMediaQuery } from 'react-responsive';
import {
    home_svg,
    listening_svg,
    login_svg,
    quiz_svg,
    reading_svg,
    verb_svg
} from '../../images/image';

type NavProps = {
    userInfo: UserData | null;
    logout: () => void;
};
export const Nav: React.FC<NavProps> = ({ userInfo, logout }): JSX.Element => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    return (
        <nav>
            <NavLink
                to="/home"
                className={({ isActive }) => (isActive ? 'active-tab' : '')}
            >
                {isMobile ? (
                    <img src={home_svg} alt="Home" />
                ) : (
                    t('Header.MenuItems.Home')
                )}
            </NavLink>
            <NavLink
                to="/words"
                className={({ isActive }) => (isActive ? 'active-tab' : '')}
            >
                {isMobile ? (
                    <img src={verb_svg} alt="Verbs" />
                ) : (
                    t('Header.MenuItems.Words')
                )}
            </NavLink>
            <NavLink
                to="/reading"
                className={({ isActive }) => (isActive ? 'active-tab' : '')}
            >
                {isMobile ? (
                    <img src={reading_svg} alt="Reading" />
                ) : (
                    t('Header.MenuItems.Reading')
                )}
            </NavLink>
            <NavLink
                to="/listening"
                className={({ isActive }) => (isActive ? 'active-tab' : '')}
            >
                {isMobile ? (
                    <img src={listening_svg} alt="Listening" />
                ) : (
                    t('Header.MenuItems.Listening')
                )}
            </NavLink>

            <NavLink
                to="/quiz"
                className={({ isActive }) => (isActive ? 'active-tab' : '')}
            >
                {isMobile ? (
                    <img src={quiz_svg} alt="Quiz" />
                ) : (
                    t('Header.MenuItems.Quiz')
                )}
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
                <Link to="/login">
                    {isMobile ? <img src={login_svg} alt="" /> : 'Login'}
                </Link>
            )}
        </nav>
    );
};
