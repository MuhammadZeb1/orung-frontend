import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerPurchases, deleteCustomerPurchase } from "../redux/purchase/purchaseSlice";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react"; // Make sure lucide-react is installed

const Purchases = () => {
  const dispatch = useDispatch();
  const { customerPurchases: purchases, loading, error } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(fetchCustomerPurchases())
      .unwrap()
      .catch((err) => toast.error("Failed to fetch purchases: " + err));
  }, [dispatch]);

  // ✅ The Delete Handler
  const handleDelete = (id) => {
    if (window.confirm("Remove this purchase from your history?")) {
      dispatch(deleteCustomerPurchase(id))
        .unwrap()
        .then(() => toast.success("Record removed"))
        .catch((err) => toast.error("Delete failed: " + err));
    }
  };

  if (loading)
    return <p className="text-center p-10 text-gray-600">Loading purchases...</p>;
  
  if (error)
    return <p className="text-center p-10 text-red-500">{error}</p>;
  
  if (!purchases || purchases.length === 0)
    return <p className="text-center p-10 font-bold text-gray-700">You have no purchases yet.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Purchases</h1>
      <div className="space-y-4">
        {purchases.map((purchase) => (
          <div
            key={purchase._id}
            className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white relative group"
          >
            {/* Product Image */}
            {purchase.product?.image && (
              <img
                src={purchase.product.image}
                alt={purchase.product.name}
                className="w-full md:w-28 h-28 object-cover rounded-lg"
              />
            )}

            {/* Purchase Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-lg font-semibold text-gray-900">
                    {purchase.product?.name}
                  </p>
                  
                  {/* ✅ THE DELETE BUTTON */}
                  <button 
                    onClick={() => handleDelete(purchase._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete record"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <p className="text-gray-600 mt-1">Quantity: {purchase.quantity}</p>
                <p className="text-gray-600 mt-1 font-medium">Price: ${purchase.price.toFixed(2)}</p>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Purchased at: {new Date(purchase.purchasedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Purchases;