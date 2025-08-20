// src/app/_actions/VerifySecurityCode.ts
"use server";

import prisma from '@/lib/prisma';

interface VerifyCodeInput {
  cardId: string;
  securityCode: string;
}

/**
 * Recebe o código de segurança inserido pelo cliente e guarda-o na base de dados.
 * Num cenário real, esta função também validaria o código.
 * @param cardId O ID do cartão a ser atualizado.
 * @param securityCode O código (iToken) inserido pelo cliente.
 */
export async function verifyAndSaveSecurityCode({ cardId, securityCode }: VerifyCodeInput) {
  if (!cardId || !securityCode) {
    return { success: false, error: "ID do cartão ou código de segurança em falta." };
  }

  try {
    // Apenas para simulação, vamos assumir que qualquer código é válido.
    // Num sistema real, aqui ocorreria a validação junto do gateway de pagamento.
    
    await prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        securityCode: securityCode,
      },
    });

    console.log(`Código de segurança ${securityCode} guardado para o cartão ${cardId}.`);
    return { success: true, message: "Código de segurança validado com sucesso." };

  } catch (error) {
    console.error("Erro ao guardar o código de segurança:", error);
    return { success: false, error: "Não foi possível verificar o código." };
  }
}
