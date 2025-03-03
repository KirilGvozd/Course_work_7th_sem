import React, { useState, ChangeEvent, useEffect, useContext } from "react";
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
import { useParams, useNavigate } from "react-router-dom";

import api from "@/utils/api.ts";
import { AuthContext, User } from "@/context/AuthContext.tsx";

interface Review {
  id: number;
  name?: string;
  text: string;
  rate: number;
  attachments?: string[];
  user?: User;
}

const SellerPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sellerName, setSellerName] = useState<string>("");
  const [sellerRate, setSellerRate] = useState<number>();
  const [newReview, setNewReview] = useState<Review>({
    id: 0,
    text: "",
    rate: 3,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { user, isLoggedIn } = useContext(AuthContext);
  const isAdmin = user?.role === "seller";
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchReviews = async () => {
    const response = await api.get(`/comment/${id}`);

    setReviews(response.data.comments);
    setSellerName(response.data.sellerName);
    setSellerRate(response.data.sellerRate);
  };

  useEffect(() => {
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
    if (newReview.text && newReview.rate) {
      const sellerId = parseInt(id!, 10);

      if (isNaN(sellerId)) {
        alert("Некорректный sellerId");

        return;
      }

      if (isNaN(newReview.rate)) {
        alert("Некорректный рейтинг");

        return;
      }

      const formData = new FormData();

      formData.append("text", newReview.text);
      formData.append("rate", newReview.rate.toString());
      formData.append("sellerId", sellerId.toString());

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch("http://localhost:4000/comment", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.status === 401) {
        alert("Нельзя оставлять больше одного отзыва!");
      }

      if (response.ok) {
        const data = await response.json();

        setReviews([...reviews, { ...data, user: { ...user } }]);
        setNewReview({ id: 0, text: "", rate: 3, attachments: [] });
        setImagePreview([]);
        setImageFiles([]);
        await fetchReviews();
      }
    } else {
      alert("Заполните все поля отзыва!");
    }
  };

  const handleRemoveReview = async (id: number) => {
    const response = await fetch(`http://localhost:4000/comment/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    await fetchReviews();

    if (response.status === 401) {
      alert("You don't have permission to remove this comment!");
    }

    setReviews(reviews.filter((review) => review.id !== id));
  };

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
    setIsImageOpen(true);
  };

  const closeImagePopup = () => {
    setIsImageOpen(false);
    setSelectedImage(null);
  };

  const handleGoBack = () => {
    navigate(-1); // Возвращаем пользователя на предыдущую страницу
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <Button
        color="primary"
        style={{ marginBottom: "20px" }}
        onPress={handleGoBack} // Добавляем обработчик для кнопки "Назад"
      >
        Назад
      </Button>
      <Card style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Продавец: {sellerName}</h2>
        <Spacer y={2} />
        <span style={{ fontSize: "1rem" }}>Рейтинг: {sellerRate}</span>
        <Spacer y={2} />
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
          showValueLabel={false}
          size="md"
          value={sellerRate}
        />
      </Card>

      <Spacer y={2} />

      <h3>Отзывы</h3>
      {reviews.map((review) => (
        <Card key={review.id} style={{ marginBottom: "20px", padding: "1rem" }}>
          <h4 style={{ marginBottom: "1rem" }}>{review.user?.name}</h4>
          <span style={{ fontSize: "1rem" }}>Оценка: {review.rate}</span>
          <Spacer y={2} />
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
            showValueLabel={false}
            size="md"
            value={review.rate}
          />
          <Spacer y={2} />
          <p>{review.text}</p>
          <Spacer y={2} />
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
          {user && review.user?.id === user.id && (
            <Button
              color="danger"
              size="sm"
              style={{ marginLeft: "auto" }}
              onPress={() => handleRemoveReview(review.id)}
            >
              Удалить отзыв
            </Button>
          )}
        </Card>
      ))}

      {isImageOpen && selectedImage && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
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
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Spacer y={2} />

      {isLoggedIn && !isAdmin && (
        <>
          <h3>Оставить отзыв</h3>
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
            label="Загрузите фотографии"
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
          <Button onPress={handleSubmitReview}>Оставить отзыв</Button>
        </>
      )}
    </div>
  );
};

export default SellerPage;
