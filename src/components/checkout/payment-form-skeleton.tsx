import { Skeleton } from "@/components/ui/skeleton";

/**
 * Esqueleto para o carregamento inicial da seção de pagamento,
 * mostrando as opções de escolha.
 */
export const PaymentFormSkeleton = () => (
  <div className="p-6 animate-shimmer">
    <div className="space-y-4">
      {/* Esqueleto da Opção 1 (representando o botão do PIX) */}
      <div className="flex w-full items-center space-x-4 p-4 border border-neutral-200/80 rounded-lg">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4 rounded" />
          <Skeleton className="h-3 w-3/4 rounded" />
        </div>
      </div>

      {/* Esqueleto da Opção 2 (representando o botão do Cartão de Crédito) */}
      <div className="flex w-full items-center space-x-4 p-4 border border-neutral-200/80 rounded-lg">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2 rounded" />
          <Skeleton className="h-3 w-3/4 rounded" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * Esqueleto para a tela do Pix, exibido enquanto os dados
 * do QR Code estão sendo gerados.
 */
export const PixDisplaySkeleton = () => (
  <div className="text-center bg-neutral-50 p-6 rounded-lg border border-neutral-200 animate-pulse">
    <Skeleton className="h-5 w-3/4 mb-4 mx-auto rounded-md" />
    <div className="flex justify-center mb-4">
      <Skeleton className="h-40 w-40 rounded-lg" />
    </div>
    <Skeleton className="h-12 w-full rounded-md" />
  </div>
);
