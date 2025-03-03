import React, { useContext, useEffect, useState } from "react";

import ProductCard from "../components/ProductCard";
import { fetchItems, Item } from "../services/itemService";
import { fetchCategories } from "../services/categoryService";

import { AuthContext } from "@/context/AuthContext.tsx";

const ITEMS_PER_PAGE = 8;

const HomePage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]); // Состояние для отфильтрованных товаров
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
  const [searchQuery, setSearchQuery] = useState(""); // Состояние для поискового запроса
  // const [showWishlistButton, setShowWishlistButton] = useState(false);
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
          typeId: selectedCategory,
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
        setFilteredItems(data.items); // Инициализируем отфильтрованные товары
        setTotalItems(data.total || 0);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [currentPage, minPrice, maxPrice, selectedCategory, attributes, user?.id]);

  // Функция для фильтрации товаров по поисковому запросу
  useEffect(() => {
    if (searchQuery) {
      const filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setFilteredItems(filtered);
      // setShowWishlistButton(filtered.length === 0);
    } else {
      setFilteredItems(items);
      // setShowWishlistButton(false);
    }
  }, [searchQuery, items]);

  // const handleAddToWishlist = async (data: {
  //   itemName: string;
  //   userId: number;
  // }) => {
  //   try {
  //     const response = await fetch("http://localhost:4000/item/add-wishlist", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json", // Добавляем токен для авторизации
  //       },
  //       credentials: "include",
  //       body: JSON.stringify(data),
  //     });
  //
  //     if (!response.ok) {
  //       throw new Error("Ошибка при добавлении в Wishlist");
  //     }
  //
  //     return await response.json(); // Возвращаем данные ответа
  //   } catch (error) {
  //     console.error("Ошибка:", error);
  //     throw error;
  //   }
  // };

  const totalPages =
    totalItems > 0 ? Math.ceil(totalItems / ITEMS_PER_PAGE) : 0;

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value ? Number(e.target.value) : undefined;

    setSelectedCategory(categoryId);
    setAttributes({});
  };

  const handleAttributeChange = (key: string, value: any) => {
    const newValue = value === "" ? undefined : value;

    setAttributes((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const selectedCategoryAttributes = selectedCategory
    ? categories.find((cat) => cat.id === selectedCategory)?.attributes
    : [];

  return (
    <>
      <main className="px-4 sm:px-8 lg:px-16 py-8 bg-gray-100 min-h-screen">
        {/* Поисковая строка */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md animate-fade-in">
          <label className="block text-gray-700 font-medium mb-2">
            Поиск:
            <input
              className="ml-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Введите название или описание товара"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>
        {/*{showWishlistButton && user?.role === "buyer" && (*/}
        {/*  <div className="mb-6 p-4 bg-white rounded-lg shadow-md animate-fade-in">*/}
        {/*    <p className="text-gray-700 font-medium mb-2">*/}
        {/*      Товар с названием "{searchQuery}" не найден.*/}
        {/*    </p>*/}
        {/*    <button*/}
        {/*      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"*/}
        {/*      onClick={async () => {*/}
        {/*        if (!user || user.role !== "buyer") {*/}
        {/*          alert("Только покупатели могут добавлять товары в Wishlist.");*/}

        {/*          return;*/}
        {/*        }*/}

        {/*        try {*/}
        {/*          await handleAddToWishlist({*/}
        {/*            itemName: searchQuery,*/}
        {/*            userId: user.id,*/}
        {/*          });*/}
        {/*          alert("Товар успешно добавлен в Wishlist!");*/}
        {/*        } catch (error) {*/}
        {/*          console.error("Ошибка при добавлении в Wishlist:", error);*/}
        {/*          alert("Не удалось добавить товар в Wishlist.");*/}
        {/*        }*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      Добавить в Wishlist*/}
        {/*    </button>*/}
        {/*  </div>*/}
        {/*)}*/}

        {/* Category Dropdown */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md animate-fade-in">
          <label className="block text-gray-700 font-medium mb-2">
            Категория:
            <select
              className="ml-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
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
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label className="text-gray-700 font-medium mr-2">
                Минимальная цена:
              </label>
              <input
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Введите минимальную цену"
                type="text"
                value={minPrice ?? ""}
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  const value = input.value.replace(/[^0-9]/g, "");

                  input.value = value;
                  setMinPrice(value ? Number(value) : undefined);
                }}
              />
            </div>

            <div className="flex items-center">
              <label className="text-gray-700 font-medium mr-2">
                Максимальная цена:
              </label>
              <input
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Введите максимальную цену"
                type="text"
                value={maxPrice ?? ""}
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  const value = input.value.replace(/[^0-9]/g, "");

                  input.value = value;
                  setMaxPrice(value ? Number(value) : undefined);
                }}
              />
            </div>
          </div>
        </div>

        {/* Attribute Filters */}
        {selectedCategoryAttributes &&
          selectedCategoryAttributes.length > 0 && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-md animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">Атрибуты</h3>
              {selectedCategoryAttributes.map((attr: any) => (
                <div key={attr.id} className="mb-4">
                  <label className="text-gray-700 font-medium block">
                    {attr.name}:
                  </label>
                  {attr.type === "STRING" && (
                    <input
                      className="mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200 w-full"
                      type="text"
                      onChange={(e) =>
                        handleAttributeChange(attr.name, e.target.value)
                      }
                    />
                  )}
                  {attr.type === "NUMBER" && (
                    <input
                      className="mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200 w-full"
                      type="number"
                      onChange={(e) =>
                        handleAttributeChange(
                          attr.name,
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                    />
                  )}
                  {attr.type === "BOOLEAN" && (
                    <div>
                      {attr.name}:
                      <select
                        value={attributes[attr.name] ?? ""}
                        onChange={(e) => {
                          const selectedValue = e.target.value;

                          if (selectedValue === "") {
                            handleAttributeChange(attr.name, undefined);
                          } else {
                            handleAttributeChange(
                              attr.name,
                              selectedValue === "true",
                            );
                          }
                        }}
                      >
                        <option value="">Выберите</option>
                        <option value="true">Да</option>
                        <option value="false">Нет</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        {/* Product List */}
        {loading ? (
          <p className="text-center text-gray-600 font-medium animate-pulse">
            Loading...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
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
        <div className="mt-8">
          {totalPages > 0 ? (
            <div className="flex justify-center items-center space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Предыдущая
              </button>
              <p className="text-gray-700 font-medium">
                Страница {currentPage} из {totalPages}
              </p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Следующая
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-600 font-medium mt-4">
              Товары отсутствуют
            </p>
          )}
        </div>
      </main>
    </>
  );
};

export default HomePage;
