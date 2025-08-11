"use client"

import { useState, useEffect } from "react"
import { Edit, Check, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area
} from 'recharts';

// --- DATOS SIMULADOS ---

// Datos históricos detallados.
const historicalData = [
    { date: '2022-01-01', value: 5000 }, { date: '2022-02-01', value: 5800 },
    { date: '2022-03-01', value: 5400 }, { date: '2022-04-01', value: 6500 },
    { date: '2022-05-01', value: 7200 }, { date: '2022-06-01', value: 6800 },
    { date: '2022-07-01', value: 8100 }, { date: '2022-08-01', value: 7500 },
    { date: '2022-09-01', value: 9200 }, { date: '2022-10-01', value: 8800 },
    { date: '2022-11-01', value: 10500 }, { date: '2022-12-01', value: 11500 },
    { date: '2023-01-01', value: 10800 }, { date: '2023-02-01', value: 12000 },
    { date: '2023-03-01', value: 13100 }, { date: '2023-04-01', value: 12500 },
    { date: '2023-05-01', value: 14000 }, { date: '2023-06-01', value: 15500 },
    { date: '2023-07-01', value: 14900 }, { date: '2023-08-01', value: 16800 },
    { date: '2023-09-01', value: 18200 }, { date: '2023-10-01', value: 17700 },
    { date: '2023-11-01', value: 19500 }, { date: '2023-12-01', value: 22300 },
    { date: '2024-01-01', value: 21000 }, { date: '2024-02-01', value: 22500 },
    { date: '2024-03-01', value: 24000 }, { date: '2024-04-01', value: 23500 },
    { date: '2024-05-01', value: 25800 }, { date: '2024-06-01', value: 27100 },
    { date: '2024-07-01', value: 26300 }, { date: '2024-08-01', value: 28000 },
    { date: '2024-09-01', value: 29500 }, { date: '2024-10-01', value: 31000 },
    { date: '2024-11-01', value: 30200 }, { date: '2024-12-01', value: 33500 },
    { date: '2025-01-01', value: 32440 },
];

// Genera datos de proyección futura desde 2025 a 2040.
const generateFutureData = () => {
    const futureData = [];
    let lastValue = historicalData[historicalData.length - 1].value;
    for (let year = 2025; year <= 2040; year++) {
        for (let month = 1; month <= 12; month++) {
            if (year === 2025 && month === 1) continue;
            const fluctuation = (Math.random() - 0.4) * 2000;
            const growth = 500;
            lastValue += growth + fluctuation;
            const date = `${year}-${String(month).padStart(2, '0')}-01`;
            futureData.push({ date, value: Math.max(0, lastValue) });
        }
    }
    return futureData;
};

const futureProjectionData = generateFutureData();
const allData = [...historicalData, ...futureProjectionData];

// Datos de eventos significativos (ingresos/gastos).
const eventData = [
    { date: '2022-05-15', type: 'income', description: 'Bonus de proyecto' },
    { date: '2022-12-20', type: 'income', description: 'Paga extra Navidad' },
    { date: '2023-04-10', type: 'expense', description: 'Reparación coche' },
    { date: '2023-08-05', type: 'expense', description: 'Vacaciones de verano' },
    { date: '2023-12-20', type: 'income', description: 'Paga extra Navidad' },
    { date: '2024-06-15', type: 'income', description: 'Bonus de proyecto' },
    { date: '2024-11-29', type: 'expense', description: 'Compras Black Friday' },
];

// --- COMPONENTES ---

