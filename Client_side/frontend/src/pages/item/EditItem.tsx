import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Textarea, Button, Card, Spacer } from "@nextui-org/react";

import { fetchItem, updateItem } from "@/services/itemService";

const EditItemPage = () => {
  const { id } = useParams(); // Получаем ID из URL
  const navigate = useNavigate(); // Для перенаправления

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  // @ts-ignore
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (id) {
      // Если есть ID, загружаем данные о товаре
      fetchItem(Number(id))
        .then((item) => {
          setName(item.name);
          setDescription(item.description);
          setPrice(item.price);
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

    try {
      await updateItem(Number(id), {
        name,
        description,
        price: Number(price),
        typeId: 1,
      });
      alert("Item updated successfully");
      navigate(`/item/${id}`); // Перенаправляем на страницу товара
    } catch (err) {
      setError("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <Card style={{ maxWidth: 600, margin: "auto", padding: "2rem" }}>
      <form onSubmit={handleSubmit}>
        <h2>Edit Item</h2>

        {error && <div style={{ color: "red" }}>{error}</div>}

        <Input
          required
          label="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Spacer y={1} />
        <Textarea
          required
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Spacer y={1} />
        <Input
          required
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Spacer y={1} />
        <Spacer y={1} />
        <Input
          multiple
          label="Upload Images"
          type="file"
          onChange={handleImageUpload}
        />
        <Spacer y={1} />

        <Button disabled={loading} type="submit">
          {loading ? "Updating..." : "Update Item"}
        </Button>
      </form>
    </Card>
  );
};

export default EditItemPage;
