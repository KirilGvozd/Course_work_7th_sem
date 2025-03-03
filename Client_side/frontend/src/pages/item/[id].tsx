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
    <div className="flex justify-center items-center p-8 bg-gray-100 min-h-screen">
      <Card className="max-w-lg w-full bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
        {/* Item Name */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">{item.name}</h2>
        </div>

        {/* Image Carousel */}
        <div className="relative">
          <Image
            alt={item.name}
            className="w-full h-[500px] object-cover rounded-t-lg"
            height="500px"
            src={`http://localhost:4000/${item.images[currentIndex]}`}
          />
          {!loading && (
            <>
              {/* Previous Button */}
              <Button
                className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition duration-300 focus:outline-none"
                onPress={prevImage}
              >
                <span className="text-4xl">←</span>
              </Button>

              {/* Next Button */}
              <Button
                className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition duration-300 focus:outline-none"
                onPress={nextImage}
              >
                <span className="text-4xl">→</span>
              </Button>
            </>
          )}
        </div>

        {/* Item Details */}
        <div className="p-4 border-b border-gray-200">
          <Spacer y={2} />
          <p className="text-gray-700">{item.description}</p>
          <Spacer y={2} />
          <h4 className="text-lg font-semibold text-green-600">
            Цена: {item.price}
          </h4>
          <Spacer y={1} />
          <h4 className="text-gray-700">
            Продавец:{" "}
            <a
              className="underline text-blue-600 hover:text-blue-800 transition duration-300"
              href={`/user/${item.user.id}`}
            >
              {item.user.name}
            </a>
          </h4>
          {/* Category and Attributes */}
          {item.category && (
            <>
              <Spacer y={1} />
              <h4 className="text-gray-700">Категория: {item.category.name}</h4>
              <Spacer y={1} />
              {item.attributes && item.attributes.length > 0 ? (
                <div>
                  {item.attributes.map((attr: any) => (
                    <div key={attr.id} className="mb-2">
                      <h5 className="text-gray-700">
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
                <h5 className="text-gray-600">Атрибуты не указаны</h5>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between p-4 bg-gray-50">
          <Button
            className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-300 px-4 py-2 rounded-md focus:outline-none"
            onPress={() => navigate("/")}
          >
            Назад
          </Button>
          <div className="flex gap-2">
            {isLoggedIn && !isAdmin && !isFavourite && (
              <Button
                className="bg-yellow-400 text-white hover:bg-yellow-500 transition duration-300 px-4 py-2 rounded-md focus:outline-none"
                onPress={addItemToFavourites}
              >
                Добавить в избранное
              </Button>
            )}
            {isLoggedIn && !isAdmin && (
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300 px-4 py-2 rounded-md focus:outline-none"
                onPress={() => navigate(`/chat/item/${id}`)}
              >
                Написать продавцу
              </Button>
            )}
            {isAdmin && (
              <>
                <Button
                  className="bg-orange-400 text-white hover:bg-orange-500 transition duration-300 px-4 py-2 rounded-md focus:outline-none"
                  onPress={handleEdit}
                >
                  Редактировать
                </Button>
                <Button
                  className="bg-red-500 text-white hover:bg-red-600 transition duration-300 px-4 py-2 rounded-md focus:outline-none"
                  onPress={handleDelete}
                >
                  Удалить
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ItemPage;
