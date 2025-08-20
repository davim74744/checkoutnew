// src/app/api/Leads/[uuid]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  try {
    const { uuid } = params;

    if (!uuid) {
      return NextResponse.json({ success: false, message: 'UUID do pedido não fornecido.' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: uuid },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Pedido não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });

  } catch (error) {
    console.error("Erro ao buscar o pedido:", error);
    return NextResponse.json({ success: false, message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
