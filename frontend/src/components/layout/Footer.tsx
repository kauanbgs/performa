export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-secondary text-sm">
                            © {new Date().getFullYear()} Performa | Desenvolvido por <a href="https://github.com/kauanbgs" className="text-gray-400 hover:text-gray-600 transition-colors font-secondary text-sm">Kauan Plaza.</a>
                        </span>

                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors font-secondary text-sm">
                            Termos de Uso
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors font-secondary text-sm">
                            Política de Privacidade
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors font-secondary text-sm">
                            Contato
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}