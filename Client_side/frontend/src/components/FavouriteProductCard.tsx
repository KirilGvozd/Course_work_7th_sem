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
    await deleteFavourite(id);
    onRemove(id);
  };

  return (
    <Card isHoverable>
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

      <CardFooter>
        <span style={{ marginRight: "10px" }}>{price}</span>
        <Button
          as="a"
          color="primary"
          href={`/item/${id}`}
          style={{ margin: "10px" }}
          variant="shadow"
        >
          Подробнее
        </Button>
        <Button color="danger" variant="shadow" onPress={handleRemove}>
          Удалить
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FavouriteProductCard;
