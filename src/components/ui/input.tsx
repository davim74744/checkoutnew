'use client';
import { cn } from "@/lib/utils";
import { applyMask } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    mask?: string;
    children?: React.ReactNode;
    // Adicionando inputMode para otimização mobile
    inputMode?: 'numeric' | 'text' | 'email' | 'tel' | 'decimal' | 'url';
}

export const Input = ({
    label,
    id,
    name,
    type = 'text',
    value,
    onInput,
    error,
    mask,
    disabled = false,
    children,
    autoComplete,
    inputMode,
    ...props
}: InputProps) => {

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (mask) {
            e.target.value = applyMask(e.target.value, mask);
        }
        if (onInput) {
            onInput(e);
        }
    };

    const hasError = error && error.length > 0;
    // O placeholder é passado como prop para ser usado no input, mas a label que flutua.
    const placeholder = props.placeholder || ' '; 

    return (
        <div className="relative mb-4">
            <div className="relative">
                <input
                    id={id}
                    name={name || id}
                    type={type}
                    value={value}
                    onInput={handleInput}
                    disabled={disabled}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    inputMode={inputMode || 'text'}
                    // A classe 'peer' é essencial para o efeito floating label com Tailwind
                    className={cn(
                        "peer w-full h-14 px-4 pt-5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-light placeholder-transparent",
                        disabled && 'bg-neutral-100 cursor-not-allowed',
                        hasError ? 'border-error focus:ring-error-soft' : 'border-neutral-300 focus:ring-primary focus:border-primary'
                    )}
                    {...props}
                />
                {/* A Label agora flutua usando a pseudo-classe 'peer-placeholder-shown' */}
                <label
                    htmlFor={id}
                    className={cn(
                        "absolute left-4 top-2 text-xs font-medium text-neutral-500 transition-all duration-200 pointer-events-none",
                        "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base",
                        "peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary",
                        hasError && "text-error peer-focus:text-error"
                    )}
                >
                    {label}
                </label>
                {children && <div className="absolute right-3 top-1/2 -translate-y-1/2">{children}</div>}
            </div>
            {hasError && <p className="text-xs text-error-soft mt-1.5">{error}</p>}
        </div>
    );
};