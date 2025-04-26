import { useState } from "react";

function RealEstate() {
  const [netRevenue, setNetRevenue] = useState(20000); // Example net annual revenue
  const [investmentRate, setInvestmentRate] = useState(5); // Annual return rate (%)
  const [inflationRate, setInflationRate] = useState(3); // Annual inflation rate (%)
  const [years, setYears] = useState(10); // Investment period (years)
  const [annualInvestment, setAnnualInvestment] = useState(20000);
  const [investmentGrowthRate, setInvestmentGrowthRate] = useState(0); // Annual investment growth rate (%)

  const calculateCompoundInterest = () => {
    let principal = annualInvestment; // Initial annual investment
    const returnRate = investmentRate / 100;
    const growthRate = investmentGrowthRate / 100;
    let amount = 0;

    // Compound interest with increasing annual investment
    for (let i = 0; i < years; i++) {
      // Calculate compound interest for the current year's investment
      amount += principal * Math.pow(1 + returnRate, years - i);
      // Increase the principal for the next year
      principal *= (1 + growthRate);
    }

    return amount.toFixed(2);
  };

  const calculatePresentValue = () => {
    const futureValue = parseFloat(calculateCompoundInterest());
    const inflation = inflationRate / 100;
    // Present Value formula: PV = FV / (1 + i)^n
    const presentValue = futureValue / Math.pow(1 + inflation, years);
    return presentValue.toFixed(2);
  };

  const handleYearsChange = (value) => {
    setYears(parseInt(value));
  };

  const handleAnnualInvestmentChange = (value) => {
    const parsedValue = parseFloat(value) || 0;
    setAnnualInvestment(Math.max(0, Math.min(parsedValue, netRevenue)));
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800">Simulateur d'Investissement</h4>
      <div className="grid grid-cols-2 gap-8">
        {/* Left column - Parameters */}
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Revenu net annuel disponible : €{netRevenue.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} (€{(netRevenue / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois)
          </p>
          <div>
            <label htmlFor="annualInvestment" className="block text-sm font-medium text-gray-700">
              Investissement annuel (€)
            </label>
            <input
              type="number"
              id="annualInvestment"
              value={annualInvestment.toFixed(0)}
              onChange={(e) => handleAnnualInvestmentChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
              placeholder="ex. 10000"
            />
            <div className="text-xs text-gray-500 mt-1">
              Maximum: €{netRevenue.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an
            </div>
          </div>
          <div>
            <label htmlFor="investmentRate" className="block text-sm font-medium text-gray-700">
              Taux de rendement annuel (%)
            </label>
            <select
              id="investmentRate"
              value={investmentRate}
              onChange={(e) => setInvestmentRate(parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
            >
              {Array.from({length: 21}, (_, i) => (
                <option key={i} value={i}>{i}%</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="inflationRate" className="block text-sm font-medium text-gray-700">
              Taux d'inflation annuel (%)
            </label>
            <select
              id="inflationRate"
              value={inflationRate}
              onChange={(e) => setInflationRate(parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
            >
              {Array.from({length: 21}, (_, i) => (
                <option key={i} value={i}>{i}%</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="investmentGrowthRate" className="block text-sm font-medium text-gray-700">
              Taux de croissance annuel de l'investissement (%)
            </label>
            <select
              id="investmentGrowthRate"
              value={investmentGrowthRate}
              onChange={(e) => setInvestmentGrowthRate(parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
            >
              {Array.from({length: 21}, (_, i) => (
                <option key={i} value={i}>{i}%</option>
              ))}
            </select>
            <div className="text-xs text-gray-500 mt-1">
              Pourcentage d'augmentation annuelle de l'investissement (ex. croissance du revenu)
            </div>
          </div>
          <div>
            <label htmlFor="years" className="block text-sm font-medium text-gray-700">
              Durée de l'investissement (années)
            </label>
            <select
              id="years"
              value={years}
              onChange={(e) => handleYearsChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
            >
              {Array.from({length: 80}, (_, i) => (
                <option key={i+1} value={i+1}>{i+1} ans</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right column - Results */}
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 h-fit">
          <h5 className="text-lg font-semibold text-gray-800 mb-4">Résultat de l'investissement</h5>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Montant projeté après {years} ans :</p>
              <p className="text-2xl font-bold text-blue-600">
                €{parseFloat(calculateCompoundInterest()).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Valeur présente (ajustée pour l'inflation) :</p>
              <p className="text-2xl font-bold text-green-600">
                €{parseFloat(calculatePresentValue()).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealEstate;