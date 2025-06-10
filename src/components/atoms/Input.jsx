import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', rows, options, autoFocus, ...props }) => {
    const baseClasses = `w-full px-4 py-3 bg-surface-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200`;

    const filteredProps = { value, onChange, placeholder, autoFocus, ...props };

    switch (type) {
        case 'textarea':
            return (
                <textarea
                    rows={rows || 3}
                    className={`${baseClasses} resize-none ${className}`}
                    {...filteredProps}
                />
            );
        case 'select':
            return (
                <select
                    className={`${baseClasses} ${className}`}
                    {...filteredProps}
                >
                    {options && options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            );
        default: // text, date, number etc.
            return (
                <input
                    type={type}
                    className={`${baseClasses} ${className}`}
                    {...filteredProps}
                />
            );
    }
};

export default Input;