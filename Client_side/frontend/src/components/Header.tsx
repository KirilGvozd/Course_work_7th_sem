import { useContext } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";

import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { isLoggedIn, logout, user } = useContext(AuthContext);

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <span style={{ fontWeight: "bold", fontSize: "18px" }}>
          Flea market
        </span>
      </NavbarBrand>

      {/* Кнопка Home Page */}
      <NavbarContent justify="center">
        <NavbarItem>
          {user?.role === "admin" ? (
            <Button as="a" color="primary" href="/admin" variant="bordered">
              Главная
            </Button>
          ) : (
            <Button as="a" color="default" href="/" variant="shadow">
              Главная
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* Кнопки для авторизованных пользователей */}
      <NavbarContent justify="end">
        {isLoggedIn ? (
          <>
            {/* Для админа показываем только Logout */}
            {user && user.role === "admin" ? (
              <NavbarItem>
                <Button as="a" href="/" variant="shadow" onPress={logout}>
                  Выйти
                </Button>
              </NavbarItem>
            ) : (
              <>
                {/* Для продавцов и покупателей оставляем старые кнопки */}
                {user && (
                  <>
                    {user.role === "seller" ? (
                      <>
                        <NavbarItem>
                          <Button as="a" href="/add-item" variant="shadow">
                            Добавить товар
                          </Button>
                        </NavbarItem>
                        {/* Кнопка для перехода на страницу товаров, ожидающих обработки */}
                        <NavbarItem>
                          <Button
                            as="a"
                            href="/seller/reserved-items"
                            variant="shadow"
                          >
                            Товары для обработки
                          </Button>
                        </NavbarItem>
                      </>
                    ) : (
                      <>
                        <NavbarItem>
                          <Button as="a" href="/favourites" variant="shadow">
                            Избранные
                          </Button>
                        </NavbarItem>
                        <NavbarItem>
                          <Button
                            as="a"
                            href="/user/reserved-items"
                            variant="shadow"
                          >
                            Забронированные
                          </Button>
                        </NavbarItem>
                      </>
                    )}
                  </>
                )}
                <NavbarItem>
                  <Button as="a" href="/chat" variant="shadow">
                    Чаты
                  </Button>
                </NavbarItem>
                <NavbarItem>
                  <Button as="a" href="/" variant="shadow" onPress={logout}>
                    Выйти
                  </Button>
                </NavbarItem>
              </>
            )}
          </>
        ) : (
          <>
            {/* Для неавторизованных пользователей */}
            <NavbarItem>
              <Button as="a" color="primary" href="/login" variant="shadow">
                Войти
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as="a" href="/register" variant="shadow">
                Регистрация
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
