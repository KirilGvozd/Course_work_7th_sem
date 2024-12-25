import api from "../utils/api";

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
