import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Cookies from 'js-cookie';
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

function FranceEntrepreneur() {
  const [results, setResults] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState(() => Cookies.get('selectedStructure') || "SASU");
  const [revenue, setRevenue] = useState(() => parseFloat(Cookies.get('revenue') || '83625'));
  const [expenses, setExpenses] = useState(() => parseFloat(Cookies.get('expenses') || '5000'));
  const [netSalary, setNetSalary] = useState(() => parseFloat(Cookies.get('netSalary') || '0'));
  const [rent, setRent] = useState(() => parseFloat(Cookies.get('rent') || '0'));
  const [progressiveTax, setProgressiveTax] = useState(() => Cookies.get('progressiveTax') !== 'false');
  const [isZFRRCorporateTax, setIsZFRRCorporateTax] = useState(() => Cookies.get('isZFRRCorporateTax') === 'true');
  const [isZFRRPatronal, setIsZFRRPatronal] = useState(() => Cookies.get('isZFRRPatronal') === 'true');
  const [isMicroRegime, setIsMicroRegime] = useState(() => Cookies.get('isMicroRegime') !== 'false');
  const [isVFL, setIsVFL] = useState(() => Cookies.get('isVFL') !== 'false');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", details: "" });
  const [isSimulationDataOpen, setIsSimulationDataOpen] = useState(true);

  // Save parameters to cookies whenever they change
  useEffect(() => {
    Cookies.set('selectedStructure', selectedStructure, { expires: 365 });
    Cookies.set('revenue', revenue.toString(), { expires: 365 });
    Cookies.set('expenses', expenses.toString(), { expires: 365 });
    Cookies.set('netSalary', netSalary.toString(), { expires: 365 });
    Cookies.set('rent', rent.toString(), { expires: 365 });
    Cookies.set('progressiveTax', progressiveTax.toString(), { expires: 365 });
    Cookies.set('isZFRRCorporateTax', isZFRRCorporateTax.toString(), { expires: 365 });
    Cookies.set('isZFRRPatronal', isZFRRPatronal.toString(), { expires: 365 });
    Cookies.set('isMicroRegime', isMicroRegime.toString(), { expires: 365 });
    Cookies.set('isVFL', isVFL.toString(), { expires: 365 });
  }, [selectedStructure, revenue, expenses, netSalary, rent, progressiveTax, isZFRRCorporateTax, isZFRRPatronal, isMicroRegime, isVFL]);

  const calculateDecoteIncomeTax = (incomeTax) => {
    const decoteLimit = 1964;
    const decoteRate = 0.4525;
    const sommeForfaitaire = 889;
    if (incomeTax > decoteLimit) {
      return 0;
    }
    return sommeForfaitaire - incomeTax * decoteRate;
  };

  const progressiveIncomeTax = (totalTaxableIncome, no_decote = false) => {
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
    let decote = 0;
    if (!no_decote) {
      decote = calculateDecoteIncomeTax(tax);
      tax -= decote;
    }
    return { tax, decote, marginalTaxRate };
  };

  const calculateIncomeTax = (netSalary, grossDividends, progressiveTax, rent = 0) => {
    let csm = 0;
    if (grossDividends >= pumaThresholdDividends && netSalary <= pumaThresholdSalaryNet) {
      const taxableDividends = grossDividends - pumaThresholdDividends;
      const taxableDividendsPercentage = 1.0 - (netSalary / pumaThresholdSalaryNet);
      csm = pumaRate * taxableDividends * taxableDividendsPercentage;
    }

    const taxableRent = rent * 0.7; // 30% abattement sur les loyers

    if (progressiveTax) {
      const dividendSocialContributions = grossDividends * 0.172;
      const deductibleCSG = grossDividends * 0.068;
      const taxableDividends = grossDividends * (1 - 0.4) - deductibleCSG;
      const totalTaxableIncome = netSalary * 0.9 + taxableDividends + taxableRent; // 10% deductions pros
      const taxInfo = progressiveIncomeTax(totalTaxableIncome);
      const incomeTax = taxInfo.tax;
      const totalTax = incomeTax + dividendSocialContributions;

      return {
        tax: totalTax,
        decote: taxInfo.decote,
        netRevenue: netSalary + (grossDividends - dividendSocialContributions - csm) + rent - incomeTax,
        csm,
        marginalTaxRate: taxInfo.marginalTaxRate,
      };
    } else {
      const dividendTax = grossDividends * 0.3;
      const taxInfo = progressiveIncomeTax(netSalary + taxableRent);
      const salaryTax = taxInfo.tax;
      const totalTax = salaryTax + dividendTax;

      return {
        tax: totalTax,
        decote: taxInfo.decote,
        netRevenue: netSalary + (grossDividends - dividendTax - csm) + rent - salaryTax,
        csm,
        marginalTaxRate: taxInfo.marginalTaxRate,
      };
    }
  };

  const calculateStructure = (revenue, expenses, netSalary, structure, progressiveTax, rent = 0) => {
    const totalProfExpenses = expenses + rent;
    let salarieCharges = 0, patronalCharges = 0, tax = 0, retirement = 0;
    let grossDividends = 0, netDividends = 0, csm = 0, decote = 0;
    let incomeTaxRate = 0, marginalTaxRate = 0;
    let companyNetProfit = 0, corporateTax = 0;
    let grossSalary = 0, directorNetSalary = 0, netRevenue = 0;

    switch (structure) {
      case "SASU":
        directorNetSalary = netSalary;
        grossSalary = netSalary * (1 + 0.28);
        salarieCharges = netSalary * 0.28;
        patronalCharges = isZFRRPatronal ? 0 : grossSalary * 0.54;
        companyNetProfit = revenue - totalProfExpenses - grossSalary - patronalCharges;
        if (isZFRRCorporateTax) {
          corporateTax = 0;
        } else if (companyNetProfit > 0) {
          if (companyNetProfit <= 42500) {
            corporateTax = companyNetProfit * 0.15;
          } else {
            corporateTax = 42500 * 0.15 + (companyNetProfit - 42500) * 0.25;
          }
        }
        grossDividends = Math.max(0, companyNetProfit - corporateTax);
        const taxResult = calculateIncomeTax(directorNetSalary, grossDividends, progressiveTax, rent);
        tax = taxResult.tax;
        decote = taxResult.decote;
        netRevenue = taxResult.netRevenue;
        csm = taxResult.csm;
        retirement = salarieCharges * 0.30;
        incomeTaxRate = (tax / (directorNetSalary + grossDividends + rent)) * 100 || 0;
        marginalTaxRate = taxResult.marginalTaxRate;
        break;

      case "EURL":
        grossSalary = revenue - totalProfExpenses;
        directorNetSalary = grossSalary / (1 + 0.45);
        salarieCharges = directorNetSalary * 0.45;
        patronalCharges = 0;
        companyNetProfit = revenue - totalProfExpenses - grossSalary - salarieCharges;
        if (isZFRRCorporateTax) {
          corporateTax = 0;
        } else if (companyNetProfit > 0) {
          if (companyNetProfit <= 42500) {
            corporateTax = companyNetProfit * 0.15;
          } else {
            corporateTax = 42500 * 0.15 + (companyNetProfit - 42500) * 0.25;
          }
        }
        grossDividends = 0;
        const taxResultEURL = calculateIncomeTax(directorNetSalary, grossDividends, progressiveTax, rent);
        tax = taxResultEURL.tax;
        decote = taxResultEURL.decote;
        netRevenue = taxResultEURL.netRevenue;
        csm = taxResultEURL.csm;
        retirement = (grossSalary * 0.45) * 0.25;
        incomeTaxRate = (tax / (directorNetSalary + grossDividends + rent)) * 100 || 0;
        marginalTaxRate = taxResultEURL.marginalTaxRate;
        break;

      case "EI":
        companyNetProfit = revenue - totalProfExpenses;
        corporateTax = 0;
        grossSalary = companyNetProfit;
        directorNetSalary = grossSalary / (1 + 0.44);
        salarieCharges = directorNetSalary * 0.44;
        let taxableIncome = companyNetProfit;
        if (isMicroRegime && revenue <= 77700) {
          if (isVFL) {
            tax = directorNetSalary * 0.022;
            decote = 0;
            marginalTaxRate = 0;
            netRevenue = directorNetSalary + rent - tax;
          } else {
            taxableIncome = (taxableIncome * (1.0 - 0.34)) + (rent * 0.7);
            const taxResultMicro = progressiveIncomeTax(taxableIncome);
            tax = taxResultMicro.tax;
            decote = taxResultMicro.decote;
            marginalTaxRate = taxResultMicro.marginalTaxRate;
            netRevenue = directorNetSalary + rent - tax;
          }
        } else {
          taxableIncome = taxableIncome + (rent * 0.7);
          const taxResultEI = progressiveIncomeTax(taxableIncome);
          tax = taxResultEI.tax;
          decote = taxResultEI.decote;
          marginalTaxRate = taxResultEI.marginalTaxRate;
          netRevenue = directorNetSalary + rent - tax;
        }
        retirement = salarieCharges * 0.25;
        incomeTaxRate = (tax / (companyNetProfit + rent)) * 100 || 0;
        patronalCharges = 0;
        grossDividends = 0;
        csm = 0;
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
      corporateTax,
      rent,
    };
  };

  const runSimulation = () => {
    const structures = ["SASU", "EURL", "EI"];
    const newResults = structures.map((structure) => ({
      structure,
      ...calculateStructure(revenue, expenses, netSalary, structure, progressiveTax, rent),
    }));

    setResults(newResults);
    const bestStructure = newResults.reduce((best, current) =>
      current.netRevenue > best.netRevenue ? current : best,
      newResults[0]
    );
    const highlightColor = "rgba(234, 88, 12, 0.8)";
    const defaultNetColor = "rgba(59, 130, 246, 0.5)";

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
      ],
    });
  };

  useEffect(() => {
    runSimulation();
  }, [revenue, expenses, netSalary, rent, progressiveTax, isZFRRCorporateTax, isZFRRPatronal, isMicroRegime, isVFL]);

  const optimizeNetSalary = () => {
    if (selectedStructure !== "SASU") {
      alert("L'optimisation du salaire net n'est disponible que pour SASU.");
      return;
    }

    const tolerance = 1; // Precision in euros
    let low = 0;
    let high = revenue - expenses - rent;
    high = high / (1 + 0.28 + 0.54); // Adjust for social contributions

    const calculateNetRevenueForSalary = (salary) => {
      const result = calculateStructure(revenue, expenses, salary, selectedStructure, progressiveTax, rent);
      return result.netRevenue;
    };

    while (high - low > tolerance) {
      const mid1 = low + (high - low) / 3;
      const mid2 = high - (high - low) / 3;
      const netRevenue1 = calculateNetRevenueForSalary(mid1);
      const netRevenue2 = calculateNetRevenueForSalary(mid2);

      if (netRevenue1 < netRevenue2) {
        low = mid1;
      } else {
        high = mid2;
      }
    }

    let optimalSalary = (low + high) / 2;
    optimalSalary = Math.floor(optimalSalary);
    setNetSalary(optimalSalary);
    runSimulation();
  };

  const current = results.find((r) => r.structure === selectedStructure);
  const bestStructure = results.reduce(
    (best, current) => (current.netRevenue > best.netRevenue ? current : best),
    results[0]
  );
  const isBest = current?.structure === bestStructure?.structure;

  const getCalculationDetails = (key, current) => {
    switch (key) {
      case "companyGrossRevenue":
        return {
          title: "Chiffre d'Affaires Annuel",
          details: `Le chiffre d'affaires annuel est la valeur saisie directement dans le formulaire.\n\nValeur: €${current.companyGrossRevenue.toFixed(2)}`,
        };
      case "expenses":
        return {
          title: "Frais de Fonctionnement",
          details: `Les frais de fonctionnement sont la valeur saisie directement dans le formulaire. Ces frais n'incluent pas le loyer qui est compté séparément.\n\nValeur: €${current.expenses.toFixed(2)}`,
        };
      case "rent":
        return {
          title: "Loyer Annuel",
          details: `Le loyer annuel est la valeur saisie directement dans le formulaire. Le loyer est compté comme une charge pour l'entreprise mais revient également au dirigeant comme revenu personnel, avec un abattement fiscal de 30% pour le calcul de l'impôt sur le revenu.\n\nValeur: €${current.rent.toFixed(2)}`,
        };
      case "directorGrossSalary":
        if (current.structure === "SASU") {
          return {
            title: "Salaire Brut",
            details: `Calculé à partir du salaire net saisi (€${current.directorNetSalary.toFixed(2)}) divisé par (1 - taux des charges salariales de 28%).\n\nFormule: Salaire Net / (1 - 0.28)\n= €${current.directorNetSalary.toFixed(2)} / 0.72\n= €${current.directorGrossSalary.toFixed(2)}`,
          };
        } else if (current.structure === "EURL") {
          return {
            title: "Salaire Brut",
            details: `Égal au chiffre d'affaires moins les frais de fonctionnement et le loyer.\n\nFormule: CA - Frais - Loyer\n= €${current.companyGrossRevenue.toFixed(2)} - €${current.expenses.toFixed(2)} - €${current.rent.toFixed(2)}\n= €${current.directorGrossSalary.toFixed(2)}`,
          };
        } else if (current.structure === "EI") {
          return {
            title: "Salaire Brut",
            details: `Égal au bénéfice net de l'entreprise (chiffre d'affaires moins frais et loyer).\n\nFormule: CA - Frais - Loyer\n= €${current.companyGrossRevenue.toFixed(2)} - €${current.expenses.toFixed(2)} - €${current.rent.toFixed(2)}\n= €${current.directorGrossSalary.toFixed(2)}`,
          };
        }
        break;
      case "salarieCharges":
        if (current.structure === "SASU") {
          return {
            title: "Cotisations Salariales",
            details: `Calculé comme 28% du salaire brut.\n\nFormule: Salaire Brut * 0.28\n= €${current.directorGrossSalary.toFixed(2)} * 0.28\n= €${current.salarieCharges.toFixed(2)}`,
          };
        } else if (current.structure === "EURL") {
          return {
            title: "Cotisations Salariales",
            details: `Calculé comme 45% du salaire net pour les TNS.\n\nFormule: Salaire Net * 0.45\n= €${current.directorNetSalary.toFixed(2)} * 0.45\n= €${current.salarieCharges.toFixed(2)}`,
          };
        } else if (current.structure === "EI") {
          return {
            title: "Cotisations Salariales",
            details: `Calculé comme 44% du bénéfice net.\n\nFormule: Bénéfice Net * 0.44\n= €${current.companyNetProfit.toFixed(2)} * 0.44\n= €${current.salarieCharges.toFixed(2)}`,
          };
        }
        break;
      case "patronalCharges":
        return {
          title: "Cotisations Patronales",
          details: isZFRRPatronal
            ? `Exonérées grâce à l'option ZFRR.\n\nValeur: €0`
            : `Calculé comme 54% du salaire brut.\n\nFormule: Salaire Brut * 0.54\n= €${current.directorGrossSalary.toFixed(2)} * 0.54\n= €${current.patronalCharges.toFixed(2)}`,
        };
      case "directorNetSalary":
        if (current.structure === "SASU") {
          return {
            title: "Salaire Net",
            details: `Valeur saisie directement dans le formulaire.\n\nValeur: €${current.directorNetSalary.toFixed(2)}`,
          };
        } else if (current.structure === "EURL") {
          return {
            title: "Salaire Net",
            details: `Calculé comme le salaire brut divisé par (1 + taux des charges sociales de 45%).\n\nFormule: Salaire Brut / (1 + 0.45)\n= €${current.directorGrossSalary.toFixed(2)} / 1.45\n= €${current.directorNetSalary.toFixed(2)}`,
          };
        } else if (current.structure === "EI") {
          return {
            title: "Salaire Net",
            details: `Calculé comme le salaire brut divisé par (1 + taux des charges sociales de 44%).\n\nFormule: Salaire Brut / (1 + 0.44)\n= €${current.directorGrossSalary.toFixed(2)} / 1.44\n= €${current.directorNetSalary.toFixed(2)}`,
          };
        }
        break;
      case "companyNetProfit":
        if (current.structure === "SASU") {
          return {
            title: "Bénéfices Nets",
            details: `Calculé comme le chiffre d'affaires moins les frais, le loyer, le salaire brut et les cotisations patronales.\n\nFormule: CA - Frais - Loyer - Salaire Brut - Cotisations Patronales\n= €${current.companyGrossRevenue.toFixed(2)} - €${current.expenses.toFixed(2)} - €${current.rent.toFixed(2)} - €${current.directorGrossSalary.toFixed(2)} - €${current.patronalCharges.toFixed(2)}\n= €${current.companyNetProfit.toFixed(2)}`,
          };
        } else if (current.structure === "EURL") {
          return {
            title: "Bénéfices Nets",
            details: `Calculé comme le chiffre d'affaires moins les frais, le loyer, le salaire brut et les cotisations sociales.\n\nFormule: CA - Frais - Loyer - Salaire Brut - Cotisations Salariales\n= €${current.companyGrossRevenue.toFixed(2)} - €${current.expenses.toFixed(2)} - €${current.rent.toFixed(2)} - €${current.directorGrossSalary.toFixed(2)} - €${current.salarieCharges.toFixed(2)}\n= €${current.companyNetProfit.toFixed(2)}`,
          };
        } else if (current.structure === "EI") {
          return {
            title: "Bénéfices Nets",
            details: `Calculé comme le chiffre d'affaires moins les frais et le loyer.\n\nFormule: CA - Frais - Loyer\n= €${current.companyGrossRevenue.toFixed(2)} - €${current.expenses.toFixed(2)} - €${current.rent.toFixed(2)}\n= €${current.companyNetProfit.toFixed(2)}`,
          };
        }
        break;
      case "corporateTax":
        if (current.structure === "SASU") {
          return {
            title: "Impôt sur les Bénéfices",
            details: isZFRRCorporateTax
              ? `Exonéré grâce à l'option ZFRR.\n\nValeur: €0`
              : `Calculé avec un taux progressif: 15% jusqu'à 42500€ de bénéfices, puis 25% au-delà.\n\nFormule: ${current.companyNetProfit <= 42500 
                  ? `Bénéfices Nets * 0.15\n= €${current.companyNetProfit.toFixed(2)} * 0.15\n= €${current.corporateTax.toFixed(2)}`
                  : `(42500€ * 0.15) + ((Bénéfices Nets - 42500€) * 0.25)\n= (42500 * 0.15) + (€${(current.companyNetProfit - 42500).toFixed(2)} * 0.25)\n= €${(42500 * 0.15).toFixed(2)} + €${((current.companyNetProfit - 42500) * 0.25).toFixed(2)}\n= €${current.corporateTax.toFixed(2)}`}`,
          };
        } else if (current.structure === "EURL") {
          return {
            title: "Impôt sur les Bénéfices",
            details: isZFRRCorporateTax
              ? `Exonéré grâce à l'option ZFRR.\n\nValeur: €0`
              : `Calculé avec un taux progressif: 15% jusqu'à 42500€ de bénéfices, puis 25% au-delà.\n\nFormule: ${current.companyNetProfit <= 42500 
                  ? `Bénéfices Nets * 0.15\n= €${current.companyNetProfit.toFixed(2)} * 0.15\n= €${current.corporateTax.toFixed(2)}`
                  : `(42500€ * 0.15) + ((Bénéfices Nets - 42500€) * 0.25)\n= (42500 * 0.15) + (€${(current.companyNetProfit - 42500).toFixed(2)} * 0.25)\n= €${(42500 * 0.15).toFixed(2)} + €${((current.companyNetProfit - 42500) * 0.25).toFixed(2)}\n= €${current.corporateTax.toFixed(2)}`}`,
          };
        } else if (current.structure === "EI") {
          return {
            title: "Impôt sur les Bénéfices",
            details: `Aucun impôt sur les sociétés pour l'EI.\n\nValeur: €0`,
          };
        }
        break;
      case "grossDividends":
        return {
          title: "Dividendes Bruts",
          details: current.grossDividends === 0
            ? `Aucun dividende distribué.\n\nValeur: €0`
            : `Calculé comme les bénéfices nets moins l'impôt sur les sociétés.\n\nFormule: Bénéfices Nets - Impôt sur les Bénéfices\n= €${current.companyNetProfit.toFixed(2)} - €${current.corporateTax.toFixed(2)}\n= €${current.grossDividends.toFixed(2)}`,
        };
      case "tax":
        if (current.structure === "EI" && isMicroRegime && isVFL) {
          return {
            title: "Impôt sur le Revenu",
            details: `Calculé comme 2.2% du salaire net pour le versement forfaitaire libératoire.\n\nFormule: Salaire Net * 0.022\n= €${current.directorNetSalary.toFixed(2)} * 0.022\n= €${current.tax.toFixed(2)}`,
          };
        } else {
          return {
            title: "Impôt sur le Revenu",
            details: progressiveTax
              ? `Calculé via l'impôt progressif sur le revenu imposable (salaire net (10% deductions pros) + dividendes taxables + loyer taxable après abattement de 30%) plus cotisations sociales sur dividendes.\n\nRevenu Imposable: €${(current.directorNetSalary * 0.9 + (current.grossDividends * (1 - 0.4) - current.grossDividends * 0.068) + (current.rent * 0.7)).toFixed(2)}\nImpôt: €${current.tax.toFixed(2)} (voir détails de l'impôt progressif)`
              : `Calculé comme l'impôt progressif sur le salaire net et le loyer taxable (après abattement de 30%) plus 30% de flat tax sur les dividendes.\n\nImpôt Salaire + Loyer: €${progressiveIncomeTax(current.directorNetSalary * 0.9 + (current.rent * 0.7)).tax.toFixed(2)}\nFlat Tax Dividendes: €${(current.grossDividends * 0.3).toFixed(2)}\nTotal: €${current.tax.toFixed(2)}`,
          };
        }
      case "csm":
        return {
          title: "Contribution Subsidiaire Maladie",
          details: current.csm === 0
            ? `Aucune CSM due (salaire net > 20% PASS ou dividendes < 50% PASS).\n\nValeur: €0`
            : `Calculé comme 6.5% des dividendes taxables au-delà du seuil PUMA (50% du PASS = €${pumaThresholdDividends}), pondéré par le ratio du salaire net.\n\nDividendes Taxables: €${(current.grossDividends - pumaThresholdDividends).toFixed(2)}\nRatio: ${(1.0 - (current.directorNetSalary / pumaThresholdSalaryNet)).toFixed(2)}\nFormule: 0.065 * Dividendes Taxables * Ratio\n= €${current.csm.toFixed(2)}`,
        };
      case "netRevenue":
        if (current.structure === "EI") {
          return {
            title: "Revenu Net Total",
            details: `Calculé comme le salaire net plus le loyer (après abattement fiscal de 30% pour l'impôt) moins l'impôt sur le revenu.\n\nFormule: Salaire Net + Loyer - Impôt\n= €${current.directorNetSalary.toFixed(2)} + €${current.rent.toFixed(2)} - €${current.tax.toFixed(2)}\n= €${current.netRevenue.toFixed(2)}`,
          };
        } else {
          return {
            title: "Revenu Net Total",
            details: progressiveTax
              ? `Calculé comme le salaire net plus les dividendes après cotisations sociales, plus le loyer (après abattement fiscal de 30% pour l'impôt), moins l'impôt sur le revenu et la CSM.\n\nFormule: Salaire Net + (Dividendes Bruts - Cotisations Sociales Dividendes - CSM) + Loyer - Impôt\n= €${current.directorNetSalary.toFixed(2)} + (€${current.grossDividends.toFixed(2)} - €${(current.grossDividends * 0.172).toFixed(2)} - €${current.csm.toFixed(2)}) + €${current.rent.toFixed(2)} - €${current.tax.toFixed(2)}\n= €${current.netRevenue.toFixed(2)}`
              : `Calculé comme le salaire net plus les dividendes après flat tax, plus le loyer (après abattement fiscal de 30% pour l'impôt), moins l'impôt sur le revenu et la CSM.\n\nFormule: Salaire Net + (Dividendes Bruts - Flat Tax Dividendes - CSM) + Loyer - Impôt Salaire\n= €${current.directorNetSalary.toFixed(2)} + (€${current.grossDividends.toFixed(2)} - €${(current.grossDividends * 0.3).toFixed(2)} - €${current.csm.toFixed(2)}) + €${current.rent.toFixed(2)} - €${progressiveIncomeTax(current.directorNetSalary + (current.rent * 0.7)).tax.toFixed(2)}\n= €${current.netRevenue.toFixed(2)}`,
          };
        }
      default:
        return {
          title: "Détails Non Disponibles",
          details: "Les détails de calcul pour cette valeur ne sont pas disponibles.",
        };
    }
  };

  const handleCellClick = (e, key, current) => {
    const details = getCalculationDetails(key, current);
    setModalContent(details);
    setIsModalOpen(true);
  };

  const CalculationModal = ({ isOpen, onClose, title, details }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{details}</p>
          <button
            onClick={onClose}
            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  };

  const getMaxNetSalary = () => {
    return (revenue - expenses - rent) / (1 + 0.28 + 0.54);
  };

  const handleNetSalaryChange = (value) => {
    setNetSalary(Math.min(parseFloat(value) || 0, getMaxNetSalary()));
  };

  return (
    <section id="simulator" className="py-12 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md sticky top-4">
              <div
                className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 rounded-t-lg"
                onClick={() => setIsSimulationDataOpen(!isSimulationDataOpen)}
              >
                <h3 className="text-xl font-semibold text-gray-800">Données de Simulation</h3>
                <svg
                  className={`w-6 h-6 transform transition-transform ${
                    isSimulationDataOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
              {isSimulationDataOpen && (
                <div className="p-6">
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
                    {(selectedStructure !== "EURL" && selectedStructure !== "EI") && (
                      <>
                        <div>
                          <label htmlFor="netSalary" className="block text-sm font-medium text-gray-700">
                            Salaire Net Annuel du Dirigeant (€)
                          </label>
                          <input
                            type="number"
                            id="netSalary"
                            value={netSalary.toFixed(0)}
                            onChange={(e) => handleNetSalaryChange(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                            placeholder="ex. 30000"
                            required
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            Maximum: €{(getMaxNetSalary()).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="rent" className="block text-sm font-medium text-gray-700">
                            Loyer Annuel (€)
                          </label>
                          <input
                            type="number"
                            id="rent"
                            value={rent}
                            onChange={(e) => setRent(parseFloat(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                            placeholder="ex. 12000"
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            Le loyer est compté dans les charges de l'entreprise mais vous revient en tant que revenu personnel avec un abattement fiscal de 30%
                          </div>
                        </div>
                      </>
                    )}
                    {(selectedStructure === "EURL" || selectedStructure === "EI") && (
                      <div>
                        <label htmlFor="netSalary" className="block text-sm font-medium text-gray-700">
                          Salaire Net Annuel du Dirigeant (€)
                        </label>
                        <input
                          type="number"
                          id="netSalary"
                          value={current?.directorNetSalary.toFixed(0) || 0}
                          disabled
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-gray-800 cursor-not-allowed"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Les EURL et EI payent tout en salaire dans notre simulation
                        </div>
                      </div>
                    )}
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
                      {(selectedStructure === "SASU") && (
                        <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-2">Options SASU</h4>
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
                          <button
                            onClick={optimizeNetSalary}
                            className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Optimiser Revenu Net via Salaire Net
                          </button>
                        </div>
                      )}
                      {selectedStructure === "EI" && (
                        <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-2">Options EI</h4>
                          <div>
                            <label htmlFor="microRegime" className="block text-sm font-medium text-gray-700">
                              Régime Micro-Entreprise
                            </label>
                            <input
                              type="checkbox"
                              id="microRegime"
                              checked={isMicroRegime}
                              onChange={() => {
                                setIsMicroRegime(!isMicroRegime);
                                if (!isMicroRegime) setIsVFL(false);
                              }}
                              className="mt-1"
                            />
                            {revenue > 77700 && (
                              <div className="text-red-500 text-xs mt-1">
                                Option désactivée car le CA est supérieur à 77 700€
                              </div>
                            )}
                          </div>
                          {isMicroRegime && (
                            <div>
                              <label htmlFor="vfl" className="block text-sm font-medium text-gray-700">
                                Versement Forfaitaire Libératoire
                              </label>
                              <input
                                type="checkbox"
                                id="vfl"
                                checked={isVFL}
                                onChange={() => setIsVFL(!isVFL)}
                                className="mt-1"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes d'optimisation</h4>
                    <div id="optimization-notes" className="text-sm text-gray-600 whitespace-pre-wrap">
                      - Valider les trimestres de retraite sont inutiles pour le moment si on compte prendre la retraite à 67 ans car seuls les 25 meilleures années de cotisations sont prises en compte. <br />
                      - Dans le cas des Exonération avec la ZFRR, le revenu total net est maximisé en minimisant la Contribution Subsidiaire Maladie (CSM) via une augmentation du salaire net jusqu'à 20% du PASS. Ne pas oublier que l'exoneration des charges patronales dure 12 mois.<br />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="sticky top-4 bg-white z-10 pb-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  📈 Résultats de Simulation
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {results.map((result) => (
                    <button
                      key={result.structure}
                      onClick={() => setSelectedStructure(result.structure)}
                      className={`flex items-center justify-between px-6 py-3 rounded-lg ${
                        selectedStructure === result.structure 
                          ? 'bg-blue-600 text-white' 
                          : result.structure === bestStructure?.structure
                          ? 'bg-green-100 text-gray-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      <span className="font-medium flex items-center gap-2">
                        {result.structure === "SASU" && "🏢 SASU"}
                        {result.structure === "EURL" && "💼 EURL"}
                        {result.structure === "EI" && "👔 EI"}
                        <span className="ml-4 text-sm">
                          €{(result.netRevenue / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois
                          {result.structure === bestStructure?.structure && (
                            <span className="ml-2 text-green-600">✨ Optimal</span>
                          )}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-y-auto mt-4" style={{ maxHeight: "calc(100vh - 200px)" }}>
                {current && (
                  <div className="space-y-6">
                    <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800">Données de l'Entreprise</h4>
                      </div>
                      <table className="min-w-full divide-y divide-gray-100 text-sm">
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr className="hover:bg-gray-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "companyGrossRevenue", current)}>
                            <td className="px-6 py-4 font-semibold text-gray-700">💼 Chiffre d'Affaires Annuel</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.companyGrossRevenue.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                              <div className="text-xs text-gray-500">€{(current.companyGrossRevenue / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                            </td>
                            <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Cliquez pour les détails du calcul
                            </div>
                          </tr>
                          <tr className="hover:bg-gray-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "expenses", current)}>
                            <td className="px-6 py-4 font-semibold text-gray-700">📊 Frais de Fonctionnement</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.expenses.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                              <div className="text-xs text-gray-500">€{(current.expenses / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                            </td>
                            <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Cliquez pour les détails du calcul
                            </div>
                          </tr>
                          <tr className="hover:bg-gray-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "rent", current)}>
                            <td className="px-6 py-4 font-semibold text-gray-700">🏠 Loyer Annuel</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.rent.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                              <div className="text-xs text-gray-500">€{(current.rent / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                            </td>
                            <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Cliquez pour les détails du calcul
                            </div>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800">Salaires et Cotisations</h4>
                      </div>
                      <table className="min-w-full divide-y divide-gray-100 text-sm">
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr className="hover:bg-gray-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "directorGrossSalary", current)}>
                            <td className="px-6 py-4 font-semibold text-gray-700">💰 Salaire Brut</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.directorGrossSalary.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                              <div className="text-xs text-gray-500">€{(current.directorGrossSalary / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                            </td>
                            <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Cliquez pour les détails du calcul
                            </div>
                          </tr>
                          <tr className="hover:bg-gray-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "salarieCharges", current)}>
                            <td className="px-6 py-4 font-semibold text-gray-700">📈 Cotisations Salariales</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.salarieCharges.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                              <div className="text-xs text-gray-500">€{(current.salarieCharges / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                            </td>
                            <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Cliquez pour les détails du calcul
                            </div>
                          </tr>
                          {current.structure !== "EURL" && current.structure !== "EI" && (
                            <tr className="hover:bg-gray-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "patronalCharges", current)}>
                              <td className="px-6 py-4 font-semibold text-gray-700">
                                🏢 Cotisations Patronales
                                {isZFRRPatronal && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ZFRR
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right text-gray-900">
                                <div>€{current.patronalCharges.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                                <div className="text-xs text-gray-500">€{(current.patronalCharges / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                                {isZFRRPatronal && (
                                  <div className="text-xs text-green-600">Exonération ZFRR appliquée</div>
                                )}
                              </td>
                              <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                Cliquez pour les détails du calcul
                              </div>
                            </tr>
                          )}
                          <tr className="hover:bg-gray-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "directorNetSalary", current)}>
                            <td className="px-6 py-4 font-semibold text-gray-700">👤 Salaire Net</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.directorNetSalary.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                              <div className="text-xs text-gray-500">€{(current.directorNetSalary / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                            </td>
                            <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Cliquez pour les détails du calcul
                            </div>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {current.structure !== "EURL" && current.structure !== "EI" && (
                      <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-800">Bénéfices et Impôts Société</h4>
                        </div>
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "companyNetProfit", current)}>
                              <td className="px-6 py-4 font-semibold text-gray-700">📈 Bénéfices Nets</td>
                              <td className="px-6 py-4 text-right text-gray-900">
                                <div>€{current.companyNetProfit.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                                <div className="text-xs text-gray-500">€{(current.companyNetProfit / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                              </td>
                              <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                Cliquez pour les détails du calcul
                              </div>
                            </tr>
                            <tr className="hover:bg-gray-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "corporateTax", current)}>
                              <td className="px-6 py-4 font-semibold text-gray-700">
                                🏢 Impôt sur les Bénéfices
                                {isZFRRCorporateTax && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ZFRR
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right text-gray-900">
                                <div>€{current.corporateTax.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                                <div className="text-xs text-gray-500">€{(current.corporateTax / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                                {isZFRRCorporateTax && (
                                  <div className="text-xs text-green-600">Exonération ZFRR appliquée</div>
                                )}
                              </td>
                              <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                Cliquez pour les détails du calcul
                              </div>
                            </tr>
                            <tr className="hover:bg-gray-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "grossDividends", current)}>
                              <td className="px-6 py-4 font-semibold text-gray-700">💰 Bénéfices Après IS</td>
                              <td className="px-6 py-4 text-right text-gray-900">
                                <div>€{(current.companyNetProfit - current.corporateTax).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                                <div className="text-xs text-gray-500">€{((current.companyNetProfit - current.corporateTax) / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                              </td>
                              <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                Cliquez pour les détails du calcul
                              </div>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800">Revenus Finaux</h4>
                      </div>
                      <table className="min-w-full divide-y divide-gray-100 text-sm">
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr className="hover:bg-gray-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "directorNetSalary", current)}>
                            <td className="px-6 py-4 font-semibold text-gray-700">👤 Salaire Net</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.directorNetSalary.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                              <div className="text-xs text-gray-500">€{(current.directorNetSalary / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                            </td>
                            <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Cliquez pour les détails du calcul
                            </div>
                          </tr>
                          {current.structure !== "EURL" && current.structure !== "EI" && (
                            <tr className="hover:bg-gray-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "grossDividends", current)}>
                              <td className="px-6 py-4 font-semibold text-gray-700">💵 Dividendes Bruts</td>
                              <td className="px-6 py-4 text-right text-gray-900">
                                <div>€{current.grossDividends.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                                <div className="text-xs text-gray-500">€{(current.grossDividends / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                              </td>
                              <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                Cliquez pour les détails du calcul
                              </div>
                            </tr>
                          )}
                          <tr className="hover:bg-gray-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "rent", current)}>
                            <td className="px-6 py-4 font-semibold text-gray-700">🏠 Loyer Annuel</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.rent.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                              <div className="text-xs text-gray-500">€{(current.rent / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                              <div className="text-xs text-gray-500">Taxable: €{(current.rent * 0.7).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an (après 30% abattement)</div>
                            </td>
                            <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Cliquez pour les détails du calcul
                            </div>
                          </tr>
                          <tr className="hover:bg-gray-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "tax", current)}>
                            <td className="px-6 py-4 font-semibold text-gray-700">📑 Impôt sur le Revenu</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.tax.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                              <div className="text-xs text-gray-500">€{(current.tax / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                            </td>
                            <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Cliquez pour les détails du calcul
                            </div>
                          </tr>
                          <tr className="hover:bg-gray-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "csm", current)}>
                            <td className="px-6 py-4 font-semibold text-gray-700">📑 Contribution Subsidiaire Maladie</td>
                            <td className="px-6 py-4 text-right text-gray-900">
                              <div>€{current.csm.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                              <div className="text-xs text-gray-500">€{(current.csm / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                            </td>
                            <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Cliquez pour les détails du calcul
                            </div>
                          </tr>
                          <tr className="border-t-2 border-gray-300 bg-blue-50 cursor-pointer group relative" onClick={(e) => handleCellClick(e, "netRevenue", current)}>
                            <td className="px-6 py-4 font-bold text-blue-900">💎 Revenu Net Total</td>
                            <td className="px-6 py-4 text-right font-bold text-blue-900">
                              <div>€{current.netRevenue.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / an</div>
                              <div className="text-sm text-blue-700">€{(current.netRevenue / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / mois</div>
                            </td>
                            <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Cliquez pour les détails du calcul
                            </div>
                          </tr>
                        </tbody>
                      </table>
                      <div className="bg-gray-50 px-6 py-4 text-xs text-gray-600">
                        <div>Taux d'Imposition: {current?.incomeTaxRate.toFixed(1)}%</div>
                        <div>Taux Marginal d'Imposition: {current?.marginalTaxRate}%</div>
                        <div>Décôte de l'Impôt sur le revenu: €{current?.decote.toFixed(2)}</div>
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
      <CalculationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        details={modalContent.details}
      />
    </section>
  );
}

export default FranceEntrepreneur;