// Componente para la línea de tiempo de eventos bajo el gráfico.
const EventTimeline = ({ events, data, timeRange }: { events: any[], data: any[], timeRange: string }) => {
    if (!data || data.length < 2) return null;

    const startDate = new Date(data[0].date).getTime();
    const endDate = new Date(data[data.length - 1].date).getTime();
    const totalDuration = endDate - startDate;

    if (totalDuration <= 0) return null;

    const calculatePosition = (eventDate: string) => {
        const eventTime = new Date(eventDate).getTime();
        const position = ((eventTime - startDate) / totalDuration) * 100;
        return `${position}%`;
    };

    const filteredEvents = events.filter(event => {
        const eventTime = new Date(event.date).getTime();
        return eventTime >= startDate && eventTime <= endDate;
    });

    return (
        <div className="relative h-10 w-full mt-[-1rem] px-5">
            {filteredEvents.map((event, index) => (
                <div
                    key={index}
                    className="absolute transform -translate-x-1/2"
                    style={{ left: calculatePosition(event.date) }}
                >
                    <div className="flex flex-col items-center group cursor-pointer">
                        {event.type === 'income' ? (
                            <ArrowUpCircle className="w-5 h-5 text-green-400" />
                        ) : (
                            <ArrowDownCircle className="w-5 h-5 text-red-400" />
                        )}
                        <div className="absolute bottom-full mb-2 w-max p-2 text-xs bg-slate-800 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                            {event.description}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Variable para rastrear el último año mostrado en el eje X.
// Se declara fuera del componente para que persista entre renders.
let lastDisplayedYear: number | null = null;

export function Dashboard() {
  const [balance, setBalance] = useState(32440.00);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(balance.toFixed(2));
  
  const [timeRange, setTimeRange] = useState('ALL');
  const [displayData, setDisplayData] = useState(historicalData);

  useEffect(() => {
    const now = new Date('2025-01-01');
    let startDate;
    let dataSet = timeRange === 'TODO' ? allData : historicalData;

    if (timeRange === 'TODO') {
        setDisplayData(allData);
        return;
    }

    switch (timeRange) {
        case '1M': startDate = new Date(new Date(now).setMonth(now.getMonth() - 1)); break;
        case '3M': startDate = new Date(new Date(now).setMonth(now.getMonth() - 3)); break;
        case '6M': startDate = new Date(new Date(now).setMonth(now.getMonth() - 6)); break;
        case '1A': startDate = new Date(new Date(now).setFullYear(now.getFullYear() - 1)); break;
        case '3A': startDate = new Date(new Date(now).setFullYear(now.getFullYear() - 3)); break;
        case '5A': startDate = new Date(new Date(now).setFullYear(now.getFullYear() - 5)); break;
        default: setDisplayData(historicalData); return;
    }
    
    const filteredData = dataSet.filter(d => new Date(d.date) >= startDate);
    const startIndex = dataSet.findIndex(d => new Date(d.date) >= startDate);
    const finalData = startIndex > 0 ? [dataSet[startIndex - 1], ...filteredData] : filteredData;

    setDisplayData(finalData);
  }, [timeRange]);


  const handleEdit = () => {
    setInputValue(balance.toFixed(2).replace('.', ','));
    setIsEditing(true);
  };

  const handleSave = () => {
    const newBalance = parseFloat(inputValue.replace(',', '.'));
    if (!isNaN(newBalance)) {
      setBalance(newBalance);
    }
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const formattedBalance = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(balance);

  const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
          return (
              <div className="bg-[#1f2937]/80 backdrop-blur-sm p-2 border border-slate-700 rounded-lg shadow-lg text-sm">
                  <p className="label text-slate-400">{new Date(label).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="intro text-green-400 font-bold">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(payload[0].value)}</p>
              </div>
          );
      }
      return null;
  };

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    const year = date.getFullYear();

    if (['3A', '5A', 'TODO'].includes(timeRange)) {
        if (year !== lastDisplayedYear) {
            lastDisplayedYear = year;
            return year.toString();
        }
        return "";
    }
    
    const options: Intl.DateTimeFormatOptions = {};
    switch (timeRange) {
        case '1M': options.day = 'numeric'; options.month = 'short'; break;
        case '3M': options.month = 'short'; break;
        case '6M': options.month = 'short'; break;
        case '1A': options.month = 'short'; break;
    }
    return date.toLocaleDateString('es-ES', options).replace('.', '');
  };

  const getInterval = () => {
    switch(timeRange) {
        case '1M':
        case '3M':
        case '6M':
        case '1A':
            return 0; // Muestra todas las etiquetas para rangos cortos
        case '3A':
            return 2; // Muestra una de cada 3 etiquetas
        case '5A':
            return 5; // Muestra una de cada 6 etiquetas
        case 'TODO':
            return 11; // Muestra una de cada 12 etiquetas (anual)
        default:
            return 'auto';
    }
  }


  return (
    <div className="flex justify-center text-white p-4">
      <div className="space-y-6 w-full md:mx-auto">
        {/* Sección de Saldo */}
        <div className="mb-6 text-center">
          <p className="text-xl font-medium text-gray-400 mb-2">Patrimonio Actual</p>
          <div className="flex items-center justify-center gap-2 h-12">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  autoFocus
                  className="text-4xl font-bold text-cyan-300 bg-transparent border-b-2 border-cyan-300 w-48 text-center outline-none"
                />
                <span className="text-4xl font-bold text-cyan-300">€</span>
                <button onClick={handleSave} className="text-green-400 hover:text-green-300">
                  <Check size={28} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-bold text-cyan-300">{formattedBalance}</h1>
                <button onClick={handleEdit} className="text-gray-400 hover:text-white">
                  <Edit size={24} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="grid grid-cols-4 gap-4 text-center mb-8">
           <div className="flex flex-col items-center">
            <button className="bg-[#1e5c70] text-white p-2 rounded-xl shadow-lg transition-colors duration-200 w-16 h-16 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </button>
            <span className="mt-2 text-sm text-gray-400">Payment</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="bg-[#20333b] text-white p-2 rounded-xl shadow-lg transition-colors duration-200 w-16 h-16 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <span className="mt-2 text-sm text-gray-400">Receive</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="bg-[#20333b] text-white p-2 rounded-xl shadow-lg transition-colors duration-200 w-16 h-16 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
              </svg>
            </button>
            <span className="mt-2 text-sm text-gray-400">Top Up</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="bg-[#20333b] text-white p-2 rounded-xl shadow-lg transition-colors duration-200 w-16 h-16 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
            <span className="mt-2 text-sm text-gray-400">Transfer</span>
          </div>
        </div>

        {/* Tarjeta de Historial de Patrimonio */}
        <div className="bg-[#20333b] p-4 rounded-xl">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-200">Historial y Proyecciones</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                    <button onClick={() => setTimeRange('1M')} className={`${timeRange === '1M' ? 'bg-green-500/30 text-green-300' : 'bg-slate-700/50'} px-2 py-1 rounded hover:bg-slate-600`}>1M</button>
                    <button onClick={() => setTimeRange('3M')} className={`${timeRange === '3M' ? 'bg-green-500/30 text-green-300' : 'bg-slate-700/50'} px-2 py-1 rounded hover:bg-slate-600`}>3M</button>
                    <button onClick={() => setTimeRange('6M')} className={`${timeRange === '6M' ? 'bg-green-500/30 text-green-300' : 'bg-slate-700/50'} px-2 py-1 rounded hover:bg-slate-600`}>6M</button>
                    <button onClick={() => setTimeRange('1A')} className={`${timeRange === '1A' ? 'bg-green-500/30 text-green-300' : 'bg-slate-700/50'} px-2 py-1 rounded hover:bg-slate-600`}>1A</button>
                    <button onClick={() => setTimeRange('3A')} className={`${timeRange === '3A' ? 'bg-green-500/30 text-green-300' : 'bg-slate-700/50'} px-2 py-1 rounded hover:bg-slate-600`}>3A</button>
                    <button onClick={() => setTimeRange('5A')} className={`${timeRange === '5A' ? 'bg-green-500/30 text-green-300' : 'bg-slate-700/50'} px-2 py-1 rounded hover:bg-slate-600`}>5A</button>
                    <button onClick={() => setTimeRange('TODO')} className={`${timeRange === 'TODO' ? 'bg-green-500/30 text-green-300' : 'bg-slate-700/50'} px-2 py-1 rounded hover:bg-slate-600`}>Todo</button>
                </div>
            </div>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={displayData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        onMouseEnter={() => { lastDisplayedYear = null; }}
                        onMouseLeave={() => { lastDisplayedYear = null; }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickFormatter={formatXAxis} axisLine={false} tickLine={false} interval={getInterval()} />
                        <YAxis domain={[0, 'dataMax + 20000']} stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `€${Math.round(value/1000)}k`} axisLine={false} tickLine={false} />
                        <Tooltip 
                            content={<CustomTooltip />} 
                            cursor={{ stroke: '#4ade80', strokeWidth: 1, strokeDasharray: '3 3' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="none" 
                            fillOpacity={1} 
                            fill="url(#colorValue)"
                        />
                         <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, stroke: '#1f2937', fill: '#22c55e', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <EventTimeline events={eventData} data={displayData} timeRange={timeRange} />
        </div>


        {/* Historial de Transacciones */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-gray-400">
            <span className="font-semibold text-gray-200">Transaction History</span>
            <a href="#" className="text-sm text-cyan-300 hover:underline">See All</a>
          </div>
          <div className="bg-[#20333b] p-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <div className="ml-3">
                <p className="font-semibold text-gray-200">Bank Account</p>
                <p className="text-sm text-gray-400">4322 **** **** 8900</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="bg-[#20333b] p-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 .895-2 2-2zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <p className="font-semibold text-gray-200">VISA</p>
                <p className="text-sm text-gray-400">5567 **** **** 8910</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
