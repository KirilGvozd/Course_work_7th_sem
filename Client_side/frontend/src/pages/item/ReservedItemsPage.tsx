import React, { useState, useEffect } from "react";

import ProductCard from "../../components/ProductCard";

const ITEMS_PER_PAGE = 8;

const ReservedItemsPage: React.FC = () => {
  const [reservedItems, setReservedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchReservedItems = async (page: number) => {
    setLoading(true);
    try {
      const skip = (page - 1) * ITEMS_PER_PAGE;
      const response = await fetch(
        `http://localhost:4000/item/reserved?skip=${skip}&limit=${ITEMS_PER_PAGE}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();

      if (response.ok) {
        setReservedItems(data[0]);
        setTotalItems(data[1]);
      } else {
        console.error("Ошибка при загрузке данных");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservedItems(currentPage);
  }, [currentPage]);

  const handleRemoveItem = (itemId: number) => {
    setReservedItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId),
    );
  };

  const totalPages =
    totalItems > 0 ? Math.ceil(totalItems / ITEMS_PER_PAGE) : 0;

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <p>Загрузка...</p>
      ) : reservedItems.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {reservedItems.map((item) => (
            <div key={item.id} style={{ flex: "0 0 calc(25% - 20px)" }}>
              <ProductCard
                description={item.description}
                id={item.id}
                image={
                  item.images[0]
                    ? `http://localhost:4000/${item.images[0]}`
                    : "https://via.placeholder.com/150"
                }
                name={item.name}
                price={item.price}
                reservationExpiry={item.reservationExpiry}
                reservedById={item.reservedById}
                onRemove={() => handleRemoveItem(item.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>У вас нет забронированных товаров</p>
      )}

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
          <p style={{ textAlign: "center", marginTop: "20px", color: "#888" }}>
            Товары отсутствуют
          </p>
        )}
      </div>
    </div>
  );
};

export default ReservedItemsPage;
