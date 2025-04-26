import { useState } from 'react';
import FranceEntrepreneur from './FranceEntrepreneur';
import InvestmentSimulator from './InvestmentSimulator';
import RealEstate from './RealEstate';
import Inflation from './Inflation';

function Simulator() {
  const [activeTab, setActiveTab] = useState('investment');

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
              onClick={() => setActiveTab('inflation')}
              className={`${
                activeTab === 'inflation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Inflation Infos
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
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'entrepreneur' ? <FranceEntrepreneur /> : 
           activeTab === 'investment' ? <InvestmentSimulator /> : 
           activeTab === 'realestate' ? <RealEstate /> :
           <Inflation />}
        </div>
      </div>
    </div>
  );
}

export default Simulator;