export interface FormData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

export interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error' | string;
}

export interface CardData {
    cardNumber: string;
    cardName: string;
    cardExpiry: string;
    cardCvv: string;
}

export interface CardErrors {
    cardNumber?: string;
    cardName?: string;
    cardExpiry?: string;
    cardCvv?: string;
}