import React, { useState } from 'react';
import './dropDown.scss';

export type DropDownProps = {
    options: string[];
    defaultOption: string;
    onSelect: (option: string) => void;
    className?: string;
};

export const DropDown: React.FC<DropDownProps> = ({
    className,
    options,
    defaultOption,
    onSelect
}) => {
    const [selectedOption, setSelectedOption] = useState(defaultOption || '');

    const handleOptionChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
        const option = ev.target.value;
        setSelectedOption(option);
        onSelect(option);
    };

    return (
        <div className={`DropDown ${className}`}>
            <select value={selectedOption} onChange={handleOptionChange}>
                {defaultOption && (
                    <option value={defaultOption} disabled>
                        {defaultOption}
                    </option>
                )}
                {options.map((option, index) => (
                    <option
                        key={index}
                        value={option}
                        disabled={option === '----------'}
                    >
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};
