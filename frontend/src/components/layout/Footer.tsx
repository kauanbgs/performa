export default function Footer() {
    return (
        <footer className="bg-white">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-secondary text-sm">
                            © {new Date().getFullYear()} Performa | Desenvolvido por <a href="https://github.com/kauanbgs" className="text-gray-400 hover:text-gray-600 transition-colors font-secondary text-sm">Kauan Plaza.</a>
                        </span>

                    </div>
                    <div className="flex gap-6">  
                        <a href="https://www.linkedin.com/in/kauanbgs/" className="text-gray-400 hover:text-gray-600 transition-colors font-secondary text-sm" target="_blank">
                            Linkedin
                        </a>
                        <a href="https://github.com/kauanbgs" className="text-gray-400 hover:text-gray-600 transition-colors font-secondary text-sm" target="_blank">
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}