import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminPurchases } from "../redux/purchase/purchaseSlice";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { adminPurchases } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(fetchAdminPurchases());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Master Sales List</h2>
      <div className="overflow-x-auto">
        <table className="table w-full bg-base-100 shadow-xl">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Revenue</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {adminPurchases.map((sale) => (
              <tr key={sale._id}>
                <td>
                  <div className="font-bold">{sale.customer?.name}</div>
                  <div className="text-xs opacity-50">{sale.customer?.email}</div>
                </td>
                <td>{sale.product?.name}</td>
                <td>{sale.quantity}</td>
                <td className="text-green-600 font-bold">${sale.price}</td>
                <td>{new Date(sale.purchasedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;