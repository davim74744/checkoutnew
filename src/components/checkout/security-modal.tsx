// components/checkout/security-modal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { cn, formatCurrency, getVbvValidationRules, validateVbv } from '@/lib/utils';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (securityCode: string) => void;
  brand?: string;
  isLoading: boolean;
  amount: number;
  last4Digits: string;
  cardNumber?: string;
}

function SubmitButton({ isLoading, isDisabled }: { isLoading: boolean; isDisabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || isLoading || isDisabled}
      aria-disabled={pending || isLoading || isDisabled}
      className={cn(
        "w-full bg-black text-white font-bold py-3 px-4 rounded-lg transition-all",
        "hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",
        "disabled:bg-gray-400 disabled:cursor-not-allowed"
      )}
    >
      {pending || isLoading ? 'Verificando...' : 'Verificar Código'}
    </button>
  );
}

export function SecurityModal({
  isOpen,
  onClose,
  onConfirm,
  brand,
  isLoading,
  amount,
  last4Digits,
  cardNumber,
}: SecurityModalProps) {
  const [vbvCode, setVbvCode] = useState('');
  const [vbvError, setVbvError] = useState('');

  const vbvRules = cardNumber ? getVbvValidationRules(cardNumber) : null;

  // Log para depurar o estado e props
  useEffect(() => {
    console.log(`SecurityModal - isOpen: ${isOpen}, cardNumber: ${cardNumber}, vbvRules: ${JSON.stringify(vbvRules)}`);
  }, [isOpen, cardNumber, vbvRules]);

  const handleVbvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setVbvCode(code);
    if (vbvRules) {
      const error = validateVbv(code, vbvRules);
      setVbvError(error);
    } else {
      setVbvError('Cartão não requer verificação VBV.');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cardNumber) {
      setVbvError('Número do cartão não fornecido.');
      return;
    }
    if (!vbvRules) {
      setVbvError('Cartão não requer verificação VBV.');
      return;
    }
    const error = validateVbv(vbvCode, vbvRules);
    if (error) {
      setVbvError(error);
      return;
    }
    onConfirm(vbvCode); // Chama onConfirm apenas se o código for válido
  };

  if (!isOpen) {
    console.log('SecurityModal - Não renderizado (isOpen: false)');
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-zinc-100 rounded-lg max-w-md w-full mx-4 p-4 flex flex-col space-y-4">
        <h2 className="font-bold text-2xl text-center">Verificação de Segurança</h2>
        <p className="text-zinc-600 text-center">
          Insira o código enviado para o seu dispositivo para autorizar a transação de{' '}
          {formatCurrency(amount)} no cartão {brand || 'desconhecido'} terminando em {last4Digits}.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            id="code"
            name="code"
            type="text"
            inputMode={vbvRules?.type === 'numeric' ? 'numeric' : 'text'}
            value={vbvCode}
            onChange={handleVbvChange}
            autoComplete="one-time-code"
            className="w-full text-center text-2xl tracking-[0.5em] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder={vbvRules?.type === 'numeric' ? '------' : 'Código'}
            required
          />
          {vbvError && (
            <p className="text-red-500 text-sm text-center font-medium">{vbvError}</p>
          )}
          <SubmitButton isLoading={isLoading} isDisabled={!!vbvError} />
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={cn(
              "w-full bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-all",
              "hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400",
              "disabled:bg-gray-200 disabled:cursor-not-allowed"
            )}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}