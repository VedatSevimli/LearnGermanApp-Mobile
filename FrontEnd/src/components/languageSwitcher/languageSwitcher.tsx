import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './languageSwitcher.scss';
import useClickOutside from '../../hooks/useClickOutside';

export const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    useClickOutside(() => setDropdownOpen(false), [containerRef]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const changeLanguage = async (lng: string): Promise<void> => {
        if (lng !== localStorage.getItem('language')) {
            localStorage.setItem('language', lng);
            await i18n.changeLanguage(lng);
            window.location.reload();
        }
        setDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="language-switcher" ref={containerRef}>
            <select onClick={toggleDropdown} value={i18n.language}>
                <option value="en">EN</option>
                <option value="de">DE</option>
                <option value="tr">TR</option>
            </select>

            {/* Custom dropdown menu */}
            <div className={`custom-options ${dropdownOpen ? 'active' : ''}`}>
                <div className="option" onClick={() => changeLanguage('en')}>
                    {t('Components.language.Switcher.Language.English')}
                </div>
                <div className="option" onClick={() => changeLanguage('de')}>
                    {t('Components.language.Switcher.Language.German')}
                </div>
                <div className="option" onClick={() => changeLanguage('tr')}>
                    {t('Components.language.Switcher.Language.Turkish')}
                </div>
            </div>
        </div>
    );
};
