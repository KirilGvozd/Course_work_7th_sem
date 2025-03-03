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
import { FaShoppingCart, FaTimes, FaEllipsisV } from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  reservedById?: number | null;
  reservationExpiry?: string;
  onRemove?: () => void;
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
  const [isReserved, setIsReserved] = useState(!!reservedById);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const { user } = useContext(AuthContext);

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

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [isReserved, reservationExpiry]);

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

  const handleRemoveReservation = async () => {
    try {
      const response = await fetch(`http://localhost:4000/item/reserve/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setIsReserved(false);
        if (onRemove) {
          onRemove();
        }
      } else {
        alert("Ошибка при удалении бронирования");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
      <Card
        isHoverable
        className="w-auto overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div className={isReserved ? "filter blur-sm" : ""}>
          {/* Картинка товара */}
          <CardHeader className="p-0">
            <motion.div whileHover={{ scale: 1.03 }}>
              <Image
                alt={name}
                className="w-full h-64 object-cover rounded-t-lg"
                height="300px"
                src={image}
                width="100%"
              />
            </motion.div>
          </CardHeader>

          {/* Основная информация о товаре */}
          <CardBody className="p-4">
            <h4 className="text-xl font-semibold text-gray-800">{name}</h4>
            <p className="text-lg font-medium text-gray-900 mt-2">{price}</p>
          </CardBody>
        </div>

        {/* Футер с кнопками */}
        <CardFooter className="p-4 bg-gray-50 border-t border-gray-200">
          {isReserved ? (
            <div className="w-full">
              <p className="text-sm text-gray-600 mb-2">Товар забронирован</p>
              {reservationExpiry && (
                <p className="text-sm text-gray-600 mb-4">
                  До конца бронирования: {timeLeft}
                </p>
              )}
              {user?.id === reservedById && (
                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  color="danger"
                  startContent={<FaTimes />}
                  onPress={handleRemoveReservation}
                >
                  Удалить из забронированных
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              {user?.role === "buyer" && (
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  color="primary"
                  startContent={<FaShoppingCart />}
                  onPress={handleReserve}
                >
                  Забронировать
                </Button>
              )}
              <Button
                as="a"
                className="bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-700"
                href={`/item/${id}`}
                startContent={<FaEllipsisV />}
              />
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
