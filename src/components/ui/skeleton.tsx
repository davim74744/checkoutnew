import { cn } from "@/lib/utils";

export const Skeleton = ({ className }: { className?: string }) => (
    <div className={cn("bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] animate-shimmer rounded", className)} />
);
