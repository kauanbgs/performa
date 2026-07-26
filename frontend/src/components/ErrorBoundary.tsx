import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erro não tratado na árvore de componentes:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
        <h1 className="text-xl font-semibold text-black">Algo deu errado.</h1>
        <p className="text-sm text-neutral-500">
          Tente recarregar a página. Se o problema continuar, volte mais tarde.
        </p>
        <button
          onClick={() => window.location.assign("/")}
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white"
        >
          Voltar ao início
        </button>
      </div>
    );
  }
}
