import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

function RealEstate() {
    const [language, setLanguage] = useState(() => Cookies.get('language') || 'en');
    const [personalContribution, setPersonalContribution] = useState(() => parseFloat(Cookies.get('initialLoan') || '200000'));
    const [loanDuration, setLoanDuration] = useState(() => parseInt(Cookies.get('loanDuration') || '20'));
    const [loanInterestRate, setLoanInterestRate] = useState(() => parseFloat(Cookies.get('loanInterestRate') || '3.5'));
    const [loanInsuranceRate, setLoanInsuranceRate] = useState(() => parseFloat(Cookies.get('loanInsuranceRate') || '0.3'));
    const [loanInitialFees, setLoanInitialFees] = useState(() => parseFloat(Cookies.get('loanInitialFees') || '1000'));
    const [propertyPrice, setPropertyPrice] = useState(() => parseFloat(Cookies.get('propertyPrice') || '250000'));
    const [notaryFees, setNotaryFees] = useState(() => parseFloat(Cookies.get('notaryFees') || '20000'));
    const [agencyFees, setAgencyFees] = useState(() => parseFloat(Cookies.get('agencyFees') || '10000'));
    const [surveyFees, setSurveyFees] = useState(() => parseFloat(Cookies.get('surveyFees') || '500'));
    const [maintenanceBudget, setMaintenanceBudget] = useState(() => parseFloat(Cookies.get('maintenanceBudget') || '1000'));
    const [renovationCosts, setRenovationCosts] = useState(() => parseFloat(Cookies.get('renovationCosts') || '5000'));
    const [propertySize, setPropertySize] = useState(() => parseFloat(Cookies.get('propertySize') || '50'));
    const [rentalPriceMonthly, setRentalPriceMonthly] = useState(() => parseFloat(Cookies.get('rentalPriceMonthly') || '1000'));
    const [rentalGrowthRate, setRentalGrowthRate] = useState(() => parseFloat(Cookies.get('rentalGrowthRate') || '2.0'));
    const [vacancyRate, setVacancyRate] = useState(() => parseFloat(Cookies.get('vacancyRate') || '1'));
    const [coproCharges, setCoproCharges] = useState(() => parseFloat(Cookies.get('coproCharges') || '100'));
    const [pnoInsurance, setPnoInsurance] = useState(() => parseFloat(Cookies.get('pnoInsurance') || '20'));
    const [accountingFees, setAccountingFees] = useState(() => parseFloat(Cookies.get('accountingFees') || '50'));
    const [cgaFees, setCgaFees] = useState(() => parseFloat(Cookies.get('cgaFees') || '30'));
    const [bankFees, setBankFees] = useState(() => parseFloat(Cookies.get('bankFees') || '10'));
    const [waterBill, setWaterBill] = useState(() => parseFloat(Cookies.get('waterBill') || '30'));
    const [electricityBill, setElectricityBill] = useState(() => parseFloat(Cookies.get('electricityBill') || '40'));
    const [gasBill, setGasBill] = useState(() => parseFloat(Cookies.get('gasBill') || '30'));
    const [internetBill, setInternetBill] = useState(() => parseFloat(Cookies.get('internetBill') || '30'));
    const [cfeTax, setCfeTax] = useState(() => parseFloat(Cookies.get('cfeTax') || '50'));
    const [propertyTax, setPropertyTax] = useState(() => parseFloat(Cookies.get('propertyTax') || '100'));
    const [otherCharges, setOtherCharges] = useState(() => parseFloat(Cookies.get('otherCharges') || '20'));
    const [inflationRate, setInflationRate] = useState(() => parseFloat(Cookies.get('inflationRate') || '2.5'));
    const [propertyPriceGrowthRate, setPropertyPriceGrowthRate] = useState(() => parseFloat(Cookies.get('propertyPriceGrowthRate') || '3.0'));

    const translations = {
      en: {
        title: "Real Estate Investment Simulator",
        loanSettings: "Loan Settings",
        initialLoan: "Personal Contribution (€)",
        loanDuration: "Loan Duration (years)",
        loanInterestRate: "Loan Interest Rate (%)",
        loanInsuranceRate: "Loan Insurance Rate (%)",
        loanInitialFees: "Loan Initial Fees (€)",
        propertySettings: "Property Purchase Settings",
        propertyPrice: "Property Price (€)",
        notaryFees: "Notary Fees (€)",
        agencyFees: "Real Estate Agency Fees (€)",
        surveyFees: "Survey Fees (€)",
        maintenanceBudget: "Maintenance Budget (€/year)",
        renovationCosts: "Renovation Costs (€)",
        propertySize: "Property Size (m²)",
        rentalSettings: "Rental Settings",
        rentalPriceMonthly: "Monthly Rental Price (€)",
        rentalGrowthRate: "Rental Price Growth Rate (%)",
        vacancyRate: "Vacancy Rate (months/year)",
        coproCharges: "Co-ownership Charges (€/month)",
        pnoInsurance: "PNO Insurance (€/month)",
        accountingFees: "Accounting Fees (€/month)",
        cgaFees: "CGA Fees (€/month)",
        bankFees: "Bank Fees (€/month)",
        waterBill: "Water Bill (€/month)",
        electricityBill: "Electricity Bill (€/month)",
        gasBill: "Gas Bill (€/month)",
        internetBill: "Internet Bill (€/month)",
        cfeTax: "CFE Tax (€/month)",
        propertyTax: "Property Tax (€/month)",
        otherCharges: "Other Charges (€/month)",
        economicFactors: "Economic Factors",
        inflationRate: "Average Inflation Rate (%)",
        propertyPriceGrowthRate: "Property Price Growth Rate (%)",
        results: "Investment Results",
        totalInvestmentCost: "Total Investment Cost",
        totalBorrowedAmount: "Total Borrowed Amount",
        initialCashNeeded: "Initial Cash Required",
        propertyValue: "Property Value",
        cashFlow: "Annual Cash Flow",
        taxes: "Annual Taxes",
        cashBalance: "Cash Balance",
        monthlyDeficit: "Monthly Payment Deficit",
        totalValue: "Total Value",
        presentValue: "Present Value",
        grossYield: "Gross Yield",
        netYield: "Net Yield",
        yearlyEvolution: "Yearly Evolution",
        year: "Year",
        switchLanguage: "Switch to French"
      },
      fr: {
        title: "Simulateur d'Investissement Immobilier",
        loanSettings: "Paramètres du Prêt",
        initialLoan: "Apport Personnel (€)",
        loanDuration: "Durée du Prêt (années)",
        loanInterestRate: "Taux d'Intérêt du Prêt (%)",
        loanInsuranceRate: "Taux d'Assurance du Prêt (%)",
        loanInitialFees: "Frais de Dossier (€)",
        propertySettings: "Paramètres d'Achat du Bien",
        propertyPrice: "Prix du Bien (€)",
        notaryFees: "Frais de Notaire (€)",
        agencyFees: "Frais d'Agence Immobilière (€)",
        surveyFees: "Frais d'État des Lieux (€)",
        maintenanceBudget: "Budget de Maintenance (€/an)",
        renovationCosts: "Coûts de Rénovation (€)",
        propertySize: "Surface du Bien (m²)",
        rentalSettings: "Paramètres de Location",
        rentalPriceMonthly: "Prix de Location Mensuel (€)",
        rentalGrowthRate: "Taux de Croissance du Loyer (%)",
        vacancyRate: "Taux de Vacance (mois/an)",
        coproCharges: "Charges de Copropriété (€/mois)",
        pnoInsurance: "Assurance PNO (€/mois)",
        accountingFees: "Frais de Comptabilité (€/mois)",
        cgaFees: "Frais CGA (€/mois)",
        bankFees: "Frais Bancaires (€/mois)",
        waterBill: "Facture d'Eau (€/mois)",
        electricityBill: "Facture d'Électricité (€/mois)",
        gasBill: "Facture de Gaz (€/mois)",
        internetBill: "Facture d'Internet (€/mois)",
        cfeTax: "Taxe CFE (€/mois)",
        propertyTax: "Taxe Foncière (€/mois)",
        otherCharges: "Autres Charges (€/mois)",
        economicFactors: "Facteurs Économiques",
        inflationRate: "Taux d'Inflation Moyen (%)",
        propertyPriceGrowthRate: "Taux de Croissance du Prix du Bien (%)",
        results: "Résultats de l'Investissement",
        totalInvestmentCost: "Coût Total de l'Investissement",
        totalBorrowedAmount: "Montant Total Emprunté",
        initialCashNeeded: "Trésorerie Initiale Requise",
        propertyValue: "Valeur du Bien",
        cashFlow: "Flux de Trésorerie Annuel",
        taxes: "Taxes Annuelles",
        cashBalance: "Solde de Trésorerie",
        monthlyDeficit: "Déficit des Paiements Mensuels",
        totalValue: "Valeur Totale",
        presentValue: "Valeur Actuelle",
        grossYield: "Rendement Brut",
        netYield: "Rendement Net",
        yearlyEvolution: "Évolution Annuelle",
        year: "Année",
        switchLanguage: "Afficher en Anglais"
      }
    };

    const t = translations[language];

    useEffect(() => {
      Cookies.set('language', language.toString(), { expires: 365 });
      Cookies.set('initialLoan', personalContribution.toString(), { expires: 365 });
      Cookies.set('loanDuration', loanDuration.toString(), { expires: 365 });
      Cookies.set('loanInterestRate', loanInterestRate.toString(), { expires: 365 });
      Cookies.set('loanInsuranceRate', loanInsuranceRate.toString(), { expires: 365 });
      Cookies.set('loanInitialFees', loanInitialFees.toString(), { expires: 365 });
      Cookies.set('propertyPrice', propertyPrice.toString(), { expires: 365 });
      Cookies.set('notaryFees', notaryFees.toString(), { expires: 365 });
      Cookies.set('agencyFees', agencyFees.toString(), { expires: 365 });
      Cookies.set('surveyFees', surveyFees.toString(), { expires: 365 });
      Cookies.set('maintenanceBudget', maintenanceBudget.toString(), { expires: 365 });
      Cookies.set('renovationCosts', renovationCosts.toString(), { expires: 365 });
      Cookies.set('propertySize', propertySize.toString(), { expires: 365 });
      Cookies.set('rentalPriceMonthly', rentalPriceMonthly.toString(), { expires: 365 });
      Cookies.set('rentalGrowthRate', rentalGrowthRate.toString(), { expires: 365 });
      Cookies.set('vacancyRate', vacancyRate.toString(), { expires: 365 });
      Cookies.set('coproCharges', coproCharges.toString(), { expires: 365 });
      Cookies.set('pnoInsurance', pnoInsurance.toString(), { expires: 365 });
      Cookies.set('accountingFees', accountingFees.toString(), { expires: 365 });
      Cookies.set('cgaFees', cgaFees.toString(), { expires: 365 });
      Cookies.set('bankFees', bankFees.toString(), { expires: 365 });
      Cookies.set('waterBill', waterBill.toString(), { expires: 365 });
      Cookies.set('electricityBill', electricityBill.toString(), { expires: 365 });
      Cookies.set('gasBill', gasBill.toString(), { expires: 365 });
      Cookies.set('internetBill', internetBill.toString(), { expires: 365 });
      Cookies.set('cfeTax', cfeTax.toString(), { expires: 365 });
      Cookies.set('propertyTax', propertyTax.toString(), { expires: 365 });
      Cookies.set('otherCharges', otherCharges.toString(), { expires: 365 });
      Cookies.set('inflationRate', inflationRate.toString(), { expires: 365 });
      Cookies.set('propertyPriceGrowthRate', propertyPriceGrowthRate.toString(), { expires: 365 });
    }, [
      personalContribution, loanDuration, loanInterestRate, loanInsuranceRate, loanInitialFees,
      propertyPrice, notaryFees, agencyFees, surveyFees, maintenanceBudget, renovationCosts, propertySize,
      rentalPriceMonthly, rentalGrowthRate, vacancyRate, coproCharges, pnoInsurance, accountingFees,
      cgaFees, bankFees, waterBill, electricityBill, gasBill, internetBill, cfeTax, propertyTax,
      otherCharges, inflationRate, propertyPriceGrowthRate
    ]);

    const calculateMonthlyLoanPayment = () => {
      const borrowedAmount = propertyPrice + notaryFees + agencyFees + surveyFees + renovationCosts + loanInitialFees - personalContribution;
      const monthlyInterestRate = (loanInterestRate / 100) / 12;
      const numberOfPayments = loanDuration * 12;
      const monthlyPayment = borrowedAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      const insuranceMonthly = (borrowedAmount * (loanInsuranceRate / 100)) / 12;
      return (monthlyPayment + insuranceMonthly).toFixed(2);
    };

    const calculateYearlyEvolution = () => {
      const results = [];
      let currentPropertyPrice = propertyPrice;
      let currentRentalPriceMonthly = rentalPriceMonthly;
      const propGrowthRate = (propertyPriceGrowthRate || 0) / 100;
      const rentGrowthRate = (rentalGrowthRate || 0) / 100;
      const inflation = (inflationRate || 0) / 100;
      const monthlyLoanPayment = parseFloat(calculateMonthlyLoanPayment());
      const totalMonthlyCharges = coproCharges + pnoInsurance + accountingFees + cgaFees + bankFees +
                                 waterBill + electricityBill + gasBill + internetBill + cfeTax +
                                 propertyTax + otherCharges;
      let remainingLoan = personalContribution;
      const monthlyInterestRate = (loanInterestRate / 100) / 12;
      let cashBalance = -(notaryFees + agencyFees + surveyFees + renovationCosts + loanInitialFees);

      for (let year = 1; year <= loanDuration; year++) {
        currentPropertyPrice *= (1 + propGrowthRate);
        currentRentalPriceMonthly *= (1 + rentGrowthRate);
        const annualRentalIncome = currentRentalPriceMonthly * (12 - vacancyRate);
        const annualCharges = totalMonthlyCharges * 12 + maintenanceBudget;
        const annualLoanPayments = monthlyLoanPayment * 12;
        const annualTaxes = (annualRentalIncome * 0.3).toFixed(2); // Simplified 30% tax rate
        const cashFlow = annualRentalIncome - annualCharges - annualTaxes - annualLoanPayments;
        cashBalance += cashFlow;

        // Calculate remaining loan balance
        for (let month = 0; month < 12; month++) {
          const interest = remainingLoan * monthlyInterestRate;
          const principal = monthlyLoanPayment - interest;
          remainingLoan -= principal;
        }

        const monthlyDeficit = annualLoanPayments - annualRentalIncome > 0 ? (annualLoanPayments - annualRentalIncome) / 12 : 0;
        const totalValue = currentPropertyPrice + cashBalance - remainingLoan;
        const presentValue = totalValue / Math.pow(1 + inflation, year);

        results.push({
          year,
          propertyValue: currentPropertyPrice,
          cashFlow,
          taxes: parseFloat(annualTaxes),
          cashBalance,
          monthlyDeficit,
          totalValue,
          presentValue
        });
      }
      return results;
    };

    const calculateYields = () => {
      const annualRentalIncome = rentalPriceMonthly * (12 - vacancyRate);
      const totalMonthlyCharges = coproCharges + pnoInsurance + accountingFees + cgaFees + bankFees +
                                 waterBill + electricityBill + gasBill + internetBill + cfeTax +
                                 propertyTax + otherCharges;
      const annualCharges = totalMonthlyCharges * 12 + maintenanceBudget;
      const totalInvestment = propertyPrice + notaryFees + agencyFees + surveyFees + renovationCosts + loanInitialFees;
      const grossYield = ((annualRentalIncome / totalInvestment) * 100).toFixed(2);
      const netYield = ((annualRentalIncome - annualCharges) / totalInvestment * 100).toFixed(2);
      return { grossYield, netYield };
    };

    const rateOptions = Array.from({ length: 201 }, (_, i) => (i / 10).toFixed(1));

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-800">{t.title}</h4>
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {t.switchLanguage}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Settings Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Loan Settings */}
              <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                <h6 className="font-medium text-gray-800">{t.loanSettings}</h6>
                <div>
                  <label htmlFor="initialLoan" className="block text-sm font-medium text-gray-700">{t.initialLoan}</label>
                  <input
                    type="number"
                    id="initialLoan"
                    value={personalContribution}
                    onChange={(e) => setPersonalContribution(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="loanDuration" className="block text-sm font-medium text-gray-700">{t.loanDuration}</label>
                  <select
                    id="loanDuration"
                    value={loanDuration}
                    onChange={(e) => setLoanDuration(parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {Array.from({length: 30}, (_, i) => (
                      <option key={i+1} value={i+1}>{i+1} years</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="loanInterestRate" className="block text-sm font-medium text-gray-700">{t.loanInterestRate}</label>
                  <select
                    id="loanInterestRate"
                    value={loanInterestRate.toFixed(1)}
                    onChange={(e) => setLoanInterestRate(parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {rateOptions.map(rate => <option key={rate} value={rate}>{rate}%</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="loanInsuranceRate" className="block text-sm font-medium text-gray-700">{t.loanInsuranceRate}</label>
                  <select
                    id="loanInsuranceRate"
                    value={loanInsuranceRate.toFixed(1)}
                    onChange={(e) => setLoanInsuranceRate(parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {rateOptions.map(rate => <option key={rate} value={rate}>{rate}%</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="loanInitialFees" className="block text-sm font-medium text-gray-700">{t.loanInitialFees}</label>
                  <input
                    type="number"
                    id="loanInitialFees"
                    value={loanInitialFees}
                    onChange={(e) => setLoanInitialFees(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Property Purchase Settings */}
              <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                <h6 className="font-medium text-gray-800">{t.propertySettings}</h6>
                <div>
                  <label htmlFor="propertyPrice" className="block text-sm font-medium text-gray-700">{t.propertyPrice}</label>
                  <input
                    type="number"
                    id="propertyPrice"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="notaryFees" className="block text-sm font-medium text-gray-700">{t.notaryFees}</label>
                  <input
                    type="number"
                    id="notaryFees"
                    value={notaryFees}
                    onChange={(e) => setNotaryFees(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="agencyFees" className="block text-sm font-medium text-gray-700">{t.agencyFees}</label>
                  <input
                    type="number"
                    id="agencyFees"
                    value={agencyFees}
                    onChange={(e) => setAgencyFees(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="surveyFees" className="block text-sm font-medium text-gray-700">{t.surveyFees}</label>
                  <input
                    type="number"
                    id="surveyFees"
                    value={surveyFees}
                    onChange={(e) => setSurveyFees(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="maintenanceBudget" className="block text-sm font-medium text-gray-700">{t.maintenanceBudget}</label>
                  <input
                    type="number"
                    id="maintenanceBudget"
                    value={maintenanceBudget}
                    onChange={(e) => setMaintenanceBudget(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="renovationCosts" className="block text-sm font-medium text-gray-700">{t.renovationCosts}</label>
                  <input
                    type="number"
                    id="renovationCosts"
                    value={renovationCosts}
                    onChange={(e) => setRenovationCosts(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="propertySize" className="block text-sm font-medium text-gray-700">{t.propertySize}</label>
                  <input
                    type="number"
                    id="propertySize"
                    value={propertySize}
                    onChange={(e) => setPropertySize(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Rental Settings Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Main Rental Settings */}
              <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                <h6 className="font-medium text-gray-800">{t.rentalSettings}</h6>
                <div>
                  <label htmlFor="rentalPriceMonthly" className="block text-sm font-medium text-gray-700">{t.rentalPriceMonthly}</label>
                  <input
                    type="number"
                    id="rentalPriceMonthly"
                    value={rentalPriceMonthly}
                    onChange={(e) => setRentalPriceMonthly(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="rentalGrowthRate" className="block text-sm font-medium text-gray-700">{t.rentalGrowthRate}</label>
                  <select
                    id="rentalGrowthRate"
                    value={rentalGrowthRate.toFixed(1)}
                    onChange={(e) => setRentalGrowthRate(parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {rateOptions.map(rate => <option key={rate} value={rate}>{rate}%</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="vacancyRate" className="block text-sm font-medium text-gray-700">{t.vacancyRate}</label>
                  <select
                    id="vacancyRate"
                    value={vacancyRate}
                    onChange={(e) => setVacancyRate(parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {Array.from({length: 13}, (_, i) => (
                      <option key={i} value={i}>{i} months</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Rental Settings */}
              <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                <h6 className="font-medium text-gray-800">{t.rentalSettings}</h6>
                <div>
                  <label htmlFor="coproCharges" className="block text-sm font-medium text-gray-700">{t.coproCharges}</label>
                  <input
                    type="number"
                    id="coproCharges"
                    value={coproCharges}
                    onChange={(e) => setCoproCharges(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="pnoInsurance" className="block text-sm font-medium text-gray-700">{t.pnoInsurance}</label>
                  <input
                    type="number"
                    id="pnoInsurance"
                    value={pnoInsurance}
                    onChange={(e) => setPnoInsurance(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="accountingFees" className="block text-sm font-medium text-gray-700">{t.accountingFees}</label>
                  <input
                    type="number"
                    id="accountingFees"
                    value={accountingFees}
                    onChange={(e) => setAccountingFees(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="cgaFees" className="block text-sm font-medium text-gray-700">{t.cgaFees}</label>
                  <input
                    type="number"
                    id="cgaFees"
                    value={cgaFees}
                    onChange={(e) => setCgaFees(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="bankFees" className="block text-sm font-medium text-gray-700">{t.bankFees}</label>
                  <input
                    type="number"
                    id="bankFees"
                    value={bankFees}
                    onChange={(e) => setBankFees(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="waterBill" className="block text-sm font-medium text-gray-700">{t.waterBill}</label>
                  <input
                    type="number"
                    id="waterBill"
                    value={waterBill}
                    onChange={(e) => setWaterBill(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="electricityBill" className="block text-sm font-medium text-gray-700">{t.electricityBill}</label>
                  <input
                    type="number"
                    id="electricityBill"
                    value={electricityBill}
                    onChange={(e) => setElectricityBill(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="gasBill" className="block text-sm font-medium text-gray-700">{t.gasBill}</label>
                  <input
                    type="number"
                    id="gasBill"
                    value={gasBill}
                    onChange={(e) => setGasBill(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="internetBill" className="block text-sm font-medium text-gray-700">{t.internetBill}</label>
                  <input
                    type="number"
                    id="internetBill"
                    value={internetBill}
                    onChange={(e) => setInternetBill(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="cfeTax" className="block text-sm font-medium text-gray-700">{t.cfeTax}</label>
                  <input
                    type="number"
                    id="cfeTax"
                    value={cfeTax}
                    onChange={(e) => setCfeTax(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="propertyTax" className="block text-sm font-medium text-gray-700">{t.propertyTax}</label>
                  <input
                    type="number"
                    id="propertyTax"
                    value={propertyTax}
                    onChange={(e) => setPropertyTax(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="otherCharges" className="block text-sm font-medium text-gray-700">{t.otherCharges}</label>
                  <input
                    type="number"
                    id="otherCharges"
                    value={otherCharges}
                    onChange={(e) => setOtherCharges(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Economic Factors */}
            <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
              <h6 className="font-medium text-gray-800">{t.economicFactors}</h6>
              <div>
                <label htmlFor="inflationRate" className="block text-sm font-medium text-gray-700">{t.inflationRate}</label>
                <select
                  id="inflationRate"
                  value={inflationRate.toFixed(1)}
                  onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {rateOptions.map(rate => <option key={rate} value={rate}>{rate}%</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="propertyPriceGrowthRate" className="block text-sm font-medium text-gray-700">{t.propertyPriceGrowthRate}</label>
                <select
                  id="propertyPriceGrowthRate"
                  value={propertyPriceGrowthRate.toFixed(1)}
                  onChange={(e) => setPropertyPriceGrowthRate(parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {rateOptions.map(rate => <option key={rate} value={rate}>{rate}%</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col p-6 bg-gray-50 rounded-lg border border-gray-200" style={{ height: 'fit-content' }}>
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-gray-800">{t.results}</h5>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">{t.totalInvestmentCost}:</p>
                <p className="text-2xl font-bold text-blue-600">
                  €{(propertyPrice + notaryFees + agencyFees + surveyFees + renovationCosts + loanInitialFees).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">{t.totalBorrowedAmount}:</p>
                <p className="text-2xl font-bold text-blue-600">
                  €{(propertyPrice + notaryFees + agencyFees + surveyFees + renovationCosts + loanInitialFees - personalContribution).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">{t.initialCashNeeded}:</p>
                <p className="text-2xl font-bold text-green-600">
                  €{personalContribution.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">{t.propertyValue} (Year {loanDuration}):</p>
                <p className="text-2xl font-bold text-blue-600">
                  €{calculateYearlyEvolution()[loanDuration-1]?.propertyValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">{t.totalValue} (Year {loanDuration}):</p>
                <p className="text-2xl font-bold text-blue-600">
                  €{calculateYearlyEvolution()[loanDuration-1]?.totalValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">{t.presentValue} (Year {loanDuration}):</p>
                <p className="text-2xl font-bold text-green-600">
                  €{calculateYearlyEvolution()[loanDuration-1]?.presentValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">{t.grossYield}:</p>
                <p className="text-2xl font-bold text-purple-600">{calculateYields().grossYield}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">{t.netYield}:</p>
                <p className="text-2xl font-bold text-purple-600">{calculateYields().netYield}%</p>
              </div>
            </div>

            <div className="flex-1 mt-6">
              <h6 className="font-medium text-gray-800 mb-3">{t.yearlyEvolution}</h6>
              <div className="overflow-auto" style={{ height: '520px' }}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.year}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.propertyValue}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.cashFlow}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.taxes}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.cashBalance}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.monthlyDeficit}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.totalValue}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.presentValue}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {calculateYearlyEvolution().map((data) => (
                      <tr key={data.year}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          €{data.propertyValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          €{data.cashFlow.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          €{data.taxes.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          €{data.cashBalance.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          €{data.monthlyDeficit.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          €{data.totalValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          €{data.presentValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
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

export default RealEstate;