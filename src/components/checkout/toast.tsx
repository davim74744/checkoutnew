import { CheckCircleIcon } from "@/components/Icons";
import type { ToastData } from "@/lib/types";

const Toast = ({ message, type }: Omit<ToastData, 'id'>) => {
    const icon = type === 'success' ? <CheckCircleIcon className="w-6 h-6 text-success" /> : null;
    return (
        <div className="flex items-center gap-3 p-4 bg-light rounded-xl shadow-lg animate-toast-in">
            {icon}
            <p className="font-medium text-sm text-neutral-800">{message}</p>
        </div>
    );
};

export const ToastContainer = ({ toasts }: { toasts: ToastData[] }) => (
    <div className="fixed bottom-8 right-8 z-50 space-y-3">
        {toasts.map(toast => <Toast key={toast.id} message={toast.message} type={toast.type} />)}
    </div>
);