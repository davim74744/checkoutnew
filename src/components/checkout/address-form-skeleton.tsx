import { Skeleton } from "@/components/ui/skeleton";

export const AddressFormSkeleton = () => (
    <div className="p-6 space-y-4">
        <div className="space-y-1.5"><Skeleton className="h-4 w-12" /><Skeleton className="h-11 w-1/2" /></div>
        <div className="space-y-1.5"><Skeleton className="h-4 w-24" /><Skeleton className="h-11 w-full" /></div>
        <div className="grid md:grid-cols-2 md:gap-4">
            <div className="space-y-1.5"><Skeleton className="h-4 w-16" /><Skeleton className="h-11 w-full" /></div>
            <div className="space-y-1.5"><Skeleton className="h-4 w-32" /><Skeleton className="h-11 w-full" /></div>
        </div>
         <div className="space-y-1.5"><Skeleton className="h-4 w-16" /><Skeleton className="h-11 w-full" /></div>
        <div className="pt-2"><Skeleton className="h-12 w-full rounded-lg" /></div>
    </div>
);
