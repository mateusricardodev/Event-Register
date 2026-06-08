import { registerDecorator } from 'class-validator';
function validateCpf(cpf) {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11)
        return false;
    if (/^(\d)\1{10}$/.test(digits))
        return false;
    const calc = (mod) => {
        let sum = 0;
        for (let i = 0; i < mod - 1; i++)
            sum += Number(digits[i]) * (mod - i);
        const rem = (sum * 10) % 11;
        return rem >= 10 ? 0 : rem;
    };
    return calc(10) === Number(digits[9]) && calc(11) === Number(digits[10]);
}
export function IsCpf(options) {
    return (object, propertyName) => {
        registerDecorator({
            name: 'isCpf',
            target: object.constructor,
            propertyName,
            options: { message: 'CPF inválido', ...options },
            validator: { validate: (v) => typeof v === 'string' && validateCpf(v) },
        });
    };
}
//# sourceMappingURL=is-cpf.validator.js.map