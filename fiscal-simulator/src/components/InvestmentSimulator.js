import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

function InvestmentSimulator() {
  // Initialize state with values from cookies or defaults
  const [investmentRate, setInvestmentRate] = useState(() => parseFloat(Cookies.get('investmentRate') || '5.0'));
  const [inflationRate, setInflationRate] = useState(() => parseFloat(Cookies.get('inflationRate') || '2.5'));
  const [years, setYears] = useState(() => parseInt(Cookies.get('years') || '10'));
  const [simulationYears, setSimulationYears] = useState(() => parseInt(Cookies.get('simulationYears') || '20'));
  const [annualInvestment, setAnnualInvestment] = useState(() => parseFloat(Cookies.get('annualInvestment') || '20000'));
  const [investmentGrowthRate, setInvestmentGrowthRate] = useState(() => parseFloat(Cookies.get('investmentGrowthRate') || '3.0'));

  // Save parameters to cookies whenever they change
  useEffect(() => {
    Cookies.set('investmentRate', investmentRate.toString(), { expires: 365 });
    Cookies.set('inflationRate', inflationRate.toString(), { expires: 365 });
    Cookies.set('years', years.toString(), { expires: 365 });
    Cookies.set('simulationYears', simulationYears.toString(), { expires: 365 });
    Cookies.set('annualInvestment', annualInvestment.toString(), { expires: 365 });
    Cookies.set('investmentGrowthRate', investmentGrowthRate.toString(), { expires: 365 });
  }, [investmentRate, inflationRate, years, simulationYears, annualInvestment, investmentGrowthRate]);

  // Ensure investment duration doesn't exceed simulation duration
  const handleSimulationYearsChange = (value) => {
    const parsedValue = parseInt(value);
    setSimulationYears(parsedValue);
    if (years > parsedValue) {
      setYears(parsedValue);
    }
  };

  // Ensure simulation duration is at least as long as investment duration
  const handleYearsChange = (value) => {
    const parsedValue = parseInt(value);
    setYears(parsedValue);
    if (parsedValue > simulationYears) {
      setSimulationYears(parsedValue);
    }
  };

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

  const calculateValueAtInvestmentEnd = () => {
    let total = 0;
    let yearlyInvestment = annualInvestment;
    const returnRate = (investmentRate || 0) / 100;
    const growthRate = (investmentGrowthRate || 0) / 100;
    const inflation = (inflationRate || 0) / 100;

    for (let year = 1; year <= years; year++) {
      total += yearlyInvestment * Math.pow(1 + returnRate, years - year + 1);
      yearlyInvestment *= (1 + growthRate);
    }

    const presentValue = total / Math.pow(1 + inflation, years);
    return { projected: total.toFixed(2), present: presentValue.toFixed(2) };
  };

  const calculateGrowthAfterInvestment = () => {
    const finalValues = {
      projected: parseFloat(calculateCompoundInterest()),
      present: parseFloat(calculatePresentValue())
    };
    const stopValues = {
      projected: parseFloat(calculateValueAtInvestmentEnd().projected),
      present: parseFloat(calculateValueAtInvestmentEnd().present)
    };
    
    const percentageProjected = ((finalValues.projected / stopValues.projected - 1) * 100);
    const percentagePresent = ((finalValues.present / stopValues.present - 1) * 100);
    
    const growth = {
      projected: finalValues.projected - stopValues.projected,
      present: finalValues.present - stopValues.present,
      percentageProjected: (percentageProjected >= 0 ? '+' : '') + percentageProjected.toFixed(2),
      percentagePresent: (percentagePresent >= 0 ? '+' : '') + percentagePresent.toFixed(2)
    };
    
    return growth;
  };

  const calculateTotalInvestment = () => {
    let total = 0;
    let yearlyInvestment = annualInvestment;
    const growthRate = (investmentGrowthRate || 0) / 100;

    for (let year = 1; year <= years; year++) {
      total += yearlyInvestment;
      yearlyInvestment *= (1 + growthRate);
    }
    return total;
  };

  const calculateTotalInvestmentPresentValue = () => {
    let total = 0;
    let yearlyInvestment = annualInvestment;
    const growthRate = (investmentGrowthRate || 0) / 100;
    const inflation = (inflationRate || 0) / 100;

    for (let year = 1; year <= years; year++) {
      total += yearlyInvestment / Math.pow(1 + inflation, year);
      yearlyInvestment *= (1 + growthRate);
    }
    return total;
  };

  const calculateTotalGrowth = () => {
    const totalValue = parseFloat(calculateCompoundInterest());
    const totalInvested = calculateTotalInvestment();
    const presentTotalValue = parseFloat(calculatePresentValue());
    const presentTotalInvested = calculateTotalInvestmentPresentValue();
    
    const growthPercentage = ((totalValue / totalInvested - 1) * 100);
    const presentGrowthPercentage = ((presentTotalValue / presentTotalInvested - 1) * 100);
    
    return {
      growth: totalValue - totalInvested,
      growthPercentage: (growthPercentage >= 0 ? '+' : '') + growthPercentage.toFixed(2),
      presentGrowth: presentTotalValue - presentTotalInvested,
      presentGrowthPercentage: (presentGrowthPercentage >= 0 ? '+' : '') + presentGrowthPercentage.toFixed(2)
    };
  };

  const handleAnnualInvestmentChange = (value) => {
    const parsedValue = parseFloat(value) || 0;
    setAnnualInvestment(parsedValue);
  };

  const rateOptions = Array.from({ length: 201 }, (_, i) => (i / 10).toFixed(1));

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
                onChange={(e) => handleSimulationYearsChange(e.target.value)}
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
              <select
                id="investmentGrowthRate"
                value={investmentGrowthRate.toFixed(1)}
                onChange={(e) => setInvestmentGrowthRate(parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
              >
                {rateOptions.map(rate => (
                  <option key={rate} value={rate}>{rate}%</option>
                ))}
              </select>
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
              <select
                id="investmentRate"
                value={investmentRate.toFixed(1)}
                onChange={(e) => setInvestmentRate(parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
              >
                {rateOptions.map(rate => (
                  <option key={rate} value={rate}>{rate}%</option>
                ))}
              </select>
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
              <select
                id="inflationRate"
                value={inflationRate}
                onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
              >
                {rateOptions.map(rate => (
                  <option key={rate} value={rate}>{rate}%</option>
                ))}
              </select>
              <div className="text-xs text-gray-500 mt-1">
                Expected annual inflation rate (e.g. 2.5% for current average inflation in France)
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Results */}
        <div className="flex flex-col p-6 bg-gray-50 rounded-lg border border-gray-200" style={{ height: 'fit-content' }}>
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-gray-800">Investment Results</h5>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Projected amount after {simulationYears} years:
              </p>
              <p className="text-2xl font-bold text-blue-600 flex justify-between items-center">
                €{parseFloat(calculateCompoundInterest()).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                <span className="text-base font-bold text-red-500">
                  +{calculateTotalGrowth().growthPercentage.replace('+', '')}% gain
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Present Value (adjusted for inflation):</p>
              <p className="text-2xl font-bold text-green-600 flex justify-between items-center">
                €{parseFloat(calculatePresentValue()).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                <span className="text-base font-bold text-red-500">
                  +{calculateTotalGrowth().presentGrowthPercentage.replace('+', '')}% real gain
                </span>
              </p>
            </div>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Investment vs Growth Analysis:</p>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Total Money Invested:</p>
                    <p className="text-lg font-bold text-purple-600">
                      €{calculateTotalInvestment().toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Present Value:</p>
                    <p className="text-lg font-bold text-purple-500">
                      €{calculateTotalInvestmentPresentValue().toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Total Growth from Investments (after {simulationYears} years):</p>
                    <p className="text-lg font-bold text-indigo-600">
                      €{calculateTotalGrowth().growth.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                      <span className="text-sm font-normal text-indigo-500 ml-2">
                        ({calculateTotalGrowth().growthPercentage}%)
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Present Value:</p>
                    <p className="text-lg font-bold text-indigo-500">
                      <span className="text-sm font-normal text-indigo-400">
                        ({calculateTotalGrowth().presentGrowthPercentage}%)
                      </span>
                      
                      <span className="ml-2">
                        €{calculateTotalGrowth().presentGrowth.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {years < simulationYears && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Growth after stopping investments:</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Value at investment end (Year {years}):</p>
                      <p className="text-lg font-bold text-purple-600">
                        €{parseFloat(calculateValueAtInvestmentEnd().projected).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Present Value:</p>
                      <p className="text-lg font-bold text-purple-500">
                        €{parseFloat(calculateValueAtInvestmentEnd().present).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Projected Amount Growth: (after {simulationYears} years)</p>
                      <p className="text-lg font-bold text-blue-600">
                        €{calculateGrowthAfterInvestment().projected.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                        <span className="text-sm font-normal text-blue-500 ml-2">
                          ({calculateGrowthAfterInvestment().percentageProjected}%)
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Present Value Growth:</p>
                      <p className="text-lg font-bold text-green-600">
                      <span className="text-sm font-normal text-green-500 ml-2">
                          ({calculateGrowthAfterInvestment().percentagePresent}%)
                        </span>
                        <span className="ml-2">
                        €{calculateGrowthAfterInvestment().present.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 mt-6">
            <h6 className="font-medium text-gray-800 mb-3">Year by Year Evolution</h6>
            <div className="overflow-auto" style={{ height: '520px' }}>
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