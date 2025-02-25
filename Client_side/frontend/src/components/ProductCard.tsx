import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
} from "@nextui-org/react";

import { AuthContext } from "../context/AuthContext";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  reservedById?: number | null; // Пропс для проверки бронирования
  reservationExpiry?: string; // Пропс для срока бронирования
  onRemove?: () => void; // Колбэк для удаления товара из списка
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  reservedById,
  reservationExpiry,
  onRemove,
}) => {
  const [isReserved, setIsReserved] = useState(!!reservedById); // Проверяем, есть ли reservedById
  const [timeLeft, setTimeLeft] = useState<string>("");
  const { user } = useContext(AuthContext);

  // Эффект для обновления таймера
  useEffect(() => {
    if (isReserved && reservationExpiry) {
      const updateTimer = () => {
        const now = new Date();
        const expiryDate = new Date(reservationExpiry);
        const difference = expiryDate.getTime() - now.getTime();

        if (difference <= 0) {
          setIsReserved(false);
          setTimeLeft("Время бронирования истекло");

          return;
        }
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      };

      // Обновляем таймер сразу и каждую секунду
      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [isReserved, reservationExpiry]);

  // Обработчик бронирования товара
  const handleReserve = async () => {
    try {
      const response = await fetch(`http://localhost:4000/item/reserve/${id}`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsReserved(true);
      } else {
        alert("Ошибка при бронировании товара");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  // Обработчик удаления товара из забронированных
  const handleRemoveReservation = async () => {
    try {
      const response = await fetch(`http://localhost:4000/item/reserve/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setIsReserved(false);
        if (onRemove) {
          onRemove(); // Вызываем колбэк для обновления списка
        }
      } else {
        alert("Ошибка при удалении бронирования");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <Card
      isHoverable
      style={{
        width: "auto",
      }}
    >
      {/* Размытие применяется только к CardHeader и CardBody */}
      <div style={{ filter: isReserved ? "blur(2px)" : "none" }}>
        <CardHeader>
          <Image
            alt={name}
            height="300px"
            src={image}
            style={{ objectFit: "cover", borderRadius: "8px" }}
            width="100%"
          />
        </CardHeader>

        <CardBody>
          <h4>{name}</h4>
        </CardBody>
      </div>

      {/* Футер не блюрится */}
      <CardFooter>
        <span style={{ marginRight: "10px" }}>{price}</span>
        {isReserved ? (
          <div>
            <p>Товар забронирован</p>
            {reservationExpiry && <p>До конца бронирования: {timeLeft}</p>}
            {/* Показываем кнопку "Удалить из забронированных" только для пользователя, который забронировал товар */}
            {user?.id === reservedById && (
              <Button
                color="danger"
                variant="solid"
                onPress={handleRemoveReservation}
              >
                Удалить из забронированных
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Показываем кнопку "Забронировать" только для пользователей с ролью buyer */}
            {user?.role === "buyer" && (
              <Button color="primary" variant="solid" onPress={handleReserve}>
                Забронировать
              </Button>
            )}
            <Button
              as="a"
              color="secondary"
              href={`/item/${id}`}
              style={{ marginLeft: "10px" }}
              variant="solid"
            >
              Подробнее
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
