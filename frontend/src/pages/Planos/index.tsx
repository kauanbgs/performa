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
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-black">
          Escolha o plano ideal
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Preços simples e transparentes para todos os tamanhos de projetos. Sem surpresas ou taxas ocultas.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative flex flex-col p-8 rounded-2xl border-2 transition-transform duration-300 hover:-translate-y-1 ${
                plan.highlighted 
                  ? 'bg-black text-white border-black shadow-2xl scale-105 z-10' 
                  : 'bg-white text-black border-black shadow-sm'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-white text-black border-2 border-black text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-black'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm min-h-[40px] ${plan.highlighted ? 'text-gray-300' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8 flex items-baseline text-5xl font-extrabold">
                {plan.price}
                {plan.period && (
                  <span className={`text-xl font-medium ml-1 ${plan.highlighted ? 'text-gray-300' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className={`h-6 w-6 shrink-0 mr-3 ${plan.highlighted ? 'text-white' : 'text-black'}`} />
                    <span className={plan.highlighted ? 'text-gray-200' : 'text-gray-700'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => window.location.href = "/cadastro"}
                className={`w-full py-4 px-6 rounded-lg font-bold text-center transition-colors duration-200 border-2 ${
                  plan.highlighted
                    ? 'bg-white text-black border-white hover:bg-gray-100'
                    : 'bg-black text-white border-black hover:bg-white hover:text-black'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / FAQ Hint */}
      <div className="bg-gray-50 border-t-2 border-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-black font-medium mb-2">Tem alguma dúvida sobre os planos?</p>
          <a href="#" className="text-black underline font-bold hover:text-gray-600 transition-colors">
            Fale com a nossa equipe
          </a>
        </div>
      </div>
    </div>
  );
}