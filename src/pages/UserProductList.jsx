import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "../components/AppSidebar";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProducts } from "../redux/products/productsSlice";
import { motion, AnimatePresence } from "framer-motion";
import UserCardProduct from "@/components/UserCardProduct";

const UserProductList = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);
  
  const { category } = useParams();

  const [baseProducts, setBaseProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter by category from URL
  useEffect(() => {
    const filtered = category
      ? items.filter(
          (p) => p.category?.name?.toLowerCase() === category.toLowerCase()
        )
      : items;

    setBaseProducts(filtered);
    setFilteredProducts(filtered); // show all by default
  }, [items, category]);
   console.log("khan")
  if (loading)
    return <div className="flex justify-center p-10">Loading...</div>;

  return (
    <SidebarProvider>
      <motion.div
        className="flex min-h-screen w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Sidebar */}
        <AppSidebar products={baseProducts} onFilterChange={setFilteredProducts} />

        <main className="flex-1 p-6">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold capitalize">
              {category ? `${category} Products` : "All Products"}
            </h1>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">
              No products found.
            </p>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <UserCardProduct product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </motion.div>
    </SidebarProvider>
  );
};

export default UserProductList;
