import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PASS_2025 = 47100; // Plafond Annuel de la Sécurité Sociale estimé pour 2025
const pumaThresholdDividends = 0.5 * PASS_2025; // Seuil PUMA: 50% du PASS
const pumaThresholdSalaryNet = 0.2 * PASS_2025; // Seuil PUMA: 20% du PASS
const pumaRate = 0.065; // Taux PUMA de 6,5%


function Simulator() {
  const [results, setResults] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState("SASU");
  const [revenue, setRevenue] = useState(43000);
  const [expenses, setExpenses] = useState(5000);
  const [netSalary, setNetSalary] = useState(0);
 
  const [progressiveTax, setProgressiveTax] = useState(true);
  const [isZFRRCorporateTax, setIsZFRRCorporateTax] = useState(false);
  const [isZFRRPatronal, setIsZFRRPatronal] = useState(false);

  const calculateDecoteIncomeTax = (incomeTax) => { // https://www.economie.gouv.fr/particuliers/tranches-imposition-impot-revenu
    const decoteLimit = 1964; // 3248 for couple
    const decoteRate = 0.4525;
    const sommeForfaitaire = 889; // 1470 for couple
    if (incomeTax > decoteLimit) {
      return 0;
    }
    return sommeForfaitaire - incomeTax * decoteRate;
  }

  const progressiveIncomeTax = (totalTaxableIncome) => {
    let tax = 0;
    let income = totalTaxableIncome;
    let marginalTaxRate = 0;
    if (income > 180294) {
      tax += (income - 180294) * 0.45;
      income = 180294;
      marginalTaxRate = 45;
    }
    if (income > 83824) {
      tax += (income - 83824) * 0.41;
      income = 83824;
      if (marginalTaxRate < 41) {
        marginalTaxRate = 41;
      }
    }
    if (income > 29316) {
      tax += (income - 29316) * 0.30;
      income = 29316;
      if (marginalTaxRate < 30) {
        marginalTaxRate = 30;
      }
    }
    if (income > 11497) {
      tax += (income - 11497) * 0.11;
      if (marginalTaxRate < 11) {
        marginalTaxRate = 11;
      }
    }
    const decote = calculateDecoteIncomeTax(tax);
    tax -= decote;
    return {
      tax: tax,
      decote: decote,
      marginalTaxRate: marginalTaxRate,
    };
  };

  const calculateIncomeTax = (netSalary, grossDividends, progressiveTax) => {
    let csm = 0;
    if (grossDividends >= pumaThresholdDividends && netSalary <= pumaThresholdSalaryNet) {
      const taxableDividends = grossDividends - pumaThresholdDividends;
      const taxableDividendsPercentage = 1.0 - (netSalary / pumaThresholdSalaryNet);
      csm = pumaRate * taxableDividends * taxableDividendsPercentage;
    }

    if (progressiveTax) {
      const dividendSocialContributions = grossDividends * 0.172;
      const deductibleCSG = grossDividends * 0.068;
      const taxableDividends = grossDividends * (1 - 0.4) - deductibleCSG;

      const totalTaxableIncome = netSalary + taxableDividends;
      const taxInfo = progressiveIncomeTax(totalTaxableIncome);
      const incomeTax = taxInfo.tax;

      const totalTax = incomeTax + dividendSocialContributions;

      return {
        tax: totalTax,
        decote: taxInfo.decote,
        netRevenue: netSalary + ( grossDividends - dividendSocialContributions - csm ) - incomeTax,
        csm: csm,
        marginalTaxRate: taxInfo.marginalTaxRate,
      };
    } else {
      const dividendTax = grossDividends * 0.3;
      const taxInfo = progressiveIncomeTax(netSalary);
      const salaryTax = taxInfo.tax;
      const totalTax = salaryTax + dividendTax;

      return {
        tax: totalTax,
        decote: taxInfo.decote,
        netRevenue: netSalary + (grossDividends - dividendTax - csm),
        csm: csm,
        marginalTaxRate: taxInfo.marginalTaxRate,
      };
    }
  };

  const calculateStructure = (revenue, expenses, netSalary, structure, progressiveTax) => {
    let salarieCharges = 0, patronalCharges = 0, tax = 0, retirement = 0;
    let grossDividends = 0, netDividends = 0, csm = 0, decote = 0;
    let incomeTaxRate = 0, marginalTaxRate = 0;
    let companyNetProfit = 0, corporateTax = 0;
    let grossSalary = 0, directorNetSalary = 0, netRevenue = 0;
    
    switch (structure) {
      case "SASU":
        // On part du salaire net voulu pour calculer le brut
        directorNetSalary = netSalary;
        grossSalary = netSalary / (1 - 0.22); // 22% charges salariales
        salarieCharges = grossSalary * 0.22;
        patronalCharges = isZFRRPatronal ? 0 : grossSalary * 0.42;
        
        companyNetProfit = revenue - expenses - grossSalary - patronalCharges;
        
        if (isZFRRCorporateTax) {
          corporateTax = 0;
        } else {
          corporateTax = companyNetProfit > 0 ? companyNetProfit * 0.15 : 0;
        }

        grossDividends = Math.max(0, companyNetProfit - corporateTax);
        const taxResult = calculateIncomeTax(directorNetSalary, grossDividends, progressiveTax);
        tax = taxResult.tax;
        decote = taxResult.decote;
        netRevenue = taxResult.netRevenue;
        csm = taxResult.csm;
        retirement = salarieCharges * 0.30;
        incomeTaxRate = (tax / (directorNetSalary + grossDividends)) * 100;
        marginalTaxRate = taxResult.marginalTaxRate;
        break;

      case "EURL":
        directorNetSalary = netSalary;
        grossSalary = netSalary / (1 - 0.22);
        salarieCharges = grossSalary * 0.22;
        patronalCharges = isZFRRPatronal ? 0 : grossSalary * 0.42;
        
        companyNetProfit = revenue - expenses - grossSalary - patronalCharges;
        
        if (isZFRRCorporateTax) {
          corporateTax = 0;
        } else {
          corporateTax = companyNetProfit > 0 ? companyNetProfit * 0.15 : 0;
        }
        
        grossDividends = Math.max(0, companyNetProfit - corporateTax);
        const taxResultEURL = calculateIncomeTax(directorNetSalary, grossDividends, progressiveTax);
        tax = taxResultEURL.tax;
        netRevenue = taxResultEURL.netRevenue;
        csm = taxResultEURL.csm;
        retirement = salarieCharges * 0.25;
        incomeTaxRate = (tax / (directorNetSalary + grossDividends)) * 100;
        marginalTaxRate = taxResultEURL.marginalTaxRate;
        break;

      case "EI":
        directorNetSalary = netSalary;
        grossSalary = netSalary / (1 - 0.22);
        salarieCharges = grossSalary * 0.22;
        patronalCharges = isZFRRPatronal ? 0 : grossSalary * 0.42;
        
        companyNetProfit = revenue - expenses - grossSalary - patronalCharges;
        
        if (isZFRRCorporateTax) {
          corporateTax = 0;
        } else {
          corporateTax = companyNetProfit > 0 ? companyNetProfit * 0.15 : 0;
        }

        netRevenue = companyNetProfit - corporateTax;
        retirement = salarieCharges * 0.25;
        const eiTaxResult = calculateIncomeTax(netRevenue, 0, true);
        tax = eiTaxResult.tax;
        marginalTaxRate = eiTaxResult.marginalTaxRate;
        break;
    }
    return { 
      companyGrossRevenue: revenue,
      expenses,
      directorGrossSalary: grossSalary,
      directorNetSalary,
      grossDividends,
      netDividends,
      csm,
      netRevenue: Math.max(0, netRevenue),
      salarieCharges,
      patronalCharges,
      tax,
      decote,
      retirement,
      incomeTaxRate,
      marginalTaxRate,
      companyNetProfit,
      corporateTax
    };
  };

  const runSimulation = () => {
    const structures = ["SASU", "EURL", "EI"];
    const newResults = structures.map((structure) => ({
      structure,
      ...calculateStructure(revenue, expenses, netSalary, structure, progressiveTax),
    }));

    setResults(newResults);
    setChartData({
      labels: structures,
      datasets: [
        {
          label: "Revenu Net (€)",
          data: newResults.map((r) => r.netRevenue),
          backgroundColor: "rgba(59, 130, 246, 0.5)",
        },
        {
          label: "Cotisations Retraite (€)",
          data: newResults.map((r) => r.retirement),
          backgroundColor: "rgba(16, 185, 129, 0.5)",
        },
      ],
    });
    const bestStructure = newResults.reduce((best, current) =>
      current.netRevenue > best.netRevenue ? current : best,
      newResults[0]
    );
    const highlightColor = "rgba(234, 88, 12, 0.8)";
    const defaultNetColor = "rgba(59, 130, 246, 0.5)";
    const defaultRetirementColor = "rgba(16, 185, 129, 0.5)";
    
    setChartData({
      labels: structures,
      datasets: [
        {
          label: "Revenu Net (€)",
          data: newResults.map((r) => r.netRevenue),
          backgroundColor: newResults.map((r) =>
            r.structure === bestStructure.structure ? highlightColor : defaultNetColor
          ),
        },
        {
          label: "Cotisations Retraite (€)",
          data: newResults.map((r) => r.retirement),
          backgroundColor: defaultRetirementColor,
        },
      ],
    });    
  };

  useEffect(() => {
    runSimulation();
  }, [revenue, expenses, netSalary, progressiveTax, isZFRRCorporateTax, isZFRRPatronal]);

  const current = results.find(r => r.structure === selectedStructure);

  const bestStructure = results.reduce((best, current) =>
    current.netRevenue > best.netRevenue ? current : best,
    results[0]
  );
  const isBest = current?.structure === bestStructure?.structure;

  return (
    <section id="simdeploy startsimulator" className="py-12 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Données de Simulation</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="revenue" className="block text-sm font-medium text-gray-700">
                    Chiffre d'Affaires Annuel (€)
                  </label>
                  <input
                    type="number"
                    id="revenue"
                    value={revenue}
                    onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="expenses" className="block text-sm font-medium text-gray-700">
                    Frais de Fonctionnement (€)
                  </label>
                  <input
                    type="number"
                    id="expenses"
                    value={expenses}
                    onChange={(e) => setExpenses(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="netSalary"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Salaire Net Annuel du Dirigeant (€)
                  </label>
                  <input
                    type="number"
                    id="netSalary"
                    value={netSalary}
                    onChange={(e) => setNetSalary(parseFloat(e.target.value || 0))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                    placeholder="ex. 2500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="progressiveTax" className="block text-sm font-medium text-gray-700">
                    Utiliser l'impôt progressif pour les dividendes
                  </label>
                  <input
                    type="checkbox"
                    id="progressiveTax"
                    checked={progressiveTax}
                    onChange={() => setProgressiveTax(!progressiveTax)}
                    className="mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="zfrrCorporateTax" className="block text-sm font-medium text-gray-700">
                      Exonération IS - ZFRR
                    </label>
                    <input
                      type="checkbox"
                      id="zfrrCorporateTax"
                      checked={isZFRRCorporateTax}
                      onChange={() => setIsZFRRCorporateTax(!isZFRRCorporateTax)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="zfrrPatronal" className="block text-sm font-medium text-gray-700">
                      Exonération Charges Patronales - ZFRR
                    </label>
                    <input
                      type="checkbox"
                      id="zfrrPatronal"
                      checked={isZFRRPatronal}
                      onChange={() => setIsZFRRPatronal(!isZFRRPatronal)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="sticky top-4 bg-white z-10 pb-4 border-b">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Résultats - {selectedStructure}</h3>
                <div className="mb-4 flex flex-wrap gap-2">
                  {results.map((s) => (
                    <button
                      key={s.structure}
                      onClick={() => setSelectedStructure(s.structure)}
                      className={`px-4 py-2 rounded-full font-medium ${
                        selectedStructure === s.structure
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {s.structure}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-y-auto mt-4" style={{ maxHeight: "calc(100vh - 200px)" }}>
                {current && (
                  <div className="space-y-6">
                    {/* Tableau 1: Données de l'Entreprise */}
                    <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800">Données de l'Entreprise</h4>
                      </div>
                      <table className="min-w-full divide-y divide-gray-100 text-sm">
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold text-gray-700">💼 Chiffre d'Affaires Annuel</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.companyGrossRevenue.toFixed(2)} / an</div>
                              <div className="text-xs text-gray-500">€{(current.companyGrossRevenue / 12).toFixed(2)} / mois</div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold text-gray-700">📊 Frais de Fonctionnement</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.expenses.toFixed(2)} / an</div>
                              <div className="text-xs text-gray-500">€{(current.expenses / 12).toFixed(2)} / mois</div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold text-gray-700">📈 Bénéfices Nets de l'Entreprise</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.companyNetProfit.toFixed(2)} / an</div>
                              <div className="text-xs text-gray-500">€{(current.companyNetProfit / 12).toFixed(2)} / mois</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Tableau 3: Bénéfices et Impôts Société */}
                    <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800">Bénéfices et Impôts Société</h4>
                      </div>
                      <table className="min-w-full divide-y divide-gray-100 text-sm">
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold text-gray-700">📈 Bénéfices Nets</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.companyNetProfit.toFixed(2)} / an</div>
                              <div className="text-xs text-gray-500">€{(current.companyNetProfit / 12).toFixed(2)} / mois</div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold text-gray-700">
                              🏢 Impôt sur les Bénéfices
                              {isZFRRCorporateTax && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  ZFRR
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.corporateTax.toFixed(2)} / an</div>
                              <div className="text-xs text-gray-500">€{(current.corporateTax / 12).toFixed(2)} / mois</div>
                              {isZFRRCorporateTax && (
                                <div className="text-xs text-green-600">Exonération ZFRR appliquée</div>
                              )}
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold text-gray-700">💰 Bénéfices Après IS</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{(current.companyNetProfit - current.corporateTax).toFixed(2)} / an</div>
                              <div className="text-xs text-gray-500">€{((current.companyNetProfit - current.corporateTax) / 12).toFixed(2)} / mois</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Tableau 2: Salaires et Cotisations */}
                    <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800">Salaires et Cotisations</h4>
                      </div>
                      <table className="min-w-full divide-y divide-gray-100 text-sm">
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold text-gray-700">💰 Salaire Brut</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.directorGrossSalary.toFixed(2)} / an</div>
                              <div className="text-xs text-gray-500">€{(current.directorGrossSalary / 12).toFixed(2)} / mois</div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold text-gray-700">📈 Cotisations Salariales</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.salarieCharges.toFixed(2)} / an</div>
                              <div className="text-xs text-gray-500">€{(current.salarieCharges / 12).toFixed(2)} / mois</div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold text-gray-700">
                              🏢 Cotisations Patronales
                              {isZFRRPatronal && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  ZFRR
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.patronalCharges.toFixed(2)} / an</div>
                              <div className="text-xs text-gray-500">€{(current.patronalCharges / 12).toFixed(2)} / mois</div>
                              {isZFRRPatronal && (
                                <div className="text-xs text-green-600">Exonération ZFRR appliquée</div>
                              )}
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold text-gray-700">👤 Salaire Net</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.directorNetSalary.toFixed(2)} / an</div>
                              <div className="text-xs text-gray-500">€{(current.directorNetSalary / 12).toFixed(2)} / mois</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800">Revenus Finaux</h4>
                      </div>
                      <table className="min-w-full divide-y divide-gray-100 text-sm">
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold text-gray-700">👤 Salaire Net</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.directorNetSalary.toFixed(2)} / an</div>
                              <div className="text-xs text-gray-500">€{(current.directorNetSalary / 12).toFixed(2)} / mois</div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold text-gray-700">💵 Dividendes Bruts</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.grossDividends.toFixed(2)} / an</div>
                              <div className="text-xs text-gray-500">€{(current.grossDividends / 12).toFixed(2)} / mois</div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold text-gray-700">📑 Impôt sur le Revenu</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.tax.toFixed(2)} / an</div>
                              <div className="text-xs text-gray-500">€{(current.tax / 12).toFixed(2)} / mois</div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold text-gray-700">📑 Contribution Subsidiaire Maladie</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.csm.toFixed(2)} / an</div>
                              <div className="text-xs text-gray-500">€{(current.csm / 12).toFixed(2)} / mois</div>
                            </td>
                          </tr>
                          <tr className="border-t-2 border-gray-300 bg-blue-50">
                            <td className="px-6 py-4 font-bold text-blue-900">💎 Revenu Net Total</td>
                            <td className="px-6 py-4 text-right font-bold text-blue-900">
                              <div>€{current.netRevenue.toFixed(2)} / an</div>
                              <div className="text-sm text-blue-700">€{(current.netRevenue / 12).toFixed(2)} / mois</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="bg-gray-50 px-6 py-4 text-xs text-gray-600">
                        <div>
                          Taux d'Imposition: {current?.incomeTaxRate.toFixed(1)}%
                          {!progressiveTax && (
                            <span> (impôt sur le salaire + flat tax sur les dividendes)</span>
                          )}
                        </div>
                        <div>
                          Taux Marginal d'Imposition: {current?.marginalTaxRate}%
                          {!progressiveTax && <span> (pour le salaire)</span>}
                        </div>
                        <div>
                          Décôte de l'Impôt sur le revenu: {current?.decote.toFixed(2)} €
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {chartData && (
                  <div className="mt-6 mb-6">
                    <Bar
                      data={chartData}
                      options={{
                        scales: { y: { beginAtZero: true } },
                        plugins: { legend: { position: "top" } },
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Simulator;