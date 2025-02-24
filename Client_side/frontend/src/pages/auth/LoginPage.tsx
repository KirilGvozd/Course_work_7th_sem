import { useNavigate } from "react-router-dom";
import { Input, Button, Card, Spacer } from "@nextui-org/react";
import { useState } from "react";

import api from "@/utils/api.ts";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const response = await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true },
      );

      const userRole = response.data?.userRole;

      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Не удалось выполнить вход");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <Card style={{ maxWidth: "400px", width: "100%", padding: "2rem" }}>
        <h3 style={{ textAlign: "center" }}>Авторизация</h3>
        <Spacer y={1} />
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <Input
          fullWidth
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Spacer y={1} />
        <Input
          fullWidth
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Spacer y={1} />
        <Button fullWidth onPress={handleLogin}>
          Войти
        </Button>
        <Spacer y={0.5} />
        <Button fullWidth variant="flat" onPress={() => navigate("/register")}>
          Регистрация
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;
