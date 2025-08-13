"use client"

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Check, Eye, EyeOff, ChevronDown, ChevronUp, Maximize, Minimize, Clock, Plus, X } from "lucide-react";
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, DataZoomComponent, MarkLineComponent, ToolboxComponent } from 'echarts/components';
import { UniversalTransition } from 'echarts/features';

// Inicialización de ECharts
echarts.use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, TitleComponent, DataZoomComponent, MarkLineComponent, ToolboxComponent, UniversalTransition]);

// ============================================================================
// COMPONENTE AreaTimeSeriesChart Y SUS DEPENDENCIAS
// ============================================================================

type FlowItem = { id: number; label: string; amount: number };

export type AreaTimeSeriesChartProps = {
  startNetWorth: number;
  monthlyIncomes: FlowItem[];
  onMonthlyIncomesChange: (incomes: FlowItem[]) => void;
  monthlyExpenses: FlowItem[];
  onMonthlyExpensesChange: (expenses: FlowItem[]) => void;
  monthlyInvestments: FlowItem[];
  onMonthlyInvestmentsChange: (investments: FlowItem[]) => void;
  horizonYears?: number;
  height?: number;
  onEtaChange?: (eta: string | null) => void;
};

const GOAL_NET_WORTH = 100000;

class OrganicProjection {
  static getSeries(props: Omit<AreaTimeSeriesChartProps, 'onEtaChange'>): [number, number][] {
    const { startNetWorth, monthlyIncomes, monthlyExpenses, monthlyInvestments, horizonYears = 15 } = props;
    const series: [number, number][] = [];
    let currentDate = new Date();
    let currentNetWorth = startNetWorth;
    
    const totalMonthlyIncome = monthlyIncomes.reduce((sum, item) => sum + item.amount, 0);
    const totalMonthlyExpense = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
    const totalMonthlyInvestment = monthlyInvestments.reduce((sum, item) => sum + item.amount, 0);
    const monthlyNetChange = totalMonthlyIncome - totalMonthlyExpense - totalMonthlyInvestment;

    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + horizonYears);

    series.push([currentDate.getTime(), parseFloat(currentNetWorth.toFixed(2))]);

    while (currentDate < endDate) {
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const midMonthDate = new Date(currentDate);
      midMonthDate.setDate(currentDate.getDate() + daysInMonth / 2);

      if (midMonthDate < endDate) {
        const fluctuation = (Math.random() - 0.45) * (monthlyNetChange * 0.7); 
        series.push([midMonthDate.getTime(), parseFloat((currentNetWorth + (monthlyNetChange / 2) + fluctuation).toFixed(2))]);
      }

      currentDate.setMonth(currentDate.getMonth() + 1);
      currentNetWorth += monthlyNetChange;
      
      if (currentDate < endDate) {
        series.push([new Date(currentDate).getTime(), parseFloat(currentNetWorth.toFixed(2))]);
      }
    }
    
    series.sort((a, b) => a[0] - b[0]);
    return series;
  }

  static getETAtoGoal(projection: [number, number][], goal: number): string | null {
    const pointReached = projection.find(p => p[1] >= goal);
    if (pointReached) {
        return new Date(pointReached[0]).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    }
    return null;
  }
}

