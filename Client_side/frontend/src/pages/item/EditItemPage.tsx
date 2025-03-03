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
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [changedAttributes, setChangedAttributes] = useState<number[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchItem(Number(id))
        .then((item) => {
          setName(item.name);
          setDescription(item.description);
          setPrice(item.price.replace(/[$,]/g, ""));
          setExistingImages(item.images);
          setAttributes(item.attributes || []);
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
      setError("Цена должна быть положительным числом.");
      setLoading(false);

      return;
    }

    // Обновляем измененные атрибуты
    const updatedAttributesPromises = changedAttributes
      .map((attributeId) => {
        const attribute = attributes.find((attr) => attr.id === attributeId);

        if (!attribute) return;

        let bodyKey, bodyValue;

        if (attribute.attribute.type === "BOOLEAN") {
          bodyKey = "booleanValue";
          bodyValue = attribute.booleanValue;
        } else if (attribute.attribute.type === "NUMBER") {
          bodyKey = "numberValue";
          bodyValue = attribute.numberValue;
        } else {
          bodyKey = "stringValue";
          bodyValue = attribute.stringValue;
        }

        return fetch(`http://localhost:4000/item-attribute/${attributeId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [bodyKey]: bodyValue }),
          credentials: "include",
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update attribute");
          }
        });
      })
      .filter(Boolean); // Удаляем пустые промисы

    try {
      await Promise.all(updatedAttributesPromises);
    } catch (error) {
      setError("Ошибка при обновлении атрибутов.");
      setLoading(false);

      return;
    }

    // Отправляем остальные данные
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    existingImages.forEach((image) =>
      formData.append("existingImages[]", image),
    );
    newImages.forEach((image) => formData.append("images", image));
    deletedImages.forEach((image) => formData.append("deletedImages[]", image));

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
      const selectedFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/"),
      );

      if (selectedFiles.length !== e.target.files.length) {
        setError("Можно загружать только изображения.");

        return;
      }
      setNewImages((prevImages) => [...prevImages, ...selectedFiles]);
    }
  };

  const handleRemoveExistingImage = (index: number) => {
    const imageToDelete = existingImages[index];

    setDeletedImages((prev) => [...prev, imageToDelete]);
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
      prevAttributes.map((attr) => {
        if (attr.id === attributeId) {
          if (attr.attribute.type === "BOOLEAN") {
            return {
              ...attr,
              booleanValue:
                value === "true" ? true : value === "false" ? false : null,
            };
          }

          if (attr.attribute.type === "NUMBER") {
            // Если значение передано как строка, сохраняем его как строку
            if (typeof value === "string") {
              return { ...attr, numberValue: value };
            }

            // Если значение передано как число, сохраняем его как число
            if (typeof value === "number") {
              return { ...attr, numberValue: value };
            }

            // Если значение null, сохраняем как null
            return { ...attr, numberValue: null };
          }

          return { ...attr, stringValue: value };
        }

        return attr;
      }),
    );

    if (!changedAttributes.includes(attributeId)) {
      setChangedAttributes((prev) => [...prev, attributeId]);
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
              setPrice(value === "" ? 0 : value);
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
                    onChange={(e) =>
                      handleAttributeChange(attribute.id, e.target.value)
                    }
                  />
                )}
                {attribute.attribute.type === "BOOLEAN" && (
                  <select
                    value={attribute.booleanValue === true ? "true" : "false"}
                    onChange={(e) =>
                      handleAttributeChange(attribute.id, e.target.value)
                    }
                  >
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                  </select>
                )}
                {attribute.attribute.type === "NUMBER" && (
                  <Input
                    label={attribute.attribute.name}
                    type="text"
                    value={
                      attribute.numberValue === null
                        ? ""
                        : attribute.numberValue.toString() // Всегда отображаем как строку
                    }
                    variant="bordered"
                    onBlur={(e) => {
                      const value = e.target.value;

                      if (value === "." || value === "") {
                        handleAttributeChange(attribute.id, null); // Если точка или пустое значение, устанавливаем null
                      } else {
                        handleAttributeChange(attribute.id, parseFloat(value)); // Преобразуем в число
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Разрешаем ввод цифр и одной точки
                      if (/^\d*\.?\d*$/.test(value)) {
                        handleAttributeChange(attribute.id, value); // Сохраняем как строку
                      }
                    }}
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
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button color="primary" disabled={loading} onClick={handleSubmit}>
            {loading ? "Обновляем..." : "Обновить информацию"}
          </Button>

          <Button
            color="secondary"
            onClick={() => navigate(`/item/${id}`)} // Возврат к карточке товара
          >
            Назад
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EditItemPage;
