import React from 'react';
import './Nav.scss';
import { Link } from 'react-router-dom';
import { UserData } from '../../modules/login/login.type';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../languageSwitcher/languageSwitcher';

type NavProps = {
    userInfo: UserData | null;
    logout: () => void;
};
export const Nav: React.FC<NavProps> = ({ userInfo, logout }): JSX.Element => {
    const { t } = useTranslation();
    return (
        <nav>
            <Link to="/home">{t('Header.MenuItems.Home')}</Link>
            <Link to="/reading">{t('Header.MenuItems.Reading')}</Link>
            <Link to="/listening">{t('Header.MenuItems.Listening')}</Link>
            <Link to="/words">{t('Header.MenuItems.Words')}</Link>
            <Link to="/quiz">{t('Header.MenuItems.Quiz')}</Link>
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
