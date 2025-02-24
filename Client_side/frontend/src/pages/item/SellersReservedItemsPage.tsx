import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
} from "@nextui-org/react";

import { AuthContext } from "../../context/AuthContext";

const ITEMS_PER_PAGE = 8; // Количество товаров на странице

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  reservedById?: number | null;
  reservationExpiry?: string;
  isApprovedByModerator?: boolean;
}

const SellerReservedItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]); // Все товары
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const { user } = useContext(AuthContext);

  // Функция для загрузки всех товаров продавца
  const fetchSellerItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/item/pending-approval`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();

      if (response.ok) {
        setItems(data || []); // Убедимся, что data не undefined
      } else {
        console.error("Ошибка при загрузке данных");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    if (user) {
      fetchSellerItems();
    }
  }, [user]);

  // Фильтруем товары, которые ожидают подтверждения бронирования
  const pendingItems = items.filter(
    (item) => item.reservedById && item.isApprovedByModerator,
  );

  // Вычисляем индексы для текущей страницы
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = pendingItems.slice(startIndex, endIndex); // Товары для текущей страницы

  // Общее количество страниц
  const totalPages = Math.ceil(pendingItems.length / ITEMS_PER_PAGE);

  // Обработчик подтверждения бронирования
  const handleApproveReservation = async (itemId: number) => {
    try {
      const response = await fetch(
        `http://localhost:4000/item/approve/${itemId}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (response.ok) {
        // Обновляем список товаров
        fetchSellerItems();
      } else {
        alert("Ошибка при подтверждении бронирования");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  const handleRejectReservation = async (itemId: number) => {
    try {
      const response = await fetch(
        `http://localhost:4000/item/reject/${itemId}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (response.ok) {
        fetchSellerItems();
      } else {
        alert("Ошибка при отклонении бронирования");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Товары, ожидающие подтверждения бронирования</h1>

      {/* Список товаров */}
      {loading ? (
        <p>Загрузка...</p>
      ) : currentItems.length > 0 ? ( // Используем currentItems
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {currentItems.map((item) => (
            <Card key={item.id} style={{ flex: "0 0 calc(25% - 20px)" }}>
              <CardHeader>
                <Image
                  height="300px"
                  src={item.image}
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                  width="100%"
                />
              </CardHeader>

              <CardBody>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p>Цена: {item.price}</p>
                {item.reservedById && (
                  <p>
                    {item.reservationExpiry && (
                      <span>
                        {" "}
                        (до {new Date(item.reservationExpiry).toLocaleString()})
                      </span>
                    )}
                  </p>
                )}
              </CardBody>

              <CardFooter>
                <Button
                  color="success"
                  onClick={() => handleApproveReservation(item.id)}
                >
                  Подтвердить
                </Button>
                <Button
                  color="danger"
                  style={{ marginLeft: "10px" }}
                  onClick={() => handleRejectReservation(item.id)}
                >
                  Отклонить
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>Нет товаров, ожидающих подтверждения бронирования</p>
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
          Назад
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
          Вперед
        </button>
      </div>
    </div>
  );
};

export default SellerReservedItemsPage;
