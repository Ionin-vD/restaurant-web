import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { globals } from "../config";

function Menu({ onLogout }) {
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Получаем данные пользователя из localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserRole(user.role); // Устанавливаем роль пользователя
    }
  }, []);

  const handleMenuItemClick = (item) => {
    setActiveMenuItem(activeMenuItem === item ? null : item);
  };

  const addTable = async () => {
    try {
      const response = await axios.post(
        `http://${globals.ipAddress}:${globals.port}/restaurant/table/add`,
        { status: "available" }
      );
      if (response.status === 201) {
        window.location.reload();
      } else {
        alert("Ошибка при выполнении запроса. Пожалуйста, попробуйте позже.");
      }
    } catch (error) {
      alert("Ошибка при выполнении запроса. Пожалуйста, попробуйте позже.");
    }
  };
  const delTable = async () => {
    try {
      const response = await axios.delete(
        `http://${globals.ipAddress}:${globals.port}/restaurant/table/delete`
      );
      if (response.status === 200) {
        console.log(response.status);
        window.location.reload();
      } else if (response.status === 409) {
        console.log(response.status);
        alert("Последний столик недоступен и не может быть удален.");
      } else {
        alert("Ошибка при выполнении запроса. Пожалуйста, попробуйте позже.");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log(error.response.status);
        alert("Последний столик недоступен и не может быть удален.");
      } else {
        alert("Ошибка при выполнении запроса. Пожалуйста, попробуйте позже.");
      }
    }
  };

  return (
    <>
      <div className="Menu">
        <Link to="/" onClick={() => handleMenuItemClick("home")}>
          Главная
        </Link>
        <Link
          to="/Preservation_Table"
          onClick={() => handleMenuItemClick("reservation")}
        >
          Бронь стола
        </Link>
        {userRole === "waiter" ? null : (
          <>
            {activeMenuItem === "reservation" && (
              <div className="SubMenu">
                <Link to="/Preservation_Table" onClick={() => addTable()}>
                  Добавить стол
                </Link>
                <Link to="/Preservation_Table" onClick={() => delTable()}>
                  Удалить стол
                </Link>
              </div>
            )}
          </>
        )}
        <Link to="/Client" onClick={() => handleMenuItemClick("clients")}>
          Клиенты
        </Link>

        {userRole === "waiter" ? null : (
          <>
            <Link
              to="/Personal"
              onClick={() => handleMenuItemClick("personal")}
            >
              Персонал
            </Link>
            <Link
              to="/List_Dishes"
              onClick={() => handleMenuItemClick("dishes")}
            >
              Список блюд
            </Link>
          </>
        )}
        <Link to="/Login" id="But_Exit" onClick={onLogout}>
          Выйти
        </Link>
      </div>
    </>
  );
}

export default Menu;
