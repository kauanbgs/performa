import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <div className="bg-paper flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* O 404 usa o mesmo itálico de display do resto do app: mesmo errando
          a rota, o usuário continua dentro da mesma marca. */}
      <p className="font-primary text-ink text-7xl italic sm:text-8xl">404</p>

      <h1 className="font-primary text-ink mt-4 text-2xl sm:text-3xl">
        Essa página não existe.
      </h1>

      {/* Um beco sem saída deve apontar uma saída, não pedir para "contatar
          o administrador" — não há administrador nenhum para contatar. */}
      <p className="font-secondary text-ink-soft mt-3 max-w-md text-sm leading-relaxed">
        O link pode estar quebrado ou a página pode ter sido removida.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/home"
          className="font-secondary bg-ink text-paper inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors hover:bg-black"
        >
          Ir para meus projetos
        </Link>
        <button
          onClick={() => window.history.back()}
          className="font-secondary text-ink inline-flex h-12 items-center justify-center rounded-full border border-black/15 px-6 text-sm font-medium transition-colors hover:bg-black/5"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
