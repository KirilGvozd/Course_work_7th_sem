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

      <NavbarContent justify="center">
        <NavbarItem>
          <Button as="a" href="/" variant="flat">
            Home Page
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {isLoggedIn ? (
          <>
            {user && (
              <NavbarItem>
                {user.role === "seller" ? (
                  <>
                    <Button as="a" href="/add-item" variant="solid">
                      Добавить товар
                    </Button>
                  </>
                ) : (
                  <Button as="a" href="/favourites" variant="solid">
                    Избранные
                  </Button>
                )}
              </NavbarItem>
            )}
            <NavbarItem>
              <Button as="a" href="/chat" variant="solid">
                Chats
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as="a" href="/" variant="solid" onPress={logout}>
                Logout
              </Button>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <Button as="a" color="primary" href="/login" variant="solid">
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as="a" href="/register" variant="flat">
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
