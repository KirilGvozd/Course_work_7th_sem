import React, { useState } from "react";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardFooter,
  Select,
  SelectItem,
  Spacer,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const CreateCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [attributes, setAttributes] = useState<
    { name: string; type: string }[]
  >([]);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [newAttributeType, setNewAttributeType] = useState("STRING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Добавление нового атрибута
  const handleAddAttribute = () => {
    if (newAttributeName.trim() && newAttributeType) {
      setAttributes([
        ...attributes,
        { name: newAttributeName, type: newAttributeType },
      ]);
      setNewAttributeName("");
      setNewAttributeType("STRING");
    }
  };

  // Удаление атрибута
  const handleRemoveAttribute = (index: number) => {
    const updatedAttributes = attributes.filter((_, i) => i !== index);

    setAttributes(updatedAttributes);
  };

  // Отправка формы
  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Название категории обязательно");

      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Создание категории
      const categoryResponse = await fetch("http://localhost:4000/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({ name }),
        credentials: "include",
      });

      if (!categoryResponse.ok) {
        throw new Error("Не удалось создать категорию");
      }

      const categoryData = await categoryResponse.json();
      const categoryId = categoryData.id;

      // Создание атрибутов
      for (const attribute of attributes) {
        const attributeResponse = await fetch(
          "http://localhost:4000/attribute",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "*/*",
            },
            body: JSON.stringify({
              name: attribute.name,
              categoryId,
              type: attribute.type,
            }),
            credentials: "include",
          },
        );

        if (!attributeResponse.ok) {
          throw new Error("Не удалось создать атрибут");
        }
      }

      // Перенаправление на страницу админа после успешного создания
      navigate("/admin");
    } catch (err) {
      setError("Произошла ошибка при создании категории или атрибутов");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <Card style={{ width: "400px", padding: "20px" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Создать новую категорию
        </h1>
        <CardBody>
          {/* Поле для названия категории */}
          <Input
            label="Название категории"
            style={{ marginBottom: "10px" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div style={{ marginBottom: "10px" }}>
            <Spacer y={1} />
            <Input
              label="Название атрибута"
              style={{ marginBottom: "10px" }}
              value={newAttributeName}
              onChange={(e) => setNewAttributeName(e.target.value)}
            />
            <Spacer y={1} />
            <Select
              label="Тип атрибута"
              selectedKeys={[newAttributeType]}
              style={{ marginBottom: "10px" }}
              onChange={(e) => setNewAttributeType(e.target.value)}
            >
              <SelectItem key="STRING" value="STRING">
                STRING
              </SelectItem>
              <SelectItem key="NUMBER" value="NUMBER">
                NUMBER
              </SelectItem>
              <SelectItem key="BOOLEAN" value="BOOLEAN">
                BOOLEAN
              </SelectItem>
            </Select>
            <Button fullWidth onPress={handleAddAttribute}>
              Добавить атрибут
            </Button>
          </div>

          {/* Список добавленных атрибутов */}
          {attributes.length > 0 && (
            <div style={{ marginBottom: "10px" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "10px" }}>
                Атрибуты:
              </h3>
              {attributes.map((attr, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <span>
                    {attr.name} ({attr.type})
                  </span>
                  <Button
                    size="sm"
                    onPress={() => handleRemoveAttribute(index)}
                  >
                    Удалить
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
        <CardFooter style={{ justifyContent: "center" }}>
          <Button color="primary" isLoading={loading} onPress={handleSubmit}>
            Создать категорию
          </Button>
        </CardFooter>

        {/* Отображение ошибки */}
        {error && (
          <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
            {error}
          </p>
        )}
      </Card>
    </div>
  );
};

export default CreateCategoryPage;
