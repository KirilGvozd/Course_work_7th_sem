import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Card,
  Spacer,
  Input,
  Textarea,
  Button,
  Image,
  Slider,
  Progress,
} from "@nextui-org/react";
import { useParams } from "react-router-dom";

import api from "@/utils/api.ts";

interface Review {
  id: number;
  name: string;
  text: string;
  rate: number;
  attachments: string[];
}

const SellerPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sellerName, setSellerName] = useState<string>("");
  const [sellerRate, setSellerRate] = useState<number>();
  const [newReview, setNewReview] = useState<Review>({
    id: 0,
    name: "",
    text: "",
    rate: 3,
    attachments: [],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    // Загрузка отзывов
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/comment/${id}`);

        setReviews(response.data.comments);
        setSellerName(response.data.sellerName);
        setSellerRate(response.data.sellerRate);
      } catch (error) {
        console.error("Ошибка загрузки отзывов:", error);
      }
    };

    fetchReviews();
  }, [id]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setNewReview({ ...newReview, [name]: value });
  };

  const handleRatingChange = (value: number | number[]) => {
    const rating = Array.isArray(value) ? value[0] : value;

    setNewReview({ ...newReview, rate: rating });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    setImagePreview(previews);
    setImageFiles(files);
  };

  const handleSubmitReview = async () => {
    if (newReview.name && newReview.text && newReview.rate) {
      const formData = new FormData();

      // Добавляем текстовые данные
      formData.append("name", newReview.name);
      formData.append("text", newReview.text);
      formData.append("rate", newReview.rate.toString());
      formData.append("sellerId", `${id}`);

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      try {
        const response = await fetch("http://localhost:4000/comment", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();

          setReviews([...reviews, data]);
          setNewReview({ id: 0, name: "", text: "", rate: 3, attachments: [] });
          setImagePreview([]);
          setImageFiles([]);
        } else {
          console.error("Ошибка отправки отзыва:", response.statusText);
        }
      } catch (error) {
        console.error("Ошибка отправки отзыва:", error);
      }
    } else {
      alert("Заполните все поля отзыва!");
    }
  };

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
    setIsImageOpen(true);
  };

  const closeImagePopup = () => {
    setIsImageOpen(false);
    setSelectedImage(null);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Card>
        <h2>{sellerName}</h2>
        <Progress
          aria-label="Рейтинг продавца"
          classNames={{
            base: "max-w-md",
            track: "drop-shadow-md border border-default",
            indicator:
              "bg-gradient-to-r from-red-500 via-yellow-500 to-green-500",
            label: "tracking-wider font-medium text-default-600",
            value: "text-foreground/60",
          }}
          formatOptions={{ style: "decimal" }}
          maxValue={5}
          showValueLabel={true}
          size="md"
          value={sellerRate}
        />
      </Card>

      <Spacer y={2} />

      <h3>Отзывы</h3>
      {reviews.map((review) => (
        <Card key={review.id} style={{ marginBottom: "20px" }}>
          <h4>{review.name}</h4>
          <Progress
            aria-label={`Рейтинг отзыва ${review.rate}`}
            classNames={{
              base: "max-w-md",
              track: "drop-shadow-md border border-default",
              indicator:
                "bg-gradient-to-r from-red-500 via-yellow-500 to-green-500",
              label: "tracking-wider font-medium text-default-600",
              value: "text-foreground/60",
            }}
            formatOptions={{ style: "decimal" }}
            maxValue={5}
            showValueLabel={true}
            size="md"
            value={review.rate}
          />
          <p>{review.text}</p>
          {Array.isArray(review.attachments) &&
            review.attachments.length > 0 && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {review.attachments.map((image, index) => {
                  const imageUrl = `http://localhost:4000/${image}`;

                  return (
                    <Image
                      key={index}
                      alt={`Review image ${index + 1}`}
                      height={100}
                      src={imageUrl}
                      style={{ cursor: "pointer" }}
                      width={100}
                      onClick={() => handleImageClick(imageUrl)}
                    />
                  );
                })}
              </div>
            )}
        </Card>
      ))}

      {/* Всплывающее окно с картинкой */}
      {isImageOpen && selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={closeImagePopup}
        >
          <Image
            alt="Selected"
            src={selectedImage}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              cursor: "pointer",
            }}
            onClick={(e) => e.stopPropagation()} // Останавливаем всплытие события, чтобы картинка не закрылась при клике на неё
          />
        </div>
      )}

      <Spacer y={2} />

      <h3>Оставить отзыв</h3>
      <Input
        fullWidth
        name="name"
        placeholder="Ваше имя"
        style={{ marginBottom: "10px" }}
        value={newReview.name}
        onChange={handleInputChange}
      />
      <Textarea
        fullWidth
        name="text"
        placeholder="Ваш отзыв"
        style={{ marginBottom: "10px" }}
        value={newReview.text}
        onChange={handleInputChange}
      />
      <Slider
        className="max-w-md"
        defaultValue={newReview.rate}
        label="Оценка"
        maxValue={5}
        minValue={1}
        step={1}
        onChange={handleRatingChange}
      />
      <Spacer y={1} />
      <Input
        multiple
        label="Upload Images"
        type="file"
        onChange={handleImageUpload}
      />
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "10px",
        }}
      >
        {imagePreview.map((src, index) => (
          <Image
            key={index}
            alt={`Preview ${index + 1}`}
            height={100}
            src={src}
            style={{ cursor: "pointer" }}
            width={100}
            onClick={() => handleImageClick(src)}
          />
        ))}
      </div>
      <Spacer y={1} />
      <Button onClick={handleSubmitReview}>Отправить</Button>
    </div>
  );
};

export default SellerPage;
