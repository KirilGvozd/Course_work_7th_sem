import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardFooter,
  Select,
  SelectItem,
  Spacer,
} from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";

const EditCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [attributes, setAttributes] = useState<
    { id?: number; name: string; type: string }[]
  >([]);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [newAttributeType, setNewAttributeType] = useState("STRING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных категории
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`http://localhost:4000/category/${id}`, {
          headers: {
            accept: "*/*",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Не удалось загрузить категорию");
        }

        const data = await response.json();

        setName(data.name);
        setAttributes(data.attributes || []);
      } catch (err) {
        setError("Не удалось загрузить категорию");
      }
    };

    fetchCategory();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1); // Возвращаем пользователя на предыдущую страницу
  };

  // Добавление нового атрибута
  const handleAddAttribute = async () => {
    if (!newAttributeName.trim() || !newAttributeType) {
      setError("Название и тип атрибута обязательны");

      return;
    }

    try {
      const categoryIdNumber = Number(id);

      if (isNaN(categoryIdNumber)) {
        throw new Error("Неверный ID категории");
      }

      // Отправляем запрос на создание атрибута
      const response = await fetch("http://localhost:4000/attribute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          name: newAttributeName,
          categoryId: categoryIdNumber,
          type: newAttributeType,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Не удалось создать атрибут");
      }

      const newAttribute = await response.json();

      // Обновляем список атрибутов
      setAttributes([...attributes, newAttribute]);
      setNewAttributeName("");
      setNewAttributeType("STRING");
    } catch (err) {
      setError("Не удалось создать атрибут: " + (err as Error).message);
    }
  };

  // Удаление атрибута
  const handleRemoveAttribute = async (attributeId?: number) => {
    if (attributeId) {
      try {
        const response = await fetch(
          `http://localhost:4000/attribute/${attributeId}`,
          {
            method: "DELETE",
            headers: {
              accept: "*/*",
            },
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Не удалось удалить атрибут");
        }

        // Обновляем список атрибутов после удаления
        setAttributes(attributes.filter((attr) => attr.id !== attributeId));
      } catch (err) {
        setError("Не удалось удалить атрибут");
      }
    } else {
      // Удаление нового атрибута (ещё не сохранённого на сервере)
      setAttributes(
        attributes.filter((attr) => attr.name !== newAttributeName),
      );
    }
  };

  // Редактирование названия атрибута
  const handleEditAttribute = async (attributeId: number, newName: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/attribute/${attributeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          body: JSON.stringify({
            name: newName,
          }),
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Не удалось обновить атрибут");
      }

      // Обновляем список атрибутов
      const updatedAttributes = attributes.map((attr) =>
        attr.id === attributeId ? { ...attr, name: newName } : attr,
      );

      setAttributes(updatedAttributes);
    } catch (err) {
      setError("Не удалось обновить атрибут");
    }
  };

  // Отправка формы
  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Название категории обязательно");

      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Обновление категории
      const categoryResponse = await fetch(
        `http://localhost:4000/category/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          body: JSON.stringify({ name }),
          credentials: "include",
        },
      );

      if (!categoryResponse.ok) {
        throw new Error("Не удалось обновить категорию");
      }

      // Перенаправление на страницу админа после успешного обновления
      navigate("/admin");
    } catch (err) {
      setError("Произошла ошибка при обновлении категории");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <Card style={{ width: "400px", padding: "20px" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Редактировать категорию
        </h1>
        <CardBody>
          {/* Поле для названия категории */}
          <Input
            label="Название категории"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Spacer y={2} />
          {/* Поля для добавления атрибута */}
          <div style={{ marginBottom: "10px" }}>
            <Input
              label="Название атрибута"
              value={newAttributeName}
              onChange={(e) => setNewAttributeName(e.target.value)}
            />
            <Spacer y={2} />
            <Select
              label="Тип атрибута"
              selectedKeys={[newAttributeType]}
              style={{ marginBottom: "10px" }}
              onChange={(e) => setNewAttributeType(e.target.value)}
            >
              <SelectItem key="STRING" value="STRING">
                STRING
              </SelectItem>
              <SelectItem key="NUMBER" value="NUMBER">
                NUMBER
              </SelectItem>
              <SelectItem key="BOOLEAN" value="BOOLEAN">
                BOOLEAN
              </SelectItem>
            </Select>
            <Button fullWidth onPress={handleAddAttribute}>
              Добавить атрибут
            </Button>
          </div>

          {/* Список добавленных атрибутов */}
          {attributes.length > 0 && (
            <div style={{ marginBottom: "10px" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "10px" }}>
                Атрибуты:
              </h3>
              {attributes.map((attr, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <Input
                    style={{ marginRight: "10px" }}
                    value={attr.name}
                    onBlur={() => {
                      if (attr.id) {
                        handleEditAttribute(attr.id, attr.name);
                      }
                    }}
                    onChange={(e) => {
                      const updatedAttributes = [...attributes];

                      updatedAttributes[index].name = e.target.value;
                      setAttributes(updatedAttributes);
                    }}
                  />
                  <Button
                    color={"danger"}
                    size="sm"
                    onPress={() => handleRemoveAttribute(attr.id)}
                  >
                    Удалить
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
        <CardFooter style={{ justifyContent: "center" }}>
          <Button color="primary" isLoading={loading} onPress={handleSubmit}>
            Сохранить изменения
          </Button>
          <Spacer y={2} />
          <Button
              color="primary"
              onPress={handleGoBack} // Добавляем обработчик для кнопки "Назад"
          >
            Назад
          </Button>
        </CardFooter>

        {/* Отображение ошибки */}
        {error && (
          <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
            {error}
          </p>
        )}
      </Card>
    </div>
  );
};

export default EditCategoryPage;
