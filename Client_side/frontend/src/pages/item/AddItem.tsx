import React, { useState } from "react";
import {
  Input,
  Textarea,
  Button,
  Card,
  Spacer,
} from "@nextui-org/react";

const AddItemPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [typeId, setTypeId] = useState<number | string>("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

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
    formData.append("typeId", typeId.toString());
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await fetch("http://localhost:4000/item", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        alert("Item created successfully");
        setName("");
        setDescription("");
        setPrice("");
        setTypeId("");
        setImages([]);
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
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <Card style={{ maxWidth: 600, margin: "auto", padding: "2rem" }}>
      <form onSubmit={handleSubmit}>
        <h2>Add Item</h2>

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
          onChange={(e) => setPrice(e.target.value)}
        />
        <Spacer y={1} />
        <Input
          multiple
          label="Upload Images"
          type="file"
          onChange={handleImageUpload}
        />
        <Spacer y={1} />

        <Button disabled={loading} type="submit">
          {loading ? "Adding..." : "Add Item"}
        </Button>
      </form>
    </Card>
  );
};

export default AddItemPage;
