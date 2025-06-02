import React, { useState, useEffect, useRef } from 'react';

const NiceSelect = ({ options, defaultValue, onChange, disabled, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue || '');
    const [focusedOption, setFocusedOption] = useState(null);
    const selectRef = useRef(null);
    const dropdownRef = useRef(null);

    // Handle clicks outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isOpen && (event.key === 'Enter' || event.key === ' ')) {
                setIsOpen(true);
                event.preventDefault();
            } else if (isOpen) {
                const enabledOptions = options.filter(opt => !opt.disabled);
                const currentIndex = focusedOption !== null
                    ? enabledOptions.findIndex(opt => opt.value === focusedOption)
                    : enabledOptions.findIndex(opt => opt.value === selectedValue);

                if (event.key === 'ArrowDown') {
                    const nextIndex = currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0;
                    setFocusedOption(enabledOptions[nextIndex].value);
                    event.preventDefault();
                } else if (event.key === 'ArrowUp') {
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1;
                    setFocusedOption(enabledOptions[prevIndex].value);
                    event.preventDefault();
                } else if (event.key === 'Enter' || event.key === ' ') {
                    if (focusedOption !== null) {
                        setSelectedValue(focusedOption);
                        setIsOpen(false);
                        onChange?.(focusedOption);
                    }
                    event.preventDefault();
                } else if (event.key === 'Escape') {
                    setIsOpen(false);
                    event.preventDefault();
                } else if (event.key === 'Tab' && isOpen) {
                    event.preventDefault();
                }
            }
        };

        const current = dropdownRef.current;
        current?.addEventListener('keydown', handleKeyDown);
        return () => current?.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, focusedOption, options, selectedValue, onChange]);

    // Handle option selection
    const handleOptionClick = (option) => {
        if (!option.disabled) {
            setSelectedValue(option.value);
            setIsOpen(false);
            onChange?.(option.value);
        }
    };

    // Toggle dropdown
    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(prev => !prev);
            setFocusedOption(selectedValue);
        }
    };

    // Get display text for selected option
    const selectedOption = options.find(opt => opt.value === selectedValue);
    const displayText = selectedOption?.display || selectedOption?.text || 'Select an option';

    return (
        <div
            className={`nice-select ${disabled ? 'disabled' : ''} ${className || ''}`}
            ref={dropdownRef}
            tabIndex={disabled ? null : 0}
            onClick={toggleDropdown}
        >
            <span className="current">{displayText}</span>
            <ul className={`list ${isOpen ? 'open' : ''}`}>
                {options.map((option, index) => (
                    <li
                        key={index}
                        className={`option ${option.value === selectedValue ? 'selected' : ''} ${
                            option.disabled ? 'disabled' : ''
                        } ${option.value === focusedOption ? 'focus' : ''}`}
                        onClick={() => handleOptionClick(option)}
                        data-value={option.value}
                        data-display={option.display}
                    >
                        {option.text}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NiceSelect;