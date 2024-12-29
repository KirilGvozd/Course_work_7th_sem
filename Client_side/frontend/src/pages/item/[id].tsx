import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Image, Spacer } from "@nextui-org/react";

import { AuthContext } from "@/context/AuthContext"; // Импорт контекста
import {
  fetchItem,
  deleteItem,
  addToFavourites,
  checkFavourites,
} from "@/services/itemService.ts";

const ItemPage = () => {
  const { id } = useParams(); // Используем useParams для получения параметра id
  const navigate = useNavigate(); // Для навигации по маршрутам
  const { user } = useContext(AuthContext); // Получаем пользователя из контекста

  const [item, setItem] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Индекс текущего изображения
  const [loading, setLoading] = useState(true); // Стейт загрузки
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchItem(Number(id))
        .then((data) => {
          setItem(data);
          setCurrentIndex(0); // Сбрасываем индекс на 0, когда товар загружается
          setLoading(false); // Ожидание завершено
        })
        .catch((err) => {
          console.error("Failed to fetch item:", err);
          setLoading(false); // Если произошла ошибка, завершение загрузки
        });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      checkFavouriteItems(); // Проверяем, находится ли товар в избранном
    }
  }, [id]);

  const checkFavouriteItems = async () => {
    try {
      const favouriteIds = await checkFavourites(); // Получаем список ID избранных товаров

      setIsFavourite(favouriteIds.includes(Number(id))); // Проверяем, есть ли текущий товар в избранном
    } catch (error) {
      console.error("Ошибка при проверке избранных товаров:", error);
    }
  };

  if (loading) return <p>Loading...</p>; // Показываем "Loading..." до полной загрузки данных

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
    if (!user) return; // Если нет пользователя, не выполняем удаление

    try {
      await deleteItem(Number(id)); // Передаем токен для авторизации
      navigate("/");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const addItemToFavourites = async () => {
    if (!user) return;

    try {
      console.log(item.id);
      await addToFavourites(Number(item.id));
      setIsFavourite(true);

      return alert("Added to Favourites");
    } catch (error) {
      console.error("Error adding item to favourites:", error);
    }
  };

  const isAdmin = user?.role === "seller"; // Проверяем роль пользователя

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <Card style={{ maxWidth: "600px", width: "100%" }}>
        <div style={{ padding: "1rem" }}>
          <h2>{item.name}</h2>
        </div>

        {/* Слайдер изображений */}
        <div style={{ position: "relative" }}>
          <Image
            alt={item.name}
            height="500px"
            src={`http://localhost:4000/${item.images[currentIndex]}`}
            style={{ borderRadius: "8px" }}
            width="100%"
          />

          {/* Кнопки переключения изображений */}
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
                }}
                onClick={prevImage}
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
                }}
                onClick={nextImage}
              >
                {">"}
              </Button>
            </>
          )}
        </div>

        <div style={{ padding: "1rem" }}>
          <p>{item.description}</p>
          <Spacer y={0.5} />
          <h4>Price: {item.price}$</h4>
          <h4>
            <a href={`/user/${item.userId}`}>Seller: {item.sellerName}</a>
          </h4>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "1rem",
          }}
        >
          <Button onClick={() => navigate("/")}>Назад</Button>

          {/* Показываем кнопку "Добавить в избранное", если пользователь не админ и товар не в избранном */}
          {!isAdmin && !isFavourite && (
            <Button color="secondary" onClick={addItemToFavourites}>
              Добавить в избранное
            </Button>
          )}

          {/* Кнопки для администратора */}
          {isAdmin && (
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button color="warning" onClick={handleEdit}>
                Редактировать
              </Button>
              <Button color="danger" onClick={handleDelete}>
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
