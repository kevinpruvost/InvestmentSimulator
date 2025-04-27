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
    const [simulationDuration, setSimulationDuration] = useState(() => parseInt(Cookies.get('simulationDuration') || '30'));
    const [agencyManagementFee, setAgencyManagementFee] = useState(() => parseFloat(Cookies.get('agencyManagementFee') || '5.0'));

    const [propertyType, setPropertyType] = useState(() => Cookies.get('propertyType') || 'Furnished');
    const [furnitureValue, setFurnitureValue] = useState(() => parseFloat(Cookies.get('furnitureValue') || '0'));
    const [propertyAmortizationPeriod, setPropertyAmortizationPeriod] = useState(() => parseInt(Cookies.get('propertyAmortizationPeriod') || '30'));
    const [furnitureAmortizationPeriod, setFurnitureAmortizationPeriod] = useState(() => parseInt(Cookies.get('furnitureAmortizationPeriod') || '7'));
    const [incomeTaxRate, setIncomeTaxRate] = useState(() => parseFloat(Cookies.get('incomeTaxRate') || '30'));
    const [socialChargesRate, setSocialChargesRate] = useState(() => parseFloat(Cookies.get('socialChargesRate') || '17.2'));
    const [corporateTaxRate, setCorporateTaxRate] = useState(() => parseFloat(Cookies.get('corporateTaxRate') || '25'));
    const [taxSystem, setTaxSystem] = useState(() => Cookies.get('taxSystem') || 'Default');

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
        initialCashNeeded: "Personal Contribution",
        totalInvestmentValueWithoutInflation: "Total investment Value without inflation",
        propertyValue: "Property Value",
        propertyValueAfterInflation: "Property Value After Inflation",
        cashFlow: "Annual Cash Flow",
        taxes: "Annual Taxes",
        cashBalance: "Cash Balance",
        cashBalanceAfterInflation: "Cash Balance After Inflation",
        totalValue: "Total Value",
        presentValue: "Present Value",
        grossYield: "Gross Yield",
        netYield: "Net Yield",
        yearlyEvolution: "Yearly Evolution",
        year: "Year",
        switchLanguage: "Switch to French",
        rentalIncomeSettings: "Rental Income Settings",
        rentalExpensesSettings: "Rental Expenses Settings",
        simulationDuration: "Simulation Duration (years)",
        propertyRentability: "Property Rentability",
        monthlyFees: "Monthly Fees",
        monthlyPayment: "Monthly Payment",
        yearlyFees: "Yearly Fees",
        initialInvestment: "Initial Investment",
        investmentEvolution: "Investment Evolution",
        totalInvestmentAfterInflation: "Total Investment Value After Inflation",
        actualMoneySpentAfterInflation: "Actual Money Spent For The Investment After Inflation",
        agencyManagementFee: "Agency Management Fee (%)",
        actualMoneySpentDescription: "This represents the actual value of all money paid to the bank over time (personal contribution at the beginning, so without inflation + monthly payments with inflation applied gradually)",
        propertyType: "Property Type",
        furnished: "Furnished",
        unfurnished: "Unfurnished",
        furnitureValue: "Furniture Value (€)",
        propertyAmortizationPeriod: "Property Amortization Period (years)",
        furnitureAmortizationPeriod: "Furniture Amortization Period (years)",
        incomeTaxRate: "Income Tax Rate (%)",
        socialChargesRate: "Social Charges Rate (%)",
        corporateTaxRate: "Corporate Tax Rate (%)",
        taxSystem: "Tax System",
        defaultTax: "Default: 30% of revenues",
        lmnpReel: "French LMNP Reel",
        lmnpMicroBIC: "French LMNP Micro BIC",
        lmpReel: "French LMP Reel",
        lmpMicroBIC: "French LMP Micro BIC",
        sciIS: "French SCI IS",
        sciIR: "French SCI IR",
        locationNueReel: "French Location Nue Reel",
        locationNueMicro: "French Location Nue Micro",
        rentalIncome: "Rental Income",
        charges: "Charges",
        loanPayments: "Loan Payments",
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
        initialCashNeeded: "Apport Personnel",
        totalInvestmentValueWithoutInflation: "Investissement Total sans Inflation",
        propertyValue: "Valeur du Bien",
        propertyValueAfterInflation: "Valeur du Bien Après Inflation",
        cashFlow: "Flux de Trésorerie Annuel",
        taxes: "Taxes Annuelles",
        cashBalance: "Solde de Trésorerie",
        cashBalanceAfterInflation: "Cash Balance After Inflation",
        totalValue: "Valeur Totale",
        presentValue: "Valeur Actuelle",
        grossYield: "Rendement Brut",
        netYield: "Rendement Net",
        yearlyEvolution: "Évolution Annuelle",
        year: "Année",
        switchLanguage: "Afficher en Anglais",
        rentalIncomeSettings: "Revenus Locatifs",
        rentalExpensesSettings: "Charges Locatives",
        simulationDuration: "Durée de Simulation (années)",
        propertyRentability: "Rentabilité du Bien",
        monthlyFees: "Charges Mensuelles",
        monthlyPayment: "Mensualités",
        yearlyFees: "Charges Annuelles",
        initialInvestment: "Investissement Initial",
        investmentEvolution: "Évolution de l'Investissement",
        totalInvestmentAfterInflation: "Valeur Totale de l'Investissement Après Inflation",
        actualMoneySpentAfterInflation: "Dépense Réelle de l'Investissement initial Après Inflation",
        agencyManagementFee: "Frais de Gestion d'Agence (%)",
        actualMoneySpentDescription: "Cela représente la valeur réelle de tout l'argent versé à la banque au fil du temps (apport personnel au début, donc sans inflation + mensualités avec inflation appliquée progressivement)",
        propertyType: "Type de Bien",
        furnished: "Meublé",
        unfurnished: "Non Meublé",
        furnitureValue: "Valeur du Mobilier (€)",
        propertyAmortizationPeriod: "Période d'Amortissement du Bien (années)",
        furnitureAmortizationPeriod: "Période d'Amortissement du Mobilier (années)",
        incomeTaxRate: "Taux d'Impôt sur le Revenu (%)",
        socialChargesRate: "Taux de Charges Sociales (%)",
        corporateTaxRate: "Taux d'Impôt sur les Sociétés (%)",
        taxSystem: "Régime Fiscal",
        defaultTax: "Défaut : 30% des revenus",
        lmnpReel: "LMNP Réel",
        lmnpMicroBIC: "LMNP Micro BIC",
        lmpReel: "LMP Réel",
        lmpMicroBIC: "LMP Micro BIC",
        sciIS: "SCI IS",
        sciIR: "SCI IR",
        locationNueReel: "Location Nue Réel",
        locationNueMicro: "Location Nue Micro",
        rentalIncome: "Revenus Locatifs",
        charges: "Charges",
        loanPayments: "Mensualités du Prêt",
      }
    };

    const calculateProgressiveInflationValue = (value, years) => {
      const yearlyAmount = value / years;
      let totalInflatedValue = 0;
      for (let year = 0; year < years; year++) {
        totalInflatedValue += yearlyAmount / Math.pow(1 + inflationRate / 100, year);
      }
      return totalInflatedValue;
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
      Cookies.set('simulationDuration', simulationDuration.toString(), { expires: 365 });
      Cookies.set('agencyManagementFee', agencyManagementFee.toString(), { expires: 365 });
      Cookies.set('propertyType', propertyType, { expires: 365 });
      Cookies.set('furnitureValue', furnitureValue.toString(), { expires: 365 });
      Cookies.set('propertyAmortizationPeriod', propertyAmortizationPeriod.toString(), { expires: 365 });
      Cookies.set('furnitureAmortizationPeriod', furnitureAmortizationPeriod.toString(), { expires: 365 });
      Cookies.set('incomeTaxRate', incomeTaxRate.toString(), { expires: 365 });
      Cookies.set('socialChargesRate', socialChargesRate.toString(), { expires: 365 });
      Cookies.set('corporateTaxRate', corporateTaxRate.toString(), { expires: 365 });
      Cookies.set('taxSystem', taxSystem, { expires: 365 });
    }, [
      personalContribution, loanDuration, loanInterestRate, loanInsuranceRate, loanInitialFees,
      propertyPrice, notaryFees, agencyFees, surveyFees, maintenanceBudget, renovationCosts, propertySize,
      rentalPriceMonthly, rentalGrowthRate, vacancyRate, coproCharges, pnoInsurance, accountingFees,
      cgaFees, bankFees, waterBill, electricityBill, gasBill, internetBill, cfeTax, propertyTax,
      otherCharges, inflationRate, propertyPriceGrowthRate, simulationDuration, agencyManagementFee,
      propertyType, furnitureValue, propertyAmortizationPeriod, furnitureAmortizationPeriod,
      incomeTaxRate, socialChargesRate, corporateTaxRate, taxSystem
    ]);

    const calculateMonthlyLoanPayment = () => {
      const borrowedAmount = propertyPrice + notaryFees + agencyFees + surveyFees + renovationCosts + loanInitialFees - personalContribution;
      const monthlyInterestRate = (loanInterestRate / 100) / 12;
      const numberOfPayments = loanDuration * 12;
      const monthlyPayment = borrowedAmount * (monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments))); 
      const insuranceMonthly = borrowedAmount * (loanInsuranceRate / 100) / 12;
      return (monthlyPayment + insuranceMonthly).toFixed(2);
    };

    const calculateYearlyEvolution = () => {
      const results = [];
      let currentPropertyPrice = propertyPrice || 0;
      let currentRentalPriceMonthly = rentalPriceMonthly || 0;
      const propGrowthRate = (propertyPriceGrowthRate || 0) / 100;
      const rentGrowthRate = (rentalGrowthRate || 0) / 100;
      const inflation = (inflationRate || 0) / 100;
      const monthlyLoanPayment = parseFloat(calculateMonthlyLoanPayment());
      const insuranceMonthly = (propertyPrice || 0) * (loanInsuranceRate || 0) / 100 / 12;
      const totalMonthlyCharges = (coproCharges || 0) + (pnoInsurance || 0) + (accountingFees || 0) + 
                                 (cgaFees || 0) + (bankFees || 0) + (waterBill || 0) + 
                                 (electricityBill || 0) + (gasBill || 0) + (internetBill || 0) + 
                                 (cfeTax || 0) + (propertyTax || 0) + (otherCharges || 0);
      let remainingLoan = (propertyPrice || 0) + (notaryFees || 0) + (agencyFees || 0) + 
                          (surveyFees || 0) + (renovationCosts || 0) + (loanInitialFees || 0) - 
                          (personalContribution || 0);
      const monthlyInterestRate = (loanInterestRate || 0) / 100 / 12;
      let cashBalance = 0;
    
      for (let year = 1; year <= (simulationDuration || 1); year++) {
        currentPropertyPrice *= (1 + propGrowthRate);
        currentRentalPriceMonthly *= (1 + rentGrowthRate);
        const annualRentalIncome = currentRentalPriceMonthly * (12 - (vacancyRate || 0)) * 
                                  (1 - (agencyManagementFee || 0) / 100);
        const annualCharges = (totalMonthlyCharges * 12 + (maintenanceBudget || 0)) * Math.pow(1 + inflation, year - 1);
        const annualLoanPayments = year <= loanDuration ? (monthlyLoanPayment + insuranceMonthly) * 12 : 0;
        console.log("Annual Loan Payments: ", monthlyLoanPayment, insuranceMonthly, annualLoanPayments);
    
        // Calculate annual interest and insurance
        let annualInterest = 0;
        let annualInsurance = year <= (loanDuration || 1) ? insuranceMonthly * 12 : 0;
        if (year <= (loanDuration || 1)) {
          for (let month = 0; month < 12; month++) {
            const interest = remainingLoan * monthlyInterestRate;
            const principal = monthlyLoanPayment - interest;
            remainingLoan -= principal;
            annualInterest += isNaN(interest) ? 0 : interest;
          }
        }
    
        // Determine if amortization is allowed
        let allowAmortization = false;
        if ((taxSystem === 'French LMNP Reel' || taxSystem === 'French LMP Reel') && propertyType === 'Furnished') {
          allowAmortization = true;
        } else if (taxSystem === 'French SCI IS') {
          allowAmortization = true;
        } else if (taxSystem === 'French SCI IR' && propertyType === 'Furnished') {
          allowAmortization = true;
        }
    
        // Calculate annual amortization with validation
        let annualAmortization = 0;
        if (allowAmortization && year <= (propertyAmortizationPeriod || 30)) {
          const safePropertyPeriod = (propertyAmortizationPeriod || 30) > 0 ? propertyAmortizationPeriod || 30 : 30;
          const safeFurniturePeriod = (furnitureAmortizationPeriod || 7) > 0 ? furnitureAmortizationPeriod || 7 : 7;
          const propertyAmortization = (propertyPrice || 0) / safePropertyPeriod;
          const furnitureAmortization = (propertyType === 'Furnished' && year <= safeFurniturePeriod) 
                                       ? (furnitureValue || 0) / safeFurniturePeriod : 0;
          annualAmortization = propertyAmortization + furnitureAmortization;
        }
    
        // Calculate deductible expenses
        let deductibleExpenses = annualCharges + annualInterest + annualInsurance;
        if (allowAmortization) {
          deductibleExpenses += isNaN(annualAmortization) ? 0 : annualAmortization;
        }
    
        // Calculate taxes based on tax system with validation
        let taxes = 0;
        const safeIncomeTaxRate = (incomeTaxRate || 30) / 100;
        const safeSocialChargesRate = (socialChargesRate || 17.2) / 100;
        const safeCorporateTaxRate = (corporateTaxRate || 25) / 100;
        if (taxSystem === 'Default') {
          taxes = annualRentalIncome * 0.3;
        } else if (taxSystem === 'French LMNP Micro BIC' && propertyType === 'Furnished') {
          const taxableIncome = annualRentalIncome * 0.5; // 50% deduction
          taxes = (taxableIncome * safeIncomeTaxRate) + (taxableIncome * safeSocialChargesRate);
        } else if (taxSystem === 'French LMP Micro BIC' && propertyType === 'Furnished') {
          const taxableIncome = annualRentalIncome * 0.5; // 50% deduction
          taxes = (taxableIncome * safeIncomeTaxRate) + (taxableIncome * safeSocialChargesRate);
        } else if (taxSystem === 'French Location Nue Micro' && propertyType === 'Unfurnished') {
          const taxableIncome = annualRentalIncome * 0.7; // 30% deduction
          taxes = (taxableIncome * safeIncomeTaxRate) + (taxableIncome * safeSocialChargesRate);
        } else if ((taxSystem === 'French LMNP Reel' || taxSystem === 'French LMP Reel') && propertyType === 'Furnished') {
          const taxableIncome = Math.max(0, annualRentalIncome - deductibleExpenses);
          taxes = (taxableIncome * safeIncomeTaxRate) + (taxableIncome * safeSocialChargesRate);
        } else if (taxSystem === 'French Location Nue Reel' && propertyType === 'Unfurnished') {
          const taxableIncome = Math.max(0, annualRentalIncome - (annualCharges + annualInterest + annualInsurance));
          taxes = (taxableIncome * safeIncomeTaxRate) + (taxableIncome * safeSocialChargesRate);
        } else if (taxSystem === 'French SCI IS') {
          const taxableIncome = Math.max(0, annualRentalIncome - deductibleExpenses);
          taxes = taxableIncome * safeCorporateTaxRate;
        } else if (taxSystem === 'French SCI IR') {
          const taxableIncome = Math.max(0, annualRentalIncome - deductibleExpenses);
          taxes = (taxableIncome * safeIncomeTaxRate) + (taxableIncome * safeSocialChargesRate);
        }
    
        // Ensure taxes is not NaN
        taxes = isNaN(taxes) ? 0 : taxes;
    
        const cashFlow = annualRentalIncome - annualCharges - taxes - annualLoanPayments;
        cashBalance += isNaN(cashFlow) ? 0 : cashFlow;
    
        const totalValue = currentPropertyPrice + cashBalance - (year <= (loanDuration || 1) ? remainingLoan : 0);
        const presentValue = totalValue / Math.pow(1 + inflation, year);
        const cashBalanceAfterInflation = cashBalance / Math.pow(1 + inflation, year);
    
        results.push({
          year,
          propertyValue: isNaN(currentPropertyPrice) ? 0 : currentPropertyPrice,
          rentalIncome: isNaN(annualRentalIncome) ? 0 : annualRentalIncome,
          charges: isNaN(annualCharges) ? 0 : annualCharges,
          loanPayments: isNaN(annualLoanPayments) ? 0 : annualLoanPayments,
          cashFlow: isNaN(cashFlow) ? 0 : cashFlow,
          taxes: taxes,
          cashBalance: isNaN(cashBalance) ? 0 : cashBalance,
          cashBalanceAfterInflation: isNaN(cashBalanceAfterInflation) ? 0 : cashBalanceAfterInflation,
          totalValue: isNaN(totalValue) ? 0 : totalValue,
          presentValue: isNaN(presentValue) ? 0 : presentValue
        });
      }
      return results;
    };

    const calculateYields = () => {
      // Calculate annual rental income WITHOUT considering agency management fee for gross yield
      const annualRentalIncomeGross = rentalPriceMonthly * (12);
      // Calculate annual rental income WITH agency management fee for net yield
      const annualRentalIncomeNet = rentalPriceMonthly * (12 - vacancyRate) * (1 - agencyManagementFee / 100);
      
      // Calculate total annual charges
      const totalMonthlyCharges = coproCharges + pnoInsurance + accountingFees + cgaFees + bankFees +
                                 waterBill + electricityBill + gasBill + internetBill + cfeTax +
                                 propertyTax + otherCharges;
      const annualCharges = totalMonthlyCharges * 12 + maintenanceBudget;
      
      // Calculate total investment cost
      const totalInvestment = propertyPrice + notaryFees + agencyFees + surveyFees + renovationCosts + loanInitialFees;
      
      // Gross yield: Annual rental income before charges and fees / Total investment
      const grossYield = ((annualRentalIncomeGross / totalInvestment) * 100).toFixed(2);
      
      // Net yield: (Annual rental income - Annual charges) / Total investment
      const netYield = ((annualRentalIncomeNet - annualCharges) / totalInvestment * 100).toFixed(2);
      
      return { grossYield, netYield };
    };

    const rateOptions = Array.from({ length: 201 }, (_, i) => (i / 10).toFixed(1));

    const calculateInflationAdjustedValue = (value, years) => {
      return value / Math.pow(1 + inflationRate / 100, years);
    };

    const calculateTotalInvestmentWithLoan = () => {
      const borrowedAmount = propertyPrice + notaryFees + agencyFees + surveyFees + renovationCosts + loanInitialFees - personalContribution;
      const monthlyInterestRate = (loanInterestRate / 100) / 12;
      const numberOfPayments = loanDuration * 12;
      const monthlyPayment = borrowedAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      const insuranceMonthly = (borrowedAmount * (loanInsuranceRate / 100)) / 12;
      const totalPayment = (monthlyPayment + insuranceMonthly) * numberOfPayments;
      return personalContribution + totalPayment;
    };

    return (
      <div className="p-3 w-full">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-800">{t.title}</h4>
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {t.switchLanguage}
          </button>
        </div>
        
        {/* Main content grid - adjust proportions */}
        <div className="grid grid-cols-[45%_55%] gap-3">
          {/* Left side - Parameters */}
          <div className="space-y-3">
            {/* Reduce text sizes and spacing in all parameter inputs */}
            <div className="grid grid-cols-3 gap-3">
              {/* Update parameter panel styling */}
              <div className="space-y-1.5 p-2 bg-white rounded-lg border border-gray-200">
                <h6 className="font-medium text-gray-800 mb-1.5 text-sm">{t.loanSettings}</h6>
                <div>
                  <label htmlFor="initialLoan" className="block text-sm font-bold text-gray-700">{t.initialLoan}</label>
                  <input
                    type="number"
                    id="initialLoan"
                    value={personalContribution}
                    onChange={(e) => setPersonalContribution(parseFloat(e.target.value) || 0)}
                    className="mt-0.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="loanDuration" className="block text-sm font-bold text-gray-700">{t.loanDuration}</label>
                  <select
                    id="loanDuration"
                    value={loanDuration}
                    onChange={(e) => setLoanDuration(parseInt(e.target.value))}
                    className="mt-0.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {Array.from({length: 25}, (_, i) => (
                      <option key={i+1} value={i+1}>{i+1} years</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="loanInterestRate" className="block text-sm font-bold text-gray-700">{t.loanInterestRate}</label>
                  <select
                    id="loanInterestRate"
                    value={loanInterestRate.toFixed(1)}
                    onChange={(e) => setLoanInterestRate(parseFloat(e.target.value))}
                    className="mt-0.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {rateOptions.map(rate => <option key={rate} value={rate}>{rate}%</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="loanInsuranceRate" className="block text-sm font-bold text-gray-700">{t.loanInsuranceRate}</label>
                  <select
                    id="loanInsuranceRate"
                    value={loanInsuranceRate.toFixed(1)}
                    onChange={(e) => setLoanInsuranceRate(parseFloat(e.target.value))}
                    className="mt-0.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {rateOptions.map(rate => <option key={rate} value={rate}>{rate}%</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="loanInitialFees" className="block text-sm font-bold text-gray-700">{t.loanInitialFees}</label>
                  <input
                    type="number"
                    id="loanInitialFees"
                    value={loanInitialFees}
                    onChange={(e) => setLoanInitialFees(parseFloat(e.target.value) || 0)}
                    className="mt-0.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Property Purchase Settings */}
              <div className="space-y-2 p-2 bg-white rounded-lg border border-gray-200">
                <h6 className="font-medium text-gray-800 mb-2">{t.propertySettings}</h6>
                <div>
                  <label htmlFor="propertyPrice" className="block text-sm font-bold text-gray-700">{t.propertyPrice}</label>
                  <input
                    type="number"
                    id="propertyPrice"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="notaryFees" className="block text-sm font-bold text-gray-700">{t.notaryFees}</label>
                  <input
                    type="number"
                    id="notaryFees"
                    value={notaryFees}
                    onChange={(e) => setNotaryFees(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="agencyFees" className="block text-sm font-bold text-gray-700">{t.agencyFees}</label>
                  <input
                    type="number"
                    id="agencyFees"
                    value={agencyFees}
                    onChange={(e) => setAgencyFees(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="surveyFees" className="block text-sm font-bold text-gray-700">{t.surveyFees}</label>
                  <input
                    type="number"
                    id="surveyFees"
                    value={surveyFees}
                    onChange={(e) => setSurveyFees(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="maintenanceBudget" className="block text-sm font-bold text-gray-700">{t.maintenanceBudget}</label>
                  <input
                    type="number"
                    id="maintenanceBudget"
                    value={maintenanceBudget}
                    onChange={(e) => setMaintenanceBudget(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="renovationCosts" className="block text-sm font-bold text-gray-700">{t.renovationCosts}</label>
                  <input
                    type="number"
                    id="renovationCosts"
                    value={renovationCosts}
                    onChange={(e) => setRenovationCosts(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="propertySize" className="block text-sm font-bold text-gray-700">{t.propertySize}</label>
                  <input
                    type="number"
                    id="propertySize"
                    value={propertySize}
                    onChange={(e) => setPropertySize(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-bold text-gray-700">{t.propertyType}</label>
                  <select
                    id="propertyType"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Furnished">{t.furnished}</option>
                    <option value="Unfurnished">{t.unfurnished}</option>
                  </select>
                </div>
                {propertyType === 'Furnished' && (
                  <div>
                    <label htmlFor="furnitureValue" className="block text-sm font-bold text-gray-700">{t.furnitureValue}</label>
                    <input
                      type="number"
                      id="furnitureValue"
                      value={furnitureValue}
                      onChange={(e) => setFurnitureValue(parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Rental Income Settings */}
              <div className="space-y-2 p-2 bg-white rounded-lg border border-gray-200">
                <h6 className="font-medium text-gray-800 mb-2">{t.rentalIncomeSettings}</h6>
                <div>
                  <label htmlFor="rentalPriceMonthly" className="block text-sm font-bold text-gray-700">{t.rentalPriceMonthly}</label>
                  <input
                    type="number"
                    id="rentalPriceMonthly"
                    value={rentalPriceMonthly}
                    onChange={(e) => setRentalPriceMonthly(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="rentalGrowthRate" className="block text-sm font-bold text-gray-700">{t.rentalGrowthRate}</label>
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
                  <label htmlFor="vacancyRate" className="block text-sm font-bold text-gray-700">{t.vacancyRate}</label>
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
                <div>
                  <label htmlFor="agencyManagementFee" className="block text-sm font-bold text-gray-700">{t.agencyManagementFee}</label>
                  <select
                    id="agencyManagementFee"
                    value={agencyManagementFee.toFixed(1)}
                    onChange={(e) => setAgencyManagementFee(parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {rateOptions.map(rate => <option key={rate} value={rate}>{rate}%</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Second Row - 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              {/* Rental Expenses Settings */}
              <div className="space-y-2 p-2 bg-white rounded-lg border border-gray-200">
                <h6 className="font-medium text-gray-800 mb-2">{t.rentalExpensesSettings}</h6>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="coproCharges" className="block text-sm font-bold text-gray-700">{t.coproCharges}</label>
                    <input
                      type="number"
                      id="coproCharges"
                      value={coproCharges}
                      onChange={(e) => setCoproCharges(parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="pnoInsurance" className="block text-sm font-bold text-gray-700">{t.pnoInsurance}</label>
                    <input
                      type="number"
                      id="pnoInsurance"
                      value={pnoInsurance}
                      onChange={(e) => setPnoInsurance(parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
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
                  <div>
                    <label htmlFor="cgaFees" className="block text-sm font-bold text-gray-700">{t.cgaFees}</label>
                    <input
                      type="number"
                      id="cgaFees"
                      value={cgaFees}
                      onChange={(e) => setCgaFees(parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="bankFees" className="block text-sm font-bold text-gray-700">{t.bankFees}</label>
                    <input
                      type="number"
                      id="bankFees"
                      value={bankFees}
                      onChange={(e) => setBankFees(parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="waterBill" className="block text-sm font-bold text-gray-700">{t.waterBill}</label>
                    <input
                      type="number"
                      id="waterBill"
                      value={waterBill}
                      onChange={(e) => setWaterBill(parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="electricityBill" className="block text-sm font-bold text-gray-700">{t.electricityBill}</label>
                    <input
                      type="number"
                      id="electricityBill"
                      value={electricityBill}
                      onChange={(e) => setElectricityBill(parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="gasBill" className="block text-sm font-bold text-gray-700">{t.gasBill}</label>
                    <input
                      type="number"
                      id="gasBill"
                      value={gasBill}
                      onChange={(e) => setGasBill(parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="internetBill" className="block text-sm font-bold text-gray-700">{t.internetBill}</label>
                    <input
                      type="number"
                      id="internetBill"
                      value={internetBill}
                      onChange={(e) => setInternetBill(parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="cfeTax" className="block text-sm font-bold text-gray-700">{t.cfeTax}</label>
                    <input
                      type="number"
                      id="cfeTax"
                      value={cfeTax}
                      onChange={(e) => setCfeTax(parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="propertyTax" className="block text-sm font-bold text-gray-700">{t.propertyTax}</label>
                    <input
                      type="number"
                      id="propertyTax"
                      value={propertyTax}
                      onChange={(e) => setPropertyTax(parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="otherCharges" className="block text-sm font-bold text-gray-700">{t.otherCharges}</label>
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
              <div className="space-y-2 p-2 bg-white rounded-lg border border-gray-200">
                <h6 className="font-medium text-gray-800 mb-2">{t.economicFactors}</h6>
                <div>
                  <label htmlFor="simulationDuration" className="block text-sm font-bold text-gray-700">{t.simulationDuration}</label>
                  <select
                    id="simulationDuration"
                    value={simulationDuration}
                    onChange={(e) => setSimulationDuration(parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {Array.from({length: 51}, (_, i) => (
                      <option key={i+10} value={i+10}>{i+10}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="inflationRate" className="block text-sm font-bold text-gray-700">{t.inflationRate}</label>
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
                  <label htmlFor="propertyPriceGrowthRate" className="block text-sm font-bold text-gray-700">{t.propertyPriceGrowthRate}</label>
                  <select
                    id="propertyPriceGrowthRate"
                    value={propertyPriceGrowthRate.toFixed(1)}
                    onChange={(e) => setPropertyPriceGrowthRate(parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {rateOptions.map(rate => <option key={rate} value={rate}>{rate}%</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="taxSystem" className="block text-sm font-bold text-gray-700">{t.taxSystem}</label>
                  <select
                    id="taxSystem"
                    value={taxSystem}
                    onChange={(e) => setTaxSystem(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Default">{t.defaultTax}</option>
                    <option value="French LMNP Reel">{t.lmnpReel}</option>
                    <option value="French LMNP Micro BIC">{t.lmnpMicroBIC}</option>
                    <option value="French LMP Reel">{t.lmpReel}</option>
                    <option value="French LMP Micro BIC">{t.lmpMicroBIC}</option>
                    <option value="French SCI IS">{t.sciIS}</option>
                    <option value="French SCI IR">{t.sciIR}</option>
                    <option value="French Location Nue Reel">{t.locationNueReel}</option>
                    <option value="French Location Nue Micro">{t.locationNueMicro}</option>
                  </select>
                </div>
                {(taxSystem === 'French LMNP Reel' || taxSystem === 'French LMP Reel' || taxSystem === 'French SCI IS' || taxSystem === 'French SCI IR') && (
                  <>
                    <div>
                      <label htmlFor="propertyAmortizationPeriod" className="block text-sm font-bold text-gray-700">{t.propertyAmortizationPeriod}</label>
                      <input
                        type="number"
                        id="propertyAmortizationPeriod"
                        value={propertyAmortizationPeriod}
                        onChange={(e) => setPropertyAmortizationPeriod(parseInt(e.target.value) || 30)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    {propertyType === 'Furnished' && (
                      <div>
                        <label htmlFor="furnitureAmortizationPeriod" className="block text-sm font-bold text-gray-700">{t.furnitureAmortizationPeriod}</label>
                        <input
                          type="number"
                          id="furnitureAmortizationPeriod"
                          value={furnitureAmortizationPeriod}
                          onChange={(e) => setFurnitureAmortizationPeriod(parseInt(e.target.value) || 7)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </>
                )}
                {(taxSystem !== 'Default' && taxSystem !== 'French SCI IS') && (
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
                {taxSystem === 'French SCI IS' && (
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
          </div>

          {/* Right side - Results with more width */}
          <div className="flex flex-col bg-gray-50 rounded-lg border border-gray-200">
            <div className="p-4">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">{t.results}</h4>

              {/* Property Rentability */}
              <div className="bg-white p-2 rounded-lg border border-gray-200 mb-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">{t.propertyRentability}</h5>
                <div className="flex flex-wrap gap-2">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-700 mb-0.5">{t.grossYield}:</p>
                    <p className="text-lg font-bold text-purple-600">{calculateYields().grossYield}%</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-700 mb-0.5">{t.netYield}:</p>
                    <p className="text-lg font-bold text-purple-600">{calculateYields().netYield}%</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-700 mb-0.5">{t.monthlyPayment}:</p>
                    <p className="text-lg font-bold text-yellow-600">
                      €{calculateMonthlyLoanPayment()}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-700 mb-0.5">{t.monthlyFees}:</p>
                    <p className="text-lg font-bold text-red-600">
                      €{(coproCharges + pnoInsurance + accountingFees + cgaFees + bankFees + waterBill + electricityBill + gasBill + internetBill + cfeTax + propertyTax + otherCharges).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-700 mb-0.5">{t.yearlyFees}:</p>
                    <p className="text-lg font-bold text-red-600">
                      €{((coproCharges + pnoInsurance + accountingFees + cgaFees + bankFees + waterBill + electricityBill + gasBill + internetBill + cfeTax + propertyTax + otherCharges) * 12 + maintenanceBudget).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3-column display */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                {/* Initial Investment */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="text-lg font-semibold text-gray-700 mb-3">{t.initialInvestment}</h5>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">{t.totalInvestmentCost}:</p>
                      <p className="text-xl font-bold text-blue-600">
                        €{(propertyPrice + notaryFees + agencyFees + surveyFees + renovationCosts + loanInitialFees).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">{t.totalBorrowedAmount}:</p>
                      <p className="text-xl font-bold text-blue-600">
                        €{(propertyPrice + notaryFees + agencyFees + surveyFees + renovationCosts + loanInitialFees - personalContribution).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">{t.initialCashNeeded}:</p>
                      <p className="text-xl font-bold text-blue-600">
                        €{personalContribution.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">{t.totalInvestmentValueWithoutInflation}:</p>
                      <p className="text-xl font-bold text-blue-600">
                        €{calculateTotalInvestmentWithLoan().toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500">(including all interest and insurance)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">{t.actualMoneySpentAfterInflation} ({t.year} {loanDuration}):</p>
                      <p className="text-xl font-bold text-green-600">
                        €{(personalContribution + calculateProgressiveInflationValue(calculateTotalInvestmentWithLoan() - personalContribution, loanDuration)).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500">{t.actualMoneySpentDescription}</p>
                    </div>
                  </div>
                </div>

                {/* Investment Evolution */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 col-span-2">
                  <h5 className="text-lg font-semibold text-gray-700 mb-3">
                    {t.investmentEvolution} <span className="text-sm text-green-600">({t.propertyValueAfterInflation})</span>
                  </h5>
                  <div className="grid grid-cols-2 gap-6">
                    {/* End of Loan */}
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-300">
                      <h6 className="text-md font-semibold text-gray-800 mb-2">End of Loan</h6>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">{t.propertyValue} ({t.year} {loanDuration}):</p>
                          <p className="text-xl font-bold text-blue-600">
                            €{calculateYearlyEvolution()[loanDuration-1]?.propertyValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-green-600">
                            €{calculateInflationAdjustedValue(calculateYearlyEvolution()[loanDuration-1]?.propertyValue, loanDuration).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">{t.cashBalance} ({t.year} {loanDuration}):</p>
                          <p className="text-xl font-bold text-blue-600">
                            €{calculateYearlyEvolution()[loanDuration-1]?.cashBalance.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-green-600">
                            €{calculateInflationAdjustedValue(calculateYearlyEvolution()[loanDuration-1]?.cashBalance, loanDuration).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">{t.propertyValue} + {t.cashBalance} ({t.year} {loanDuration}):</p>
                          <p className="text-xl font-bold text-blue-600">
                            €{(calculateYearlyEvolution()[loanDuration-1]?.propertyValue + calculateYearlyEvolution()[loanDuration-1]?.cashBalance).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-green-600">
                            €{calculateInflationAdjustedValue(calculateYearlyEvolution()[loanDuration-1]?.propertyValue + calculateYearlyEvolution()[loanDuration-1]?.cashBalance, loanDuration).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Money Gained (compared to {t.initialCashNeeded}):</p>
                          <p className="text-xl font-bold text-blue-600">
                            €{((calculateYearlyEvolution()[loanDuration-1]?.propertyValue + calculateYearlyEvolution()[loanDuration-1]?.cashBalance) - personalContribution).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-green-600">
                            €{(calculateInflationAdjustedValue((calculateYearlyEvolution()[loanDuration-1]?.propertyValue + calculateYearlyEvolution()[loanDuration-1]?.cashBalance) - personalContribution, loanDuration)).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Investment Multiplier:</p>
                          <p className="text-xl font-bold text-blue-600">
                            x{((calculateYearlyEvolution()[loanDuration-1]?.propertyValue + calculateYearlyEvolution()[loanDuration-1]?.cashBalance) / personalContribution).toFixed(2)}
                          </p>
                          <p className="text-xs text-green-600">
                            x{(calculateInflationAdjustedValue(
                              (calculateYearlyEvolution()[loanDuration-1]?.propertyValue + calculateYearlyEvolution()[loanDuration-1]?.cashBalance),
                              loanDuration
                            ) / personalContribution).toFixed(2)}
                          </p>
                        </div>
                        {/* New block: Yearly Gains */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Yearly Gains:</p>
                          <p className="text-xl font-bold text-blue-600">
                            {calculateYearlyEvolution()[loanDuration-1]
                              ? (
                                  (Math.pow(
                                    ((calculateYearlyEvolution()[loanDuration-1].propertyValue + calculateYearlyEvolution()[loanDuration-1].cashBalance) / personalContribution),
                                    1 / loanDuration
                                  ) - 1) * 100
                                ).toFixed(2)
                              : '0.00'}%
                          </p>
                          <p className="text-xs text-green-600">
                            {calculateYearlyEvolution()[loanDuration-1]
                              ? (
                                  (Math.pow(
                                    (calculateInflationAdjustedValue(
                                      (calculateYearlyEvolution()[loanDuration-1].propertyValue + calculateYearlyEvolution()[loanDuration-1].cashBalance),
                                      loanDuration
                                    ) / personalContribution),
                                    1 / loanDuration
                                  ) - 1) * 100
                                ).toFixed(2)
                              : '0.00'}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* End of Simulation */}
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-300">
                      <h6 className="text-md font-semibold text-gray-800 mb-2">End of Simulation</h6>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">{t.propertyValue} ({t.year} {simulationDuration}):</p>
                          <p className="text-xl font-bold text-blue-600">
                            €{calculateYearlyEvolution()[simulationDuration-1]?.propertyValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-green-600">
                            €{calculateInflationAdjustedValue(calculateYearlyEvolution()[simulationDuration-1]?.propertyValue, simulationDuration).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">{t.cashBalance} ({t.year} {simulationDuration}):</p>
                          <p className="text-xl font-bold text-blue-600">
                            €{calculateYearlyEvolution()[simulationDuration-1]?.cashBalance.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-green-600">
                            €{calculateInflationAdjustedValue(calculateYearlyEvolution()[simulationDuration-1]?.cashBalance, simulationDuration).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">{t.propertyValue} + {t.cashBalance} ({t.year} {simulationDuration}):</p>
                          <p className="text-xl font-bold text-blue-600">
                            €{(calculateYearlyEvolution()[simulationDuration-1]?.propertyValue + calculateYearlyEvolution()[simulationDuration-1]?.cashBalance).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-green-600">
                            €{calculateInflationAdjustedValue(calculateYearlyEvolution()[simulationDuration-1]?.propertyValue + calculateYearlyEvolution()[simulationDuration-1]?.cashBalance, simulationDuration).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Money Gained (compared to {t.initialCashNeeded}):</p>
                          <p className="text-xl font-bold text-blue-600">
                            €{((calculateYearlyEvolution()[simulationDuration-1]?.propertyValue + calculateYearlyEvolution()[simulationDuration-1]?.cashBalance) - personalContribution).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-green-600">
                            €{(calculateInflationAdjustedValue((calculateYearlyEvolution()[simulationDuration-1]?.propertyValue + calculateYearlyEvolution()[simulationDuration-1]?.cashBalance) - personalContribution, simulationDuration)).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Investment Multiplier:</p>
                          <p className="text-xl font-bold text-blue-600">
                            x{((calculateYearlyEvolution()[simulationDuration-1]?.propertyValue + calculateYearlyEvolution()[simulationDuration-1]?.cashBalance) / personalContribution).toFixed(2)}
                          </p>
                          <p className="text-xs text-green-600">
                            x{(calculateInflationAdjustedValue(
                              (calculateYearlyEvolution()[simulationDuration-1]?.propertyValue + calculateYearlyEvolution()[simulationDuration-1]?.cashBalance),
                              simulationDuration
                            ) / personalContribution).toFixed(2)}
                          </p>
                        </div>
                        {/* New block: Yearly Gains */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Yearly Gains:</p>
                          <p className="text-xl font-bold text-blue-600">
                            {calculateYearlyEvolution()[simulationDuration-1]
                              ? (
                                  (Math.pow(
                                    ((calculateYearlyEvolution()[simulationDuration-1].propertyValue + calculateYearlyEvolution()[simulationDuration-1].cashBalance) / personalContribution),
                                    1 / simulationDuration
                                  ) - 1) * 100
                                ).toFixed(2)
                              : '0.00'}%
                          </p>
                          <p className="text-xs text-green-600">
                            {calculateYearlyEvolution()[simulationDuration-1]
                              ? (
                                  (Math.pow(
                                    (calculateInflationAdjustedValue(
                                      (calculateYearlyEvolution()[simulationDuration-1].propertyValue + calculateYearlyEvolution()[simulationDuration-1].cashBalance),
                                      simulationDuration
                                    ) / personalContribution),
                                    1 / simulationDuration
                                  ) - 1) * 100
                                ).toFixed(2)
                              : '0.00'}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Results */}
                <div className="overflow-x-auto w-full col-span-3">
                  <table className="w-full table-auto divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.year}</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.propertyValue}</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.rentalIncome}</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.charges}</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.loanPayments}</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.taxes}</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.cashFlow}</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.cashBalance}</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cash Balance After Inflation</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.totalValue}</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.presentValue}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculateYearlyEvolution().map((result) => (
                        <tr key={result.year}>
                          <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">{result.year}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-sm text-blue-600">{result.propertyValue.toFixed(2)}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-sm text-blue-600">{result.rentalIncome.toFixed(2)}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-sm text-red-600">{result.charges.toFixed(2)}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-sm text-red-600">{result.loanPayments.toFixed(2)}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-sm text-red-600">{result.taxes.toFixed(2)}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">{result.cashFlow.toFixed(2)}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-sm text-yellow-600">{result.cashBalance.toFixed(2)}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-sm text-green-600">{result.cashBalanceAfterInflation.toFixed(2)}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-sm text-yellow-600">{result.totalValue.toFixed(2)}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-sm text-green-600">{result.presentValue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default RealEstate;