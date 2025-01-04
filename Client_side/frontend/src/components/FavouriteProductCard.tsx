import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
} from "@nextui-org/react";

import { deleteFavourite } from "@/services/itemService.ts";

interface FavouriteProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  onRemove: (id: number) => void;
}

const FavouriteProductCard: React.FC<FavouriteProductCardProps> = ({
  id,
  name,
  price,
  image,
  onRemove,
}) => {
  const handleRemove = async () => {
    try {
      await deleteFavourite(id); // Удаление из API
      onRemove(id); // Уведомление родительского компонента об удалении
    } catch (error) {
      console.error("Failed to remove favourite:", error);
    }
  };

  return (
    <Card isHoverable>
      {/* Изображение товара */}
      <CardHeader>
        <Image
          alt={name}
          height="300px"
          src={image}
          style={{ objectFit: "cover", borderRadius: "8px" }}
          width="100%"
        />
      </CardHeader>

      {/* Описание товара */}
      <CardBody>
        <h4>{name}</h4>
      </CardBody>

      {/* Цена и кнопки */}
      <CardFooter>
        <span style={{ marginRight: "10px" }}>${price.toFixed(2)}</span>
        <Button
          as="a"
          color="primary"
          href={`/item/${id}`}
          style={{ margin: "10px" }}
          variant="solid"
        >
          Подробнее
        </Button>
        <Button color="danger" onClick={handleRemove}>
          Удалить
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FavouriteProductCard;
