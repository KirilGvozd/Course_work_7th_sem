//@ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import { FiUser, FiMessageSquare, FiArrowRightCircle } from "react-icons/fi";

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
    return (
      <p className="text-center text-gray-600">
        Пожалуйста, войдите, чтобы увидеть свои чаты.
      </p>
    );
  }

  if (loading) {
    return <p className="text-center text-gray-600">Загрузка чатов...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500">Ошибка загрузки чатов: {error}</p>
    );
  }

  if (chats.length === 0) {
    return <p className="text-center text-gray-600">У вас пока нет чатов.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center">
        <FiMessageSquare className="mr-2 text-blue-500" /> Ваши чаты
      </h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {chats.map((chat) => (
          <div
            key={chat.itemid}
            className="max-w-xs w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => (window.location.href = `/chat/item/${chat.itemid}`)}
          >
            <div className="p-4 flex items-center">
              <FiUser className="text-blue-500 text-2xl mr-3" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {chat.itemname}
                </h3>
                <p className="text-sm text-gray-500">
                  Пользователь: {chat.username}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 p-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">Открыть чат</p>
              <FiArrowRightCircle className="text-gray-400 text-xl hover:text-blue-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
