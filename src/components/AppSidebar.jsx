import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";

const AppSidebar = ({ products = [], onFilterChange }) => {
  // Dynamically calculate max price from products
  const maxPriceFromProducts = useMemo(() => {
    const prices = products.map((p) => p.price || 0);
    return prices.length ? Math.max(...prices) : 1000;
  }, [products]);

  // Initialize filters AFTER products are loaded
  const [filters, setFilters] = useState({
    search: "",
    subCategory: "all",
    priceRange: [0, 1000], // temporary, will set after products load
  });

  // Set initial price range once products are loaded
  useEffect(() => {
    if (products.length) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [0, maxPriceFromProducts],
      }));
    }
  }, [products, maxPriceFromProducts]);

  const subCategories = [
    ...new Set(products.map((p) => p.category?.subCategory).filter(Boolean)),
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const subCat = product.category?.subCategory?.toLowerCase() || "";
      const price = typeof product.price === "number" ? product.price : 0;

      const matchName = filters.search
        ? name.includes(filters.search.toLowerCase())
        : true;
      const matchSubCategory =
        !filters.subCategory || filters.subCategory === "all"
          ? true
          : subCat === filters.subCategory.toLowerCase();
      const matchPrice =
        price >= (filters.priceRange?.[0] ?? 0) &&
        price <= (filters.priceRange?.[1] ?? maxPriceFromProducts);

      return matchName && matchSubCategory && matchPrice;
    });
  }, [products, filters, maxPriceFromProducts]);

  useEffect(() => {
    onFilterChange(filteredProducts);
  }, [filteredProducts, onFilterChange]);

  return (
    <Sidebar className="top-[73px] h-[calc(100vh-73px)] border-t">
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold tracking-tight">Filters</h2>
      </SidebarHeader>

      <SidebarContent className="px-4 space-y-6">
        {/* Search */}
        <SidebarGroup>
          <SidebarGroupLabel>Search</SidebarGroupLabel>
          <SidebarGroupContent>
            <Input
              placeholder="Product name..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Category */}
        <SidebarGroup>
          <SidebarGroupLabel>Category</SidebarGroupLabel>
          <SidebarGroupContent>
            <Select
              value={filters.subCategory}
              onValueChange={(val) =>
                setFilters({ ...filters, subCategory: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {subCategories.map((sub) => (
                  <SelectItem key={sub} value={sub.toLowerCase()}>
                    {sub}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Price Range */}
        <SidebarGroup>
          <SidebarGroupLabel>
            Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-4">
            <Slider
              max={maxPriceFromProducts}
              step={10}
              value={filters.priceRange}
              onValueChange={(val) =>
                setFilters({ ...filters, priceRange: val })
              }
            />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Reset */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            setFilters({
              search: "",
              subCategory: "all",
              priceRange: [0, maxPriceFromProducts],
            })
          }
        >
          Reset Filters
        </Button>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
