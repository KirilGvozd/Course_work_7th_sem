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

interface Review {
  id: number;
  name: string;
  text: string;
  rating: number;
  images: File[];
}

const SellerPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      name: "Иван",
      text: "Отличный продавец! Всё быстро и качественно.",
      rating: 90,
      images: [],
    },
    {
      id: 2,
      name: "Ольга",
      text: "Товар соответствует описанию. Спасибо!",
      rating: 80,
      images: [],
    },
  ]);
  const [newReview, setNewReview] = useState<Review>({
    id: 0,
    name: "",
    text: "",
    rating: 50,
    images: [],
  });
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setNewReview({ ...newReview, [name]: value });
  };

  const handleRatingChange = (value: number | number[]) => {
    const rating = Array.isArray(value) ? value[0] : value;

    setNewReview({ ...newReview, rating });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    setImagePreview(previews);
    setNewReview({ ...newReview, images: files });
  };

  const handleSubmitReview = () => {
    if (newReview.name && newReview.text && newReview.rating) {
      setReviews([...reviews, { ...newReview, id: reviews.length + 1 }]);
      setNewReview({ id: 0, name: "", text: "", rating: 50, images: [] });
      setImagePreview([]);
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

  // Clean up object URLs when no longer needed
  useEffect(() => {
    return () => {
      imagePreview.forEach(URL.revokeObjectURL);
    };
  }, [imagePreview]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Card>
        <h2>Имя продавца</h2>
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
          value={3.5}
        />
      </Card>

      <Spacer y={2} />

      <h3>Отзывы</h3>
      {reviews.map((review) => (
        <Card key={review.id} style={{ marginBottom: "20px" }}>
          <h4>{review.name}</h4>
          <Progress
            aria-label={`Рейтинг отзыва ${review.id}`}
            classNames={{
              base: "max-w-md",
              track: "drop-shadow-md border border-default",
              indicator:
                "bg-gradient-to-r from-red-500 via-yellow-500 to-green-500",
              label: "tracking-wider font-medium text-default-600",
              value: "text-foreground/60",
            }}
            maxValue={5}
            showValueLabel={true}
            size="md"
            value={review.rating / 20}
          />
          <p>{review.text}</p>
          {review.images.length > 0 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {review.images.map((image, index) => (
                <Image
                  key={index}
                  alt={`Review image ${index + 1}`}
                  height={100}
                  src={URL.createObjectURL(image)}
                  style={{ cursor: "pointer" }}
                  width={100}
                  onClick={() => handleImageClick(URL.createObjectURL(image))}
                />
              ))}
            </div>
          )}
        </Card>
      ))}

      {/* Всплывающее окно с картинкой */}
      {isImageOpen && selectedImage && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
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
        defaultValue={newReview.rating}
        label="Оценка"
        maxValue={100}
        minValue={0}
        step={1}
        onChange={handleRatingChange}
      />
      <Spacer y={1} />
      <input
        multiple
        accept="image/*"
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
