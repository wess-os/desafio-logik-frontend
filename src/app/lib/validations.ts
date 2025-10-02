export const isEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
};

export const isPhone = (value: string): boolean => {
    // Valida telefones brasileiros (fixo e celular)
    const phoneRegex = /^\(?([1-9]{2})\)?\s?9?\d{4}-?\d{4}$/;
    return phoneRegex.test(value.replace(/\D/g, ''));
};

export const isDate = (value: string): boolean => {
    const date = new Date(value);
    return !isNaN(date.getTime());
};