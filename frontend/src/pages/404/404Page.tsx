import { Link } from 'react-router-dom';

export default function Page404() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white text-black font-secondary">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl mb-2">Essa página não existe.</h2>
            <p className="text-lg mb-6">A página procurada não existe ou foi removida. Se você acha que isso é um erro, favor contate o administrador.</p>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full w-50 hover:bg-blue-600 transition-colors" onClick={() => window.history.back()}>Voltar</button>
        </div>
    );
};