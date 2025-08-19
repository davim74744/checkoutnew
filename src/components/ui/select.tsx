import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    children: React.ReactNode;
}

export const Select = ({ label, id, value, onChange, error, children, name, ...props }: SelectProps) => {
    const hasError = error && error.length > 0;
    
    return (
        <div className="mb-4 relative">
            <label htmlFor={id} className="block text-sm font-medium text-neutral-600 mb-1.5">{label}</label>
            <select 
                id={id} 
                name={name || id} 
                value={value} 
                onChange={onChange} 
                className={cn(
                    "w-full h-11 px-4 bg-neutral-50 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 appearance-none text-sm",
                    hasError ? 'border-error focus:ring-error-soft' : 'border-neutral-300 focus:ring-primary'
                )}
                {...props}
            >
                {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-700 mt-7">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
            {hasError && <p className="text-xs text-error-soft mt-1.5">{error}</p>}
        </div>
    );
};
