import api from "../utils/api";

export interface Item {
  id: number;
  userId: number;
  typeId: number;
  prices: number[];
  images: string[];
  name: string;
  description: string;
  price: number;
  reservedById: number;
  reservationExpiry: string;
}

export const fetchItems = async (params?: {
  skip?: number;
  limit?: number;
  typeId?: number;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: number;
  attributes?: Record<string, any>;
}) => {
  const serializedParams = {
    ...params,
    attributes: params?.attributes
      ? JSON.stringify(params.attributes)
      : undefined,
  };

  const response = await api.get("/item", { params: serializedParams });

  return response.data;
};

export const fetchItem = async (id: number) => {
  const response = await api.get(`/item/${id}`);

  return response.data;
};

export const deleteItem = async (id: number) => {
  const response = await api.delete(`/item/${id}`, {
    withCredentials: true,
  });

  return response.data;
};

export const addToFavourites = async (id: number) => {
  const response = await api.post(
    `/user/add-favourite`,
    { itemId: id },
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export const checkFavourites = async () => {
  const response = await api.get(`/user/favourites`, {
    withCredentials: true,
  });

  return response.data.map((item: Item) => item.id);
};

export const getFavourites = async () => {
  const response = await api.get(`/user/favourites`, {
    withCredentials: true,
  });

  return response.data;
};

export const deleteFavourite = async (id: number) => {
  const response = await api.delete(`/user/remove-favourite/${id}`, {
    withCredentials: true,
  });

  return response.data;
};
