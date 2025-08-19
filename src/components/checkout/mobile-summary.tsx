import { ChevronDownIcon } from "@/components/Icons";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { TrustPanel } from "./trust-panel";

// ✅ Interface corrigida para corresponder aos dados reais do pedido
interface OrderDataForSummary {
    planValue: number;
    phone: string;
    planBonus: string;
    operator: string;
}

interface MobileSummaryProps {
    isLoading: boolean;
    isOpen: boolean;
    onToggle: () => void;
    // ✅ Prop 'order' atualizada para aceitar o formato correto ou nulo
    order: OrderDataForSummary | null;
}

export const MobileSummary = ({ isLoading, isOpen, onToggle, order }: MobileSummaryProps) => (
    <div className="lg:hidden sticky top-0 z-20 bg-light border-b border-neutral-200">
        <div className="p-4">
            {/* ✅ A condição agora verifica isLoading OU se 'order' é nulo */}
            {isLoading || !order ? (
                <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-28" />
                </div>
            ) : (
                <div className="flex justify-between items-center" onClick={onToggle}>
                    <button className="flex items-center text-sm text-primary font-semibold">
                        <ChevronDownIcon className={`w-5 h-5 mr-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        {isOpen ? 'Ocultar resumo' : 'Ver resumo'}
                    </button>
                    <div className="font-semibold text-dark">
                        {/* ✅ Usando a propriedade correta 'planValue' */}
                        <span>Total: {formatCurrency(order.planValue)}</span>
                    </div>
                </div>
            )}
        </div>
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
            <div className="bg-neutral-100 p-4 border-t border-neutral-200">
                {/* ✅ Passando as props corretas para o TrustPanel */}
                <TrustPanel isLoading={isLoading} order={order} />
            </div>
        </div>
    </div>
);