const FlowModal = ({ isOpen, onClose, title, items, setItems, colorClass }: { isOpen: boolean, onClose: () => void, title: string, items: FlowItem[], setItems: (items: FlowItem[]) => void, colorClass: string }) => {
  if (!isOpen) return null;

  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');

  const addItem = () => {
    if (label && amount) {
      const newAmount = parseFloat(amount);
      if (!isNaN(newAmount)) {
        setItems([...items, { id: Date.now(), label, amount: newAmount }]);
        setLabel('');
        setAmount('');
      }
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#20333b] p-6 rounded-xl shadow-lg w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h3 className={`text-lg font-semibold mb-4 ${colorClass}`}>{title}</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 mb-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-[#171A1F] p-2 rounded-md text-sm">
              <span>{item.label}</span>
              <div className="flex items-center gap-3">
                <span>{item.amount}€</span>
                <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-500"><X size={14} /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input type="text" placeholder="Concepto" value={label} onChange={e => setLabel(e.target.value)} className="bg-[#171A1F] rounded px-3 py-2 w-full text-sm outline-none focus:ring-1 focus:ring-cyan-400" />
          <input type="number" placeholder="Cant." value={amount} onChange={e => setAmount(e.target.value)} className="bg-[#171A1F] rounded px-3 py-2 w-24 text-sm outline-none focus:ring-1 focus:ring-cyan-400" />
          <button onClick={addItem} className="bg-[#1e5c70] p-2 rounded-md hover:bg-cyan-600"><Plus size={18} /></button>
        </div>
      </div>
    </div>
  );
};

const AreaTimeSeriesChart: React.FC<AreaTimeSeriesChartProps> = (props) => {
  const { height = 500, onEtaChange } = props;

  const echartsRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeRange, setActiveRange] = useState('1A');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [modalType, setModalType] = useState<'incomes' | 'expenses' | 'investments' | null>(null);

  const projectionData = useMemo(() => OrganicProjection.getSeries(props), [props]);
  
  useEffect(() => {
    const eta = OrganicProjection.getETAtoGoal(projectionData, GOAL_NET_WORTH);
    onEtaChange?.(eta);
  }, [projectionData, onEtaChange]);
  
  useEffect(() => {
    handleRangeChange(activeRange, true);
  }, [projectionData]);

  const handleRangeChange = (range: string, isInitial = false) => {
    setActiveRange(range);
    setIsTimeDropdownOpen(false);
    const echartsInstance = echartsRef.current?.getEchartsInstance();
    if (!echartsInstance) return;

    const totalPoints = projectionData.length - 1;
    if (totalPoints <= 0) return;

    const pointsPerYear = 24;
    let end = 100;
    switch (range) {
      case '1A': end = (pointsPerYear / totalPoints) * 100; break;
      case '3A': end = (pointsPerYear * 3 / totalPoints) * 100; break;
      case '5A': end = (pointsPerYear * 5 / totalPoints) * 100; break;
      default: end = 100;
    }
    
    echartsInstance.dispatchAction({ type: 'dataZoom', start: 0, end: Math.min(100, end) });
  };
  
  const toggleFullscreen = useCallback(() => {
    const chartContainer = echartsRef.current?.ele?.parentElement?.parentElement;
    if (!chartContainer) return;
    if (!document.fullscreenElement) {
        chartContainer.requestFullscreen().catch((err: any) => alert(`Error: ${err.message}`));
    } else {
        document.exitFullscreen();
    }
    setIsFullscreen(!document.fullscreenElement);
  }, []);

  const chartOption = useMemo(() => ({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', label: { backgroundColor: '#283b46' } },
        backgroundColor: 'rgba(15, 17, 20, 0.9)',
        borderColor: '#334155',
        textStyle: { color: '#e2e8f0' },
        formatter: (params: any) => {
            const date = new Date(params[0].axisValue).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
            const value = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(params[0].value[1]);
            return `${date}<br/><strong style="color: #4fd1c5; font-size: 1.1em;">${value}</strong>`;
        }
      },
      grid: { top: '5%', bottom: '20%', left: '12%', right: '5%' },
      xAxis: { type: 'time', axisLine: { lineStyle: { color: '#888' } }, axisLabel: { color: '#ccc', fontSize: 11 }, splitLine: { show: false } },
      yAxis: { type: 'value', scale: true, axisLine: { show: true, lineStyle: { color: '#888' } }, axisLabel: { color: '#ccc', fontSize: 11, formatter: (value: number) => `€${(value / 1000).toFixed(0)}k` }, splitLine: { lineStyle: { color: '#2d3748' } } },
      dataZoom: [{ type: 'inside' }, { type: 'slider', bottom: 10, height: 25, backgroundColor: 'rgba(255, 255, 255, 0.1)' }],
      series: [{
          name: 'Patrimonio',
          type: 'line',
          smooth: 0.4,
          symbol: 'none',
          lineStyle: { color: '#4fd1c5', width: 2.5 },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(79, 209, 197, 0.5)' }, { offset: 1, color: 'rgba(79, 209, 197, 0)' }]) },
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: { color: '#f59e0b', type: 'dashed' },
            data: [{ yAxis: GOAL_NET_WORTH, label: { formatter: `Objetivo: ${GOAL_NET_WORTH/1000}K €`, position: 'insideEndTop', color: '#f59e0b' } }]
          },
          data: projectionData,
      }]
  }), [projectionData]);

  return (
    <>
      <FlowModal 
        isOpen={modalType === 'incomes'}
        onClose={() => setModalType(null)}
        title="Ingresos"
        items={props.monthlyIncomes}
        setItems={props.onMonthlyIncomesChange}
        colorClass="text-gray-300"
      />
      <FlowModal 
        isOpen={modalType === 'expenses'}
        onClose={() => setModalType(null)}
        title="Gastos"
        items={props.monthlyExpenses}
        setItems={props.onMonthlyExpensesChange}
        colorClass="text-gray-300"
      />
      <FlowModal 
        isOpen={modalType === 'investments'}
        onClose={() => setModalType(null)}
        title="Inversiones"
        items={props.monthlyInvestments}
        setItems={props.onMonthlyInvestmentsChange}
        colorClass="text-gray-300"
      />

      <div className="bg-[#223138] text-white p-4 rounded-2xl shadow-xl flex flex-col" style={{ height }}>
          <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white"></h2>
              <div className="flex items-center gap-2">
                  <div className="relative">
                      <button onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)} className="flex items-center gap-2 px-3 py-1 text-sm rounded-[4px] bg-[#171A1F] text-gray-300 hover:bg-[#252a31]">
                          <Clock size={14} />
                          <span>{activeRange}</span>
                          <ChevronDown size={14} className={`transition-transform ${isTimeDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isTimeDropdownOpen && (
                          <div className="absolute top-full right-0 mt-2 w-28 bg-[#171A1F] border border-slate-700 rounded-md shadow-lg z-20">
                              {['1A', '3A', '5A', 'Todo'].map(range => (
                                  <button key={range} onClick={() => handleRangeChange(range)} className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#2d3748]">
                                      {range}
                                  </button>
                              ))}
                          </div>
                      )}
                  </div>
                  <button onClick={toggleFullscreen} className="p-2 bg-[#171A1F] rounded-md hover:bg-[#252a31]">
                      {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                  </button>
              </div>
          </div>

          <div className="flex gap-2 mb-4 text-white">
              <div className="flex-1 flex items-center justify-between bg-[#171A1F] p-2 rounded-[6px]">
                  <span className="text-sm font-semibold text-gray-300">Ingresos</span>
                  <button onClick={() => setModalType('incomes')} className="bg-[#1e5c70] p-1.5 rounded-md hover:bg-cyan-600"><Plus size={14} /></button>
              </div>
              <div className="flex-1 flex items-center justify-between bg-[#171A1F] p-2 rounded-[6px]">
                  <span className="text-sm font-semibold text-gray-300">Gastos</span>
                  <button onClick={() => setModalType('expenses')} className="bg-[#1e5c70] p-1.5 rounded-md hover:bg-cyan-600"><Plus size={14} /></button>
              </div>
              <div className="flex-1 flex items-center justify-between bg-[#171A1F] p-2 rounded-[6px]">
                  <span className="text-sm font-semibold text-gray-300">Inversiones</span>
                  <button onClick={() => setModalType('investments')} className="bg-[#1e5c70] p-1.5 rounded-md hover:bg-cyan-600"><Plus size={14} /></button>
              </div>
          </div>

          <div className="flex-grow relative">
              <ReactECharts
                  ref={echartsRef}
                  echarts={echarts}
                  option={chartOption}
                  style={{ height: '100%', width: '100%' }}
                  notMerge={true}
                  lazyUpdate={true}
              />
          </div>
      </div>
    </>
  );
};

// --- COMPONENTE DE MODAL DE CONTRASEÑA ---
const PasswordModal = ({ onCorrectPassword, onCancel }: { onCorrectPassword: () => void, onCancel: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "qwer") {
      onCorrectPassword();
    } else {
      setError("Contraseña incorrecta.");
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-[#20333b] p-6 rounded-xl shadow-lg" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-semibold text-white mb-4">Introduce la contraseña</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="bg-[#171A1F] border border-slate-700 rounded-md px-3 py-2 w-full text-center text-white outline-none focus:ring-2 focus:ring-cyan-400"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={onCancel} className="text-gray-400 hover:text-white">Cancelar</button>
            <button type="submit" className="bg-[#1e5c70] text-white px-4 py-2 rounded-lg">Mostrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL DEL DASHBOARD ---
export function Dashboard() {
  const [balance, setBalance] = useState(7500.00);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(balance.toFixed(2));
  const [eta, setEta] = useState<string | null>(null);
  
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const [isChartVisible, setIsChartVisible] = useState(false);

  const [monthlyIncomes, setMonthlyIncomes] = useState([{ id: 1, label: 'Salario', amount: 1000 }]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([{ id: 1, label: 'Subscripciones', amount: 20 }]);
  const [monthlyInvestments, setMonthlyInvestments] = useState<{id: number, label: string, amount: number}[]>([]);


  const handleEdit = () => {
    if (isBalanceVisible) {
      setInputValue(balance.toFixed(2).replace('.', ','));
      setIsEditing(true);
    }
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

  const handleVisibilityToggle = () => {
    if (isBalanceVisible) {
      setIsBalanceVisible(false);
    } else {
      setIsPasswordModalOpen(true);
    }
  };
  
  const formattedBalance = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(balance);
  
  return (
    <>
      {isPasswordModalOpen && (
        <PasswordModal 
          onCorrectPassword={() => {
            setIsBalanceVisible(true);
            setIsPasswordModalOpen(false);
          }}
          onCancel={() => setIsPasswordModalOpen(false)}
        />
      )}
      <div className="flex justify-center text-white p-4 overflow-x-hidden">
        <div className="space-y-6 w-full md:mx-auto">
          <div className="mb-6 text-center">
            <p className="text-xl font-medium text-gray-400 mb-2">Patrimonio Actual</p>
            <div className="flex items-center justify-center gap-4 h-12">
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
                <div className="flex items-center gap-4">
                  <h1 
                    onClick={handleEdit}
                    className={`text-4xl font-bold text-cyan-300 transition-all duration-300 ${isBalanceVisible ? 'blur-none cursor-pointer' : 'blur-md cursor-default'}`}
                  >
                    {formattedBalance}
                  </h1>
                  <button onClick={handleVisibilityToggle} className="text-gray-400 hover:text-white">
                    {isBalanceVisible ? <Eye size={24} /> : <EyeOff size={24} />}
                  </button>
                </div>
              )}
            </div>
          </div>

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
          </div>
          
          <div className="bg-[#20333b] rounded-xl overflow-hidden mb-24">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => setIsChartVisible(!isChartVisible)}
            >
              <div className="flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                 </svg>
                 <div className="ml-3">
                    <p className="font-semibold text-gray-200">Ahorro & Inversión</p>
                    <p className="text-sm text-gray-400">Estadísticas AI</p>
                 </div>
              </div>
              <button className="text-gray-400 hover:text-white">
                {isChartVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>

            <div className={`transition-all duration-500 ease-in-out ${isChartVisible ? 'max-h-[1000px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}>
                <div className="p-2">
                  <AreaTimeSeriesChart
                      startNetWorth={balance}
                      monthlyIncomes={monthlyIncomes}
                      onMonthlyIncomesChange={setMonthlyIncomes}
                      monthlyExpenses={monthlyExpenses}
                      onMonthlyExpensesChange={setMonthlyExpenses}
                      monthlyInvestments={monthlyInvestments}
                      onMonthlyInvestmentsChange={setMonthlyInvestments}
                      horizonYears={15}
                      height={500}
                      onEtaChange={setEta}
                   />
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
