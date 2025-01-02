import { Route, Routes } from "react-router-dom";

import ItemPage from "./pages/item/[id]";

import HomePage from "@/pages";
import LoginPage from "@/pages/auth/LoginPage.tsx";
import RegisterPage from "@/pages/auth/RegisterPage.tsx";
import AddItemPage from "@/pages/item/AddItem.tsx";
import EditItemPage from "@/pages/item/EditItem.tsx";
import FavouritesPage from "@/pages/user/FavouritesPage.tsx";
import SellerPage from "@/pages/user/[id].tsx";
import ChatPage from "@/pages/chat/item/[id].tsx";
import ChatList from "@/pages/chat/ChatList.tsx";

const RoutesComponent = () => {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<ItemPage />} path="/item/:id" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<AddItemPage />} path="/add-item" />
      <Route element={<EditItemPage />} path="/edit-item/:id" />
      <Route element={<FavouritesPage />} path={"/favourites"} />
      <Route element={<SellerPage />} path="/user/:id" />
      <Route element={<ChatPage />} path="/chat/item/:id" />
      <Route element={<ChatList />} path="/chat" />
    </Routes>
  );
};

export default RoutesComponent;
