import { useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Card,
  Spacer,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useState } from "react";

import api from "@/utils/api.ts";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("buyer");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Пароли не совпадают!");

      return;
    }
    try {
      await api.post(
        "/auth/register",
        { email, password, name, role: selectedRole },
        { withCredentials: true },
      );
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка регистрации");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-[400px] max-w-full p-8 rounded-lg shadow-lg animate-fade-in-up">
        <h3 className="text-2xl font-semibold text-center mb-6">Регистрация</h3>
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
          placeholder="Имя"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          fullWidth
          className="mb-4"
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          fullWidth
          className="mb-4"
          placeholder="Подтвердите пароль"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="capitalize w-full bg-white border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 rounded-md transition duration-300"
              variant="bordered"
            >
              {selectedRole === "buyer" ? "Покупатель" : "Продавец"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Роли"
            selectedKeys={new Set([selectedRole])}
            selectionMode="single"
            onSelectionChange={(keys) =>
              setSelectedRole(Array.from(keys as Set<string>)[0])
            }
          >
            <DropdownItem key="buyer">Покупатель</DropdownItem>
            <DropdownItem key="seller">Продавец</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Spacer y={1.5} />
        <Button
          fullWidth
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition duration-300"
          onPress={handleRegister}
        >
          Зарегистрироваться
        </Button>
        <Spacer y={1} />
        <Button
          fullWidth
          className="border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 py-2 rounded-md transition duration-300"
          variant="flat"
          onPress={() => navigate("/login")}
        >
          Уже есть аккаунт? Войти
        </Button>
      </Card>
    </div>
  );
};

export default RegisterPage;
