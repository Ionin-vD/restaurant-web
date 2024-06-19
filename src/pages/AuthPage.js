import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { globals } from "../config";

function Login({ onLogin }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Состояние для ошибки
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://${globals.ipAddress}:${globals.port}/restaurant/personal/check_login`,
        { login, password }
      );
      if (response.status === 200) {
        const user = {
          id: response.data.id,
          nameAndSerName: response.data.nameAndSerName,
          login: response.data.login,
          role: response.data.role,
        };
        // Сохранить данные в локальное хранилище
        localStorage.setItem("user", JSON.stringify(user));
        // Успешный логин
        onLogin(user);
        navigate("/");
        window.location.reload();
      } else {
        setError("Неверный логин или пароль."); // Устанавливаем ошибку
      }
    } catch (error) {
      setError("Неверный логин или пароль."); // Устанавливаем ошибку
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="Login">
          <h1 className="h3 mb-3 fw-normal">Авторизация</h1>
        </div>
        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )}{" "}
        {/* Уведомление об ошибке */}
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <label htmlFor="floatingInput">Логин</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="floatingPassword">Пароль</label>
        </div>
        <button className="btn btn-primary w-100 py-2" type="submit">
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
