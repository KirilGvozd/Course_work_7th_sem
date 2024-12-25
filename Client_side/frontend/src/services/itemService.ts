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
}

// Получить все товары
export const fetchItems = async (params?: {
  skip?: number;
  limit?: number;
  typeId?: number;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: number;
}) => {
  const response = await api.get("/item", { params });

  return response.data;
};

// Получить один товар
export const fetchItem = async (id: number) => {
  const response = await api.get(`/item/${id}`);

  return response.data;
};

// Создать товар
export const createItem = async (data: any) => {
  const response = await api.post("/item", data, {
    withCredentials: true,
  });

  return response.data;
};

// Обновить товар
export const updateItem = async (id: number, data: any) => {
  const response = await api.put(`/item/${id}`, data, {
    withCredentials: true,
  });

  return response.data;
};

// Удалить товар
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

  console.log(response.data);

  return response.data;
};

export const deleteFavourite = async (id: number) => {
  const response = await api.delete(`/user/remove-favourite/${id}`, {
    withCredentials: true,
  });

  return response.data;
};
