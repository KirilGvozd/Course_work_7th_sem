import React, { useEffect, useState } from "react";

import { getFavourites } from "@/services/itemService.ts";
import FavouriteProductCard from "@/components/FavouriteProductCard.tsx";

const FavouritesPage: React.FC = () => {
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavourites = async () => {
      setLoading(true);
      setError(null); // Сбрасываем ошибки перед новой загрузкой
      try {
        const data = await getFavourites(); // Загружаем избранные товары

        setFavourites(data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          setError("You must be logged in to view your favourites.");
        } else if (error.response?.status === 404) {
          setError("No favourites found for your account.");
        } else {
          setError("Failed to load favourites. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadFavourites();
  }, []);

  const handleRemove = (id: number) => {
    setFavourites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <main style={{ padding: "20px" }}>
        <h1>My Favourites</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            {favourites.length > 0 ? (
              favourites.map((product) => (
                <div key={product.id} style={{ flex: "0 0 calc(25% - 20px)" }}>
                  <FavouriteProductCard
                    id={product.id}
                    image={
                      product.images?.[0]
                        ? `http://localhost:4000/${product.images[0]}`
                        : "https://via.placeholder.com/150"
                    }
                    name={product.name}
                    price={product.price}
                    onRemove={handleRemove}
                  />
                </div>
              ))
            ) : (
              <p>No favourites yet!</p>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default FavouritesPage;
