import { useState } from "react";

function InvestmentSimulator() {
  const [investmentRate, setInvestmentRate] = useState(5.0);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [years, setYears] = useState(10);
  const [simulationYears, setSimulationYears] = useState(20);
  const [annualInvestment, setAnnualInvestment] = useState(20000);
  const [investmentGrowthRate, setInvestmentGrowthRate] = useState(3.0);

  const calculateCompoundInterest = () => {
    let total = 0;
    let yearlyInvestment = annualInvestment;
    const returnRate = (investmentRate || 0) / 100;
    const growthRate = (investmentGrowthRate || 0) / 100;

    // Calculate each year's contribution and its growth until investment period
    for (let year = 1; year <= years; year++) {
      // Add this year's investment and let it grow until simulation end
      total += yearlyInvestment * Math.pow(1 + returnRate, simulationYears - year + 1);
      yearlyInvestment *= (1 + growthRate);
    }

    return total.toFixed(2);
  };

  const calculatePresentValue = () => {
    const futureValue = parseFloat(calculateCompoundInterest());
    const inflation = (inflationRate || 0) / 100;
    // Discount future value to present considering the full simulation period
    const presentValue = futureValue / Math.pow(1 + inflation, simulationYears);
    return presentValue.toFixed(2);
  };

  const calculateYearlyEvolution = () => {
    const results = [];
    const returnRate = (investmentRate || 0) / 100;
    const growthRate = (investmentGrowthRate || 0) / 100;
    const inflation = (inflationRate || 0) / 100;
    let yearlyInvestment = annualInvestment;
    let investments = [];

    // First, calculate all yearly investment amounts
    for (let year = 1; year <= years; year++) {
      investments.push(yearlyInvestment);
      yearlyInvestment *= (1 + growthRate);
    }

    // Then calculate year by year evolution
    for (let currentYear = 1; currentYear <= simulationYears; currentYear++) {
      let total = 0;
      
      // Sum up all investments made up to this point with their respective growth
      for (let year = 0; year < Math.min(currentYear, years); year++) {
        total += investments[year] * Math.pow(1 + returnRate, currentYear - year);
      }

      const presentValue = total / Math.pow(1 + inflation, currentYear);
      
      results.push({
        year: currentYear,
        projected: total,
        present: presentValue
      });
    }
    return results;
  };

  const handleYearsChange = (value) => {
    setYears(parseInt(value));
  };

  const handleAnnualInvestmentChange = (value) => {
    const parsedValue = parseFloat(value) || 0;
    setAnnualInvestment(parsedValue);
  };

  const handleRateChange = (value, setter) => {
    if (value === '') {
      setter('');
      return;
    }
    // Replace comma with dot for parsing
    const normalizedValue = value.replace(',', '.');
    const parsed = parseFloat(normalizedValue);
    if (!isNaN(parsed)) {
      setter(parsed);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800">Investment Simulator</h4>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Simulation Duration */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
            <h6 className="font-medium text-gray-800">Simulation Settings</h6>
            <div>
              <label htmlFor="simulationYears" className="block text-sm font-medium text-gray-700">
                Simulation Duration (years)
              </label>
              <select
                id="simulationYears"
                value={simulationYears}
                onChange={(e) => setSimulationYears(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
              >
                {Array.from({length: 80}, (_, i) => (
                  <option key={i+1} value={i+1}>{i+1} years</option>
                ))}
              </select>
              <div className="text-xs text-gray-500 mt-1">
                Total duration of the simulation (can exceed investment period)
              </div>
            </div>
          </div>

          {/* Investment Planning */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
            <h6 className="font-medium text-gray-800">Investment Planning</h6>
            <div>
              <label htmlFor="annualInvestment" className="block text-sm font-medium text-gray-700">
                Annual Investment (€)
              </label>
              <input
                type="number"
                id="annualInvestment"
                value={annualInvestment.toFixed(0)}
                onChange={(e) => handleAnnualInvestmentChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                placeholder="e.g. 10000"
              />
              <div className="text-xs text-gray-500 mt-1">
                How much money you are investing each year.
              </div>
            </div>
            <div>
              <label htmlFor="investmentGrowthRate" className="block text-sm font-medium text-gray-700">
                Annual Investment Growth Rate (%)
              </label>
              <input
                type="text"
                id="investmentGrowthRate"
                value={investmentGrowthRate === 0 ? '' : (investmentGrowthRate + '').replace('.', ',')}
                onChange={(e) => handleRateChange(e.target.value, setInvestmentGrowthRate)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                placeholder="e.g. 2,5"
              />
              <div className="text-xs text-gray-500 mt-1">
                Annual percentage increase in investment (e.g. in case of income growth).
              </div>
              <div className="text-xs text-gray-500 mt-1">
                For instance, if you invest €10,000 this year and expect to increase your investment by 2.5% each year, the next year you would invest €10,250, and the year after that €10,506.25, etc...
              </div>
            </div>
            <div>
              <label htmlFor="years" className="block text-sm font-medium text-gray-700">
                Investment Duration (years)
              </label>
              <select
                id="years"
                value={years}
                onChange={(e) => handleYearsChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
              >
                {Array.from({length: 80}, (_, i) => (
                  <option key={i+1} value={i+1}>{i+1} years</option>
                ))}
              </select>
              <div className="text-xs text-gray-500 mt-1">
                How long will you continue investing? (e.g. 10 years)
              </div>
            </div>
          </div>

          {/* Return Rate */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
            <h6 className="font-medium text-gray-800">Expected Return</h6>
            <div>
              <label htmlFor="investmentRate" className="block text-sm font-medium text-gray-700">
                Annual Return Rate (%)
              </label>
              <input
                type="text"
                id="investmentRate"
                value={investmentRate === 0 ? '' : (investmentRate + '').replace('.', ',')}
                onChange={(e) => handleRateChange(e.target.value, setInvestmentRate)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                placeholder="e.g. 5,5"
              />
              <div className="text-xs text-gray-500 mt-1">
                Expected annual return on investment (e.g. 5.5% for stocks)
              </div>
            </div>
          </div>

          {/* Economic Factors */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
            <h6 className="font-medium text-gray-800">Economic Factors</h6>
            <div>
              <label htmlFor="inflationRate" className="block text-sm font-medium text-gray-700">
                Annual Inflation Rate (%)
              </label>
              <input
                type="text"
                id="inflationRate"
                value={inflationRate === 0 ? '' : (inflationRate + '').replace('.', ',')}
                onChange={(e) => handleRateChange(e.target.value, setInflationRate)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                placeholder="e.g. 3,2"
              />
              <div className="text-xs text-gray-500 mt-1">
                Expected annual inflation rate (e.g. 2.5% for current average inflation in France)
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Results */}
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 h-fit">
          <h5 className="text-lg font-semibold text-gray-800 mb-4">Investment Results</h5>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Projected amount after {simulationYears} years:
                {years < simulationYears && 
                  <span className="text-xs text-gray-500 ml-2">
                    (including {simulationYears - years} years of growth without new investments)
                  </span>
                }
              </p>
              <p className="text-2xl font-bold text-blue-600">
                €{parseFloat(calculateCompoundInterest()).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Present Value (adjusted for inflation):</p>
              <p className="text-2xl font-bold text-green-600">
                €{parseFloat(calculatePresentValue()).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h6 className="font-medium text-gray-800 mb-3">Year by Year Evolution</h6>
            <div className="overflow-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projected Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Present Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {calculateYearlyEvolution().map((yearData) => (
                    <tr key={yearData.year}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Year {yearData.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        €{yearData.projected.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        €{yearData.present.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvestmentSimulator;