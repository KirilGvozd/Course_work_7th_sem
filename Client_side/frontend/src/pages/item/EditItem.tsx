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
  const { id } = useParams(); // Получаем ID из URL
  const navigate = useNavigate(); // Для перенаправления

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [existingImages, setExistingImages] = useState<string[]>([]); // Ссылки на текущие изображения
  const [newImages, setNewImages] = useState<File[]>([]); // Новые изображения
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchItem(Number(id))
        .then((item) => {
          setName(item.name);
          setDescription(item.description);
          setPrice(item.price);
          setExistingImages(item.images); // Ссылки на изображения с сервера
        })
        .catch((err) => {
          console.error("Failed to fetch item:", err);
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

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());

    // Передаем старые изображения как массив
    existingImages.forEach((image) =>
      formData.append("existingImages[]", image),
    ); // Старые изображения как массив

    // Добавляем новые изображения
    newImages.forEach((image) => formData.append("images", image)); // Новые изображения

    try {
      const response = await fetch(`http://localhost:4000/item/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        alert("Информация была изменена");
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
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Spacer y={1} />

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
                  onClick={() => handleRemoveExistingImage(index)}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>
        <Spacer y={1} />

        <Input
          multiple
          label="Добавить новые фотографии"
          type="file"
          onChange={handleImageUpload}
        />
        <Spacer y={1} />

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
                    onClick={() => handleRemoveNewImage(index)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <Spacer y={1} />

        <Button disabled={loading} type="submit">
          {loading ? "Обновляем..." : "Обновить информацию"}
        </Button>
      </form>
    </Card>
  );
};

export default EditItemPage;
