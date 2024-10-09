import React from 'react';
import { Link } from 'react-router-dom';
import './footer.scss';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="footer-links">
                <Link to="/home">{t('Footer.MenuItems.Home')}</Link>
                <Link to="/reading">{t('Footer.MenuItems.Reading')}</Link>
                <Link to="/listening">{t('Footer.MenuItems.Listening')}</Link>
                <Link to="/words">{t('Footer.MenuItems.Words')}</Link>
                <Link to="/quiz">{t('Footer.MenuItems.Quiz')}</Link>
                <Link to="/">&#9400; Copyright Sevimli GmbH</Link>
            </div>
        </footer>
    );
};
