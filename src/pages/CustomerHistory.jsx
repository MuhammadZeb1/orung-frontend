import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerPurchases } from "../redux/purchase/purchaseSlice";

const CustomerHistory = () => {
  const dispatch = useDispatch();
  const { customerPurchases, loading } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(fetchCustomerPurchases());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10">Loading History...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="grid gap-4">
        {customerPurchases.map((item) => (
          <div key={item._id} className="flex items-center bg-white p-4 shadow rounded-lg">
            <img src={item.product?.image} alt="" className="w-16 h-16 object-cover rounded" />
            <div className="ml-4 flex-grow">
              <h3 className="font-bold">{item.product?.name}</h3>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-bold">${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerHistory;