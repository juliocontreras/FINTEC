"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, DataZoomComponent, MarkLineComponent, ToolboxComponent } from 'echarts/components';
import { UniversalTransition } from 'echarts/features';
import { Maximize, Minimize, Clock, ChevronDown, Plus, X } from 'lucide-react';

echarts.use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, TitleComponent, DataZoomComponent, MarkLineComponent, ToolboxComponent, UniversalTransition]);

// ============================================================================
// 1. CONTRATO DEL COMPONENTE Y TIPOS
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

// ============================================================================
// 2. LÓGICA DE PROYECCIÓN ORGÁNICA
// ============================================================================
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
      // Simula volatilidad a mitad de mes para un look más orgánico
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const midMonthDate = new Date(currentDate);
      midMonthDate.setDate(currentDate.getDate() + daysInMonth / 2);

      if (midMonthDate < endDate) {
          // fluctuación aleatoria basada en el ahorro mensual
          const fluctuation = (Math.random() - 0.45) * (monthlyNetChange * 0.7); 
          series.push([midMonthDate.getTime(), parseFloat((currentNetWorth + (monthlyNetChange / 2) + fluctuation).toFixed(2))]);
      }

      // Aplica el cambio neto mensual al final del mes
      currentDate.setMonth(currentDate.getMonth() + 1);
      currentNetWorth += monthlyNetChange;
      
      if (currentDate < endDate) {
          series.push([new Date(currentDate).getTime(), parseFloat(currentNetWorth.toFixed(2))]);
      }
    }
    
    // Ordenar por si acaso los puntos se desordenan
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

// ============================================================================
// 3. SUB-COMPONENTES DE UI
// ============================================================================
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

// ============================================================================
// 4. COMPONENTE REACT PRINCIPAL
// ============================================================================
const AreaTimeSeriesChart: React.FC<AreaTimeSeriesChartProps> = (props) => {
  const { height = 500, onEtaChange } = props;

  const echartsRef = useRef<any>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null); // Referencia para el contenedor principal del gráfico
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

  // ============================================================================
  // LÓGICA DE PANTALLA COMPLETA MEJORADA
  // ============================================================================
  useEffect(() => {
    // Función para actualizar el estado cuando cambia el modo de pantalla completa
    const handleFullscreenChange = () => {
      // Comprueba el estado de pantalla completa con y sin prefijos de proveedor
      const isCurrentlyFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
    };

    // Añade listeners para el evento de cambio de pantalla completa
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Para Safari y otros navegadores basados en WebKit

    // Limpia los listeners cuando el componente se desmonta
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const isCurrentlyFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);

    if (!isCurrentlyFullscreen) {
      // Intenta entrar en pantalla completa usando la API estándar o con prefijo
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(err => console.error(`Error al activar pantalla completa: ${err.message}`));
      } else if ((container as any).webkitRequestFullscreen) { // Safari
        (container as any).webkitRequestFullscreen();
      }
    } else {
      // Intenta salir de pantalla completa
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) { // Safari
        (document as any).webkitExitFullscreen();
      }
    }
  }, []);
  // ============================================================================

  const handleRangeChange = (range: string, isInitial = false) => {
    setActiveRange(range);
    setIsTimeDropdownOpen(false);
    const echartsInstance = echartsRef.current?.getEchartsInstance();
    if (!echartsInstance) return;

    const totalPoints = projectionData.length - 1;
    if (totalPoints <= 0) return;

    const pointsPerYear = 24; // Aproximadamente 2 puntos por mes
    let end = 100;
    switch (range) {
      case '1A': end = (pointsPerYear / totalPoints) * 100; break;
      case '3A': end = (pointsPerYear * 3 / totalPoints) * 100; break;
      case '5A': end = (pointsPerYear * 5 / totalPoints) * 100; break;
      default: end = 100;
    }
    
    echartsInstance.dispatchAction({ type: 'dataZoom', start: 0, end: Math.min(100, end) });
  };
  
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

      <div ref={chartContainerRef} className="bg-[#223138] text-white p-4 rounded-2xl shadow-xl flex flex-col" style={{ height }}>
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

          <div className="flex flex-wrap gap-2 mb-4 text-white">
              <div className="flex-1 min-w-[120px] flex items-center justify-between bg-[#171A1F] p-2 rounded-[6px]">
                  <span className="text-sm font-semibold text-gray-300">Ingresos</span>
                  <button onClick={() => setModalType('incomes')} className="bg-[#1e5c70] p-1.5 rounded-md hover:bg-cyan-600"><Plus size={14} /></button>
              </div>
              <div className="flex-1 min-w-[120px] flex items-center justify-between bg-[#171A1F] p-2 rounded-[6px]">
                  <span className="text-sm font-semibold text-gray-300">Gastos</span>
                  <button onClick={() => setModalType('expenses')} className="bg-[#1e5c70] p-1.5 rounded-md hover:bg-cyan-600"><Plus size={14} /></button>
              </div>
              <div className="flex-1 min-w-[120px] flex items-center justify-between bg-[#171A1F] p-2 rounded-[6px]">
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

export default AreaTimeSeriesChart;
