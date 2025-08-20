// src/app/api/Leads/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Define a origem permitida para as requisições
const allowedOrigin = 'http://localhost:5173';

// Função para adicionar os cabeçalhos de CORS a uma resposta
const addCorsHeaders = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
};

// Manipulador para requisições OPTIONS (preflight)
export async function OPTIONS(request: Request) {
  // Retorna uma resposta vazia com os cabeçalhos de permissão
  const response = new NextResponse(null, { status: 204 });
  return addCorsHeaders(response);
}

// Manipulador para requisições POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, cpf, phone, operator, planValue, planBonus } = body;

    if (!name || !cpf || !phone || !operator || !planValue || !planBonus) {
      console.error("Dados incompletos:", body);
      const errorResponse = NextResponse.json({ success: false, message: 'Dados incompletos.' }, { status: 400 });
      // Adiciona os cabeçalhos de CORS à resposta de erro
      return addCorsHeaders(errorResponse);
    }

    // Encontra ou cria um Cliente (Customer) com base no CPF.
    const customer = await prisma.customer.upsert({
      where: { cpf: cpf },
      update: { name: name, phone: phone },
      create: {
        cpf: cpf,
        name: name,
        phone: phone,
      },
    });

    // Cria o Pedido (Order) e associa-o ao Cliente.
    const newOrder = await prisma.order.create({
      data: {
        name,
        cpf,
        phone,
        operator,
        planValue,
        planBonus,
        customerId: customer.id,
      },
    });

    const successResponse = NextResponse.json({ success: true, data: newOrder }, { status: 201 });
    // Adiciona os cabeçalhos de CORS à resposta de sucesso
    return addCorsHeaders(successResponse);
    
  } catch (error) {
    console.error("Erro ao criar Pedido:", error);
    const errorResponse = NextResponse.json({ success: false, message: 'Erro interno do servidor.' }, { status: 500 });
    // Adiciona os cabeçalhos de CORS à resposta de erro
    return addCorsHeaders(errorResponse);
  }
}
