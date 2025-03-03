import React, { useContext, useEffect, useState } from "react";
import { FiHeart, FiX } from "react-icons/fi";

import { AuthContext } from "@/context/AuthContext";

interface WishlistItem {
  id: number;
  itemName: string; // Изменили название поля на itemName
  userId: number;
}

const WishlistPage: React.FC = () => {
  const { user, isLoggedIn } = useContext(AuthContext); // Получаем данные пользователя и статус аутентификации
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для получения данных из вишлиста
  const fetchWishlist = async () => {
    try {
      const response = await fetch(`http://localhost:4000/item/wishlist`, {
        method: "GET",
        credentials: "include", // Включаем куки для аутентификации
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist.");
      }

      const [data] = await response.json(); // Разбираем ответ как массив

      // Проверяем, что данные существуют
      if (Array.isArray(data)) {
        setWishlistItems(data);
      } else {
        throw new Error("Invalid wishlist data format.");
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить ваш вишлист.");
      setLoading(false);
    }
  };

  // Функция для удаления товара из вишлиста
  const handleRemoveFromWishlist = async (itemId: number) => {
    if (!isLoggedIn || !user) return;

    try {
      const response = await fetch(
        `http://localhost:4000/item/wishlist/${itemId}`,
        {
          method: "DELETE",
          credentials: "include", // Включаем куки для аутентификации
        },
      );

      if (!response.ok) {
        throw new Error("Failed to remove item from wishlist.");
      }

      // Обновляем состояние после успешного удаления
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId),
      );
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить товар из вишлиста.");
    }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchWishlist();
  }, [isLoggedIn, user]);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center">
        <FiHeart className="mr-2 text-red-500" /> Ваш вишлист
      </h2>

      {/* Отображение состояния загрузки */}
      {loading && (
        <div className="w-full text-center text-gray-600">
          <p>Загрузка...</p>
        </div>
      )}

      {/* Отображение ошибки */}
      {error && (
        <div className="w-full text-center text-red-600">
          <p>{error}</p>
        </div>
      )}

      {/* Отображение списка товаров */}
      {!loading && !error && (
        <div>
          {wishlistItems.length > 0 ? (
            <ul className="space-y-4">
              {wishlistItems.map((item) => (
                <li
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
                >
                  <span className="text-gray-900 font-medium">
                    {item.itemName}
                  </span>
                  <button
                    className="text-red-500 hover:text-red-700 transition-colors"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    <FiX className="text-xl" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="w-full text-center text-gray-600">
              <p>Ваш вишлист пуст.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
