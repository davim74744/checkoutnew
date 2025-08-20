// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FormData, FormErrors } from "./types";
import { secureBins, issuers, VbvRule } from './security-bins';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatCPF = (cpf: string) => {
  const cleaned = cpf.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return cpf;
};

export const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export const formatCardNumber = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();
};

export const formatExpiryDate = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .slice(0, 5);
};

export const getCardType = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  return 'unknown';
};

export const validatePersonalData = (formData: FormData, setErrors: (errors: FormErrors) => void): boolean => {
  const newErrors: FormErrors = {};
  if (!formData.name.trim()) newErrors.name = "Nome é obrigatório.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email inválido.";
  if (formData.cpf.replace(/\D/g, '').length !== 11) newErrors.cpf = "CPF inválido.";
  if (formData.phone.replace(/\D/g, '').length < 10) newErrors.phone = "Telefone inválido.";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export function requiresSecurityModal(cardNumber?: string): boolean {
  if (!cardNumber) return false;
  const cleanedCardNumber = cardNumber.replace(/\D/g, '');
  if (cleanedCardNumber.length < 6) return false;
  const prefix = parseInt(cleanedCardNumber.substring(0, 6), 10);
  return secureBins.has(prefix);
}

export function getVbvValidationRules(cardNumber?: string): VbvRule | null {
  if (!cardNumber) return null;
  const cleanedCardNumber = cardNumber.replace(/\D/g, '');
  if (cleanedCardNumber.length < 6) return null;
  const prefix = parseInt(cleanedCardNumber.substring(0, 6), 10);
  for (const issuerName in issuers) {
    const issuer = issuers[issuerName];
    if (new Set(issuer.bins).has(prefix)) {
      return issuer.rules;
    }
  }
  return null;
}

export function validateVbv(vbv: string, rules: VbvRule): string {
    if (vbv.length < rules.minLength) return `O código deve ter no mínimo ${rules.minLength} caracteres.`;
    if (vbv.length > rules.maxLength) return `O código deve ter no máximo ${rules.maxLength} caracteres.`;
    if (rules.type === 'numeric' && !/^\d+$/.test(vbv)) return "O código deve conter apenas números.";
    if (rules.type === 'alphanumeric' && !/^[a-zA-Z0-9]+$/.test(vbv)) return "O código deve conter apenas letras e números.";
    return "";
}

/**
 * ✅ FUNÇÃO ADICIONADA
 * Valida um número de cartão de crédito usando o algoritmo de Luhn.
 */
export const luhnCheck = (val: string): boolean => {
  const num = val.replace(/\D/g, '');
  if (num.length < 13 || num.length > 19) return false;
  let checksum = 0;
  let j = 1;
  for (let i = num.length - 1; i >= 0; i--) {
    let calc = Number(num.charAt(i)) * j;
    if (calc > 9) {
      checksum = checksum + 1;
      calc = calc - 10;
    }
    checksum = checksum + calc;
    j = j === 1 ? 2 : 1;
  }
  return checksum % 10 === 0;
};

/**
 * ✅ FUNÇÃO ADICIONADA
 * Aplica uma máscara a uma string (ex: CPF, telefone).
 */
export const applyMask = (value: string, mask: string): string => {
  let i = 0;
  const v = value.toString().replace(/\D/g, "");
  return mask.replace(/#/g, () => v[i++] || "");
};
