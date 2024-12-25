import React, { useContext, useEffect, useState } from "react";

import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { fetchItems } from "../services/itemService";

import { AuthContext } from "@/context/AuthContext.tsx";

const ITEMS_PER_PAGE = 8;

const HomePage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * ITEMS_PER_PAGE;
        const baseFilter = {
          skip,
          limit: ITEMS_PER_PAGE,
          minPrice,
          maxPrice,
        };

        const filterOptions =
          user?.role === "seller"
            ? { ...baseFilter, sellerId: user.id }
            : baseFilter;

        const data = await fetchItems(filterOptions);

        setItems(data.items);
        setTotalItems(data.total || 0);
      } catch (error) {
        console.error("Failed to load items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [currentPage, minPrice, maxPrice, user?.id]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <>
      <Header />
      <main style={{ padding: "20px" }}>
        <h1>Available Products</h1>

        {/* Фильтры */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ marginLeft: "20px" }}>
            Min Price:
            <input
              style={{ marginLeft: "10px" }}
              type="number"
              value={minPrice || ""}
              onChange={(e) => setMinPrice(Number(e.target.value) || undefined)}
            />
          </label>

          <label style={{ marginLeft: "20px" }}>
            Max Price:
            <input
              style={{ marginLeft: "10px" }}
              type="number"
              value={maxPrice || ""}
              onChange={(e) => setMaxPrice(Number(e.target.value) || undefined)}
            />
          </label>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            {items.map((product) => (
              <div key={product.id} style={{ flex: "0 0 calc(25% - 20px)" }}>
                <ProductCard
                  description={product.description}
                  id={product.id}
                  image={
                    `http://localhost:4000/${product.images[0]}` ||
                    "https://via.placeholder.com/150"
                  }
                  name={product.name}
                  price={product.price}
                />
              </div>
            ))}
          </div>
        )}

        {/* Пагинация */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <p style={{ margin: "0 10px" }}>
            Page {currentPage} of {totalPages}
          </p>
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </button>
        </div>
      </main>
    </>
  );
};

export default HomePage;
