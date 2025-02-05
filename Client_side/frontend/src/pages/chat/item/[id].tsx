import { useParams, useNavigate } from "react-router-dom"; // Импортируем useNavigate
import React, { useContext } from "react";

import Chat from "../../../components/Chat";

import { AuthContext } from "@/context/AuthContext";

const ChatPage: React.FC = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate("/login");

    return null;
  }

  if (!id || isNaN(Number(id))) {
    return <div>Некорректный ID товара.</div>;
  }

  const itemId = Number(id);

  return (
    <div>
      <Chat itemId={itemId} />
    </div>
  );
};

export default ChatPage;
