import api from "../utils/api";

export const fetchCategories = async () => {
  const response = await api.get("/type");

  return response.data;
};
