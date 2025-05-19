import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function LoanSimulator() {
    const [investmentAmount, setInvestmentAmount] = useState(() => parseFloat(Cookies.get('loanPropertyPrice') || '200000'));
    const [personalContribution, setPersonalContribution] = useState(() => parseFloat(Cookies.get('loanContribution') || '20000'));
    const [loanDuration, setLoanDuration] = useState(() => parseInt(Cookies.get('simpleLoanDuration') || '20'));
    const [interestRate, setInterestRate] = useState(() => parseFloat(Cookies.get('simpleLoanInterest') || '3.5'));
    const [insuranceRate, setInsuranceRate] = useState(() => parseFloat(Cookies.get('simpleLoanInsurance') || '0.3'));
    const [inflationRate, setInflationRate] = useState(() => parseFloat(Cookies.get('simpleLoanInflation') || '2.5'));

    useEffect(() => {
        Cookies.set('loanPropertyPrice', investmentAmount.toString());
        Cookies.set('loanContribution', personalContribution.toString());
        Cookies.set('simpleLoanDuration', loanDuration.toString());
        Cookies.set('simpleLoanInterest', interestRate.toString());
        Cookies.set('simpleLoanInsurance', insuranceRate.toString());
        Cookies.set('simpleLoanInflation', inflationRate.toString());
    }, [investmentAmount, personalContribution, loanDuration, interestRate, insuranceRate, inflationRate]);

    const calculateResults = () => {
        const borrowedAmount = investmentAmount - personalContribution;
        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanDuration * 12;
        
        // Calculate monthly payment using the loan payment formula
        const monthlyPayment = borrowedAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))
            / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        
        // Calculate insurance payment
        const monthlyInsurance = (borrowedAmount * (insuranceRate / 100)) / 12;
        
        // Calculate total monthly payment
        const totalMonthlyPayment = monthlyPayment + monthlyInsurance;
        
        // Calculate total amount paid without inflation
        const totalPaid = totalMonthlyPayment * numberOfPayments + personalContribution;
        
        // Calculate inflation-adjusted payments with personal contribution
        let inflationAdjustedTotal = personalContribution; // Initial contribution at year 0
        const yearlyPayment = totalMonthlyPayment * 12;
        
        // Add yearly payments adjusted for inflation
        for (let year = 0; year < loanDuration; year++) {
            inflationAdjustedTotal += yearlyPayment / Math.pow(1 + inflationRate / 100, year + 1);
        }
        
        return {
            monthlyPayment: monthlyPayment.toFixed(2),
            monthlyInsurance: monthlyInsurance.toFixed(2),
            totalMonthlyPayment: totalMonthlyPayment.toFixed(2),
            totalPaid: totalPaid.toFixed(2),
            inflationAdjustedTotal: inflationAdjustedTotal.toFixed(2),
            totalInterestPaid: (totalPaid - borrowedAmount - personalContribution).toFixed(2),
            borrowedAmount: borrowedAmount.toFixed(2),
            percentageOfInvestment: ((yearlyPayment / investmentAmount) * 100).toFixed(2)
        };
    };

    const results = calculateResults();

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Simple Loan Calculator</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Investment Amount (€)</label>
                        <input
                            type="number"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(parseFloat(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Personal Contribution (€)</label>
                        <input
                            type="number"
                            value={personalContribution}
                            onChange={(e) => setPersonalContribution(parseFloat(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Loan Duration (years)</label>
                        <input
                            type="number"
                            value={loanDuration}
                            onChange={(e) => setLoanDuration(parseInt(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Insurance Rate (%)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={insuranceRate}
                            onChange={(e) => setInsuranceRate(parseFloat(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Inflation Rate (%)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={inflationRate}
                            onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Results</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">Borrowed Amount:</p>
                        <p className="text-xl font-bold text-blue-600">€{results.borrowedAmount}</p>
                        
                        <p className="text-sm text-gray-600">Monthly Payment (excl. insurance):</p>
                        <p className="text-xl font-bold text-blue-600">€{results.monthlyPayment}</p>
                        
                        <p className="text-sm text-gray-600">Monthly Insurance:</p>
                        <p className="text-xl font-bold text-blue-600">€{results.monthlyInsurance}</p>
                        
                        <p className="text-sm text-gray-600">Total Monthly Payment:</p>
                        <p className="text-xl font-bold text-green-600">€{results.totalMonthlyPayment}</p>
                    </div>
                    
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">Total Amount Paid:</p>
                        <p className="text-xl font-bold text-blue-600">€{results.totalPaid}</p>
                        
                        <p className="text-sm text-gray-600">Total Interest & Insurance:</p>
                        <p className="text-xl font-bold text-red-600">€{results.totalInterestPaid}</p>
                        
                        <p className="text-sm text-gray-600">Inflation-Adjusted Total Cost:</p>
                        <p className="text-xl font-bold text-green-600">€{results.inflationAdjustedTotal}</p>
                        
                        <p className="text-sm text-gray-600">Percentage of Investment Amount paid per year:</p>
                        <p className="text-xl font-bold text-purple-600">{results.percentageOfInvestment}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoanSimulator;
