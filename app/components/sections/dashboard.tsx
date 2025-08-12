"use client"

import { useState } from "react"
import { Check, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react"
import AreaTimeSeriesChart from '@/components/charts/AreaTimeSeriesChart';

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
          
          {/* --- MODIFICACIÓN: Card del Gráfico con color de fondo homogéneo --- */}
          <div className="bg-[#20333b] rounded-xl overflow-hidden mb-24">
            {/* Cabecera Clicable para Plegar/Desplegar */}
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => setIsChartVisible(!isChartVisible)}
            >
              <h3 className="font-semibold text-lg text-white">Objetivo 100K</h3>
              <button className="text-gray-400 hover:text-white">
                {isChartVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>

            {/* Contenido Plegable con Transición */}
            <div className={`transition-all duration-500 ease-in-out ${isChartVisible ? 'max-h-[1000px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}>
               {/* Se elimina el div con fondo negro para que herede el color de la card */}
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
