import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  CardBody,
  CardFooter,
  Spinner,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [moderators, setModerators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка категорий
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/category", {
        headers: {
          accept: "*/*",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Не удалось загрузить категории");
      }

      const data = await response.json();

      setCategories(data[0]); // Извлекаем массив категорий из ответа
    } catch (err) {
      setError("Не удалось загрузить категории");
    }
  };

  // Загрузка модераторов
  const fetchModerators = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/moderators", {
        headers: {
          accept: "*/*",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Не удалось загрузить модераторов");
      }

      const data = await response.json();

      setModerators(data[0]); // Извлекаем массив модераторов из ответа
    } catch (err) {
      setError("Не удалось загрузить модераторов");
    }
  };

  // Удаление категории
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      const response = await fetch(
        `http://localhost:4000/category/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            accept: "*/*",
          },
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Не удалось удалить категорию");
      }

      // Обновляем список категорий после удаления
      fetchCategories();
    } catch (err) {
      setError("Не удалось удалить категорию");
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCategories();
      await fetchModerators();
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
        Admin Dashboard
      </h1>

      {/* Секция категорий */}
      <Card style={{ marginBottom: "20px" }}>
        <CardBody>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            Категории
          </h2>
          <Table aria-label="Категории">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Название</TableColumn>
              <TableColumn>Атрибуты</TableColumn>
              <TableColumn>Действия</TableColumn>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {category.attributes
                      .map((attr: any) => attr.name)
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() =>
                        navigate(`/admin/edit-category/${category.id}`)
                      }
                    >
                      Редактировать
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      style={{ marginLeft: "10px" }}
                      onPress={() => handleDeleteCategory(category.id)}
                    >
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
        <CardFooter>
          <Button
            color="primary"
            onPress={() => navigate("/admin/create-category")}
          >
            Создать новую категорию
          </Button>
        </CardFooter>
      </Card>

      {/* Секция модераторов */}
      <Card>
        <CardBody>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            Модераторы
          </h2>
          <Table aria-label="Модераторы">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Имя</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Рейтинг</TableColumn>
            </TableHeader>
            <TableBody>
              {moderators.map((moderator) => (
                <TableRow key={moderator.id}>
                  <TableCell>{moderator.id}</TableCell>
                  <TableCell>{moderator.name}</TableCell>
                  <TableCell>{moderator.email}</TableCell>
                  <TableCell>{moderator.rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
        <CardFooter>
          <Button
            color="primary"
            onPress={() => navigate("/admin/add-moderator")}
          >
            Добавить нового модератора
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminPage;
