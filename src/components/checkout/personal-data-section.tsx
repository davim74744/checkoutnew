"use client";
import type { FormData, FormErrors } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionSummary } from "./section-summary";
import {
  CheckIcon,
  ChevronRightIcon,
  UserCircleIcon,
} from "@/components/Icons";

interface PersonalDataSectionProps {
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  onEdit: () => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
}

export const PersonalDataSection = ({
  isActive,
  isCompleted,
  onComplete,
  onEdit,
  formData,
  setFormData,
  errors,
}: PersonalDataSectionProps) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="bg-light rounded-xl  overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <div className="flex">
          <div
            className={`w-8 h-8 rounded-full ${
              isCompleted
                ? "text-primary"
                : isActive
                ? "text-primary"
                : "text-neutral-400"
            }`}
          >
            {isCompleted ? (
              <UserCircleIcon className="w-6 h-6" />
            ) : (
              <UserCircleIcon className="w-6 h-6" />
            )}
          </div>
          <div className="ml-4 flex flex-col">
            <h2
              className={`font-semibold ${
                isActive || isCompleted ? "text-[#666666]" : "text-neutral-500"
              }`}
            >
              INFORMAÇÕES PESSOAIS
            </h2>
            <p
              className={` ${
                isActive || isCompleted ? "text-[#666666]" : "text-neutral-500"
              }`}
            >
              Utilizaremos seu e-mail para: Identificar seu perfil, histórico de
              compra, notificação de pedidos e carrinho de compras.
            </p>
          </div>
        </div>
      </div>
      <div
        className={`transition-all duration-500 ease-in-out ${
          isActive ? "max-h-[1000px] opacity-100 bg-[#ffffff80]" : "max-h-0 opacity-0"
        }`}
      >
    <div className="px-6 pb-6 pt-2">
          {isCompleted ? (
            <SectionSummary title="Contato" onEdit={onEdit}>
              <p>{formData.name}</p>
              <p>{formData.email}</p>
            </SectionSummary>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                label="Nome completo"
                id="name"
                name="name"
                placeholder="Maria Oliveira"
                value={formData.name}
                onInput={handleInput}
                error={errors.name}
              />
              <Input
                label="E-mail"
                id="email"
                name="email"
                type="email"
                placeholder="maria.oliveira@email.com"
                value={formData.email}
                onInput={handleInput}
                error={errors.email}
              />
                <Input
                  label="CPF"
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onInput={handleInput}
                  error={errors.cpf}
                  mask="###.###.###-##"
                />
                <Input
                  label="Celular/WhatsApp"
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onInput={handleInput}
                  error={errors.phone}
                  mask="(##) #####-####"
                />
              <div className="mt-2">
                <Button fullWidth={true} type="submit">
                  CONTINUAR <ChevronRightIcon className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
