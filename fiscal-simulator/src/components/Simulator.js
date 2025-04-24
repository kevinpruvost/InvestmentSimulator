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

function Simulator() {
  const [results, setResults] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState("SASU");
  const [revenue, setRevenue] = useState(43000);
  const [expenses, setExpenses] = useState(5000);
  const [grossSalary, setGrossSalary] = useState(0);

  const calculateStructure = (revenue, expenses, grossSalary, structure) => {
    let netRevenue = 0, salarieCharges = 0, patronalCharges = 0, tax = 0, retirement = 0, directorNetSalary = 0;
    let grossDividends = 0, netDividends = 0, csm = 0;
    let incomeTaxRate = 0, marginalTaxRate = 0;
    let companyNetProfit = 0, corporateTax = 0;

    
    
    switch (structure) {
      case "SASU":
        salarieCharges = grossSalary * 0.28;
        patronalCharges = grossSalary * 0.54;
        directorNetSalary = grossSalary - (salarieCharges * 0.4);
        companyNetProfit = revenue - expenses - grossSalary - patronalCharges;
        corporateTax = companyNetProfit > 0 ? companyNetProfit * 0.15 : 0; // Simplifié, devrait être 15% jusqu'à 42 500 €, puis 25%
        grossDividends = Math.max(0, companyNetProfit - corporateTax);
        netDividends = grossDividends * 0.7; // Corrigé pour PFU
        tax = (directorNetSalary * 0.3) + (grossDividends * 0.128); // Simplifié
        netRevenue = directorNetSalary + netDividends - tax;
        retirement = salarieCharges * 0.30;
        incomeTaxRate = (tax / (directorNetSalary + grossDividends)) * 100;
        marginalTaxRate = 30;
        break;
      case "EURL":
        salarieCharges = grossSalary * 0.45; // Corrigé de 0.40
        directorNetSalary = grossSalary - (salarieCharges * 0.4); // Aligné sur SASU
        companyNetProfit = revenue - expenses - grossSalary - (salarieCharges * 0.6);
        tax = companyNetProfit * 0.25; // Corrigé de 0.20
        netRevenue = revenue - expenses - grossSalary - salarieCharges - tax;
        retirement = salarieCharges * 0.25;
        break;
      case "EI":
        salarieCharges = grossSalary * 0.40; // Simplifié, devrait être sur bénéfices
        directorNetSalary = grossSalary - salarieCharges;
        tax = (revenue - salarieCharges) * 0.20; // Simplifié, devrait être progressif
        netRevenue = revenue - salarieCharges - tax;
        retirement = salarieCharges * 0.25;
        break;
      case "Micro":
        salarieCharges = grossSalary * 0.22; // Simplifié, devrait être revenue * 0.22
        directorNetSalary = grossSalary - salarieCharges;
        const abatement = revenue * 0.50;
        tax = (revenue - abatement) * 0.12; // Simplifié, devrait être progressif
        netRevenue = revenue - salarieCharges - tax;
        retirement = salarieCharges * 0.20;
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
      salarieCharges: salarieCharges,
      patronalCharges: patronalCharges,
      tax,
      retirement,
      incomeTaxRate,
      marginalTaxRate,
      companyNetProfit,
      corporateTax
    };
  };

  const runSimulation = (revenue, expenses, grossSalary) => {
    const structures = ["SASU", "EURL", "EI", "Micro"];
    const newResults = structures.map((structure) => ({
      structure,
      ...calculateStructure(revenue, expenses, grossSalary, structure),
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
    const highlightColor = "rgba(234, 88, 12, 0.8)"; // Tailwind's orange-600
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
    runSimulation(revenue, expenses, grossSalary);
  }, [revenue, expenses, grossSalary]);

  const current = results.find(r => r.structure === selectedStructure);

  const bestStructure = results.reduce((best, current) =>
    current.netRevenue > best.netRevenue ? current : best,
    results[0]
  );
  const isBest = current?.structure === bestStructure?.structure;
  

  return (
    <section id="simulator" className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
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
                  htmlFor="grossSalary"
                  className="block text-sm font-medium text-gray-700"
                >
                  Salaire Brut du Dirigeant (€)
                </label>
                <input
                  type="number"
                  id="grossSalary"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                  placeholder="ex. 30000"
                  required
                />
              </div>
            </div>
          </div>

          <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Résultats - SASU</h3>

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

            {current && (
            <div className="space-y-6">
              {/* Tableau 1: Données de l'entreprise */}
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
                        <div>€{(current.salarieCharges).toFixed(2)} / an</div>
                        <div className="text-xs text-gray-500">€{(current.salarieCharges/ 12).toFixed(2)} / mois</div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-700">🏢 Cotisations Patronales</td>
                      <td className="px-6 py-4 text-right text-gray-900">
                        <div>€{(current.patronalCharges).toFixed(2)} / an</div>
                        <div className="text-xs text-gray-500">€{(current.patronalCharges / 12).toFixed(2)} / mois</div>
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
                      <td className="px-6 py-4 font-semibold text-gray-700">🏢 Impôt sur les Bénéfices</td>
                      <td className="px-6 py-4 text-right text-gray-900">
                        <div>€{current.corporateTax.toFixed(2)} / an</div>
                        <div className="text-xs text-gray-500">€{(current.corporateTax / 12).toFixed(2)} / mois</div>
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

              {/* Tableau 4: Revenus Finaux */}
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
                  <div>Taux d'Imposition: {current?.incomeTaxRate.toFixed(1)}%</div>
                  <div>Taux Marginal d'Imposition: {current?.marginalTaxRate}%</div>
                </div>
              </div>
            </div>
            )}

            {chartData && (
              <div className="mt-6">
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
    </section>
  );
}

export default Simulator;
