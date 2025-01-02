import React, { useContext, useEffect, useState } from "react";

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
        <h1>Ваши чаты</h1>
        <ul>
          {chats.map((chat) => (
            <li key={chat.itemid}>
              <a href={`/chat/item/${chat.itemid}`}>
                {chat.itemname} - {chat.username}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ChatList;
