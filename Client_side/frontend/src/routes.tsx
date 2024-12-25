import { Route, Routes } from "react-router-dom";

import ItemPage from "./pages/item/[id]";

import HomePage from "@/pages";
import LoginPage from "@/pages/auth/LoginPage.tsx";
import RegisterPage from "@/pages/auth/RegisterPage.tsx";
import AddItemPage from "@/pages/item/AddItem.tsx";
import EditItemPage from "@/pages/item/EditItem.tsx";

const RoutesComponent = () => {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<ItemPage />} path="/item/:id" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<AddItemPage />} path="/add-item" />
      <Route element={<EditItemPage />} path="/edit-item/:id" />
    </Routes>
  );
};

export default RoutesComponent;
