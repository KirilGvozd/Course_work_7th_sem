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
                {user.role === "seller" ? ( // Check for seller role
                  <Button as="a" href="/add-item" variant="solid">
                    Add Item
                  </Button>
                ) : (
                  <Button as="a" href="/favourites" variant="solid">
                    Favourites
                  </Button> // Display user info
                )}
              </NavbarItem>
            )}
            <NavbarItem>
              <Button variant="solid" onClick={logout}>
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
                Register
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
