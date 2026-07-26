import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Básico',
    description: 'Para quem está começando e precisa apenas do essencial.',
    price: 'R$ 0',
    period: '/mês',
    features: [
      'Até 3 projetos',
      '3 Exportações diárias',
      'Suporte da comunidade',
      'Estatísticas básicas'
    ],
    buttonText: 'Começar grátis',
    highlighted: false,
  },
  {
    name: 'Profissional',
    description: 'A solução completa para autônomos e pequenas equipes.',
    price: 'R$ 15',
    period: '/mês',
    features: [
      'Até 5 Usuários',
      'Projetos ilimitados',
      'Exportações ilimitadas',
      'Suporte prioritário',
      'Estatísticas avançadas',
      'Exportação de dados'
    ],
    buttonText: 'Assinar Profissional',
    highlighted: true,
  }
];

export default function App() {
  return (
    <div className="bg-paper text-ink min-h-screen selection:bg-black selection:text-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        {/* Mesmo display serif do resto do app: esta página estava em
            font-sans genérica, destoando de todas as outras. */}
        <h1 className="font-primary text-ink mb-4 text-4xl md:text-5xl">
          Escolha o plano ideal
        </h1>
        <p className="font-secondary text-ink-soft mx-auto max-w-2xl text-lg md:text-xl">
          Preços simples e transparentes para todos os tamanhos de projetos. Sem surpresas ou taxas ocultas.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative flex flex-col rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? 'bg-ink text-paper z-10 scale-105 shadow-2xl'
                  : 'border border-black/10 bg-white/70 shadow-sm backdrop-blur-xl'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="font-secondary bg-paper text-ink rounded-full border border-black/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-primary mb-2 text-2xl">{plan.name}</h3>
                <p
                  className={`font-secondary min-h-[40px] text-sm ${plan.highlighted ? 'text-white/70' : 'text-ink-soft'}`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="font-primary mb-8 flex items-baseline text-5xl">
                {plan.price}
                {plan.period && (
                  <span
                    className={`font-secondary ml-1 text-xl font-medium ${plan.highlighted ? 'text-white/70' : 'text-ink-soft'}`}
                  >
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="font-secondary flex items-start text-sm">
                    <Check
                      className={`mr-3 h-5 w-5 shrink-0 ${plan.highlighted ? 'text-paper' : 'text-ink'}`}
                    />
                    <span className={plan.highlighted ? 'text-white/90' : 'text-ink-soft'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => window.location.href = "/cadastro"}
                className={`font-secondary h-12 w-full rounded-full px-6 text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-paper text-ink hover:bg-white'
                    : 'bg-ink text-paper hover:bg-black'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / FAQ Hint */}
      <div className="border-t border-black/10 bg-black/[0.02] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-secondary text-ink mb-2 text-sm font-medium">
            Tem alguma dúvida sobre os planos?
          </p>
          {/* Antes era href="#" — um link que não levava a lugar nenhum.
              Aponta para o mesmo contato já usado no rodapé do app. */}
          <a
            href="https://www.linkedin.com/in/kauanbgs/"
            target="_blank"
            rel="noreferrer"
            className="font-secondary text-ink text-sm underline underline-offset-4 transition-colors hover:text-ink-soft"
          >
            Falar com quem fez
          </a>
        </div>
      </div>
    </div>
  );
}