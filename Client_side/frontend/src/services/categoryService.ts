import api from "../utils/api";

export const fetchCategories = async () => {
  const response = await api.get("/category");

  return response.data;
};
