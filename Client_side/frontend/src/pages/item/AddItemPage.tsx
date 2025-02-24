import React, { useState, useEffect } from "react";
import {
  Input,
  Textarea,
  Button,
  Card,
  Spacer,
  Select,
  SelectItem,
} from "@nextui-org/react";

const AddItemPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [categoryId, setCategoryId] = useState<number | string>("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [categories, setCategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<number, any>>(
    {},
  );

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:4000/category", {
          headers: {
            accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error("Не удалось загрузить категории");
        }

        const data = await response.json();

        setCategories(data[0]); // Извлекаем массив категорий из ответа
      } catch (err) {
        setError("Не удалось загрузить категории");
      }
    };

    fetchCategories();
  }, []);

  // Загрузка атрибутов категории
  useEffect(() => {
    const fetchAttributes = async () => {
      if (!categoryId) return;

      try {
        const response = await fetch(
          `http://localhost:4000/category/${categoryId}`,
          {
            headers: {
              accept: "*/*",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Не удалось загрузить атрибуты");
        }

        const data = await response.json();

        setAttributes(data.attributes || []);
      } catch (err) {
        setError("Не удалось загрузить атрибуты");
      }
    };

    fetchAttributes();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Проверка валидности цены
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError("Цена должна быть положительным числом.");
      setLoading(false);

      return;
    }

    // Проверка валидности категории
    if (!categoryId || isNaN(Number(categoryId))) {
      setError("Выберите корректную категорию.");
      setLoading(false);

      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString()); // Отправляем как строку, но сервер должен преобразовать в число
    formData.append("categoryId", categoryId.toString()); // То же самое для categoryId
    images.forEach((image) => formData.append("images", image));

    try {
      const itemResponse = await fetch("http://localhost:4000/item", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!itemResponse.ok) {
        const errorData = await itemResponse.json();

        console.error("Ошибка сервера:", errorData);
        throw new Error("Не удалось добавить товар");
      }

      const itemData = await itemResponse.json();
      const itemId = itemData.id;

      for (const attr of attributes) {
        const value = attributeValues[attr.id];

        if (value !== undefined && value !== "") {
          await fetch("http://localhost:4000/item-attribute", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "*/*",
            },
            body: JSON.stringify({
              itemId,
              attributeId: attr.id,
              stringValue: attr.type === "STRING" ? value : null,
              numberValue: attr.type === "NUMBER" ? Number(value) : null,
              booleanValue: attr.type === "BOOLEAN" ? Boolean(value) : null,
            }),
            credentials: "include",
          });
        }
      }

      alert("Товар добавлен!");
      setName("");
      setDescription("");
      setPrice(0); // Сбрасываем цену
      setCategoryId(""); // Сбрасываем категорию
      setImages([]);
      setAttributeValues({});
    } catch (err) {
      setError("Ошибка: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleAttributeChange = (attributeId: number, value: any) => {
    setAttributeValues((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
  };

  return (
    <Card style={{ maxWidth: 600, margin: "auto", padding: "2rem" }}>
      <form onSubmit={handleSubmit}>
        <h2>Добавить товар</h2>

        {error && <div style={{ color: "red" }}>{error}</div>}

        <Input
          required
          label="Имя товара"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Spacer y={1} />
        <Textarea
          required
          label="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Spacer y={1} />
        <Input
          required
          label="Цена"
          type="number"
          value={price.toString()}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <Spacer y={1} />

        {/* Выбор категории */}
        <Select
          label="Категория"
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
        >
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </Select>
        <Spacer y={1} />

        {/* Поля для атрибутов категории */}
        {attributes.map((attr) => (
          <div key={attr.id} style={{ marginBottom: "1rem" }}>
            <Input
              label={attr.name}
              type={
                attr.type === "NUMBER"
                  ? "number"
                  : attr.type === "BOOLEAN"
                    ? "checkbox"
                    : "text"
              }
              value={attributeValues[attr.id] || ""}
              onChange={(e) => handleAttributeChange(attr.id, e.target.value)}
            />
          </div>
        ))}

        <Input
          multiple
          label="Загрузите фотографии"
          type="file"
          onChange={handleImageUpload}
        />
        <Spacer y={1} />

        <Button disabled={loading} type="submit">
          {loading ? "Добавляем..." : "Добавить товар"}
        </Button>
      </form>
    </Card>
  );
};

export default AddItemPage;
