import { PencilIcon } from "@/components/Icons";

interface SectionSummaryProps {
    title: string;
    children: React.ReactNode;
    onEdit: () => void;
}

export const SectionSummary = ({ title, children, onEdit }: SectionSummaryProps) => (
    <div className="flex justify-between items-center">
        <div>
            <p className="text-sm text-neutral-500">{title}</p>
            <div className="text-sm font-medium text-dark mt-1">{children}</div>
        </div>
        <button onClick={onEdit} className="flex items-center text-sm font-semibold text-primary hover:text-primary-hover">
            <PencilIcon className="w-4 h-4 mr-1.5" />
            Editar
        </button>
    </div>
);