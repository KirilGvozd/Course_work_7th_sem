import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Image, Spacer } from "@nextui-org/react";

import { AuthContext } from "@/context/AuthContext";
import {
  fetchItem,
  deleteItem,
  addToFavourites,
  checkFavourites,
} from "@/services/itemService.ts";

const ItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useContext(AuthContext);

  const [item, setItem] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchItem(Number(id))
        .then((data) => {
          setItem(data);
          setCurrentIndex(0);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      checkFavouriteItems();
    }
  }, [id]);

  const checkFavouriteItems = async () => {
    const favouriteIds = await checkFavourites();

    setIsFavourite(favouriteIds.includes(Number(id)));
  };

  if (loading) return <p>Loading...</p>;

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % item.images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + item.images.length) % item.images.length,
    );
  };

  const handleEdit = () => {
    navigate(`/edit-item/${id}`);
  };

  const handleDelete = async () => {
    if (!user) return;

    await deleteItem(Number(id));
    navigate("/");
  };

  const addItemToFavourites = async () => {
    if (!user) return;

    await addToFavourites(Number(item.id));
    setIsFavourite(true);

    return alert("Товар добавлен в избранные");
  };

  const isAdmin = user?.role === "seller";

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <Card style={{ maxWidth: "fit-content", maxHeight: "fit-content" }}>
        <div style={{ padding: "1rem" }}>
          <h2>{item.name}</h2>
        </div>

        <div style={{ position: "relative" }}>
          <Image
            alt={item.name}
            height="500px"
            src={`http://localhost:4000/${item.images[currentIndex]}`}
            style={{ borderRadius: "8px" }}
            width="100%"
          />

          {!loading && (
            <>
              <Button
                color="primary"
                size="sm"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                }}
                onPress={prevImage}
              >
                {"<"}
              </Button>

              <Button
                color="primary"
                size="sm"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                }}
                onPress={nextImage}
              >
                {">"}
              </Button>
            </>
          )}
        </div>

        <div style={{ padding: "1rem" }}>
          <Spacer y={2} />
          <p>{item.description}</p>
          <Spacer y={2} />
          <h4>Цена: {item.price}</h4>
          <Spacer y={1} />
          <h4>
            Продавец:{" "}
            <a
              href={`/user/${item.user.id}`}
              style={{ textDecoration: "underline" }}
            >
              {item.user.name}
            </a>
          </h4>

          {/* Отображение категории и её атрибутов */}
          {item.category && (
            <>
              <Spacer y={1} />
              <h4>Категория: {item.category.name}</h4>
              <Spacer y={1} />
              {item.attributes && item.attributes.length > 0 ? (
                <div>
                  {item.attributes.map((attr: any) => (
                    <div key={attr.id} style={{ marginBottom: "0.5rem" }}>
                      <h5>
                        {attr.attribute.name}:{" "}
                        {attr.attribute.type === "BOOLEAN" // Проверяем тип атрибута
                          ? attr.booleanValue === true
                            ? "Да" // Если true, отображаем "Да"
                            : "Нет" // Если false, отображаем "Нет"
                          : attr.stringValue ||
                            attr.numberValue ||
                            "Не указано"}
                      </h5>
                    </div>
                  ))}
                </div>
              ) : (
                <h5>Атрибуты не указаны</h5>
              )}
            </>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "1rem",
          }}
        >
          <Button onPress={() => navigate("/")}>Назад</Button>

          {isLoggedIn && !isAdmin && !isFavourite && (
            <Button color="secondary" onPress={addItemToFavourites}>
              Добавить в избранное
            </Button>
          )}

          {isLoggedIn && !isAdmin && (
            <Button onPress={() => navigate(`/chat/item/${id}`)}>
              Написать продавцу
            </Button>
          )}

          {isAdmin && (
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button color="warning" onPress={handleEdit}>
                Редактировать
              </Button>
              <Button color="danger" onPress={handleDelete}>
                Удалить
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ItemPage;
