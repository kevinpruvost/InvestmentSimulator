import { useEffect, useState } from 'react';
import FranceEntrepreneur from './FranceEntrepreneur';
import InvestmentSimulator from './InvestmentSimulator';
import RealEstate from './RealEstate';
import Inflation from './Inflation';
import SCPI from './SCPI';
import LoanSimulator from './LoanSimulator';
import ProgressiveTax from './ProgressiveTax';

import Cookies from 'js-cookie';

function Simulator() {
  const [activeTab, setActiveTab] = useState(() => Cookies.get('activeTab') || 'investment');

  useEffect(() => {
    Cookies.set('activeTab', activeTab);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-[100vw]">
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('entrepreneur')}
              className={`${
                activeTab === 'entrepreneur'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              French Companies (only in French)
            </button>
            <button
              onClick={() => setActiveTab('investment')}
              className={`${
                activeTab === 'investment'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Investment
            </button>
            <button
              onClick={() => setActiveTab('realestate')}
              className={`${
                activeTab === 'realestate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Real Estate
            </button>
            <button
              onClick={() => setActiveTab('scpi')}
              className={`${
                activeTab === 'scpi'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              SCPI
            </button>
            <button
              onClick={() => setActiveTab('inflation')}
              className={`${
                activeTab === 'inflation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Inflation Rates
            </button>
            <button
              onClick={() => setActiveTab('loan')}
              className={`${
                activeTab === 'loan'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Loan Calculator
            </button>
            <button
              onClick={() => setActiveTab('progressiveTax')}
              className={`${
                activeTab === 'progressiveTax'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Progressive Tax
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'entrepreneur' ? <FranceEntrepreneur /> : 
           activeTab === 'investment' ? <InvestmentSimulator /> : 
           activeTab === 'realestate' ? <RealEstate /> :
           activeTab === 'scpi' ? <SCPI /> :
           activeTab === 'loan' ? <LoanSimulator /> :
           activeTab === 'progressiveTax' ? <ProgressiveTax /> :
           <Inflation />}
        </div>
      </div>
    </div>
  );
}

export default Simulator;