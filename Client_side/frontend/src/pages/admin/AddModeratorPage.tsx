import React, { useState } from "react";
import { Input, Button, Card, CardBody, CardFooter } from "@nextui-org/react";

const AddModeratorPage: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    // Обработка отправки формы (например, отправка данных на бэкенд)
    console.log("Добавление модератора:", { email });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Центрирование по вертикали
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
          Добавить нового модератора
        </h1>
        <CardBody>
          <Input
            label="Email"
            style={{ marginBottom: "10px" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </CardBody>
        <CardFooter style={{ justifyContent: "center" }}>
          <Button color="primary" onClick={handleSubmit}>
            Добавить модератора
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddModeratorPage;
