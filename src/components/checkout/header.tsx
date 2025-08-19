import Image from "next/image";
import { LockClosedIcon } from "@/components/Icons";

export const Header = () => (
    <header className="bg-light border-b border-neutral-100 border-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center">
                <Image src="/sdsadsd.png" alt="RecargaFácil Logo" width={100} height={32} priority />
            </div>
            <div className="flex items-center text-sm font-medium text-primary">
                 <LockClosedIcon className="w-4 h-4 mr-2 text-primary" />
                Compra 100% Segura
            </div>
        </div>
    </header>
);
