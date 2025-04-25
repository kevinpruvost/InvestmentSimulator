import { useState } from "react";

function InvestmentSimulator({ netRevenue }) {
  const [investmentRate, setInvestmentRate] = useState(5); // Annual return rate (%)
  const [inflationRate, setInflationRate] = useState(2); // Annual inflation rate (%)
  const [years, setYears] = useState(10); // Investment period (years)
  const [annualInvestment, setAnnualInvestment] = useState(netRevenue * 0.5); // 50% of annual net revenue
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
    const parsedValue = parseFloat(value) || 1;
    setYears(Math.max(1, Math.min(80, parsedValue)));
  };

  const handleAnnualInvestmentChange = (value) => {
    const parsedValue = parseFloat(value) || 0;
    setAnnualInvestment(Math.min(parsedValue, netRevenue));
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800">Simulateur d'Investissement</h4>
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
        <input
          type="number"
          id="investmentRate"
          value={investmentRate}
          onChange={(e) => setInvestmentRate(parseFloat(e.target.value) || 0)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
          placeholder="ex. 5"
        />
      </div>
      <div>
        <label htmlFor="inflationRate" className="block text-sm font-medium text-gray-700">
          Taux d'inflation annuel (%)
        </label>
        <input
          type="number"
          id="inflationRate"
          value={inflationRate}
          onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
          placeholder="ex. 2"
        />
      </div>
      <div>
        <label htmlFor="investmentGrowthRate" className="block text-sm font-medium text-gray-700">
          Taux de croissance annuel de l'investissement (%)
        </label>
        <input
          type="number"
          id="investmentGrowthRate"
          value={investmentGrowthRate}
          onChange={(e) => setInvestmentGrowthRate(parseFloat(e.target.value) || 0)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
          placeholder="ex. 0"
        />
        <div className="text-xs text-gray-500 mt-1">
          Pourcentage d'augmentation annuelle de l'investissement (ex. croissance du revenu)
        </div>
      </div>
      <div>
        <label htmlFor="years" className="block text-sm font-medium text-gray-700">
          Durée de l'investissement (années)
        </label>
        <input
          type="number"
          id="years"
          value={years}
          onChange={(e) => handleYearsChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
          placeholder="ex. 10"
        />
        <div className="text-xs text-gray-500 mt-1">
          Minimum: 1 an, Maximum: 80 ans
        </div>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h5 className="text-sm font-semibold text-gray-700 mb-2">Résultat de l'investissement</h5>
        <p className="text-sm text-gray-600">
          Montant projeté après {years} ans : €{parseFloat(calculateCompoundInterest()).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </p>
        <p className="text-sm text-gray-600">
          Valeur présente (ajustée pour l'inflation) : €{parseFloat(calculatePresentValue()).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}

export default InvestmentSimulator;