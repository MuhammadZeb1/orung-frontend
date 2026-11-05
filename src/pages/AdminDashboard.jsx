import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminAnalytics } from "../redux/purchase/purchaseSlice";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  BarChart3, 
  Medal,
  Globe
} from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  // Defaulting to "all" to show lifetime stats on load
  const [period, setPeriod] = useState("all"); 
  const { analytics, loading } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(fetchAdminAnalytics(period));
  }, [dispatch, period]);

  // Safe access helper to prevent .toLocaleString() errors on undefined
  const formatCurrency = (val) => (val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

  const stats = [
    {
      title: "Total Sales",
      value: `$${formatCurrency(analytics?.summary?.totalSales)}`,
      icon: <DollarSign className="text-blue-600" size={20} />,
      bg: "bg-blue-50",
    },
    {
      title: "Net Profit",
      value: `$${formatCurrency(analytics?.summary?.totalProfit)}`,
      icon: <TrendingUp className="text-green-600" size={20} />,
      bg: "bg-green-50",
    },
    {
      title: "Total Loss",
      value: `$${formatCurrency(analytics?.summary?.totalLoss)}`,
      icon: <TrendingDown className="text-red-600" size={20} />,
      bg: "bg-red-50",
    },
    {
      title: "Total Orders",
      value: analytics?.totalTransactions || 0,
      icon: <Package className="text-purple-600" size={20} />,
      bg: "bg-purple-50",
    },
  ];

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-gray-500 font-medium animate-pulse">Calculating financials...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      
      {/* --- HEADER & FILTERS --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <BarChart3 className="text-primary" /> Executive Analytics
          </h1>
          <p className="text-gray-500 text-sm">Real-time financial performance tracking</p>
        </div>

        {/* Updated Filter Toggle with "All" */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl self-center lg:self-auto">
          {["all", "daily", "weekly", "monthly"].map((t) => (
            <button
              key={t}
              onClick={() => setPeriod(t)}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                period === t 
                ? "bg-white text-primary shadow-sm ring-1 ring-black/5" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              {t === "all" ? "All Time" : t}
            </button>
          ))}
        </div>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
            <div className={`p-4 rounded-2xl ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h2 className="text-xl font-black text-gray-800">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* --- BEST SELLERS LEADERBOARD --- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
               <Medal className="text-yellow-500" size={22} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Best Selling Products</h3>
          </div>
          <span className="text-[10px] bg-gray-100 px-3 py-1.5 rounded-lg font-black text-gray-500 uppercase tracking-widest">
            Ranked by Units
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr className="text-gray-400 text-[11px] uppercase tracking-widest bg-gray-50/50">
                <th className="py-5 px-6 font-bold">Rank</th>
                <th className="font-bold">Product Details</th>
                <th className="font-bold">Inventory Sold</th>
                <th className="font-bold text-center">Revenue</th>
                <th className="font-bold text-right px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.bestSellingProducts?.map((product, index) => (
                <tr key={index} className="hover:bg-blue-50/30 transition-colors border-b last:border-0 border-gray-50 group">
                  <td className="py-5 px-6">
                    <span className={`
                      w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm
                      ${index === 0 ? "bg-yellow-100 text-yellow-700 shadow-sm" : 
                        index === 1 ? "bg-slate-100 text-slate-600" : 
                        index === 2 ? "bg-orange-100 text-orange-700" : "bg-gray-50 text-gray-400"}
                    `}>
                      #{index + 1}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={product.image || "https://via.placeholder.com/150"} 
                          alt={product.name} 
                          className="w-14 h-14 rounded-xl object-cover shadow-sm group-hover:ring-2 ring-primary/20 transition-all"
                        />
                      </div>
                      <span className="font-bold text-gray-700 text-sm sm:text-base">{product.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1.5 max-w-[120px]">
                      <div className="flex justify-between text-xs font-bold text-gray-500">
                        <span>{product.unitsSold} units</span>
                      </div>
                      <progress 
                        className="progress progress-primary w-full h-1.5 shadow-sm" 
                        value={product.unitsSold} 
                        max={analytics.bestSellingProducts[0].unitsSold}
                      ></progress>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-sm">
                      ${formatCurrency(product.revenue)}
                    </span>
                  </td>
                  <td className="text-right px-6">
                    <span className="text-[10px] bg-primary/10 text-primary px-3 py-1.5 rounded-lg uppercase font-black tracking-tighter">
                      Active Seller
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!analytics?.bestSellingProducts || analytics.bestSellingProducts.length === 0) && (
            <div className="py-24 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Globe className="text-gray-300" size={40} />
              </div>
              <h4 className="text-gray-800 font-bold">No Data Found</h4>
              <p className="text-gray-400 text-sm max-w-xs mx-auto mt-1">
                We couldn't find any sales records for the selected period ({period}).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;