import React, { useContext, useEffect, useState } from "react";
import { Card } from "@nextui-org/react";

import { AuthContext } from "../../context/AuthContext";

interface ChatResponse {
  itemid: number;
  itemname: string;
  userid: number;
  username: string;
}

const ChatList: React.FC = () => {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [chats, setChats] = useState<ChatResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      if (isLoggedIn && user) {
        try {
          const response = await fetch("http://localhost:4000/chat", {
            credentials: "include",
          });

          if (!response.ok) {
            const errorData = await response.json();

            throw new Error(
              errorData.message || `HTTP error! status: ${response.status}`,
            );
          }

          const data: ChatResponse[] = await response.json();

          setChats(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchChats();
  }, [isLoggedIn, user]);

  if (!isLoggedIn) {
    return <p>Пожалуйста, войдите, чтобы увидеть свои чаты.</p>;
  }

  if (loading) {
    return <p>Загрузка чатов...</p>;
  }

  if (error) {
    return <p>Ошибка загрузки чатов: {error}</p>;
  }

  if (chats.length === 0) {
    return <p>У вас пока нет чатов.</p>;
  }

  return (
    <>
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px", marginLeft: "20px" }}>
          {chats.map((chat) => (
            <Card
              key={chat.itemid}
              isHoverable
              isPressable
              style={{ width: "300px", padding: "1rem", cursor: "pointer" }}
              onClick={() =>
                (window.location.href = `/chat/item/${chat.itemid}`)
              }
            >
              <h3>{chat.itemname}</h3>
              <p>Пользователь: {chat.username}</p>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatList;
