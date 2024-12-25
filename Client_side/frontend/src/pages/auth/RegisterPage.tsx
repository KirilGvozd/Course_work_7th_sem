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
  const [selectedRole, setSelectedRole] = useState<string>("buyer"); // Default role

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
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <Card style={{ maxWidth: "400px", width: "100%", padding: "2rem" }}>
        <h3 style={{ textAlign: "center" }}>Регистрация</h3>
        {error && (
          <div
            style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}
          >
            {error}
          </div>
        )}
        <Spacer y={1} />
        <Input
          fullWidth
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Spacer y={1} />
        <Spacer y={1} />
        <Input
          fullWidth
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <Input
          fullWidth
          placeholder="Подтвердите пароль"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Spacer y={1} />
        <Dropdown>
          <DropdownTrigger>
            <Button className="capitalize" variant="bordered">
              {selectedRole === "buyer" ? "Покупатель" : "Продавец"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Роли"
            selectedKeys={new Set([selectedRole])} // Convert to Set for compatibility
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
        <Button fullWidth onClick={handleRegister}>
          Зарегистрироваться
        </Button>
        <Spacer y={0.5} />
        <Button fullWidth variant="flat" onClick={() => navigate("/login")}>
          Уже есть аккаунт? Войти
        </Button>
      </Card>
    </div>
  );
};

export default RegisterPage;
