import { CheckCircleIcon } from "@/components/Icons";
import { formatCurrency } from "@/lib/utils";
import { FICTIONAL_ORDER } from "@/lib/constants";
import type { FormData } from "@/lib/types";

interface ConfirmationScreenProps {
    orderId: number;
    formData: FormData;
}

export const ConfirmationScreen = ({ orderId, formData }: ConfirmationScreenProps) => (
    <div className="text-center max-w-lg mx-auto py-12 lg:py-20 animate-slide-in-right">
        {/* ... (código do ícone e título) */}
        
        <div className="text-left bg-light p-6 rounded-lg border border-neutral-200 space-y-4">
            <h3 className="font-semibold text-dark">Detalhes da Compra</h3>
            {/* ... (detalhes do produto e valor) */}

            <div className="border-t border-neutral-200"></div>
            <h3 className="font-semibold text-dark pt-2">Informações do Comprador</h3>
             <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Nome:</span>
                <span className="font-medium text-neutral-800">{formData.name}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-neutral-600">E-mail:</span>
                <span className="font-medium text-neutral-800">{formData.email}</span>
            </div>
            {/* A seção de endereço foi removida daqui */}
        </div>

        <p className="text-sm text-neutral-500 mt-6">Enviamos um recibo para seu e-mail.</p>
    </div>
);