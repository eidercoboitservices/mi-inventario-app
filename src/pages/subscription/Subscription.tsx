import React from 'react';
import { CreditCard, Check } from 'lucide-react';


const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Tu lista de planes
  const plans = [
    {
      id: 'monthly',
      name: 'Plan Mensual',
      price: 20000,
      period: 'monthly',
      features: [
        'Acceso completo',
        'Actualizaciones automáticas',
        'Soporte por correo',
      ],
    },
    {
      id: 'annual',
      name: 'Plan Anual',
      price: 299000,
      period: 'annual',
      features: [
        'Acceso completo',
        'Actualizaciones automáticas',
        'Prioridad en soporte',
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setError(null);
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError('Por favor selecciona un plan');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (selectedPlan === 'monthly') {
        window.location.href = 'https://checkout.bold.co/payment/LNK_T458CX79EU'; // 🔥 Aquí va tu link Bold mensual
      } else if (selectedPlan === 'annual') {
        window.location.href = 'https://checkout.bold.co/payment/LNK_3KI08LQ1RH'; // 🔥 Aquí va tu link Bold anual
      } else {
        throw new Error('Plan inválido seleccionado');
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error procesando tu pago');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Suscripciones</h1>
        <p className="text-gray-600">Elige tu plan de suscripción</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Planes disponibles</h3>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => handleSelectPlan(plan.id)}
                className={`border rounded-lg p-6 cursor-pointer transition-all ${
                  selectedPlan === plan.id 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                    <p className="text-gray-500 text-sm">{plan.period === 'monthly' ? 'Pago mensual' : 'Pago anual'}</p>
                  </div>
                  <div className="flex h-6 items-center">
                    <input
                      type="radio"
                      checked={selectedPlan === plan.id}
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-3xl font-bold text-gray-900">${plan.price.toLocaleString('es-CO')}</p>
                  <p className="text-gray-500 text-sm">
                    {plan.period === 'monthly' ? 'por mes' : 'por año'}
                  </p>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handlePayment}
              disabled={loading || !selectedPlan}
              className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading || !selectedPlan ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                <span className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Suscribirse ahora
                </span>
              )}
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Procesamiento de pagos seguro a través de Bold</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
