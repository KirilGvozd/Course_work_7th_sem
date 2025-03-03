import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { FaTimes, FaCheck } from "react-icons/fa";

import { AuthContext } from "../../context/AuthContext";

const ITEMS_PER_PAGE = 8; // Количество товаров на странице

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
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
  const totalPages =
    pendingItems.length > 0
      ? Math.ceil(pendingItems.length / ITEMS_PER_PAGE)
      : 0;

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
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
            {currentItems.map((item) => (
              <Card
                key={item.id}
                isHoverable
                className="w-auto overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader>
                  <motion.div whileHover={{ scale: 1.03 }}>
                    <Image
                      alt={item.name}
                      className="w-full h-64 object-cover rounded-t-lg"
                      height="300px"
                      src={`http://localhost:4000/${item.images[0]}`}
                      width="100%"
                    />
                  </motion.div>
                </CardHeader>

                <CardBody className="p-4">
                  <h4 className="text-xl font-semibold text-gray-800">
                    {item.name}
                  </h4>
                  <p className="text-lg font-medium text-gray-900 mt-2">
                    {item.price}
                  </p>
                  {item.reservedById && (
                    <p>
                      {item.reservationExpiry && (
                        <span>
                          Зарезервирован до{" "}
                          {new Date(item.reservationExpiry).toLocaleString()}
                        </span>
                      )}
                    </p>
                  )}
                </CardBody>

                <CardFooter className="p-4 bg-gray-50 border-t border-gray-200">
                  <Button
                    className="w-full"
                    color="success"
                    startContent={<FaCheck />}
                    onPress={() => handleApproveReservation(item.id)}
                  >
                    Подтвердить
                  </Button>
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    color="danger"
                    startContent={<FaTimes />}
                    style={{ marginLeft: "10px" }}
                    onPress={() => handleRejectReservation(item.id)}
                  >
                    Отклонить
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </motion.div>
        </div>
      ) : (
        <p>Нет товаров, ожидающих подтверждения бронирования</p>
      )}

      {/* Пагинация */}
      <div>
        {/* Ваш код с отображением товаров */}

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
      </div>
    </div>
  );
};

export default SellerReservedItemsPage;
