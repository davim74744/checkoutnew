'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheckIcon, VisaSecureIcon, MastercardIDCheckIcon } from "@/components/Icons";
import { formatCurrency } from "@/lib/utils";

interface SecurityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    brand?: string;
    isLoading: boolean;
    amount: number;
    last4Digits: string;
    onResendCode: () => void;
}

export const SecurityModal = ({ isOpen, onClose, onConfirm, brand, isLoading, amount, last4Digits, onResendCode }: SecurityModalProps) => {
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setTimer(60);
            setCanResend(false);
            return;
        }
        
        if (timer > 0) {
            const intervalId = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(intervalId);
        } else {
            setCanResend(true);
        }
    }, [isOpen, timer]);

    const handleResendClick = () => {
        onResendCode();
        setTimer(60);
        setCanResend(false);
    };

    const brandInfo = {
        visa: { icon: <VisaSecureIcon />, title: 'Visa Secure' },
        mastercard: { icon: <MastercardIDCheckIcon />, title: 'Mastercard Identity Check' },
        default: { icon: <ShieldCheckIcon className="w-10 h-10 text-primary" />, title: 'Pagamento Seguro' },
    };

    const currentBrand = brandInfo[brand as keyof typeof brandInfo] || brandInfo.default;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-dark/60 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-light rounded-xl shadow-lg w-full max-w-sm m-4">
                <div className="p-5 border-b border-neutral-200">{currentBrand.icon}</div>
                <div className="p-6">
                    <h2 className="text-lg font-bold text-dark mb-4">Verifique sua compra</h2>
                    <div className="space-y-3 text-sm mb-6 text-neutral-600">
                        <div className="flex justify-between"><span className="font-medium">Comércio:</span><span>RecargaFácil</span></div>
                        <div className="flex justify-between"><span className="font-medium">Valor:</span><span className="font-bold text-dark">{formatCurrency(amount)}</span></div>
                        <div className="flex justify-between"><span className="font-medium">Cartão:</span><span>**** **** **** {last4Digits}</span></div>
                    </div>
                    <p className="text-sm text-neutral-600 mb-4">Para sua segurança, insira o código de 6 dígitos enviado para seu dispositivo.</p>
                    <Input label="Código de Verificação" id="authCode" name="authCode" placeholder="******" />
                    <div className="text-sm text-center text-neutral-500 mt-4">
                        {!canResend ? `Tempo restante: 00:${timer.toString().padStart(2, '0')}` : <button onClick={handleResendClick} className="font-semibold text-primary hover:underline">Reenviar código</button>}
                    </div>
                    <div className="w-full mt-6">
                        <Button onClick={onConfirm} isLoading={isLoading} fullWidth={true}>
                            Confirmar Pagamento
                        </Button>
                    </div>
                    <button onClick={onClose} disabled={isLoading} className="mt-4 text-sm text-neutral-500 hover:text-dark transition-colors w-full text-center">Cancelar</button>
                </div>
            </div>
        </div>
    );
};