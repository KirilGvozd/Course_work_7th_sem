import { Route, Routes } from "react-router-dom";

import ItemPage from "./pages/item/[id]";

import HomePage from "@/pages";
import LoginPage from "@/pages/auth/LoginPage.tsx";
import RegisterPage from "@/pages/auth/RegisterPage.tsx";
import AddItemPage from "@/pages/item/AddItemPage.tsx";
import EditItemPage from "@/pages/item/EditItemPage.tsx";
import FavouritesPage from "@/pages/user/FavouritesPage.tsx";
import SellerPage from "@/pages/user/[id].tsx";
import ChatPage from "@/pages/chat/item/[id].tsx";
import ChatList from "@/pages/chat/ChatList.tsx";
import AdminPage from "@/pages/admin/MainPage.tsx";
import CreateCategoryPage from "@/pages/admin/CreateCategoryPage.tsx";
import AddModeratorPage from "@/pages/admin/AddModeratorPage.tsx";
import EditCategoryPage from "@/pages/admin/EditCategoryPage.tsx";
import ReservedItemsPage from "@/pages/item/ReservedItemsPage.tsx";
import SellersReservedItemsPage from "@/pages/item/SellersReservedItemsPage.tsx";

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
      <Route element={<AdminPage />} path="/admin" />
      <Route element={<CreateCategoryPage />} path="/admin/create-category" />
      <Route element={<AddModeratorPage />} path="/admin/add-moderator" />
      <Route element={<EditCategoryPage />} path="/admin/edit-category/:id" />
      <Route element={<ReservedItemsPage />} path="/user/reserved-items" />
      <Route
        element={<SellersReservedItemsPage />}
        path="/seller/reserved-items"
      />
    </Routes>
  );
};

export default RoutesComponent;
