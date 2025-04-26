import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend 
} from 'chart.js';
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Inflation() {
    const [selectedRegion, setSelectedRegion] = useState("FRA");
    const [inflationData, setInflationData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const chartRef = useRef(null);

    const regions = [
      { code: "FRA", name: "France" },
      { code: "DEU", name: "Germany" },
      { code: "GBR", name: "United Kingdom" },
      { code: "CHN", name: "China" },
      { code: "USA", name: "United States" },
      { code: "IND", name: "India" },
      { code: "CHE", name: "Switzerland" },
      { code: "WLD", name: "World" },
      { code: "EAS", name: "East Asia & Pacific (Asia)" },
      { code: "EMU", name: "Euro area (Europe)" },
      { code: "LCN", name: "Latin America & Caribbean (South America)" },
    ];

    useEffect(() => {
        const fetchInflationData = async () => {
          setLoading(true);
          setError(null);
          try {
            const currentYear = new Date().getFullYear() - 1; // Dynamically get last year
            const response = await axios.get(
              `https://api.worldbank.org/v2/country/${selectedRegion}/indicator/FP.CPI.TOTL.ZG?format=json&date=1960:${currentYear}&per_page=100`
            );
            const data = response.data[1] || [];
            setInflationData(data.reverse()); // Reverse to have oldest to newest
          } catch (err) {
            setError("Failed to fetch data. Please try again.");
          }
          setLoading(false);
        };
        fetchInflationData();
      }, [selectedRegion]);      

    // Clean up chart instance when component unmounts
    useEffect(() => {
      return () => {
        if (chartRef.current) {
          chartRef.current.destroy();
        }
      };
    }, []);

    const calculateAverageInflation = (years) => {
      const currentYear = 2023;
      const startYear = currentYear - years + 1;
      const filteredData = inflationData.filter(
        (item) => item.date >= startYear && item.date <= currentYear && item.value !== null
      );
      const sum = filteredData.reduce((acc, item) => acc + item.value, 0);
      return filteredData.length ? (sum / filteredData.length).toFixed(2) : "N/A";
    };

    const chartData = {
      labels: inflationData.map((item) => item.date),
      datasets: [
        {
          label: "Inflation Rate (%)",
          data: inflationData.map((item) => item.value),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };

    const chartOptions = {
      scales: {
        y: {
          beginAtZero: false,
          title: { display: true, text: "Inflation Rate (%)" },
        },
        x: {
          title: { display: true, text: "Year" },
        },
      },
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Inflation Rate - ${regions.find(r => r.code === selectedRegion)?.name || selectedRegion}`,
        },
      },
    };

    return (
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Inflation Rates</h1>
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            Select Country/Region
          </label>
          <select
            id="region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="mt-1 block w-full md:w-1/2 lg:w-1/3 py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
          >
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : error ? (
          <p className="text-red-500 min-h-[400px] flex items-center justify-center">{error}</p>
        ) : inflationData.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average Inflation Rate (%)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[5, 10, 20, 25, 30, 50].map((years) => (
                    <tr key={years}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Last {years} Years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {calculateAverageInflation(years)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Inflation Trend</h2>
              <div className="max-w-4xl">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </>
        ) : (
          <p className="min-h-[400px] flex items-center justify-center">No data available for the selected region.</p>
        )}

        <div className="text-sm text-gray-600 mt-4">
          <p>
            <strong>Data Source:</strong> World Bank Open Data API (
            <a
              href="https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              FP.CPI.TOTL.ZG
            </a>
            )
          </p>
          <p>
            <strong>Notes:</strong>
          </p>
          <ul className="list-disc pl-5">
            <li>Data for China starts in 1987; earlier years may be unavailable.</li>
            <li>
              Regional data: Asia (East Asia & Pacific), Europe (Euro area), North America (US), South
              America (Latin America & Caribbean) are approximations due to limited aggregates.
            </li>
            <li>Data up to 2023; 2025 data is unavailable as of April 26, 2025.</li>
            <li>Some years may have missing data, affecting averages.</li>
          </ul>
        </div>
      </div>
    );
}