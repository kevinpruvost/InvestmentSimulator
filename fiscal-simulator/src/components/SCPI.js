import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

function SCPI() {
  // State variables with cookie persistence
  const [language, setLanguage] = useState(() => Cookies.get('language') || 'en');
  const [investorEntity, setInvestorEntity] = useState(() => Cookies.get('investorEntity') || 'Personal');
  const [investmentAmount, setInvestmentAmount] = useState(() => parseFloat(Cookies.get('investmentAmount') || '100000'));
  const [ownershipType, setOwnershipType] = useState(() => Cookies.get('ownershipType') || 'Full');
  const [demembrementDuration, setDemembrementDuration] = useState(() => parseInt(Cookies.get('demembrementDuration') || '10'));
  const [nueProprieteDiscount, setNueProprieteDiscount] = useState(() => parseFloat(Cookies.get('nueProprieteDiscount') || '60'));
  // per-remaining-years discount table
  const [discountTable, setDiscountTable] = useState(() => {
    const tbl = {};
    for (let y = 3; y <= 20; y++) {
      tbl[y] = parseFloat(Cookies.get('discount_' + y) || nueProprieteDiscount);
    }
    return tbl;
  });
  const [distributionYield, setDistributionYield] = useState(() => parseFloat(Cookies.get('distributionYield') || '5.0'));
  const [capitalAppreciationRate, setCapitalAppreciationRate] = useState(() => parseFloat(Cookies.get('capitalAppreciationRate') || '2.0'));
  const [taxRegime, setTaxRegime] = useState(() => Cookies.get('taxRegime') || 'Flat');
  const [incomeTaxRate, setIncomeTaxRate] = useState(() => parseFloat(Cookies.get('incomeTaxRate') || '30'));
  const [socialChargesRate, setSocialChargesRate] = useState(() => parseFloat(Cookies.get('socialChargesRate') || '17.2'));
  const [corporateTaxRate, setCorporateTaxRate] = useState(() => parseFloat(Cookies.get('corporateTaxRate') || '15'));
  const [distributeToAssociates, setDistributeToAssociates] = useState(() => Cookies.get('distributeToAssociates') === 'true');
  const [inflationRate, setInflationRate] = useState(() => parseFloat(Cookies.get('inflationRate') || '2.5'));
  const [simulationDuration, setSimulationDuration] = useState(() => parseInt(Cookies.get('simulationDuration') || '20'));
  const [useLoan, setUseLoan] = useState(() => Cookies.get('useLoan') === 'true');
  const [loanPercentage, setLoanPercentage] = useState(() => parseFloat(Cookies.get('loanPercentage') || '50'));
  const [loanDuration, setLoanDuration] = useState(() => parseInt(Cookies.get('loanDuration') || '15'));
  const [loanInterestRate, setLoanInterestRate] = useState(() => parseFloat(Cookies.get('loanInterestRate') || '3.5'));
  const [loanInsuranceRate, setLoanInsuranceRate] = useState(() => parseFloat(Cookies.get('loanInsuranceRate') || '0.3'));
  const [loanDossierFees, setLoanDossierFees] = useState(() => parseFloat(Cookies.get('loanDossierFees') || '1000'));
  const [managementFees, setManagementFees] = useState(() => parseFloat(Cookies.get('managementFees') || '10'));
  const [entryFees, setEntryFees] = useState(() => parseFloat(Cookies.get('entryFees') || '8'));
  const [reinvestCashflow, setReinvestCashflow] = useState(() => Cookies.get('reinvestCashflow') === 'true');
  const [distributionsDelay, setDistributionsDelay] = useState(() => parseInt(Cookies.get('distributionsDelay') || '3'));
  const [accountingFees, setAccountingFees] = useState(() => parseFloat(Cookies.get('accountingFees') || '0'));

  // Translations
  const translations = {
    en: {
      title: "SCPI Investment Simulator",
      investmentSettings: "Investment Settings",
      investorEntity: "Investor Entity",
      personalInvestment: "Personal Investment",
      sasuInvestment: "SASU Investment",
      distributeToAssociates: "Distribute to Associates",
      investmentAmount: "Total Investment (€)",
      ownershipType: "Ownership Type",
      fullOwnership: "Full Ownership",
      nuePropriete: "Bare Ownership",
      usufruit: "Usufruit",
      demembrementDuration: "Demembrement Duration (years)",
      nueProprieteDiscount: "Bare Ownership Discount (%)",
      distributionYield: "Distribution Yield (%)",
      capitalAppreciation: "Capital Appreciation Rate (%)",
      taxSettings: "Tax Settings",
      taxRegime: "Tax Regime",
      flatTax: "Flat Tax (30%)",
      progressiveTax: "Progressive Tax",
      incomeTaxRate: "Income Tax Rate (%)",
      socialChargesRate: "Social Charges Rate (%)",
      corporateTaxRate: "Corporate Tax Rate (%)",
      economicFactors: "Economic Factors",
      inflationRate: "Inflation Rate (%)",
      simulationDuration: "Simulation Duration (years)",
      loanSettings: "Loan Settings",
      useLoan: "Use Loan",
      loanAmount: "Loan Amount (€)",
      loanDuration: "Loan Duration (years)",
      loanInterestRate: "Loan Interest Rate (%)",
      loanInsuranceRate: "Loan Insurance Rate (%)",
      loanDossierFees: "Loan Dossier Fees (€)",
      feesSettings: "Fees Settings",
      managementFees: "Management Fees (%)",
      entryFees: "Entry Fees (%)",
      reinvestCashflow: "Reinvest Cash Flow",
      results: "Investment Results",
      initialInvestment: "Initial Investment",
      totalInvestmentCost: "Total Investment Cost",
      totalBorrowedAmount: "Total Borrowed Amount",
      initialCashNeeded: "Initial Cash Needed",
      yearlyEvolution: "Yearly Evolution",
      year: "Year",
      scpiValue: "SCPI Value",
      distributions: "Distributions (-Accounting Fees)",
      taxes: "Taxes",
      associateTaxes: "Associate Taxes",
      loanPayments: "Loan Payments",
      cashFlow: "Cash Flow",
      cashBalance: "Cash Balance",
      cashBalanceAfterInflation: "Cash Balance After Inflation",
      totalValue: "Total Value",
      presentValue: "Present Value",
      grossYield: "Gross Yield",
      netYield: "Net Yield",
      switchLanguage: "Switch to French",
      distributionsDelay: "Months before distributions start",
      totalDistributions: "Total Distributions",
      totalTaxesPaid: "Total Taxes Paid",
      totalLoanPayments: "Total Loan Payments",
      gainFromTotalCost: "Gain from Total Cost",
      gainFromInitialInvestment: "Gain from Initial Investment",
      totalGain: "Total Gain",
      gainAfterLoanAndDemembrement: "Gain After Loan/Demembrement",
      returnOnPersonalCapital: "Return on Personal Capital",
      usedAmortization: "Used Amortization",
      accountingFees: "Annual Accounting Fees (€)",
    },
    fr: {
      title: "Simulateur d'Investissement SCPI",
      investmentSettings: "Paramètres d'Investissement",
      investorEntity: "Entité Investisseur",
      personalInvestment: "Investissement Personnel",
      sasuInvestment: "Investissement via SASU",
      distributeToAssociates: "Distribuer aux Associés",
      investmentAmount: "Montant Total de l'Investissement (€)",
      ownershipType: "Type de Propriété",
      fullOwnership: "Pleine Propriété",
      nuePropriete: "Nue-Propriété",
      usufruit: "Usufruit",
      demembrementDuration: "Durée du Démembrement (années)",
      nueProprieteDiscount: "Décote de la Nue-Propriété (%)",
      distributionYield: "Taux de Distribution (%)",
      capitalAppreciation: "Taux d'Appréciation du Capital (%)",
      taxSettings: "Paramètres Fiscaux",
      taxRegime: "Régime Fiscal",
      flatTax: "Flat Tax (30%)",
      progressiveTax: "Impôt Progressif",
      incomeTaxRate: "Taux d'Impôt sur le Revenu (%)",
      socialChargesRate: "Taux de Charges Sociales (%)",
      corporateTaxRate: "Taux d'Impôt sur les Sociétés (%)",
      economicFactors: "Facteurs Économiques",
      inflationRate: "Taux d'Inflation (%)",
      simulationDuration: "Durée de la Simulation (années)",
      loanSettings: "Paramètres du Prêt",
      useLoan: "Utiliser un Prêt",
      loanAmount: "Montant du Prêt (€)",
      loanDuration: "Durée du Prêt (années)",
      loanInterestRate: "Taux d'Intérêt du Prêt (%)",
      loanInsuranceRate: "Taux d'Assurance du Prêt (%)",
      loanDossierFees: "Frais de Dossier du Prêt (€)",
      feesSettings: "Paramètres des Frais",
      managementFees: "Frais de Gestion (%)",
      entryFees: "Frais d'Entrée (%)",
      reinvestCashflow: "Réinvestir les Flux de Trésorerie",
      results: "Résultats de l'Investissement",
      initialInvestment: "Investissement Initial",
      totalInvestmentCost: "Coût Total de l'Investissement",
      totalBorrowedAmount: "Montant Total Emprunté",
      initialCashNeeded: "Apport Initial",
      yearlyEvolution: "Évolution Annuelle",
      year: "Année",
      scpiValue: "Valeur de la SCPI",
      distributions: "Distributions",
      taxes: "Impôts",
      associateTaxes: "Impôts des Associés",
      loanPayments: "Paiements du Prêt",
      cashFlow: "Flux de Trésorerie",
      cashBalance: "Solde de Trésorerie",
      cashBalanceAfterInflation: "Solde de Trésorerie Après Inflation",
      totalValue: "Valeur Totale",
      presentValue: "Valeur Actuelle",
      grossYield: "Rendement Brut",
      netYield: "Rendement Net",
      switchLanguage: "Afficher en Anglais",
      distributionsDelay: "Délai de jouissance (mois)",
      totalDistributions: "Total des Distributions",
      totalTaxesPaid: "Total des Impôts Payés",
      totalLoanPayments: "Total des Mensualités",
      gainFromTotalCost: "Gain par Rapport au Coût Total",
      gainFromInitialInvestment: "Gain par Rapport à l'Investissement Initial",
      totalGain: "Gain Total",
      gainAfterLoanAndDemembrement: "Gain Après Prêt/Démembrement",
      returnOnPersonalCapital: "Rendement sur Capital Personnel",
      usedAmortization: "Amortissement Utilisé",
      accountingFees: "Frais de gestion comptable annuels (€)",
    }
  };

  const t = translations[language];

  // Save state to cookies
  useEffect(() => {
    Cookies.set('language', language, { expires: 365 });
    Cookies.set('investorEntity', investorEntity, { expires: 365 });
    Cookies.set('investmentAmount', investmentAmount.toString(), { expires: 365 });
    Cookies.set('ownershipType', ownershipType, { expires: 365 });
    Cookies.set('demembrementDuration', demembrementDuration.toString(), { expires: 365 });
    Cookies.set('nueProprieteDiscount', nueProprieteDiscount.toString(), { expires: 365 });
    Cookies.set('distributionYield', distributionYield.toString(), { expires: 365 });
    Cookies.set('capitalAppreciationRate', capitalAppreciationRate.toString(), { expires: 365 });
    Cookies.set('taxRegime', taxRegime, { expires: 365 });
    Cookies.set('incomeTaxRate', incomeTaxRate.toString(), { expires: 365 });
    Cookies.set('socialChargesRate', socialChargesRate.toString(), { expires: 365 });
    Cookies.set('corporateTaxRate', corporateTaxRate.toString(), { expires: 365 });
    Cookies.set('distributeToAssociates', distributeToAssociates.toString(), { expires: 365 });
    Cookies.set('inflationRate', inflationRate.toString(), { expires: 365 });
    Cookies.set('simulationDuration', simulationDuration.toString(), { expires: 365 });
    Cookies.set('useLoan', useLoan.toString(), { expires: 365 });
    Cookies.set('loanPercentage', loanPercentage.toString(), { expires: 365 });
    Cookies.set('loanDuration', loanDuration.toString(), { expires: 365 });
    Cookies.set('loanInterestRate', loanInterestRate.toString(), { expires: 365 });
    Cookies.set('loanInsuranceRate', loanInsuranceRate.toString(), { expires: 365 });
    Cookies.set('loanDossierFees', loanDossierFees.toString(), { expires: 365 });
    Cookies.set('managementFees', managementFees.toString(), { expires: 365 });
    Cookies.set('entryFees', entryFees.toString(), { expires: 365 });
    Cookies.set('reinvestCashflow', reinvestCashflow.toString(), { expires: 365 });
    Cookies.set('distributionsDelay', distributionsDelay.toString(), { expires: 365 });
    Cookies.set('accountingFees', accountingFees.toString(), { expires: 365 });
    // persist discount table
    Object.entries(discountTable).forEach(([yr, pct]) =>
      Cookies.set('discount_' + yr, pct.toString(), { expires: 365 })
    );
  }, [
    language, investorEntity, investmentAmount, ownershipType, demembrementDuration,
    nueProprieteDiscount, distributionYield, capitalAppreciationRate, taxRegime,
    incomeTaxRate, socialChargesRate, corporateTaxRate, distributeToAssociates,
    inflationRate, simulationDuration, useLoan, loanPercentage, loanDuration,
    loanInterestRate, loanInsuranceRate, loanDossierFees, managementFees, entryFees,
    reinvestCashflow, distributionsDelay, accountingFees, discountTable
  ]);

  // Calculate effective investment based on ownership type
  const calculateEffectiveInvestment = () => {
    let effectiveInvestment = investmentAmount;
    if (useLoan) {
        effectiveInvestment += loanDossierFees; // Add loan dossier fees
    }
    console.log("Effective Investment:", effectiveInvestment);
    effectiveInvestment *= (1 + entryFees / 100); // Add entry fees
    console.log("Effective Investment:", effectiveInvestment);
    return effectiveInvestment;
  };

  // Calculate monthly loan payment
  const calculateMonthlyLoanPayment = () => {
    if (!useLoan) return 0;
    const loanAmount = calculateEffectiveInvestment() * (loanPercentage / 100);
    const monthlyInterestRate = (loanInterestRate / 100) / 12;
    const numberOfPayments = loanDuration * 12;
    const monthlyPayment = loanAmount * (monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments)));
    const insuranceMonthly = loanAmount * (loanInsuranceRate / 100) / 12;
    return (monthlyPayment + insuranceMonthly).toFixed(2);
  };

  const calculateMonthlyInterestPayment = () => {
    if (!useLoan) return 0;
    const loanAmount = calculateEffectiveInvestment() * (loanPercentage / 100);
    const monthlyInterestRate = (loanInterestRate / 100) / 12;
    const interestPayment = loanAmount * monthlyInterestRate;
    return interestPayment.toFixed(2);
  };

  // Calculate yearly evolution
  const calculateYearlyEvolution = () => {
    const results = [];
    let initialInvestmentValue = investmentAmount;
    const segments = [{
      currentValue: initialInvestmentValue,
      startYear: 1,
      origDem: ownershipType !== 'Full' ? demembrementDuration : Infinity
    }];
    let remainingLoan = useLoan ? (calculateEffectiveInvestment() * loanPercentage) / 100 : 0;
    let cashBalance = 0;
    const monthlyLoanPayment = parseFloat(calculateMonthlyLoanPayment());
    const monthlyInterestRate = (loanInterestRate / 100) / 12;

    for (let year = 1; year <= simulationDuration; year++) {
      // Compute SCPI value across all segments
      let yearScpiValue = segments.reduce((sum, seg) => {
        const yrs = year - seg.startYear + 1;
        const disc = discountTable[seg.origDem] ?? nueProprieteDiscount;
        console.log("Discount for year", year, ":", disc);
        let val = 0;
        if (ownershipType === 'Nue Propriete') {
          val = yrs <= seg.origDem
            ? seg.currentValue * (disc / 100)
            : seg.currentValue;
        } else if (ownershipType === 'Usufruit') {
          val = yrs <= seg.origDem
            ? seg.currentValue / ((100 - disc) / 100)
            : 0;
        } else {
          val = seg.currentValue;
        }
        return sum + val;
      }, 0);

      // Calculate distributions with delay
      let annualDistributions = 0;
      if (year === 1) {
        // First year: partial distributions based on delay
        const monthsWithDistributions = 12 - distributionsDelay;
        if (monthsWithDistributions > 0) {
          annualDistributions = yearScpiValue * (distributionYield / 100) * (monthsWithDistributions / 12);
        }
      } else {
        // Full year distributions after delay
        annualDistributions = yearScpiValue * (distributionYield / 100);
      }

      let annualManagementFees = annualDistributions * (managementFees / 100);
      let annualAccountingFees = accountingFees;
      let netDistributions = annualDistributions - annualManagementFees - annualAccountingFees;

      let taxes = 0;
      let associateTaxes = 0;
      let accumulatedAmortization = 0;
      let taxableIncome = netDistributions;

      let amortizationDetails = {
        usufruit: 0,
        interest: 0,
        insurance: 0,
        dossierFees: 0,
        total: 0
      };

      if (investorEntity === 'SASU') {
        if (ownershipType === 'Usufruit' && year <= demembrementDuration) {
          let usufruitValue = investmentAmount;
          amortizationDetails.usufruit = (usufruitValue / demembrementDuration);
        }

        if (useLoan && year <= loanDuration) {
          amortizationDetails.interest = remainingLoan * monthlyInterestRate * 12;
          amortizationDetails.insurance = (calculateEffectiveInvestment() * loanPercentage / 100) * (loanInsuranceRate / 100);
          if (year === 1) {
            amortizationDetails.dossierFees = loanDossierFees;
          }
        }

        amortizationDetails.total = amortizationDetails.usufruit + 
                                   amortizationDetails.interest + 
                                   amortizationDetails.insurance + 
                                   amortizationDetails.dossierFees;
        
        taxableIncome = Math.max(0, netDistributions - amortizationDetails.total);
        taxes = taxableIncome * (corporateTaxRate / 100);
      }

      let annualLoanPayments = 0;
      let annualInterest = 0;
      if (useLoan && year <= loanDuration) {
        for (let month = 0; month < 12; month++) {
          const interest = remainingLoan * monthlyInterestRate;
          const principal = monthlyLoanPayment - interest;
          remainingLoan -= principal;
          annualInterest += interest;
        }
        annualLoanPayments = monthlyLoanPayment * 12;
      }

      const cashFlow = netDistributions - taxes - associateTaxes - annualLoanPayments;
      cashBalance += cashFlow;

      // determine reinvest cutoff
      const remainingSimYears  = simulationDuration - (year - 1);
      // halt reinvest if under 5 years left of loan OR under 5 years before simulation end
      const reinvestAllowed = reinvestCashflow &&
                              cashFlow > 0;
      let distributedMoney = 0;
      if (reinvestAllowed) {
        let remDem;
        if (ownershipType === 'Usufruit') {
            if (useLoan) {
                remDem = 20;
            } else {
                remDem = 20;
            }
        } else {
            if (ownershipType === 'Nue Propriete') {
                remDem = demembrementDuration - (year - 1);
            } else {
                remDem = Infinity;
            }
        }
        let toInvest = cashFlow;
        // If the simulation is longer than the first usufruit, then only invest enough to cover the inflation
        if (ownershipType === 'Usufruit' && year > loanDuration) {
            // We take the value that the SCPI needs to be on the next year to produce at least the same amount of inflated cashflow
            const inflationAdjustedValue = yearScpiValue * (inflationRate / 100 * ((100 - discountTable[remDem]) / 100));
            toInvest = Math.max(0, toInvest - inflationAdjustedValue * 0.75);
            distributedMoney = cashFlow - toInvest;
        }

        segments.push({ currentValue: toInvest, startYear: year, origDem: remDem });
        cashBalance -= toInvest;
      }

      // Capital appreciation on all segments
      segments.forEach(seg => {
        seg.currentValue *= (1 + capitalAppreciationRate / 100);
      });

      const totalValue = yearScpiValue + cashBalance;
      const presentValue = totalValue / Math.pow(1 + inflationRate / 100, year);
      const cashBalanceAfterInflation = cashBalance / Math.pow(1 + inflationRate / 100, year);

      results.push({
        year,
        scpiValue: yearScpiValue,
        distributions: reinvestCashflow ? distributedMoney : netDistributions,
        taxes,
        associateTaxes,
        loanPayments: annualLoanPayments,
        cashFlow,
        cashBalance,
        cashBalanceAfterInflation,
        totalValue,
        presentValue,
        amortizationDetails
      });
    }
    return results;
  };

  // Calculate yields
  const calculateYields = () => {
    const annualDistributions = investmentAmount * (distributionYield / 100);
    const netDistributions = annualDistributions * (1 - managementFees / 100) - accountingFees;
    const grossYield = ((annualDistributions / investmentAmount) * 100).toFixed(2);
    const netYield = ((netDistributions / investmentAmount) * 100).toFixed(2);
    return { grossYield, netYield };
  };

  // Calculate total investment with loan
  const calculateTotalInvestmentWithLoan = () => {
    const effectiveInvestment = calculateEffectiveInvestment();
    let totalPayment = effectiveInvestment;
    if (useLoan) {
      const monthlyInterestRate = (loanInterestRate / 100) / 12;
      const numberOfPayments = loanDuration * 12;
      const monthlyPayment = (calculateEffectiveInvestment() * loanPercentage / 100) * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      const insuranceMonthly = ((calculateEffectiveInvestment() * loanPercentage / 100) * (loanInsuranceRate / 100)) / 12;
      totalPayment += (monthlyPayment + insuranceMonthly) * numberOfPayments - (calculateEffectiveInvestment() * loanPercentage / 100) + loanDossierFees;
    }
    return totalPayment;
  };

  // Rate options for select inputs
  const rateOptions = Array.from({ length: 201 }, (_, i) => (i / 10).toFixed(1));

  // Calculate inflation-adjusted value
  const calculateInflationAdjustedValue = (value, years) => {
    return value / Math.pow(1 + inflationRate / 100, years);
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-2xl font-semibold text-gray-800">{t.title}</h4>
        <button
          onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {t.switchLanguage}
        </button>
      </div>

      <div className="grid grid-cols-[40%_60%] gap-6">
        {/* Parameters */}
        <div className="space-y-4">
          {/* Investment Settings */}
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h6 className="font-medium text-gray-800 mb-3">{t.investmentSettings}</h6>
            <div className="space-y-3">
              <div>
                <label htmlFor="investorEntity" className="block text-sm font-bold text-gray-700">{t.investorEntity}</label>
                <select
                  id="investorEntity"
                  value={investorEntity}
                  onChange={(e) => setInvestorEntity(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Personal">{t.personalInvestment}</option>
                  <option value="SASU">{t.sasuInvestment}</option>
                </select>
              </div>
              {investorEntity === 'SASU' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="distributeToAssociates"
                    checked={distributeToAssociates}
                    onChange={(e) => setDistributeToAssociates(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="distributeToAssociates" className="ml-2 text-sm text-gray-700">{t.distributeToAssociates}</label>
                </div>
              )}
              <div>
                <label htmlFor="investmentAmount" className="block text-sm font-bold text-gray-700">{t.investmentAmount}</label>
                <input
                  type="number"
                  id="investmentAmount"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="ownershipType" className="block text-sm font-bold text-gray-700">{t.ownershipType}</label>
                <select
                  id="ownershipType"
                  value={ownershipType}
                  onChange={(e) => setOwnershipType(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Full">{t.fullOwnership}</option>
                  <option value="Nue Propriete">{t.nuePropriete}</option>
                  <option value="Usufruit">{t.usufruit}</option>
                </select>
              </div>
              {(ownershipType === 'Nue Propriete' || ownershipType === 'Usufruit') && (
                <>
                  <div>
                    <label htmlFor="demembrementDuration" className="block text-sm font-bold text-gray-700">{t.demembrementDuration}</label>
                    <select
                      id="demembrementDuration"
                      value={demembrementDuration}
                      onChange={(e) => setDemembrementDuration(parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {Array.from({ length: 21 }, (_, i) => (
                        <option key={i + 5} value={i + 5}>{i + 5}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="nueProprieteDiscount" className="block text-sm font-bold text-gray-700">{t.nueProprieteDiscount}</label>
                    <select
                      id="nueProprieteDiscount"
                      value={nueProprieteDiscount}
                      onChange={(e) => setNueProprieteDiscount(parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {Array.from({ length: 51 }, (_, i) => 50 + i).map(rate => (
                        <option key={rate} value={rate}>{rate}%</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div>
                <label htmlFor="distributionYield" className="block text-sm font-bold text-gray-700">{t.distributionYield}</label>
                <select
                  id="distributionYield"
                  value={distributionYield.toFixed(1)}
                  onChange={(e) => setDistributionYield(parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {rateOptions.slice(10, 101).map(rate => (
                    <option key={rate} value={rate}>{rate}%</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="capitalAppreciation" className="block text-sm font-bold text-gray-700">{t.capitalAppreciation}</label>
                <select
                  id="capitalAppreciation"
                  value={capitalAppreciationRate.toFixed(1)}
                  onChange={(e) => setCapitalAppreciationRate(parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {rateOptions.slice(0, 101).map(rate => (
                    <option key={rate} value={rate}>{rate}%</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="distributionsDelay" className="block text-sm font-bold text-gray-700">{t.distributionsDelay}</label>
                <select
                  id="distributionsDelay"
                  value={distributionsDelay}
                  onChange={(e) => setDistributionsDelay(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {Array.from({ length: 13 }, (_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Discount Table */}
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h6 className="font-medium text-gray-800 mb-3">Discount by Remaining Years</h6>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(discountTable).map(([yr, pct]) => (
                <div key={yr} className="flex items-center">
                  <label className="w-16 text-sm">{yr}y:</label>
                  <input
                    type="number"
                    className="w-16 border rounded p-1"
                    value={pct}
                    onChange={e =>
                      setDiscountTable(prev => ({
                        ...prev,
                        [yr]: parseFloat(e.target.value) || 0
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tax Settings */}
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h6 className="font-medium text-gray-800 mb-3">{t.taxSettings}</h6>
            <div className="space-y-3">
              {investorEntity === 'Personal' && (
                <>
                  <div>
                    <label htmlFor="taxRegime" className="block text-sm font-bold text-gray-700">{t.taxRegime}</label>
                    <select
                      id="taxRegime"
                      value={taxRegime}
                      onChange={(e) => setTaxRegime(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Flat">{t.flatTax}</option>
                      <option value="Progressive">{t.progressiveTax}</option>
                    </select>
                  </div>
                  {taxRegime === 'Progressive' && (
                    <>
                      <div>
                        <label htmlFor="incomeTaxRate" className="block text-sm font-bold text-gray-700">{t.incomeTaxRate}</label>
                        <input
                          type="number"
                          id="incomeTaxRate"
                          value={incomeTaxRate}
                          onChange={(e) => setIncomeTaxRate(parseFloat(e.target.value) || 30)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="socialChargesRate" className="block text-sm font-bold text-gray-700">{t.socialChargesRate}</label>
                        <input
                          type="number"
                          id="socialChargesRate"
                          value={socialChargesRate}
                          onChange={(e) => setSocialChargesRate(parseFloat(e.target.value) || 17.2)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                </>
              )}
              {investorEntity === 'SASU' && (
                <div>
                  <label htmlFor="corporateTaxRate" className="block text-sm font-bold text-gray-700">{t.corporateTaxRate}</label>
                  <input
                    type="number"
                    id="corporateTaxRate"
                    value={corporateTaxRate}
                    onChange={(e) => setCorporateTaxRate(parseFloat(e.target.value) || 25)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Economic Factors */}
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h6 className="font-medium text-gray-800 mb-3">{t.economicFactors}</h6>
            <div className="space-y-3">
              <div>
                <label htmlFor="inflationRate" className="block text-sm font-bold text-gray-700">{t.inflationRate}</label>
                <select
                  id="inflationRate"
                  value={inflationRate.toFixed(1)}
                  onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {rateOptions.slice(0, 101).map(rate => (
                    <option key={rate} value={rate}>{rate}%</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="simulationDuration" className="block text-sm font-bold text-gray-700">{t.simulationDuration}</label>
                <select
                  id="simulationDuration"
                  value={simulationDuration}
                  onChange={(e) => setSimulationDuration(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {Array.from({ length: 41 }, (_, i) => (
                    <option key={i + 10} value={i + 10}>{i + 10}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Loan Settings */}
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h6 className="font-medium text-gray-800 mb-3">{t.loanSettings}</h6>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useLoan"
                  checked={useLoan}
                  onChange={(e) => setUseLoan(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="useLoan" className="ml-2 text-sm text-gray-700">{t.useLoan}</label>
              </div>
              {useLoan && (
                <>
                  <div>
                    <label htmlFor="loanPercentage" className="block text-sm font-bold text-gray-700">{t.loanPercentage}</label>
                    <select
                      id="loanPercentage"
                      value={loanPercentage}
                      onChange={(e) => setLoanPercentage(parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {Array.from({ length: 101 }, (_, i) => (
                        <option key={i} value={i}>{i}%</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="loanDuration" className="block text-sm font-bold text-gray-700">{t.loanDuration}</label>
                    <select
                      id="loanDuration"
                      value={loanDuration}
                      onChange={(e) => setLoanDuration(parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {Array.from({ length: 30 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} years</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="loanInterestRate" className="block text-sm font-bold text-gray-700">{t.loanInterestRate}</label>
                    <select
                      id="loanInterestRate"
                      value={loanInterestRate.toFixed(1)}
                      onChange={(e) => setLoanInterestRate(parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {rateOptions.slice(0, 101).map(rate => (
                        <option key={rate} value={rate}>{rate}%</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="loanInsuranceRate" className="block text-sm font-bold text-gray-700">{t.loanInsuranceRate}</label>
                    <select
                      id="loanInsuranceRate"
                      value={loanInsuranceRate.toFixed(1)}
                      onChange={(e) => setLoanInsuranceRate(parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {rateOptions.slice(0, 51).map(rate => (
                        <option key={rate} value={rate}>{rate}%</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="loanDossierFees" className="block text-sm font-bold text-gray-700">{t.loanDossierFees}</label>
                    <input
                      type="number"
                      id="loanDossierFees"
                      value={loanDossierFees}
                      onChange={(e) => setLoanDossierFees(parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Fees Settings */}
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h6 className="font-medium text-gray-800 mb-3">{t.feesSettings}</h6>
            <div className="space-y-3">
              <div>
                <label htmlFor="managementFees" className="block text-sm font-bold text-gray-700">{t.managementFees}</label>
                <select
                  id="managementFees"
                  value={managementFees.toFixed(1)}
                  onChange={(e) => setManagementFees(parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {rateOptions.slice(0, 201).map(rate => (
                    <option key={rate} value={rate}>{rate}%</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="entryFees" className="block text-sm font-bold text-gray-700">{t.entryFees}</label>
                <select
                  id="entryFees"
                  value={entryFees.toFixed(1)}
                  onChange={(e) => setEntryFees(parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {rateOptions.slice(0, 201).map(rate => (
                    <option key={rate} value={rate}>{rate}%</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="accountingFees" className="block text-sm font-bold text-gray-700">{t.accountingFees}</label>
                <input
                  type="number"
                  id="accountingFees"
                  value={accountingFees}
                  onChange={(e) => setAccountingFees(parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reinvestCashflow"
                  checked={reinvestCashflow}
                  onChange={(e) => setReinvestCashflow(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="reinvestCashflow" className="ml-2 text-sm text-gray-700">{t.reinvestCashflow}</label>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h4 className="text-2xl font-semibold text-gray-800 mb-6">{t.results}</h4>

          {/* Initial Investment */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
            <h5 className="text-lg font-semibold text-gray-700 mb-4">{t.initialInvestment}</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">{t.totalInvestmentCost}:</p>
                  <p className="text-xl font-bold text-blue-600">
                    €{calculateEffectiveInvestment().toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                  </p>
                </div>
                {useLoan && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t.totalBorrowedAmount}:</p>
                    <p className="text-xl font-bold text-blue-600">
                      €{((calculateEffectiveInvestment() * loanPercentage / 100).toLocaleString('fr-FR', { maximumFractionDigits: 2 }))}
                    </p>
                  </div>
                )}
                {useLoan && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t.initialCashNeeded}:</p>
                    <p className="text-xl font-bold text-blue-600">
                      €{(calculateEffectiveInvestment() * (100 - loanPercentage) / 100)
                          .toLocaleString('fr-FR',{ maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-700">{t.grossYield}:</p>
                  <p className="text-xl font-bold text-purple-600">{calculateYields().grossYield}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{t.netYield}:</p>
                  <p className="text-xl font-bold text-purple-600">{calculateYields().netYield}%</p>
                </div>
                {investorEntity === 'SASU' && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-800 mb-2">Tax Deduction Details:</p>
                    {(() => {
                      let details = [];
                      if (ownershipType === 'Usufruit' && demembrementDuration > 0) {
                        const usufruitValue = investmentAmount;
                        const firstYearAmort = usufruitValue / demembrementDuration * (1 - distributionsDelay / 12);
                        const otherYearsAmort = usufruitValue / demembrementDuration + (usufruitValue / demembrementDuration * (distributionsDelay / 12)) / (demembrementDuration - 1);
                        details.push(
                          <div key="usufruit" className="mb-2 p-2 bg-blue-50 rounded border border-blue-200">
                            <p className="text-sm font-medium text-blue-800 mb-1">Usufruit Amortization</p>
                            <p className="text-sm text-blue-600">
                              First Year: €{firstYearAmort.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}<br/>
                              Following Years: €{otherYearsAmort.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        );
                      }
                      if (useLoan) {
                        const loanAmount = calculateEffectiveInvestment() * (loanPercentage / 100);
                        const yearlyInterest = loanAmount * (loanInterestRate / 100);
                        const yearlyInsurance = loanAmount * (loanInsuranceRate / 100);
                        const yearlyDossierFee = loanDossierFees / loanDuration;
                        const totalYearlyDeduction = yearlyInterest + yearlyInsurance + yearlyDossierFee;
                        details.push(
                          <div key="loan" className="p-2 bg-green-50 rounded border border-green-200">
                            <p className="text-sm font-medium text-green-800 mb-1">Loan Related Deductions</p>
                            <p className="text-sm text-green-600">
                              Interest: €{yearlyInterest.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}<br/>
                              Insurance: €{yearlyInsurance.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}<br/>
                              Dossier Fee: €{yearlyDossierFee.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-sm font-medium text-green-800 mt-1">
                              Total Annual Deduction: €{totalYearlyDeduction.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        );
                      }
                      return details;
                    })()}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {/* Calculate and display additional metrics */}
                {(() => {
                  const evolution = calculateYearlyEvolution();
                  const totalDistributions = evolution.reduce((sum, year) => sum + year.distributions, 0);
                  const totalTaxes = evolution.reduce((sum, year) => sum + year.taxes + year.associateTaxes, 0);
                  const totalLoanPayments = evolution.reduce((sum, year) => sum + year.loanPayments, 0);
                  // If usufruit, then finalValue should not contain the value of the property
                  let finalValue = evolution[evolution.length - 1]?.totalValue || 0;
                  if (ownershipType === 'Usufruit' && demembrementDuration > 0) {
                    finalValue -= evolution[evolution.length - 1]?.scpiValue || 0;
                 }
                  const gainFromTotal = finalValue - calculateEffectiveInvestment();
                  const gainFromInitial = finalValue - (calculateEffectiveInvestment() * (100 - loanPercentage) / 100);

                  return (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{t.totalDistributions}:</p>
                        <p className="text-xl font-bold text-blue-600">
                          €{totalDistributions.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-green-600">
                          €{calculateInflationAdjustedValue(totalDistributions, simulationDuration).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{t.totalTaxesPaid}:</p>
                        <p className="text-xl font-bold text-red-600">
                          €{totalTaxes.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-green-600">
                          €{calculateInflationAdjustedValue(totalTaxes, simulationDuration).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{t.totalLoanPayments}:</p>
                        <p className="text-xl font-bold text-red-600">
                          €{totalLoanPayments.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-green-600">
                          €{calculateInflationAdjustedValue(totalLoanPayments, simulationDuration).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{t.gainFromInitialInvestment}:</p>
                        <p className="text-xl font-bold text-blue-600">
                          €{gainFromInitial.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-green-600">
                          €{calculateInflationAdjustedValue(gainFromInitial, simulationDuration).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{t.returnOnPersonalCapital}:</p>
                        {(() => {
                          const initialPersonalCapital = calculateEffectiveInvestment() * (100 - loanPercentage) / 100;
                          const returnPercentage = ((finalValue / initialPersonalCapital - 1) * 100).toFixed(2);
                          const yearlyReturnRate = ((Math.pow(finalValue / initialPersonalCapital, 1 / simulationDuration) - 1) * 100).toFixed(2);
                          return (
                            <>
                              <p className="text-xl font-bold text-purple-600">
                                {returnPercentage}% ({yearlyReturnRate}% / year)
                              </p>
                              <p className="text-xs text-green-600">
                                €{finalValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} / €{initialPersonalCapital.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Yearly Evolution */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h5 className="text-lg font-semibold text-gray-700 mb-4">{t.yearlyEvolution}</h5>
            <div className="overflow-x-auto">
              <table className="w-full table-auto divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t.year}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t.scpiValue}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t.distributions}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t.taxes}</th>
                    {investorEntity === 'SASU' && (
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t.associateTaxes}</th>
                    )}
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t.loanPayments}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t.cashFlow}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t.cashBalance}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t.cashBalanceAfterInflation}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t.totalValue}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t.presentValue}</th>
                    {investorEntity === 'SASU' && (
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t.usedAmortization}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {calculateYearlyEvolution().map((result) => (
                    <tr key={result.year}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{result.year}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-600">{result.scpiValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-600">{result.distributions.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-red-600">{result.taxes.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</td>
                      {investorEntity === 'SASU' && (
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-red-600">{result.associateTaxes.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</td>
                      )}
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-red-600">{result.loanPayments.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{result.cashFlow.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-yellow-600">{result.cashBalance.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600">{result.cashBalanceAfterInflation.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-yellow-600">{result.totalValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600">{result.presentValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</td>
                      {investorEntity === 'SASU' && (
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-purple-600">
                          {result.amortizationDetails.total > 0 ? (
                            <div className="text-xs">
                              U: {result.amortizationDetails.usufruit.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}<br/>
                              I: {result.amortizationDetails.interest.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}<br/>
                              A: {result.amortizationDetails.insurance.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}<br/>
                              D: {result.amortizationDetails.dossierFees.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}<br/>
                              T: {result.amortizationDetails.total.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                            </div>
                          ) : '-'}
                        </td>
                      )}
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

export default SCPI;
