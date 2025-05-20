import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Helper to load numeric value from cookie or return default
const loadNumericFromCookie = (key, defaultValue) => {
  const cookieValue = Cookies.get(key);
  if (cookieValue) {
    const parsed = parseFloat(cookieValue);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
};

// Helper to load boolean value from cookie or return default
const loadBooleanFromCookie = (key, defaultValue) => {
  const cookieValue = Cookies.get(key);
  if (cookieValue) {
    return cookieValue === 'true';
  }
  return defaultValue;
};


// Helper to load tax brackets from cookie
const loadBracketsFromCookie = (key, defaultBrackets) => {
  const cookieValue = Cookies.get(key);
  if (cookieValue) {
    try {
      const parsed = JSON.parse(cookieValue);
      if (Array.isArray(parsed) && parsed.every(b => 'id' in b && 'upTo' in b && 'rate' in b)) {
        return parsed.map(b => ({
          ...b,
          upTo: b.upTo === "Infinity" ? Infinity : parseFloat(b.upTo),
          rate: parseFloat(b.rate)
        }));
      }
      console.warn("Invalid taxBrackets format in cookie, using default.");
      return defaultBrackets;
    } catch (error) {
      console.error("Error parsing taxBrackets from cookie:", error);
      return defaultBrackets;
    }
  }
  return defaultBrackets;
};


function ProgressiveTax() {
  const defaultInitialBrackets = [
    { id: 1, upTo: 10777, rate: 0 },
    { id: 2, upTo: 27478, rate: 0.11 },
    { id: 3, upTo: 78570, rate: 0.3 },
    { id: 4, upTo: 168994, rate: 0.41 },
    { id: 5, upTo: Infinity, rate: 0.45 },
  ];

  const [taxBrackets, setTaxBrackets] = useState(() => loadBracketsFromCookie('taxBrackets', defaultInitialBrackets));

  const [salary, setSalary] = useState(() => loadNumericFromCookie('salary', 0));
  const [rents, setRents] = useState(() => loadNumericFromCookie('rents', 0));
  const [dividends, setDividends] = useState(() => loadNumericFromCookie('dividends', 0)); // Now Gross Dividends
  const [capitalGains, setCapitalGains] = useState(() => loadNumericFromCookie('capitalGains', 0)); // Now Gross Capital Gains

  const [socialContributionsRate, setSocialContributionsRate] = useState(() => loadNumericFromCookie('socialContributionsRate', 17.2));
  const [applySocialToDividends, setApplySocialToDividends] = useState(() => loadBooleanFromCookie('applySocialToDividends', true));
  const [applySocialToCapitalGains, setApplySocialToCapitalGains] = useState(() => loadBooleanFromCookie('applySocialToCapitalGains', true));
  const [applyCSGDeductibilityDividends, setApplyCSGDeductibilityDividends] = useState(() => loadBooleanFromCookie('applyCSGDeductibilityDividends', false));

  const [totalTaxDetails, setTotalTaxDetails] = useState({ tax: 0, explanationDetails: [] });

  // --- Calculate derived values ---
  const socialRateDecimal = socialContributionsRate / 100;
  const csgDeductibleRateValue = 0.068; // CSG deductible part is 6.8%

  let socialContributionsOnDividends = 0;
  let dividendsAfterSocial = dividends;
  if (applySocialToDividends && dividends > 0) {
    socialContributionsOnDividends = dividends * socialRateDecimal;
    dividendsAfterSocial = dividends - socialContributionsOnDividends;
  }

  let socialContributionsOnCapitalGains = 0;
  let capitalGainsAfterSocial = capitalGains;
  if (applySocialToCapitalGains && capitalGains > 0) {
    socialContributionsOnCapitalGains = capitalGains * socialRateDecimal;
    capitalGainsAfterSocial = capitalGains - socialContributionsOnCapitalGains;
  }
  
  const totalSocialContributionsPaid = socialContributionsOnDividends + socialContributionsOnCapitalGains;

  const taxableSalary = salary * 0.90; // 10% deduction for professional expenses
  const rentDeductionRate = 0.30;
  const taxableRents = rents * (1 - rentDeductionRate);
  
  const dividendDeductionRate = 0.40; // Standard 40% abatement on gross dividends
  
  let abatement40OnGrossDividends = 0;
  if (dividends > 0) {
    abatement40OnGrossDividends = dividends * dividendDeductionRate;
  }

  let csgDeductionAmountOnDividends = 0;
  if (dividends > 0 && applySocialToDividends && applyCSGDeductibilityDividends) {
    csgDeductionAmountOnDividends = dividends * csgDeductibleRateValue;
  }
  
  // Taxable dividends: Gross - 40% abatement on Gross - (optional) 6.8% CSG deductible on Gross
  const taxableDividends = dividends > 0 
    ? Math.max(0, dividends - abatement40OnGrossDividends - csgDeductionAmountOnDividends) 
    : 0;
  
  // Capital gains for tax are after social contributions, no further % deduction
  const taxableCapitalGains = capitalGainsAfterSocial > 0 ? capitalGainsAfterSocial : 0;

  const totalTaxableIncome = taxableSalary + taxableRents + taxableDividends + taxableCapitalGains;
  const totalGrossIncome = salary + rents + dividends + capitalGains;

  // --- Cookie Effects ---
  useEffect(() => {
    const serializableBrackets = taxBrackets.map(b => ({ ...b, upTo: b.upTo === Infinity ? "Infinity" : b.upTo }));
    Cookies.set('taxBrackets', JSON.stringify(serializableBrackets), { expires: 365 });
  }, [taxBrackets]);
  useEffect(() => { Cookies.set('salary', String(salary), { expires: 365 }); }, [salary]);
  useEffect(() => { Cookies.set('rents', String(rents), { expires: 365 }); }, [rents]);
  useEffect(() => { Cookies.set('dividends', String(dividends), { expires: 365 }); }, [dividends]);
  useEffect(() => { Cookies.set('capitalGains', String(capitalGains), { expires: 365 }); }, [capitalGains]);
  useEffect(() => { Cookies.set('socialContributionsRate', String(socialContributionsRate), { expires: 365 }); }, [socialContributionsRate]);
  useEffect(() => { Cookies.set('applySocialToDividends', String(applySocialToDividends), { expires: 365 }); }, [applySocialToDividends]);
  useEffect(() => { Cookies.set('applySocialToCapitalGains', String(applySocialToCapitalGains), { expires: 365 }); }, [applySocialToCapitalGains]);
  useEffect(() => { Cookies.set('applyCSGDeductibilityDividends', String(applyCSGDeductibilityDividends), { expires: 365 }); }, [applyCSGDeductibilityDividends]);

  // --- Bracket Handlers ---
  const addBracket = () => setTaxBrackets([...taxBrackets, { id: Date.now(), upTo: 0, rate: 0 }]);
  const removeBracket = (id) => setTaxBrackets((brackets) => brackets.filter((b) => b.id !== id));
  const updateBracket = (id, key, value) =>
    setTaxBrackets((brackets) =>
      brackets.map((b) =>
        b.id === id ? { ...b, [key]: key === 'rate' ? parseFloat(value) / 100 || 0 : value === 'Infinity' ? Infinity : parseFloat(value) || 0, } : b
      )
    );

  // --- Tax Calculation Logic ---
  const calculateProgressiveTaxAndExplanation = (amount, bracketsToUse) => {
    const sortedBrackets = [...bracketsToUse].sort((a, b) => a.upTo - b.upTo);
    let remainingIncome = amount;
    let lowerBound = 0;
    let calculatedTax = 0;
    const explanation = [`Detailed tax calculation for Total Taxable Income of €${amount.toFixed(2)}:`];

    if (amount <= 0) {
        explanation.push(`No positive total taxable income, so no progressive tax is calculated.`);
        return { tax: 0, explanationDetails: explanation };
    }
    for (const bracket of sortedBrackets) {
        if (remainingIncome <= 0) break;
        const bracketLimit = bracket.upTo;
        const potentialIncomeInBracket = bracketLimit - lowerBound;
        const incomeInBracket = Math.min(remainingIncome, Math.max(0, potentialIncomeInBracket));
        if (incomeInBracket <= 0 && bracketLimit !== Infinity) {
            if (amount > lowerBound && amount < bracketLimit && lowerBound < bracketLimit) {}
            lowerBound = bracketLimit;
            continue;
        }
        const taxInBracket = incomeInBracket * bracket.rate;
        calculatedTax += taxInBracket;
        const effectiveUpperLimitInBracket = lowerBound + incomeInBracket;
        if (bracketLimit === Infinity) {
            explanation.push(`- €${incomeInBracket.toFixed(2)} (income above €${lowerBound.toFixed(2)}) is taxed at ${(bracket.rate * 100).toFixed(1)}%, adding €${taxInBracket.toFixed(2)} to the tax.`);
        } else {
            explanation.push(`- €${incomeInBracket.toFixed(2)} (income from €${lowerBound.toFixed(2)} up to €${effectiveUpperLimitInBracket.toFixed(2)}) is taxed at ${(bracket.rate * 100).toFixed(1)}%, adding €${taxInBracket.toFixed(2)} to the tax.`);
        }
        remainingIncome -= incomeInBracket;
        lowerBound = bracketLimit;
        if (lowerBound >= amount && bracketLimit !== Infinity && remainingIncome <=0) break;
    }
    explanation.push(`Total progressive tax based on taxable income: €${calculatedTax.toFixed(2)}.`);
    return { tax: calculatedTax, explanationDetails: explanation };
  };

  useEffect(() => {
    setTotalTaxDetails(calculateProgressiveTaxAndExplanation(totalTaxableIncome, taxBrackets));
  }, [totalTaxableIncome, taxBrackets]);

  // --- Summary Figures ---
  const totalTax = totalTaxDetails.tax;
  const effectiveTaxRateOnGross = totalGrossIncome > 0 ? (totalTax / totalGrossIncome) * 100 : 0;
  const effectiveTaxRateOnTaxable = totalTaxableIncome > 0 ? (totalTax / totalTaxableIncome) * 100 : 0;
  const totalPaidOverall = totalTax + totalSocialContributionsPaid;
  const overallEffectiveRateOnGross = totalGrossIncome > 0 ? (totalPaidOverall / totalGrossIncome) * 100 : 0;
  const netIncome = totalGrossIncome - totalTax - totalSocialContributionsPaid;

  // --- Render Helper for Explanations ---
  const renderTaxableIncomeExplanation = () => {
    if (totalGrossIncome === 0) return null;
    return (
        <div className="p-4 border rounded bg-gray-50 mt-4 text-sm">
            <h3 className="text-md font-semibold mb-2">Total Taxable Income Calculation:</h3>
            <ul className="list-none pl-0 space-y-1">
                <li><strong>Salaries:</strong>
                    <br/>&nbsp;&nbsp;&nbsp;Gross: €{salary.toFixed(2)} <span className="text-gray-600 ml-2">(Taxable: €{taxableSalary.toFixed(2)})</span>
                    <br/>&nbsp;&nbsp;&nbsp;<span className="text-gray-600 ml-2">↳ 10% deductions (pro): -€{(salary * 0.10).toFixed(2)}</span>
                </li>
                <li><strong>Rents:</strong>
                    <br/>&nbsp;&nbsp;&nbsp;Gross: €{rents.toFixed(2)}
                    <br/>&nbsp;&nbsp;&nbsp;<span className="text-gray-600 ml-2">↳ 30% deduction: -€{(rents * rentDeductionRate).toFixed(2)}</span>
                    <br/>&nbsp;&nbsp;&nbsp;<span className="text-gray-600 ml-2">↳ Taxable Rents: €{taxableRents.toFixed(2)}</span>
                </li>
                <li><strong>Dividends:</strong>
                    <br/>&nbsp;&nbsp;&nbsp;Gross: €{dividends.toFixed(2)}
                    {applySocialToDividends && dividends > 0 && (<>
                    <br/>&nbsp;&nbsp;&nbsp;<span className="text-gray-600 ml-2">↳ Social Contributions ({socialContributionsRate}%): -€{socialContributionsOnDividends.toFixed(2)}</span>
                    <br/>&nbsp;&nbsp;&nbsp;<span className="text-gray-600 ml-2">↳ Dividends net of SC (for info): €{dividendsAfterSocial.toFixed(2)}</span>
                    </>)}
                    {dividends > 0 && abatement40OnGrossDividends > 0 && (<>
                    <br/>&nbsp;&nbsp;&nbsp;<span className="text-gray-600 ml-2">↳ 40% tax abatement (on Gross): -€{abatement40OnGrossDividends.toFixed(2)}</span>
                    </>)}
                    {applySocialToDividends && applyCSGDeductibilityDividends && dividends > 0 && csgDeductionAmountOnDividends > 0 && (<>
                    <br/>&nbsp;&nbsp;&nbsp;<span className="text-gray-600 ml-2">↳ CSG Deductible (6.8% of Gross): -€{csgDeductionAmountOnDividends.toFixed(2)}</span>
                    </>)}
                    <br/>&nbsp;&nbsp;&nbsp;<span className="text-gray-600 ml-2">↳ Taxable Dividends: €{taxableDividends.toFixed(2)}</span>
                </li>
                <li><strong>Capital Gains:</strong>
                    <br/>&nbsp;&nbsp;&nbsp;Gross: €{capitalGains.toFixed(2)}
                    {applySocialToCapitalGains && capitalGains > 0 && (<>
                    <br/>&nbsp;&nbsp;&nbsp;<span className="text-gray-600 ml-2">↳ Social Contributions ({socialContributionsRate}%): -€{socialContributionsOnCapitalGains.toFixed(2)}</span>
                    <br/>&nbsp;&nbsp;&nbsp;<span className="text-gray-600 ml-2">↳ Capital Gains after SC: €{capitalGainsAfterSocial.toFixed(2)}</span>
                    </>)}
                    <br/>&nbsp;&nbsp;&nbsp;<span className="text-gray-600 ml-2">↳ Taxable Capital Gains: €{taxableCapitalGains.toFixed(2)}</span>
                </li>
            </ul>
            {totalSocialContributionsPaid > 0 && <p className="mt-2 font-medium">Total Social Contributions Paid: €{totalSocialContributionsPaid.toFixed(2)}</p>}
            <p className="mt-3 font-semibold">Total Taxable Income (for progressive tax): €{totalTaxableIncome.toFixed(2)}</p>
        </div>
    );
  }

  const renderProgressiveTaxExplanation = (details) => {
    if (totalTaxableIncome <= 0) return null;
    if (!details.explanationDetails || details.explanationDetails.length <= 1) return null;
    return (
        <div className="p-4 border rounded bg-gray-50 mt-2 text-sm">
            {details.explanationDetails.map((line, index) => (
            <p key={`total-exp-${index}`} className="whitespace-pre-wrap">{line}</p>
            ))}
        </div>
    );
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-6"> {/* Changed max-w-6xl to max-w-screen-xl */}
      <h1 className="text-3xl font-bold text-center mb-6">Advanced Progressive Tax Calculator</h1>
      

      <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
        <section className="p-4 border rounded-lg shadow lg:w-1/2">
            <h2 className="text-xl font-semibold mb-3">Income Sources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 mb-4">
            <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salaries (€)</label>
                <input id="salary" type="number" value={salary} onChange={(e) => setSalary(parseFloat(e.target.value) || 0)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 50000"/>
            </div>
            <div>
                <label htmlFor="rents" className="block text-sm font-medium text-gray-700">Rents (€)</label>
                <input id="rents" type="number" value={rents} onChange={(e) => setRents(parseFloat(e.target.value) || 0)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 12000"/>
            </div>
            <div>
                <label htmlFor="dividends" className="block text-sm font-medium text-gray-700">Gross Dividends (€)</label>
                <input id="dividends" type="number" value={dividends} onChange={(e) => setDividends(parseFloat(e.target.value) || 0)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 5000"/>
                <div className="mt-2">
                    <input 
                        type="checkbox" 
                        id="applySocialToDividends" 
                        checked={applySocialToDividends} 
                        onChange={(e) => {
                            const isChecked = e.target.checked;
                            setApplySocialToDividends(isChecked);
                            if (!isChecked) {
                                setApplyCSGDeductibilityDividends(false); // Also uncheck CSG if social is unchecked
                            }
                        }}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="applySocialToDividends" className="ml-2 text-sm text-gray-700">Apply Social Contributions</label>
                </div>
                {applySocialToDividends && dividends > 0 && (
                  <div className="mt-1 ml-6"> {/* Indent CSG option */}
                    <input
                      type="checkbox"
                      id="applyCSGDeductibilityDividends"
                      checked={applyCSGDeductibilityDividends}
                      onChange={(e) => setApplyCSGDeductibilityDividends(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="applyCSGDeductibilityDividends" className="ml-2 text-sm text-gray-700">
                      Apply CSG Deductibility (6.8% of Gross)
                    </label>
                  </div>
                )}
            </div>
            <div>
                <label htmlFor="capitalGains" className="block text-sm font-medium text-gray-700">Gross Capital Gains (€)</label>
                <input id="capitalGains" type="number" value={capitalGains} onChange={(e) => setCapitalGains(parseFloat(e.target.value) || 0)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 10000"/>
                <div className="mt-2">
                    <input type="checkbox" id="applySocialToCapitalGains" checked={applySocialToCapitalGains} onChange={(e) => setApplySocialToCapitalGains(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                    <label htmlFor="applySocialToCapitalGains" className="ml-2 text-sm text-gray-700">Apply Social Contributions</label>
                </div>
            </div>
            </div>
            {/* Social Contributions Rate input moved here */}
            <div className="mt-4">
                <label htmlFor="socialContributionsRate" className="block text-sm font-medium text-gray-700">Social Contributions Rate (%)</label>
                <input
                  id="socialContributionsRate"
                  type="number"
                  step="0.1"
                  value={socialContributionsRate}
                  onChange={(e) => setSocialContributionsRate(parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., 17.2"
                />
            </div>
        </section>

        <section className="p-4 border rounded-lg shadow lg:w-1/2">
            <h2 className="text-xl font-semibold mb-3">Tax Brackets (Applied to Total Taxable Income)</h2>
            <div className="overflow-x-auto">
                <table className="w-full table-auto mb-4">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Up To (€)</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Rate (%)</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {taxBrackets.map((b) => (
                        <tr key={b.id}>
                        <td className="border px-4 py-2 whitespace-nowrap">
                            <input type="text" value={b.upTo === Infinity ? 'Infinity' : b.upTo} onChange={(e) => updateBracket(b.id, 'upTo', e.target.value)} className="w-full p-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 10000 or Infinity"/>
                        </td>
                        <td className="border px-4 py-2 whitespace-nowrap">
                            <input type="number" step="0.1" value={(b.rate * 100).toFixed(1)} onChange={(e) => updateBracket(b.id, 'rate', e.target.value)} className="w-full p-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 10.0"/>
                        </td>
                        <td className="border px-4 py-2 text-center whitespace-nowrap">
                            <button onClick={() => removeBracket(b.id)} className="text-red-600 hover:text-red-800 font-semibold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" aria-label="Remove bracket">✕</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" onClick={addBracket}>Add Bracket</button>
        </section>
      </div>
      
      {/* Combined Details and Summary Section */}
      {(totalGrossIncome > 0 || totalTaxableIncome > 0) && (
        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
          {/* Tax Calculation Details Section */}
          <section className="p-4 border rounded-lg shadow lg:w-2/3"> {/* Assign width */}
            <h2 className="text-xl font-semibold pt-2 mb-1">Tax Calculation Details</h2>
            {renderTaxableIncomeExplanation()}
            {renderProgressiveTaxExplanation(totalTaxDetails)}
          </section>

          {/* Summary Section - Moved here and assigned width */}
          <section className="p-6 border rounded-lg shadow bg-gray-50 lg:w-1/3"> {/* Assign width */}
            <h2 className="text-xl font-semibold mb-4 text-center">Summary</h2>
            <div className="space-y-2 text-gray-700">
                <p className="flex justify-between"><span>Total Gross Income:</span> <span className="font-semibold">€{totalGrossIncome.toFixed(2)}</span></p>
                {totalSocialContributionsPaid > 0 && <p className="flex justify-between"><span>Total Social Contributions Paid:</span> <span className="font-semibold text-blue-600">€{totalSocialContributionsPaid.toFixed(2)}</span></p>}
                <p className="flex justify-between"><span>Total Taxable Income (for progressive tax):</span> <span className="font-semibold">€{totalTaxableIncome.toFixed(2)}</span></p>
                <hr className="my-1 border-gray-300"/>
                <p className="flex justify-between"><span>Total Progressive Tax Due:</span> <span className="font-semibold text-red-600">€{totalTax.toFixed(2)}</span></p>
                <p className="flex justify-between"><span>Effective Tax Rate (on Gross Income):</span> <span className="font-semibold">{effectiveTaxRateOnGross.toFixed(2)}%</span></p>
                <p className="flex justify-between"><span>Total Tax & Social Contributions Rate (on Gross Income):</span> <span className="font-semibold">{overallEffectiveRateOnGross.toFixed(2)}%</span></p>
                {totalTaxableIncome > 0 && totalTaxableIncome !== totalGrossIncome && <p className="flex justify-between text-sm text-gray-600"><span>Effective Tax Rate (on Taxable Income):</span> <span className="font-semibold">{effectiveTaxRateOnTaxable.toFixed(2)}%</span></p>}
                <hr className="my-2 border-gray-300"/>
                <p className="flex justify-between text-lg"><span>Net Income (Gross - Social Contr. - Tax):</span> <span className="font-bold text-green-600">€{netIncome.toFixed(2)}</span></p>
            </div>
          </section>
        </div>
      )}
      {/* Original Summary section location is now empty as it's moved above */}
    </div>
  );
}

export default ProgressiveTax;