import { useRouter } from "next/router";
import { Card, Button } from "@nextui-org/react";

const ItemCard = ({ item }: { item: any }) => {
  const router = useRouter();

  return (
    <Card style={{ maxWidth: "400px", margin: "auto" }}>
      <div style={{ padding: "1rem" }}>
        <h3>{item.name}</h3>
      </div>
      <div style={{ padding: "1rem" }}>
        <p>Цена: {item.price}₽</p>
      </div>
      <div
        style={{ padding: "1rem", display: "flex", justifyContent: "center" }}
      >
        <Button
          onClick={() => {
            router.push(`/item/${item.id}`);

            return false; // Возвращаем false, чтобы избежать перезагрузки страницы
          }}
        >
          Подробнее
        </Button>
      </div>
    </Card>
  );
};

export default ItemCard;
