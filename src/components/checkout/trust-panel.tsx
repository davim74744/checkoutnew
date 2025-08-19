import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

// Interface para os dados do pedido que o painel recebe
interface TrustPanelProps {
    isLoading: boolean;
    order: {
        // ✅ CORREÇÃO: Nomes das propriedades atualizados para corresponder ao objeto OrderData
        phone: string;
        planValue: number;
        planBonus: string;
        operator: string;
    } | null;
}

// O componente de esqueleto não precisa de alterações
const TrustPanelSkeleton = () => (
    <div>
        <Skeleton className="h-6 w-2/3 mb-6" />
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div>
                        <Skeleton className="h-4 w-28 mb-1.5" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
                <Skeleton className="h-5 w-16" />
            </div>
            <div className="border-t border-dashed border-neutral-200"></div>
            <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div className="border-t border-dashed border-neutral-200 my-5"></div>
        <div className="flex justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
        </div>
    </div>
);

export const TrustPanel = ({ isLoading, order }: TrustPanelProps) => (
    <div className="w-full bg-white p-6 lg:p-8 rounded-lg lg:bg-transparent lg:p-0 lg:border-none">
        {isLoading || !order ? <TrustPanelSkeleton /> : (
            <>
                <h2 className="text-lg font-semibold text-dark mb-4">Resumo do Pedido</h2>
                <div className="space-y-4 text-neutral-700 text-sm">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-dark">{`Recarga ${order.operator}`}</p>
                                {/* ✅ CORREÇÃO: Usando a propriedade correta 'phone' */}
                                <p className="text-neutral-500 text-xs">{order.phone}</p>
                            </div>
                        </div>
                        {/* ✅ CORREÇÃO: Usando a propriedade correta 'planValue' */}
                        <span className="font-semibold text-dark">{formatCurrency(order.planValue)}</span>
                    </div>
                    <div className="border-t border-dashed border-neutral-200"></div>
                    <div className="bg-primary/10 text-primary-hover p-3 rounded-lg flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {/* ✅ CORREÇÃO: Usando a propriedade correta 'planBonus' */}
                        <p className="font-medium text-xs">{`+${order.planBonus} de bônus`}</p>
                    </div>
                </div>
                <div className="border-t border-dashed border-neutral-200 my-5"></div>
                <div className="flex justify-between text-base font-bold text-dark">
                    <span>Total a pagar</span>
                    {/* ✅ CORREÇÃO: Usando a propriedade correta 'planValue' */}
                    <span className="text-primary">{formatCurrency(order.planValue)}</span>
                </div>
            </>
        )}
    </div>
);