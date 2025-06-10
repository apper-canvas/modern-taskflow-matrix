import React from 'react';
import Input from '@/components/atoms/Input';

const FormField = ({ label, id, error, required, className = '', ...inputProps }) => {
    // Determine the border class based on error prop
    const inputErrorClass = error ? 'border-error' : 'border-surface-200';

    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-error">*</span>}
                </label>
            )}
            <Input id={id} {...inputProps} className={`${inputProps.className || ''} ${inputErrorClass}`} />
            {error && <p className="mt-1 text-sm text-error">{error}</p>}
        </div>
    );
};

export default FormField;