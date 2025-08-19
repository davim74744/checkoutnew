import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FormData, FormErrors } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ✅ CORREÇÃO: Adicionada uma verificação para garantir que 'value' seja um número.
export const formatCurrency = (value: number) => {
  // Se o valor não for um número válido, retorna um placeholder em vez de quebrar.
  if (typeof value !== 'number') {
    return 'R$ --,--';
  }
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
};

export const applyMask = (value: string, mask: string): string => {
  let i = 0;
  if (!value) return '';
  const v = value.toString().replace(/\D/g, '');
  if (!v) return '';
  return mask.replace(/#/g, () => v[i++] || '');
};

export const luhnCheck = (val: string): boolean => {
    let checksum = 0;
    let j = 1;
    for (let i = val.length - 1; i >= 0; i--) {
        let calc = Number(val.charAt(i)) * j;
        if (calc > 9) {
            checksum = checksum + 1;
            calc = calc - 10;
        }
        checksum = checksum + calc;
        j = (j === 1) ? 2 : 1;
    }
    return (checksum % 10) === 0;
};

export const getCardType = (number: string): string => {
    if (!number) return 'unknown';
    const num = number.replace(/\D/g, '');
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    if (/^3(?:0[0-5]|[68])/.test(num)) return 'diners';
    if (/^35/.test(num)) return 'jcb';
    if (/^63[7-9]/.test(num) || /^67/.test(num)) return 'elo';
    return 'unknown';
};

export const validatePersonalData = (formData: FormData, setErrors: (errors: FormErrors) => void): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name) newErrors.name = 'Nome é obrigatório.';
    if (!formData.email) newErrors.email = 'E-mail é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'E-mail inválido.';
    if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório.';
    else if (formData.cpf.replace(/\D/g, '').length !== 11) newErrors.cpf = 'CPF deve conter 11 dígitos.';
    if (!formData.phone) newErrors.phone = 'Telefone é obrigatório.';
    else if (formData.phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Telefone inválido.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};