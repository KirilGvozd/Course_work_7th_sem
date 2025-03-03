import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Textarea,
  Button,
  Card,
  Spacer,
  Select,
  SelectItem,
  Image,
} from "@nextui-org/react";

const AddItemPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [categoryId, setCategoryId] = useState<number | string>("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

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

        setCategories(data[0]);
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

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError("Цена должна быть положительным числом.");
      setLoading(false);

      return;
    }

    if (!categoryId || isNaN(Number(categoryId))) {
      setError("Выберите корректную категорию.");
      setLoading(false);

      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("categoryId", categoryId.toString());
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
      navigate("/");
      setName("");
      setDescription("");
      setPrice(0);
      setCategoryId("");
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
      const selectedFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/"),
      );

      if (selectedFiles.length !== e.target.files.length) {
        setError("Можно загружать только изображения.");

        return;
      }
      setImages((prevImages) => [...prevImages, ...selectedFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
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
          isClearable={true}
          label="Имя товара"
          value={name}
          variant="bordered"
          onChange={(e) => setName(e.target.value)}
        />
        <Spacer y={1} />
        <Textarea
          required
          label="Описание"
          value={description}
          variant="bordered"
          onChange={(e) => setDescription(e.target.value)}
        />
        <Spacer y={1} />
        <Input
          required
          label="Цена"
          type="text"
          value={price === 0 ? "" : price.toString()}
          variant="bordered"
          onBlur={(e) => {
            const value = e.target.value;

            if (value === "." || value === "") {
              setPrice(0);
            } else {
              setPrice(parseFloat(value));
            }
          }}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d*\.?\d*$/.test(value) || value === "") {
              if (value === ".") {
                setPrice("0.");
              } else {
                setPrice(value === "" ? 0 : value);
              }
            }
          }}
        />
        <Spacer y={1} />

        <Select
          required
          label="Категория"
          value={categoryId}
          variant="faded"
          onChange={(e) => setCategoryId(Number(e.target.value))}
        >
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </Select>
        <Spacer y={1} />

        {attributes.map((attr) => (
          <div key={attr.id} style={{ marginBottom: "1rem" }}>
            <Input
              label={attr.name}
              type={
                attr.type === "NUMBER"
                  ? "text" // Используем тип text для ручного ввода чисел
                  : attr.type === "BOOLEAN"
                    ? "checkbox" // Используем тип checkbox для булевых значений
                    : "text"
              }
              value={
                attr.type === "NUMBER"
                  ? attributeValues[attr.id] === undefined ||
                    attributeValues[attr.id] === null
                    ? ""
                    : attributeValues[attr.id].toString() // Преобразуем число в строку
                  : attr.type === "BOOLEAN"
                    ? "" // Для чекбокса value не используется
                    : attributeValues[attr.id] || ""
              }
              checked={
                attr.type === "BOOLEAN"
                  ? attributeValues[attr.id] || false
                  : undefined
              } // Управляем состоянием чекбокса
              variant="bordered"
              onBlur={(e) => {
                if (attr.type === "NUMBER") {
                  const value = e.target.value;

                  // При потере фокуса форматируем значение
                  if (value === "." || value === "") {
                    handleAttributeChange(attr.id, null); // Если введена только точка или поле пустое, устанавливаем null
                  } else {
                    handleAttributeChange(attr.id, parseFloat(value)); // Преобразуем в число
                  }
                }
              }}
              onChange={(e) => {
                const value = e.target.value;
                const isChecked = e.target.checked;

                if (attr.type === "NUMBER") {
                  // Разрешаем ввод цифр, одной точки и пустой строки
                  if (/^\d*\.?\d*$/.test(value) || value === "") {
                    // Если введена только точка, устанавливаем значение в "0."
                    if (value === ".") {
                      handleAttributeChange(attr.id, "0.");
                    } else {
                      // Если значение пустое, устанавливаем в null, иначе сохраняем как строку
                      handleAttributeChange(attr.id, value === "" ? null : value);
                    }
                  }
                } else if (attr.type === "BOOLEAN") {
                  // Для чекбокса используем свойство checked
                  handleAttributeChange(attr.id, isChecked); // Передаём булево значение
                } else {
                  // Для других типов (текст) передаём значение как есть
                  handleAttributeChange(attr.id, value);
                }
              }}
            />
          </div>
        ))}
        <Spacer y={1} />

        <Input
          multiple
          label="Загрузите фотографии"
          type="file"
          variant="faded"
          onChange={handleImageUpload}
        />
        <Spacer y={1} />

        {/* Предпросмотр фотографий */}
        {images.length > 0 && (
          <div>
            <h4>Загруженные фотографии</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {images.map((file, index) => (
                <div
                  key={index}
                  style={{ position: "relative", width: "120px" }}
                >
                  <Image
                    alt={`Uploaded image ${index + 1}`}
                    height="auto"
                    src={URL.createObjectURL(file)}
                    width="100%"
                  />
                  <Button
                    color="danger"
                    size="sm"
                    style={{
                      position: "sticky",
                      top: "5px",
                      right: "5px",
                      padding: "0.5rem",
                    }}
                    onPress={() => handleRemoveImage(index)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Spacer y={1} />
        <Button disabled={loading} type="submit" variant="shadow">
          {loading ? "Добавляем..." : "Добавить товар"}
        </Button>
      </form>
    </Card>
  );
};

export default AddItemPage;
