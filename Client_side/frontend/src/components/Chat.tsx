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

        socketRef.current.on("recMessage", (message: Message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
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

  const deleteMessage = async (messageId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/chat/${messageId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Не удалось удалить сообщение.");
      }

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
    <div>
      <Card>
        <CardHeader>
          <h4>
            <a
              href={`/item/${item.id}`}
              style={{ textDecoration: "underline" }}
            >
              {item.name}
            </a>
          </h4>
          <Spacer y={2} />
          <h4 color="gray">
            Продавец:{" "}
            <a
              href={`/user/${item.user.id}`}
              style={{ textDecoration: "underline" }}
            >
              {item.user.name}
            </a>
          </h4>
        </CardHeader>
        <CardBody
          style={{
            height: "300px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                alignSelf:
                  message.senderId === user?.id ? "flex-end" : "flex-start",
                marginBottom: "8px",
                maxWidth: "80%",
              }}
            >
              <Card>
                <CardBody>
                  <h4>{message.messageText}</h4>
                  {message.senderId === user?.id && (
                    <Button
                      color="danger"
                      size="sm"
                      variant="shadow"
                      onClick={() => deleteMessage(message.id)}
                    >
                      Удалить
                    </Button>
                  )}
                  <h4 color="gray">
                    {new Date(message.messageDate).toLocaleString()}
                  </h4>
                  {message.sender && (
                    <h4 color="gray">{message.sender.name}</h4>
                  )}
                </CardBody>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardBody>
        <Input
          placeholder="Введите сообщение..."
          style={{ marginBottom: "10px" }}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button
          disabled={!socketRef.current?.connected || !item}
          onPress={sendMessage}
        >
          Отправить
        </Button>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default Chat;
