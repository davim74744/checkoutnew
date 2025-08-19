import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    fullWidth?: boolean;
    isLoading?: boolean;
}

export const Button = ({ children, onClick, fullWidth, isLoading, type = 'button', disabled = false, ...props }: ButtonProps) => {
    const isDisabled = isLoading || disabled;
    
    return (
        <button 
            type={type} 
            onClick={onClick} 
            disabled={isDisabled} 
            className={cn(
                "font-semibold h-12 py-3 px-6 rounded-xl transition-all duration-300 ease-in-out flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md transform hover:-translate-y-px bg-primary text-light hover:bg-primary-hover focus:ring-primary",
                fullWidth && "w-full",
                isDisabled && "opacity-75 cursor-not-allowed"
            )}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                </>
            ) : children}
        </button>
    );
};
