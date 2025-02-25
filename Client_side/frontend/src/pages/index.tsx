import React, { useContext, useEffect, useState } from "react";

import ProductCard from "../components/ProductCard";
import { fetchItems, Item } from "../services/itemService";
import { fetchCategories } from "../services/categoryService";

import { AuthContext } from "@/context/AuthContext.tsx";

const ITEMS_PER_PAGE = 8;

const HomePage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [attributes, setAttributes] = useState<Record<string, any>>({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();

        setCategories(data[0]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * ITEMS_PER_PAGE;

        // Filter out empty or undefined attribute values
        const filteredAttributes = Object.keys(attributes).reduce(
          (acc, key) => {
            const value = attributes[key];

            if (
              value !== undefined &&
              value !== "" &&
              !(typeof value === "object" && Object.keys(value).length === 0)
            ) {
              acc[key] = value;
            }

            return acc;
          },
          {} as Record<string, any>,
        );

        const baseFilter = {
          skip,
          limit: ITEMS_PER_PAGE,
          minPrice,
          maxPrice,
          typeId: selectedCategory, // Only include typeId if selectedCategory is defined
          attributes:
            Object.keys(filteredAttributes).length > 0
              ? filteredAttributes
              : undefined,
        };

        const filterOptions =
          user?.role === "seller"
            ? { ...baseFilter, sellerId: user.id }
            : baseFilter;

        const data = await fetchItems(filterOptions);

        setItems(data.items);
        setTotalItems(data.total || 0);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [currentPage, minPrice, maxPrice, selectedCategory, attributes, user?.id]);

  const totalPages =
    totalItems > 0 ? Math.ceil(totalItems / ITEMS_PER_PAGE) : 0;

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value ? Number(e.target.value) : undefined; // Set to undefined if empty

    setSelectedCategory(categoryId);
    setAttributes({}); // Reset attribute filters when category changes
  };

  // Handle attribute filter changes
  const handleAttributeChange = (key: string, value: any) => {
    setAttributes((prev) => ({
      ...prev,
      [key]: typeof value === "number" ? value : { ...prev[key], ...value },
    }));
  };

  // Get attributes for the selected category
  const selectedCategoryAttributes = selectedCategory
    ? categories.find((cat) => cat.id === selectedCategory)?.attributes
    : [];

  return (
    <>
      <main style={{ padding: "20px" }}>
        {/* Category Dropdown */}
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <label style={{ fontWeight: "500", fontSize: "16px" }}>
            Категория:
            <select
              style={{
                marginLeft: "10px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                fontSize: "14px",
              }}
              value={selectedCategory || ""}
              onChange={handleCategoryChange}
            >
              <option value="">Выберите категорию</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Price Filters */}
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <label
            style={{ marginLeft: "20px", fontWeight: "500", fontSize: "16px" }}
          >
            Минимальная цена:
            <input
              style={{
                marginLeft: "10px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                fontSize: "14px",
              }}
              type="number"
              value={minPrice || ""}
              onChange={(e) => setMinPrice(Number(e.target.value) || undefined)}
            />
          </label>

          <label
            style={{ marginLeft: "20px", fontWeight: "500", fontSize: "16px" }}
          >
            Максимальная цена:
            <input
              style={{
                marginLeft: "10px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                fontSize: "14px",
              }}
              type="number"
              value={maxPrice || ""}
              onChange={(e) => setMaxPrice(Number(e.target.value) || undefined)}
            />
          </label>
        </div>

        {/* Attribute Filters */}
        {selectedCategoryAttributes &&
          selectedCategoryAttributes.length > 0 && (
            <div
              style={{
                marginBottom: "20px",
                padding: "10px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                Атрибуты
              </h3>
              {selectedCategoryAttributes.map((attr: any) => (
                <div key={attr.id} style={{ marginBottom: "10px" }}>
                  <label style={{ fontWeight: "500", fontSize: "16px" }}>
                    {attr.name}:
                    {attr.type === "STRING" && (
                      <input
                        style={{
                          marginLeft: "10px",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          backgroundColor: "#fff",
                          fontSize: "14px",
                        }}
                        type="text"
                        onChange={(e) =>
                          handleAttributeChange(attr.name, e.target.value)
                        }
                      />
                    )}
                    {attr.type === "NUMBER" && (
                      <>
                        <input
                          style={{
                            marginLeft: "10px",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            backgroundColor: "#fff",
                            fontSize: "14px",
                            width: "80px",
                          }}
                          type="number"
                          onChange={(e) =>
                            handleAttributeChange(
                              attr.name,
                              Number(e.target.value),
                            )
                          }
                        />
                      </>
                    )}
                    {attr.type === "BOOLEAN" && (
                      <select
                        style={{
                          marginLeft: "10px",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          backgroundColor: "#fff",
                          fontSize: "14px",
                        }}
                        onChange={(e) =>
                          handleAttributeChange(
                            attr.name,
                            e.target.value === "true",
                          )
                        }
                      >
                        <option value="">Выберите</option>
                        <option value="true">Да</option>
                        <option value="false">Нет</option>
                      </select>
                    )}
                  </label>
                </div>
              ))}
            </div>
          )}

        {/* Product List */}
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
                  reservationExpiry={product.reservationExpiry}
                  reservedById={product.reservedById}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div>
          {/* Ваш код с отображением товаров */}

          {totalPages > 0 ? (
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
                Предыдущая
              </button>
              <p style={{ margin: "0 10px" }}>
                Страница {currentPage} из {totalPages}
              </p>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Следующая
              </button>
            </div>
          ) : (
            <p
              style={{ textAlign: "center", marginTop: "20px", color: "#888" }}
            >
              Товары отсутствуют
            </p>
          )}
        </div>
      </main>
    </>
  );
};

export default HomePage;
