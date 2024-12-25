import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
} from "@nextui-org/react";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  image,
}) => {
  return (
    <Card isHoverable>
      {/* Изображение товара */}
      <CardHeader>
        <Image
          alt={name}
          height="auto"
          src={image}
          style={{ objectFit: "cover", borderRadius: "8px" }}
          width="100%"
        />
      </CardHeader>

      {/* Описание товара */}
      <CardBody>
        <h4>{name}</h4>
        {description}
      </CardBody>

      {/* Цена и кнопка */}
      <CardFooter>
        <span style={{ marginRight: "10px" }}>${price.toFixed(2)}</span>
        <Button
          as="a"
          color="primary"
          href={`/item/${id}`} // Используем href для перехода
          variant="solid"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
