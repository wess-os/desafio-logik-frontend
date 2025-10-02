import { useState, useCallback } from 'react';

interface ValidationRule {
    required?: boolean;
    validate?: (value: any) => boolean;
    message?: string;
}

type Validations<T> = Partial<Record<keyof T, ValidationRule>>;

interface UseFormProps<T> {
    initialValues: T;
    validations: Validations<T>;
    onSubmit: (values: T) => void;
}

export const useForm = <T extends Record<string, any>>({
    initialValues,
    validations,
    onSubmit,
}: UseFormProps<T>) => {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    }, []);

    const setValueByName = useCallback((name: keyof T, value: any) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    }, []);

    const validate = useCallback(() => {
        const newErrors: Partial<Record<keyof T, string>> = {};
        const validationKeys = Object.keys(validations) as Array<keyof T>;

        for (const key of validationKeys) {
            const rule = validations[key];
            const value = values[key];

            if (rule?.required && !value) {
                newErrors[key] = 'Este campo é obrigatório';
            } else if (rule?.validate && value && !rule.validate(value)) {
                newErrors[key] = rule.message || 'Valor inválido';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [values, validations]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(values);
        }
    }, [validate, onSubmit, values]);

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        setValues,
        setValueByName,
    };
};

