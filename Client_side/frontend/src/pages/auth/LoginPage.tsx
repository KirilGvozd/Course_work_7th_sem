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
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || "Не удалось выполнить вход");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-[400px] max-w-full p-8 rounded-lg shadow-lg animate-fade-in-up">
        <h3 className="text-2xl font-semibold text-center mb-6">Авторизация</h3>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <Input
          fullWidth
          className="mb-4"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          fullWidth
          className="mb-4"
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          fullWidth
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-300"
          onPress={handleLogin}
        >
          Войти
        </Button>
        <Spacer y={1} />
        <Button
          fullWidth
          className="border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 py-2 rounded-md transition duration-300"
          variant="flat"
          onPress={() => navigate("/register")}
        >
          Регистрация
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;
