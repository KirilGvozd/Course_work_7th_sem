import React, { useState, useEffect, useRef, useContext } from "react";
import { io, Socket } from "socket.io-client";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Spacer,
} from "@nextui-org/react";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { FaEllipsisH } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  user: User;
}

interface Message {
  id: number;
  itemId: number;
  senderId: number;
  receiverId: number;
  messageText: string;
  messageDate: string;
  sender: User;
  receiver: User;
  item: Item;
}

interface ChatProps {
  itemId: number;
}

const Chat: React.FC<ChatProps> = ({ itemId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [item, setItem] = useState<Item | null>(null);
  const [itemLoading, setItemLoading] = useState(true);
  const [itemError, setItemError] = useState<string | null>(null);
  const [showDeleteOption, setShowDeleteOption] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      setItemLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/item/${itemId}`);

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        const data = await response.json();

        setItem(data);
      } catch (error: any) {
        setItemError(error.message);
      } finally {
        setItemLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/chat/item/${itemId}`,
          { credentials: "include" },
        );

        if (!response.ok) {
          if (response.status === 404) {
            return;
          }
          throw new Error(`Ошибка при загрузке сообщений: ${response.status}`);
        }
        const data: Message[] = await response.json();

        setMessages(data);
      } catch (error: any) {
        toast.error("Не удалось загрузить историю сообщений.");
      }
    };

    if (item) {
      fetchMessages();
    }
  }, [itemId, item]);

  useEffect(() => {
    if (user && item) {
      try {
        socketRef.current = io("http://localhost:4000", {
          withCredentials: true,
        });

        socketRef.current.emit("joinRoom", { itemId });

        socketRef.current.on("connect_error", () => {
          toast.error(
            "Ошибка подключения к чату. Пожалуйста, обновите страницу.",
          );
        });

        // Обработка нового сообщения
        socketRef.current.on("recMessage", (message: Message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Обработка удаления сообщения
        // @ts-ignore
        socketRef.current.on("messageDeleted", ({ messageId }) => {
          setMessages((prevMessages) =>
            prevMessages.filter((message) => message.id !== messageId),
          );
        });

        return () => {
          if (socketRef.current) {
            socketRef.current.emit("leaveRoom", { itemId });
            socketRef.current.disconnect();
            socketRef.current = null;
          }
        };
      } catch (error) {
        toast.error("Произошла ошибка. Пожалуйста, попробуйте позже.");
      }
    } else if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, [user, itemId, item]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (
      messageText.trim() !== "" &&
      user &&
      socketRef.current?.connected &&
      item
    ) {
      let receiverId: number;

      if (user.role === "buyer") {
        receiverId = item.user.id;
      } else if (user.role === "seller") {
        const firstMessage = messages[0];

        receiverId =
          firstMessage.senderId !== user.id ? firstMessage.senderId : 0;
      } else {
        toast.error("Роль пользователя не поддерживается.");

        return;
      }

      if (receiverId === 0) {
        toast.error("Не удалось определить получателя.");

        return;
      }

      socketRef.current.emit("sendMessage", {
        itemId,
        senderId: user.id,
        receiverId,
        messageText,
        messageDate: new Date().toISOString(),
      });

      setMessageText("");
    } else if (!socketRef.current?.connected) {
      toast.error(
        "Соединение с сервером потеряно. Пожалуйста, обновите страницу.",
      );
    } else if (!item) {
      toast.error("Данные товара еще не загружены.");
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Возвращаем пользователя на предыдущую страницу
  };

  const deleteMessage = async (messageId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/chat/${messageId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Не удалось удалить сообщение.");
      }

      // Отправка события удаления сообщения на сервер
      if (socketRef.current) {
        socketRef.current.emit("deleteMessage", { messageId, itemId });
      }

      // Локальное удаление сообщения (опционально, если сервер подтвердит удаление)
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageId),
      );

      toast.success("Сообщение удалено.");
    } catch (error: any) {
      toast.error("Ошибка при удалении сообщения.");
    }
  };

  if (itemLoading) {
    return <div>Загрузка информации о товаре...</div>;
  }

  if (itemError) {
    return <div>Ошибка загрузки информации о товаре: {itemError}</div>;
  }

  if (!item) {
    return <div>Информация о товаре не найдена.</div>;
  }

  return (
    <div className="flex items-center justify-center h-[90vh] w-screen border border-gray-300 rounded-lg">
      <div className="flex flex-col h-[80vh] w-[70vw] bg-gray-100 p-4 rounded-lg overflow-hidden">
        <Card className="flex-1 flex flex-col bg-transparent border-none">
          <CardHeader className="bg-indigo-200 text-gray-800 p-4 rounded-t-lg">
            <h4 className="text-lg font-semibold">
              <a
                className="hover:underline text-gray-800"
                href={`/item/${item.id}`}
              >
                {item.name}
              </a>
            </h4>
            <Spacer y={2} />
            <h4 className="text-sm text-gray-600">
              Продавец:{" "}
              <a
                className="hover:underline text-gray-800"
                href={`/user/${item.user.id}`}
              >
                {item.user.name}
              </a>
            </h4>
          </CardHeader>
          <CardBody className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  message.senderId === user?.id
                    ? "justify-end"
                    : "justify-start"
                } mb-4`}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <Card
                    className={`${
                      message.senderId === user?.id
                        ? "bg-indigo-100 text-gray-800"
                        : "bg-gray-200 text-gray-800"
                    } rounded-lg shadow-md max-w-xs`}
                  >
                    <CardBody className="p-3">
                      <p className="text-sm text-gray-800 mt-2">
                        {message.messageText}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.messageDate).toLocaleString()}
                      </p>
                      {message.sender && (
                        <p className="text-xs text-gray-500 mt-1">
                          {message.sender.name}
                        </p>
                      )}
                    </CardBody>
                  </Card>
                  {message.senderId === user?.id && (
                    <div className="absolute top-0 right-0 mt-1 mr-1 mb-2">
                      <button
                        className="text-gray-600 hover:text-gray-800 focus:outline-none mt-0"
                        onClick={() =>
                          setShowDeleteOption(
                            showDeleteOption === message.id ? null : message.id,
                          )
                        }
                      >
                        <FaEllipsisH className="text-gray-600" />
                      </button>
                      {showDeleteOption === message.id && (
                        <motion.div
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-0 mt-2 w-24 bg-gray-100 rounded-lg shadow-lg"
                          initial={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <button
                            className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-100 hover:text-red-700 rounded-lg"
                            onClick={() => deleteMessage(message.id)}
                          >
                            Удалить
                          </button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </CardBody>
          <div className="p-4 bg-gray-200 border-t border-gray-300">
            <Input
              className="mb-2 bg-gray-200 text-gray-800"
              placeholder="Введите сообщение..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button
              className="bg-indigo-300 text-gray-800 hover:bg-indigo-400"
              disabled={!socketRef.current?.connected || !item}
              onPress={sendMessage}
            >
              Отправить
            </Button>
            <Spacer y={2} />
            <Button
              color="primary"
              style={{ marginBottom: "20px" }}
              onPress={handleGoBack} // Добавляем обработчик для кнопки "Назад"
            >
              Назад
            </Button>
          </div>
        </Card>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Chat;
