"use server";

import prisma from '@/lib/prisma'; // Importa nossa instância única do Prisma

// ✅ Interface atualizada para incluir o ID do pedido
interface PaymentData {
  orderId: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  valor: number;
  produto: string;
}

/**
 * Server Action para gerar um pagamento Pix.
 * Integrada com o Prisma para salvar e verificar o status da transação.
 */
export async function generatePixPayment(data: PaymentData) {

  // ✅ Adicionamos o orderId à desestruturação dos dados
  const { orderId, name, cpf, email, phone, valor, produto } = data;

  try {
    // 1. VERIFICAÇÃO NO BANCO DE DADOS
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new Error('Pedido não encontrado no banco de dados.');
    }

    // Se o PIX já foi gerado, retorna os dados existentes
    if (order.status === 'WAITING_PAYMENT' && order.pixTransactionId && order.pixCopyPaste) {
      console.log(`PIX já existe para o pedido ${orderId}. Retornando dados do banco.`);
      return {
        success: true,
        data: {
          copyPaste: order.pixCopyPaste,
          qrCodeBase64: order.pixQrCode,
        },
      };
    }

    if (order.status !== 'PENDING') {
      throw new Error('Este pedido não está mais pendente de pagamento.');
    }

    // 2. LÓGICA ORIGINAL (com pequenas adaptações)
    const secretKey = process.env.TITANSHUB_SECRET_KEY;
    if (!secretKey) {
      throw new Error('Variável de ambiente TITANSHUB_SECRET_KEY faltando no servidor.');
    }

    const cleanCpf = cpf.replace(/\D/g, '');

    if (!name || !cleanCpf || !email || !phone || !valor || !produto) {
      return { success: false, error: 'Dados do cliente ou do pedido estão incompletos.' };
    }

    const amountInCents = Math.round(valor * 100);
    const requestBody = {
      paymentMethod: 'pix',
      items: [{
        title: `${produto} (Pagamento via Pix)`,
        unitPrice: amountInCents,
        quantity: 1,
        tangible: false,
        externalRef: `${produto}_pix`,
      }],
      amount: amountInCents,
      installments: '1',
      customer: {
        document: { type: 'cpf', number: cleanCpf },
        name: name,
        email: email,
        phone: phone.replace(/\D/g, ''),
      },
    };

    const authValue = btoa(`${secretKey}:x`);
    const apiResponse = await fetch('https://api.anubispay.com.br/v1/transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${authValue}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error(`Erro na API AnubisPay: HTTP ${apiResponse.status} - ${errorBody}`);
      throw new Error('Falha ao comunicar com o gateway de pagamento.');
    }

    const responseData = await apiResponse.json();
    const pixCopyPaste = responseData?.pix?.qrcode;
    const transactionId = responseData?.id?.toString(); // Pega o ID da transação

    if (!pixCopyPaste || !transactionId) {
      throw new Error('Resposta da API não contém os dados Pix necessários.');
    }

    const qrServerUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(pixCopyPaste)}`;
    const qrCodeResponse = await fetch(qrServerUrl);

    if (!qrCodeResponse.ok) {
      throw new Error('Falha ao gerar a imagem do QR Code.');
    }

    const imageBuffer = await qrCodeResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    const qrCodeDataUri = `data:image/png;base64,${imageBase64}`;

    // 3. ATUALIZAÇÃO NO BANCO DE DADOS
    // Salva os dados da transação recém-criada no pedido correspondente
    await prisma.order.update({
        where: { id: orderId },
        data: {
            email: email, // Atualiza o email do cliente no pedido
            status: 'WAITING_PAYMENT',
            paymentMethod: 'pix',
            pixTransactionId: transactionId,
            pixCopyPaste: pixCopyPaste,
            pixQrCode: qrCodeDataUri,
        }
    });
    return {
      success: true,
      data: {
        copyPaste: pixCopyPaste,
        qrCodeBase64: qrCodeDataUri,
      },
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no servidor.';
    console.error("Falha ao gerar Pix:", errorMessage);

    // Se ocorrer um erro, atualiza o status do pedido para 'ERROR'
    if (orderId) {
        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'ERROR' }
        }).catch(updateError => {
            console.error("Falha ao tentar atualizar o pedido para o status de ERRO:", updateError);
        });
    }

    return { success: false, error: errorMessage };
  }
}