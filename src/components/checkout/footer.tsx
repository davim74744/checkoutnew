import { Skeleton } from "@/components/ui/skeleton";
import { FacebookIcon, InstagramIcon, TwitterIcon, VisaIcon, MastercardIcon, EloIcon, PixIcon } from "@/components/Icons";

const footerLinks = {
    institucional: [ { name: 'Sobre Nós', href: '#' }, { name: 'Carreiras', href: '#' }, { name: 'Imprensa', href: '#' }, ],
    politicas: [ { name: 'Termos de Uso', href: '#' }, { name: 'Política de Privacidade', href: '#' }, ],
    ajuda: [ { name: 'Central de Ajuda', href: '#' }, { name: 'Fale Conosco', href: '#' }, ],
};
const socialLinks = [ { name: 'Facebook', href: '#', icon: FacebookIcon }, { name: 'Twitter', href: '#', icon: TwitterIcon }, { name: 'Instagram', href: '#', icon: InstagramIcon }, ];

const FooterSkeleton = () => (
    <footer className="w-full bg-dark mt-16">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-center sm:text-left">
                <div className="sm:col-span-2 lg:col-span-1 flex flex-col items-center sm:items-start">
                    <Skeleton className="h-8 w-32 mb-4" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="space-y-3 flex flex-col items-center sm:items-start"><Skeleton className="h-4 w-24 mb-3" /><Skeleton className="h-3 w-20" /><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-24" /></div>
                <div className="space-y-3 flex flex-col items-center sm:items-start"><Skeleton className="h-4 w-24 mb-3" /><Skeleton className="h-3 w-20" /><Skeleton className="h-3 w-16" /></div>
                <div className="space-y-3 flex flex-col items-center sm:items-start"><Skeleton className="h-4 w-24 mb-3" /><Skeleton className="h-3 w-20" /><Skeleton className="h-3 w-16" /></div>
                <div className="space-y-3 flex flex-col items-center sm:items-start">
                    <Skeleton className="h-4 w-24 mb-3" />
                    <div className="flex gap-4 justify-center sm:justify-start">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-neutral-700 flex flex-col sm:flex-row justify-between items-center">
                <Skeleton className="h-4 w-48 mb-4 sm:mb-0" />
                <div className="flex items-center space-x-3">
                    <Skeleton className="h-7 w-11 rounded-md" />
                    <Skeleton className="h-7 w-11 rounded-md" />
                    <Skeleton className="h-7 w-11 rounded-md" />
                    <Skeleton className="h-7 w-11 rounded-md" />
                </div>
            </div>
        </div>
    </footer>
);


export const Footer = ({ isLoading }: { isLoading: boolean }) => {
    if (isLoading) {
        return <FooterSkeleton />;
    }

    return (
        <footer className="w-full bg-dark text-neutral-300 mt-16">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-center sm:text-left">
                    <div className="sm:col-span-2 lg:col-span-1 text-sm">
                        <div className="flex items-center mb-2 justify-center sm:justify-start">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="ml-2.5 text-xl font-bold text-light">Recarga<span className="font-normal">Fácil</span></span>
                        </div>
                        <p>A maneira mais rápida e segura de recarregar seu celular.</p>
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-100 tracking-wider uppercase">Institucional</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.institucional.map(item => <li key={item.name}><a href={item.href} className="text-sm text-neutral-300 hover:text-light transition-colors">{item.name}</a></li>)}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-neutral-100 tracking-wider uppercase">Políticas</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.politicas.map(item => <li key={item.name}><a href={item.href} className="text-sm text-neutral-300 hover:text-light transition-colors">{item.name}</a></li>)}
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-100 tracking-wider uppercase">Ajuda</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.ajuda.map(item => <li key={item.name}><a href={item.href} className="text-sm text-neutral-300 hover:text-light transition-colors">{item.name}</a></li>)}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-neutral-100 tracking-wider uppercase">Siga-nos</h3>
                        <div className="flex mt-4 space-x-4 justify-center sm:justify-start">
                            {socialLinks.map(item => <a key={item.name} href={item.href} className="text-neutral-400 hover:text-light transition-colors"><span className="sr-only">{item.name}</span><item.icon /></a>)}
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-neutral-700 flex flex-col sm:flex-row justify-between items-center text-xs">
                    <p className="text-neutral-400 order-2 sm:order-1 mt-4 sm:mt-0 text-center sm:text-left">© 2025 RecargaFácil — Todos os direitos reservados.</p>
                    <div className="flex items-center space-x-3 order-1 sm:order-2">
                        <span className="text-neutral-400">Pagamento seguro com:</span>
                        <div className="h-6 flex items-center justify-center p-0.5"><VisaIcon /></div>
                        <div className="h-6 flex items-center justify-center p-0.5"><MastercardIcon /></div>
                        <div className="h-6 flex items-center justify-center p-0.5"><EloIcon /></div>
                        <div className="h-6 flex items-center justify-center p-0.5 text-neutral-100"><PixIcon className="h-3 w-3"/></div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
