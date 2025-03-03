import { useContext } from "react";
import { motion } from "framer-motion";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import {
  FaHome,
  FaPlus,
  FaList,
  FaHeart,
  FaShoppingCart,
  FaComments,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { isLoggedIn, logout, user } = useContext(AuthContext);

  return (
    <Navbar isBordered className="shadow-sm bg-white">
      {/* Логотип и бренд */}
      <NavbarBrand>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <span className="font-bold text-xl text-gray-800">Flea market</span>
        </motion.div>
      </NavbarBrand>

      {/* Центральная часть: кнопка "Главная" */}
      <NavbarContent justify="center">
        <NavbarItem>
          <motion.div whileHover="hover" whileTap="tap">
            {user?.role === "admin" ? (
              <Button
                as="a"
                className="font-medium flex items-center gap-2"
                color="primary"
                href="/admin"
                startContent={<FaHome />}
                variant="bordered"
              >
                Главная
              </Button>
            ) : (
              <Button
                as="a"
                className="font-medium flex items-center gap-2"
                color="default"
                href="/"
                startContent={<FaHome />}
                variant="bordered"
              >
                Главная
              </Button>
            )}
          </motion.div>
        </NavbarItem>
      </NavbarContent>

      {/* Правая часть: кнопки для авторизованных и неавторизованных пользователей */}
      <NavbarContent justify="end">
        {isLoggedIn ? (
          <>
            {/* Для админа показываем только кнопку "Выйти" */}
            {user && user.role === "admin" ? (
              <NavbarItem>
                <motion.div whileHover="hover" whileTap="tap">
                  <Button
                    as="a"
                    className="font-medium flex items-center gap-2"
                    href="/"
                    startContent={<FaSignOutAlt />}
                    variant="bordered"
                    onPress={logout}
                  >
                    Выйти
                  </Button>
                </motion.div>
              </NavbarItem>
            ) : (
              <>
                {/* Для продавцов и покупателей */}
                {user && (
                  <>
                    {user.role === "seller" ? (
                      <>
                        <NavbarItem>
                          <motion.div whileHover="hover" whileTap="tap">
                            <Button
                              as="a"
                              className="font-medium flex items-center gap-2"
                              href="/add-item"
                              startContent={<FaPlus />}
                              variant="bordered"
                            >
                              Добавить товар
                            </Button>
                          </motion.div>
                        </NavbarItem>
                        <NavbarItem>
                          <motion.div whileHover="hover" whileTap="tap">
                            <Button
                              as="a"
                              className="font-medium flex items-center gap-2"
                              href="/seller/reserved-items"
                              startContent={<FaList />}
                              variant="bordered"
                            >
                              Товары для обработки
                            </Button>
                          </motion.div>
                        </NavbarItem>
                      </>
                    ) : (
                      <>
                        {/*<NavbarItem>*/}
                        {/*  <motion.div whileHover="hover" whileTap="tap">*/}
                        {/*    <Button*/}
                        {/*      as="a"*/}
                        {/*      className="font-medium flex items-center gap-2"*/}
                        {/*      href="/user/wishlist"*/}
                        {/*      startContent={<FaClipboardList />}*/}
                        {/*      variant="bordered"*/}
                        {/*    >*/}
                        {/*      Желаемые*/}
                        {/*    </Button>*/}
                        {/*  </motion.div>*/}
                        {/*</NavbarItem>*/}
                        <NavbarItem>
                          <motion.div whileHover="hover" whileTap="tap">
                            <Button
                              as="a"
                              className="font-medium flex items-center gap-2"
                              href="/favourites"
                              startContent={<FaHeart />}
                              variant="bordered"
                            >
                              Избранные
                            </Button>
                          </motion.div>
                        </NavbarItem>
                        <NavbarItem>
                          <motion.div whileHover="hover" whileTap="tap">
                            <Button
                              as="a"
                              className="font-medium flex items-center gap-2"
                              href="/user/reserved-items"
                              startContent={<FaShoppingCart />}
                              variant="bordered"
                            >
                              Забронированные
                            </Button>
                          </motion.div>
                        </NavbarItem>
                      </>
                    )}
                  </>
                )}
                <NavbarItem>
                  <motion.div whileHover="hover" whileTap="tap">
                    <Button
                      as="a"
                      className="font-medium flex items-center gap-2"
                      href="/chat"
                      startContent={<FaComments />}
                      variant="bordered"
                    >
                      Чаты
                    </Button>
                  </motion.div>
                </NavbarItem>
                <NavbarItem>
                  <motion.div whileHover="hover" whileTap="tap">
                    <Button
                      as="a"
                      className="font-medium flex items-center gap-2"
                      href="/"
                      startContent={<FaSignOutAlt />}
                      variant="bordered"
                      onPress={logout}
                    >
                      Выйти
                    </Button>
                  </motion.div>
                </NavbarItem>
              </>
            )}
          </>
        ) : (
          <>
            {/* Для неавторизованных пользователей */}
            <NavbarItem>
              <motion.div whileHover="hover" whileTap="tap">
                <Button
                  as="a"
                  className="font-medium flex items-center gap-2"
                  color="primary"
                  href="/login"
                  startContent={<FaSignInAlt />}
                  variant="bordered"
                >
                  Войти
                </Button>
              </motion.div>
            </NavbarItem>
            <NavbarItem>
              <motion.div whileHover="hover" whileTap="tap">
                <Button
                  as="a"
                  className="font-medium flex items-center gap-2"
                  href="/register"
                  startContent={<FaUserPlus />}
                  variant="bordered"
                >
                  Регистрация
                </Button>
              </motion.div>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
