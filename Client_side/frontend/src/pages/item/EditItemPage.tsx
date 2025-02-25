import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Input,
  Textarea,
  Button,
  Card,
  Spacer,
  Image,
} from "@nextui-org/react";

import { fetchItem } from "@/services/itemService";

const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]); // Добавляем состояние для атрибутов
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [changedAttributes, setChangedAttributes] = useState<number[]>([]);

  useEffect(() => {
    if (id) {
      fetchItem(Number(id))
        .then((item) => {
          setName(item.name);
          setDescription(item.description);
          setPrice(item.price);
          setExistingImages(item.images);
          setAttributes(item.attributes || []); // Загружаем атрибуты
        })
        .catch(() => {
          setError("Failed to load item data.");
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError("Price must be a positive number.");
      setLoading(false);

      return;
    }

    const updatedAttributesPromises = attributes
      .filter((attr) => attr.stringValue !== null)
      .map(async (attribute) => {
        try {
          const response = await fetch(
            `http://localhost:4000/item-attribute/${attribute.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ stringValue: attribute.stringValue }),
              credentials: "include",
            },
          );

          if (!response.ok) {
            const errorData = await response.json();

            throw new Error(errorData.message || "Failed to update attribute");
          }
        } catch (error) {
          console.error("Ошибка при обновлении атрибута:", error);
          setError(
            `Ошибка при обновлении атрибута "${attribute.attribute.name}": ${error}`,
          );
          setLoading(false);
          throw error; // Прерываем процесс, если произошла ошибка
        }
      });

    // Ждем завершения всех запросов по обновлению атрибутов
    try {
      await Promise.all(updatedAttributesPromises);
    } catch (error) {
      return; // Если произошла ошибка при обновлении атрибутов, прекращаем выполнение
    }

    // Шаг 2: Обновляем основные данные товара
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    existingImages.forEach((image) =>
      formData.append("existingImages[]", image),
    );
    newImages.forEach((image) => formData.append("images", image));

    try {
      const response = await fetch(`http://localhost:4000/item/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        alert("Информация была успешно изменена");
        navigate(`/item/${id}`);
      } else {
        const errorData = await response.json();

        setError(errorData.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages([...newImages, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (
    attributeId: number,
    value: string | boolean | number | null,
  ) => {
    setAttributes((prevAttributes) =>
      prevAttributes.map((attr) =>
        attr.id === attributeId ? { ...attr, stringValue: value } : attr,
      ),
    );
    if (!changedAttributes.includes(attributeId)) {
      setChangedAttributes((prev) => [...prev, attributeId]);
    }
  };

  const updateAttribute = async (
    attributeId: number,
    value: string | boolean | number | null,
  ) => {
    try {
      const response = await fetch(
        `http://localhost:4000/item-attribute/${attributeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stringValue: value }),
          credentials: "include",
        },
      );

      if (response.ok) {
        alert("Атрибут успешно обновлен");
        setAttributes((prevAttributes) =>
          prevAttributes.map((attr) =>
            attr.id === attributeId ? { ...attr, stringValue: value } : attr,
          ),
        );
      } else {
        const errorData = await response.json();

        alert(`Ошибка при обновлении атрибута: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Ошибка при обновлении атрибута:", error);
    }
  };

  return (
    <Card style={{ maxWidth: 600, margin: "auto", padding: "2rem" }}>
      <form onSubmit={handleSubmit}>
        <h2>Изменить информацию</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <Input
          required
          label="Имя товара"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Spacer y={2} />
        <Textarea
          required
          label="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Spacer y={2} />
        <Input
          required
          label="Цена"
          type="text" // Используем тип text для ручного ввода
          value={price === 0 ? "" : price.toString()} // Отображаем пустую строку, если price = 0
          variant="bordered"
          onBlur={(e) => {
            // При потере фокуса форматируем значение
            const value = e.target.value;

            if (value === "." || value === "") {
              setPrice(0); // Если введена только точка или поле пустое, устанавливаем 0
            } else {
              setPrice(parseFloat(value)); // Преобразуем в число
            }
          }}
          onChange={(e) => {
            const value = e.target.value;

            // Разрешаем ввод цифр, одной точки и пустой строки
            if (/^\d*\.?\d*$/.test(value) || value === "") {
              // Если введена только точка, устанавливаем значение в "0."
              if (value === ".") {
                setPrice("0."); // Сохраняем точку для дальнейшего ввода
              } else {
                // Если значение пустое, устанавливаем price в 0, иначе сохраняем как строку
                setPrice(value === "" ? 0 : value);
              }
            }
          }}
        />
        <Spacer y={2} />

        {/* Атрибуты */}
        <div>
          <h4>Атрибуты</h4>
          {attributes.length > 0 ? (
            attributes.map((attribute) => (
              <div key={attribute.id} style={{ marginBottom: "1rem" }}>
                <strong>{attribute.attribute.name}: </strong>
                {attribute.attribute.type === "STRING" && (
                  <Input
                    value={attribute.stringValue || ""}
                    onBlur={() =>
                      updateAttribute(attribute.id, attribute.stringValue)
                    }
                    onChange={(e) =>
                      handleAttributeChange(attribute.id, e.target.value)
                    }
                  />
                )}
                {attribute.attribute.type === "BOOLEAN" && (
                  <select
                    value={attribute.booleanValue || false}
                    onBlur={() =>
                      updateAttribute(attribute.id, attribute.booleanValue)
                    }
                    onChange={(e) =>
                      handleAttributeChange(
                        attribute.id,
                        e.target.value === "true",
                      )
                    }
                  >
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                  </select>
                )}
                {attribute.attribute.type === "NUMBER" && (
                  <Input
                    type="number"
                    value={attribute.numberValue || ""}
                    onBlur={() =>
                      updateAttribute(attribute.id, attribute.numberValue)
                    }
                    onChange={(e) =>
                      handleAttributeChange(
                        attribute.id,
                        parseFloat(e.target.value),
                      )
                    }
                  />
                )}
              </div>
            ))
          ) : (
            <p>У данного товара нет атрибутов</p>
          )}
        </div>

        <Spacer y={2} />
        <div>
          <h4>Текущие фотографии</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {existingImages.map((image, index) => (
              <div key={index} style={{ position: "relative", width: "120px" }}>
                <Image
                  alt={`Existing image ${index + 1}`}
                  height="auto"
                  src={`http://localhost:4000/${image}`}
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
                  onPress={() => handleRemoveExistingImage(index)}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>
        <Spacer y={2} />
        <Input
          multiple
          label="Добавить новые фотографии"
          type="file"
          onChange={handleImageUpload}
        />
        <Spacer y={2} />
        {newImages.length > 0 && (
          <div>
            <h4>Новые фотографии</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {newImages.map((file, index) => (
                <div
                  key={index}
                  style={{ position: "relative", width: "120px" }}
                >
                  <Image
                    alt={`New image ${index + 1}`}
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
                    onPress={() => handleRemoveNewImage(index)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <Spacer y={2} />
        <Button disabled={loading} type="submit">
          {loading ? "Обновляем..." : "Обновить информацию"}
        </Button>
      </form>
    </Card>
  );
};

export default EditItemPage;
