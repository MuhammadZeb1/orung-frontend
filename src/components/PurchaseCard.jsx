import React from "react";
import { Trash2, Calendar, Package } from "lucide-react";

const PurchaseCard = ({ purchase, onDelete }) => {
  const { product, quantity, price, purchasedAt } = purchase;

  return (
    <div className="group flex flex-col md:flex-row gap-6 p-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white relative overflow-hidden">
      {/* Decorative accent for hover */}
      <div className="absolute left-0 top-0 h-full w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Product Image */}
      <div className="relative w-full md:w-32 h-32 flex-shrink-0">
        {product?.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg border border-gray-50"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
            <Package className="text-gray-400" size={32} />
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">
              {product?.name || "Unknown Product"}
            </h3>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md">
                <Package size={14} /> Qty: {quantity}
              </span>
              <span className="text-sm font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md">
                ${price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(purchase._id)}
            className="btn btn-ghost btn-circle text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Remove from history"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-gray-400 border-t border-dashed border-gray-100">
          <Calendar size={12} />
          <span>Purchased: {new Date(purchasedAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCard;