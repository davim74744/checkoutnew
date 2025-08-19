"use client";
import { useState } from "react";
import type { CardData, CardErrors } from "@/lib/types";
import { getCardType, luhnCheck, formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaymentFormSkeleton, PixDisplaySkeleton } from "./payment-form-skeleton";

import {
  CreditCardIcon,
  LockClosedIcon,
  QrCodeIcon,
  ChevronRightIcon,
  ClipboardIcon,
  VisaIcon,
  MastercardIcon,
  EloIcon,
  AmexIcon,
} from "@/components/Icons";

interface PaymentSectionProps {
  isActive: boolean;
  isLocked: boolean;
  onPay: (details: { method: string; card?: CardData }) => void;
  isLoading: boolean;
  showToast: (message: string, type?: string) => void;
  isSectionLoading: boolean;
  isPixLoading: boolean;
  pixData: { qrCodeSvg: string; copyPaste: string } | null;
  onGeneratePix: () => Promise<boolean>;
  orderValue: number; // Prop para receber o valor do pedido
}
const PaymentMethodButton = ({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full text-left p-4 rounded-lg border border-neutral-300 bg-neutral-50 hover:border-primary transition-all duration-200 flex justify-between items-center"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 flex items-center justify-center bg-light rounded-full border border-neutral-200">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-dark">{title}</p>
        <p className="text-xs text-neutral-500">{description}</p>
      </div>
    </div>
    <ChevronRightIcon className="w-5 h-5 text-neutral-400" />
  </button>
);

export const PaymentSection = ({
  isActive,
  isLocked,
  onPay,
  isLoading,
  showToast,
  isSectionLoading,
  isPixLoading,
  pixData,
  onGeneratePix,
  orderValue, // Recebendo o valor
}: PaymentSectionProps) => {
  const [selectedMethod, setSelectedMethod] = useState<"pix" | "card" | null>(
    null
  );
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });
  const [cardType, setCardType] = useState("unknown");
  const [cardErrors, setCardErrors] = useState<CardErrors>({});

  const handleSelectPix = async () => {
    setSelectedMethod("pix");
    const success = await onGeneratePix();
    if (!success) {
      setSelectedMethod(null); 
    }
  };
  
  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "cardNumber") setCardType(getCardType(value));
    setCardData((prev) => ({ ...prev, [name]: value }));
    if (cardErrors[name as keyof CardErrors]) {
      setCardErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const CardLogo = () => {
    const logoClass = "h-6 w-auto";
    switch (cardType) {
      case "visa":
        return <VisaIcon className={logoClass} />;
      case "mastercard":
        return <MastercardIcon className={logoClass} />;
      case "elo":
        return <EloIcon className={logoClass} />;
      case "amex":
        return <AmexIcon className={logoClass} />;
      default:
        return <CreditCardIcon className="h-6 w-6 text-neutral-400" />;
    }
  };

  const handleCopy = () => {
    if (pixData?.copyPaste) {
      navigator.clipboard.writeText(pixData.copyPaste);
      showToast("Código PIX copiado!", "success");
    }
  };

  const validateCard = () => {
    const newErrors: CardErrors = {};
    const { cardNumber, cardName, cardExpiry, cardCvv } = cardData;
    const rawCardNumber = cardNumber.replace(/\D/g, "");
    if (rawCardNumber.length < 13 || !luhnCheck(rawCardNumber))
      newErrors.cardNumber = "Número de cartão inválido.";
    if (!cardName.trim()) newErrors.cardName = "Nome do titular é obrigatório.";
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      newErrors.cardExpiry = "Formato de validade inválido (MM/AA).";
    } else {
      const [month, year] = cardExpiry.split("/");
      const expiryDate = new Date(parseInt(`20${year}`), parseInt(month), 0);
      if (
        expiryDate < new Date() ||
        parseInt(month) > 12 ||
        parseInt(month) < 1
      )
        newErrors.cardExpiry = "Data de validade expirada ou inválida.";
    }
    const rawCvv = cardCvv.replace(/\D/g, "");
    if (cardType === "amex") {
      if (rawCvv.length !== 4)
        newErrors.cardCvv = "CVV do American Express deve ter 4 dígitos.";
    } else {
      if (rawCvv.length !== 3)
        newErrors.cardCvv = "CVV inválido (deve ter 3 dígitos).";
    }
    setCardErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinalize = () => {
    if (selectedMethod === "card") {
      if (validateCard())
        onPay({
          method: selectedMethod,
          card: cardData,
        });
    } else if (selectedMethod === "pix") {
      onPay({ method: selectedMethod, card: cardData });
    }
  };

  return (
    <div className="bg-light rounded-xl  overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <div className="flex">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isLocked
                ? "text-primary"
                : "text-primary"
            }`}
          >
            {isLocked ? (
              <CreditCardIcon className="w-6 h-6" />
            ) : (
              <CreditCardIcon className="w- h-6" />
            )}
          </div>
          <div className="ml-4 flex flex-col">
            <h2
              className={`font-semibold ${
                isActive ? "text-[#666666]" : "text-neutral-500"
              }`}
            >
              FORMAS DE PAGAMENTO
            </h2>
            <p
              className={` ${
                isActive ? "text-[#666666]" : "text-neutral-500"
              }`}
            >
            Para finalizar seu pedido escolha uma forma de pagamento
            </p>
          </div>
        </div>
      </div>
      <div
        className={`transition-all duration-500 ease-in-out ${
          isActive ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {isSectionLoading ? (
          <PaymentFormSkeleton />
        ) : (
          <div className="p-6">
            {!selectedMethod ? (
              <div className="space-y-4 animate-fade-in">
                <PaymentMethodButton
                  onClick={handleSelectPix}
                  icon={<QrCodeIcon className="w-5 h-5 text-primary" />}
                  title="PIX"
                  description="Aprovação instantânea."
                />
                <PaymentMethodButton
                  onClick={() => setSelectedMethod("card")}
                  icon={<CreditCardIcon className="w-5 h-5 text-primary" />}
                  title="Cartão de Crédito"
                  description="Pague com segurança."
                />
              </div>
            ) : (
              <div className="animate-fade-in">
                <button
                  onClick={() => {
                    setSelectedMethod(null);
                    setCardErrors({});
                  }}
                  className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center mb-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Trocar método de pagamento
                </button>
                {selectedMethod === "pix" ? (
                  isPixLoading ? <PixDisplaySkeleton /> : (
                    <div className="text-center bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                      <p className="text-neutral-600 text-sm mb-4">Escaneie o QR Code para pagar em até <span className="font-bold text-dark">5 minutos</span>.</p>
                      <div className="flex justify-center mb-4 p-2 border border-primary/20 rounded-lg bg-light" dangerouslySetInnerHTML={{ __html: pixData?.qrCodeSvg || '' }} />
                      <button onClick={handleCopy} className="w-full bg-light p-3 rounded-lg flex items-center justify-between gap-3 border border-neutral-200 hover:border-primary/50 transition-colors">
                          <code className="text-sm text-neutral-600 truncate">
                            {pixData?.copyPaste}
                          </code>
                        <div className="flex items-center gap-2 text-primary text-xs font-semibold">
                          <ClipboardIcon className="w-4 h-4" /> Copiar
                        </div>
                      </button>
                    </div>
                  )
                ) : (
                  <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                    <Input
                      label="Número do cartão"
                      id="cardNumber"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onInput={handleCardInput}
                      error={cardErrors.cardNumber}
                      placeholder="0000 0000 0000 0000"
                      mask="#### #### #### ####"
                    >
                      <div className="flex items-center h-full">
                        <CardLogo />
                      </div>
                    </Input>
                    <Input
                      label="Nome do titular"
                      id="cardName"
                      name="cardName"
                      value={cardData.cardName}
                      onInput={handleCardInput}
                      error={cardErrors.cardName}
                      placeholder="Como impresso no cartão"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Validade"
                        id="cardExpiry"
                        name="cardExpiry"
                        value={cardData.cardExpiry}
                        onInput={handleCardInput}
                        error={cardErrors.cardExpiry}
                        placeholder="MM/AA"
                        mask="##/##"
                      />
                      <Input
                        label="CVV"
                        id="cardCvv"
                        name="cardCvv"
                        value={cardData.cardCvv}
                        onInput={handleCardInput}
                        error={cardErrors.cardCvv}
                        placeholder="123"
                        mask={cardType === "amex" ? "####" : "###"}
                      />
                    </div>
                  </div>
                )}
                <div className="mt-6">
                  <Button
                    onClick={handleFinalize}
                    isLoading={isLoading}
                    fullWidth={true}
                  >
                    <LockClosedIcon className="w-4 h-4 mr-2" />
                    {`Finalizar Compra ${formatCurrency(orderValue)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};