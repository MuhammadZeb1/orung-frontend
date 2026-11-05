import { useEffect, useMemo, useState } from "react";

const ProductFilter = ({ products = [], onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: "",
    subCategory: "",
    minPrice: 0,
    maxPrice: 1000,
  });

  const subCategories = ["Shirts", "Pants", "Shoes"];

  const filteredProducts = useMemo(() => {
    // 🔥 If no filters applied → return ALL products
    const noFiltersApplied =
      !filters.search &&
      !filters.subCategory &&
      filters.minPrice === 0 &&
      filters.maxPrice === 1000;

    if (noFiltersApplied) return products;

    return products.filter((product) => {
      const matchName = product.name
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());

      const matchSubCategory = filters.subCategory
        ? product.category?.subCategory?.toLowerCase() ===
          filters.subCategory.toLowerCase()
        : true;

      const matchPrice =
        product.price >= filters.minPrice &&
        product.price <= filters.maxPrice;

      return matchName && matchSubCategory && matchPrice;
    });
  }, [products, filters]);

  useEffect(() => {
    onFilterChange(filteredProducts);
  }, [filteredProducts, onFilterChange]);

  return (
    <div className="space-y-4 bg-white p-4 rounded-md shadow">

      <input
        type="text"
        placeholder="Search by name"
        value={filters.search}
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
        className="w-full px-3 py-2 border rounded-md"
      />

      <select
        value={filters.subCategory}
        onChange={(e) =>
          setFilters({ ...filters, subCategory: e.target.value })
        }
        className="w-full px-3 py-2 border rounded-md"
      >
        <option value="">All Sub Categories</option>
        {subCategories.map((sub) => (
          <option key={sub} value={sub}>
            {sub}
          </option>
        ))}
      </select>

      <div>
        <label>Min Price: ${filters.minPrice}</label>
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters({ ...filters, minPrice: Number(e.target.value) })
          }
          className="w-full"
        />
      </div>

      <div>
        <label>Max Price: ${filters.maxPrice}</label>
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="w-full"
        />
      </div>

      <button
        onClick={() =>
          setFilters({
            search: "",
            subCategory: "",
            minPrice: 0,
            maxPrice: 1000,
          })
        }
        className="w-full border px-4 py-2 rounded-md"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default ProductFilter;
