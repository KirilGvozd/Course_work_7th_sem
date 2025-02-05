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
  price,
  image,
}) => {
  return (
    <Card isHoverable style={{ width: "auto" }}>
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
        <span style={{ marginRight: "10px" }}>${price.toFixed(2)}</span>
        <Button as="a" color="primary" href={`/item/${id}`} variant="solid">
          Подробнее
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
