export const isEmail = (value: unknown): boolean => {
    if (typeof value !== 'string' || !value) {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(value);
};

export const isPhone = (value: unknown): boolean => {
    if (typeof value !== 'string' || !value) {
        return false;
    }

    const phoneRegex = /^\(?([1-9]{2})\)?\s?9?\d{4}-?\d{4}$/;

    return phoneRegex.test(value.replace(/\D/g, ''));
};

export const isDate = (value: unknown): boolean => {
    if (typeof value !== 'string' || !value) {
        return false;
    }

    const date = new Date(value);

    return !isNaN(date.getTime());
};