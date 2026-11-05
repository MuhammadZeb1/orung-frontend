import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminPurchases, deleteAdminPurchase } from "../redux/purchase/purchaseSlice";
import { toast } from "react-toastify";
import { Trash2, User, MapPin, Phone, Mail, Package } from "lucide-react";

const AdminPurchases = () => {
  const dispatch = useDispatch();
  const { adminPurchases: purchases, loading, error } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(fetchAdminPurchases())
      .unwrap()
      .catch((err) => toast.error("Failed to fetch admin purchases: " + err));
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction record? This cannot be undone.")) {
      dispatch(deleteAdminPurchase(id))
        .unwrap()
        .then(() => toast.success("Record deleted"))
        .catch((err) => toast.error("Delete failed: " + err));
    }
  };

  const totalRevenue = purchases?.reduce((acc, curr) => acc + curr.price, 0) || 0;

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <span className="loading loading-dots loading-lg text-primary"></span>
    </div>
  );

  if (error) return (
    <div className="alert alert-error max-w-4xl mx-auto mt-10 text-white">
      <span>{error}</span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Sales Registry</h1>
          <p className="text-gray-500 mt-1">Manage and track all customer deliveries</p>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <p className="text-sm text-gray-400 uppercase tracking-widest">Total Revenue</p>
          <p className="text-3xl font-black text-primary">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* --- CARDS LIST --- */}
      <div className="grid gap-6">
        {purchases?.map((purchase) => (
          <div key={purchase._id} className="bg-white border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row">
              
              {/* 1. Product Preview */}
              <div className="w-full md:w-48 bg-gray-50 flex items-center justify-center p-4">
                <img 
                  src={purchase.product?.image || "https://via.placeholder.com/150"} 
                  className="h-32 w-32 object-cover rounded-lg shadow-sm"
                  alt="Product"
                />
              </div>

              {/* 2. Transaction & Customer Info */}
              <div className="flex-1 p-5 border-l border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{purchase.product?.name}</h3>
                    <p className="text-sm text-gray-500">Order ID: #{purchase._id.slice(-8)}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(purchase._id)}
                    className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Delivery Column */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase">Delivery Information</p>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <User size={16} className="mt-1 text-primary" />
                      <span>{purchase.customer?.name || "Unknown Customer"}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <MapPin size={16} className="mt-1 text-primary" />
                      <span className="italic">
                         {/* Assuming address exists on the customer object */}
                        {purchase.customer?.address || "No address provided"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <Phone size={16} className="mt-1 text-primary" />
                      <span>{purchase.customer?.phone || "N/A"}</span>
                    </div>
                  </div>

                  {/* Order Summary Column */}
                  <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-bold text-gray-400 uppercase">Order Summary</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-bold">{purchase.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-2">
                      <span className="text-gray-600">Total Price:</span>
                      <span className="font-bold text-green-600">${purchase.price.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 text-[11px] text-gray-400 flex items-center gap-1">
                      <Mail size={12} /> {purchase.customer?.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50/50 px-5 py-2 flex justify-between items-center text-xs text-gray-400 border-t">
              <span>Date of Purchase: {new Date(purchase.purchasedAt).toLocaleString()}</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium uppercase">
                Paid
              </span>
            </div>
          </div>
        ))}
      </div>

      {(!purchases || purchases.length === 0) && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <Package size={48} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500 font-medium">No purchase records found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPurchases;