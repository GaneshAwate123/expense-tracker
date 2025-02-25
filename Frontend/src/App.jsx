import { useEffect, useState } from "react";
import { FaTrash, FaWindowClose, FaEdit } from 'react-icons/fa';
import { PieChart } from '@mui/x-charts/PieChart';
import { publicRequest } from './requestMethods';

function App() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [updatedId, setUpdatedId] = useState("");
  const [updatedLabel, setUpdatedLabel] = useState("");
  const [updatedAmount, setUpdatedAmount] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddExpense = () => setShowAddExpense(!showAddExpense);
  const handleShowChart = () => setShowReport(!showReport);
  const handleShowEdit = (id) => {
    setShowEdit(!showEdit);
    setUpdatedId(id);
  };

  const handleUpdateExpense = async () => {
    if(updatedId){
      try {
        await publicRequest.put(`/expenses/${updatedId}`, {
          value: updatedAmount,
          label: updatedLabel,
          date: updatedDate
        });
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleExpense = async () => {
    try {
      await publicRequest.post("/expenses", {
        label,
        date,
        value: amount
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getExpense = async () => {
      try {
        const res = await publicRequest.get("/expenses");
        setExpenses(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getExpense();
  }, []);

  const handleDelete = async (id) => {
    try {
      await publicRequest.delete(`/expenses/${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalSum = filteredExpenses.reduce((acc, curr) => acc + curr.value, 0);

  // Transform expenses data for PieChart
  const pieChartData = expenses.map((expense, index) => ({
    id: index,
    value: Number(expense.value),
    label: expense.label
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8 tracking-wide">
          Expense Tracker
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex gap-4">
            <button 
              className="bg-amber-700 text-white px-6 py-3 rounded-full hover:bg-amber-800 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              onClick={handleAddExpense}
            >
              Add Expense
            </button>
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              onClick={handleShowChart}
            >
              Expense Report
            </button>
          </div>

          <input
            type="text"
            placeholder="Search expenses..."
            className="w-full sm:w-64 p-3 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {showAddExpense && (
          <div className="absolute top-20 left-4 sm:left-20 z-50 bg-white/95 rounded-xl p-6 shadow-2xl w-full max-w-md backdrop-blur-sm">
            <FaWindowClose 
              className="text-red-500 text-2xl cursor-pointer float-right hover:scale-110 transition-transform"
              onClick={handleAddExpense}
            />
            <div className="space-y-4 mt-8">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Expense Name</label>
                <input 
                  type="text" 
                  placeholder="Snacks" 
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                  onChange={(e) => setLabel(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Expense Date</label>
                <input 
                  type="date" 
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                  onChange={(e) => setDate(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Expense Amount</label>
                <input 
                  type="number" 
                  placeholder="50" 
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <button 
                className="w-full bg-amber-700 text-white p-3 rounded-lg hover:bg-amber-800 transition-all duration-300"
                onClick={handleExpense}
              >
                Add Expense
              </button>
            </div>
          </div>
        )}

        {/* {showReport && (
          <div className="absolute top-20 left-4 sm:left-1/3 z-50 bg-white/95 rounded-xl p-6 shadow-2xl w-full max-w-lg backdrop-blur-sm">
            <FaWindowClose
              className="text-red-500 text-2xl cursor-pointer float-right hover:scale-110 transition-transform"
              onClick={handleShowChart}
            />
            <div className="mt-8 w-full h-[400px]">
              <PieChart
                series={[{
                  data: pieChartData,
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                  startAngle: -90,
                  endAngle: 270,
                }]}
                width={400}
                height={300}
                margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
              />
              <div className="text-gray-800 font-semibold mt-4 text-center">
                <strong>Total Expenses:</strong> ${totalSum}
              </div>
            </div>
          </div>
        )} */}
        {showReport && (
          <div className="absolute top-20 left-4 sm:left-1/3 z-50 bg-white/95 rounded-xl p-6 shadow-2xl w-full max-w-lg backdrop-blur-sm">
            <FaWindowClose
              className="text-red-500 text-2xl cursor-pointer float-right hover:scale-110 transition-transform"
              onClick={handleShowChart}
            />
            <div className="mt-8 w-full h-[400px] flex flex-col items-center">
              <PieChart
                series={[{
                  data: pieChartData,
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 2, // Reduced padding to minimize overlap
                  cornerRadius: 5,
                  startAngle: -90,
                  endAngle: 270,
                  // valueFormatter: (value) => `$${value}`, //Format values with dollar sign
                }]}
                width={400}
                height={300}
                margin={{ top: 0, bottom: 100, left: 20, right: 20 }} // Increased bottom margin for labels
                slotProps={{  
                  legend: {
                    direction: 'row', // Stack legend items horizontally
                    position: { vertical: 'bottom', horizontal: 'center' }, // Move legend to bottom center
                    padding: 20, // Add padding around legend
                  },
                }}
                colors={['#4CAF50', '#2196F3', '#9C27B0', '#00BCD4', '#F44336']} // Custom colors for better distinction
              />
              <div className="text-gray-800 font-semibold mt-4 text-center">
                <strong>Total Expenses:</strong> ${totalSum}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredExpenses.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center shadow-md hover:shadow-lg transition-all duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">{item.label}</h2>
              <span className="text-gray-600">{item.date}</span>
              <span className="text-lg font-medium text-gray-800">${item.value}</span>
              <div className="flex gap-4 mt-2 sm:mt-0">
                <FaTrash 
                  className="text-red-500 cursor-pointer hover:scale-110 transition-transform" 
                  onClick={() => handleDelete(item._id)}
                />
                <FaEdit 
                  className="text-purple-600 cursor-pointer hover:scale-110 transition-transform" 
                  onClick={() => handleShowEdit(item._id)}
                />
              </div>
            </div>
          ))}
        </div>

        {showEdit && (
          <div className="absolute top-20 right-4 sm:right-20 z-50 bg-white/95 rounded-xl p-6 shadow-2xl w-full max-w-md backdrop-blur-sm">
            <FaWindowClose 
              className="text-red-500 text-2xl cursor-pointer float-right hover:scale-110 transition-transform"
              onClick={handleShowEdit}
            />
            <div className="space-y-4 mt-8">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Expense Name</label>
                <input 
                  type="text" 
                  placeholder="Snacks" 
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                  onChange={(e) => setUpdatedLabel(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Expense Date</label>
                <input 
                  type="date" 
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                  onChange={(e) => setUpdatedDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Expense Amount</label>
                <input 
                  type="number" 
                  placeholder="50" 
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                  onChange={(e) => setUpdatedAmount(e.target.value)}
                />
              </div>
              <button 
                className="w-full bg-amber-700 text-white p-3 rounded-lg hover:bg-amber-800 transition-all duration-300"
                onClick={handleUpdateExpense}
              >
                Update Expense
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;