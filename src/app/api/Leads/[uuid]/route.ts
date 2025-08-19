import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ✅ CORREÇÃO: A função agora é 'async' e usa 'await' para acessar os parâmetros.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> } // A prop 'params' agora é uma Promise
) {
  try {
    const { uuid } = await params; // Usamos 'await' para extrair o valor de 'uuid'

    if (!uuid) {
        return NextResponse.json({ success: false, message: 'ID do lead é obrigatório.' }, { status: 400 });
    }
    
    const order = await prisma.order.findUnique({
      where: { id: uuid },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Lead/Pedido não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    console.error('Erro na API /api/Leads/[uuid]:', error);
    return NextResponse.json({ success: false, message: 'Erro interno no servidor.' }, { status: 500 });
  }
}