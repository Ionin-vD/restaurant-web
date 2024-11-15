import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../src/css/GridPersonal.css";
import { globals } from "../config";

function Personal() {
  const [datas, setDatas] = useState([]);
  const [newPersonal, setNewPersonal] = useState({
    nameAndSerName: "",
    login: "",
    password: "",
    role: "waiter",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://${globals.ipAddress}:${globals.port}/restaurant/personal/get_all`
        );
        if (response.status === 200) {
          setDatas(response.data);
          setError("");
        } else {
          setError(
            "Ошибка при выполнении запроса. Пожалуйста, попробуйте позже."
          );
        }
      } catch (error) {
        setError(
          "Ошибка при выполнении запроса. Пожалуйста, попробуйте позже."
        );
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedDatas = [...datas];
    updatedDatas[index][field] = value;
    setDatas(updatedDatas);
  };

  const validateFields = (personal) => {
    if (
      !personal.nameAndSerName ||
      !personal.login ||
      !personal.password ||
      !personal.role
    ) {
      return "Все поля должны быть заполнены.";
    }
    return null;
  };

  const handleSave = async (index) => {
    const personal = datas[index];
    const validationError = validateFields(personal);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const response = await axios.put(
        `http://${globals.ipAddress}:${globals.port}/restaurant/personal/update`,
        personal
      );
      if (response.status === 200) {
        setError("Успешно сохранено.");
      } else {
        setError("Не удалось сохранить изменения.");
      }
    } catch (error) {
      setError("Ошибка при выполнении запроса. Пожалуйста, попробуйте позже.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://${globals.ipAddress}:${globals.port}/restaurant/personal/delete/${id}`
      );
      if (response.status === 204) {
        setDatas(datas.filter((rating) => rating.id !== id));
        setError("");
      } else {
        setError("Не удалось удалить запись.");
      }
    } catch (error) {
      setError("Ошибка при выполнении запроса. Пожалуйста, попробуйте позже.");
    }
  };

  const handleAdd = async () => {
    const validationError = validateFields(newPersonal);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const response = await axios.post(
        `http://${globals.ipAddress}:${globals.port}/restaurant/personal/add`,
        newPersonal
      );
      if (response.status === 201) {
        setDatas([...datas, response.data]);
        setNewPersonal({
          nameAndSerName: "",
          login: "",
          password: "",
          role: "waiter",
          phone: "",
        });
        setError("");
      } else {
        setError("Не удалось добавить персонал.");
      }
    } catch (error) {
      setError("Ошибка при выполнении запроса. Пожалуйста, попробуйте позже.");
    }
  };

  return (
    <div className="container">
      <div className="rating-container">
        <h2 className="h2-auth-text">Персонал</h2>
        <div className="table-wrapper">
          <div className="table-header">
            <div className="row">
              <div className="text">Номер персонала</div>
              <div className="text">Фамилия и имя</div>
              <div className="text">Логин</div>
              <div className="text">Пароль</div>
              <div className="text">Роль</div>
              <div className="text">Действия</div>
            </div>
          </div>
          <div className="table-body">
            {datas.map((rating, index) => (
              <div className="row" key={index}>
                <div className="inStyle">{rating.id}</div>
                <input
                  type="text"
                  value={rating.nameAndSerName}
                  onChange={(e) =>
                    handleInputChange(index, "nameAndSerName", e.target.value)
                  }
                />
                <input
                  type="text"
                  value={rating.login}
                  onChange={(e) =>
                    handleInputChange(index, "login", e.target.value)
                  }
                />
                <input
                  type="password"
                  value={rating.password}
                  onChange={(e) =>
                    handleInputChange(index, "password", e.target.value)
                  }
                />

                <select
                  value={rating.role}
                  onChange={(e) =>
                    handleInputChange(index, "role", e.target.value)
                  }
                >
                  <option value="admin">admin</option>
                  <option value="waiter">waiter</option>
                </select>
                <div>
                  <button className="butDiv" onClick={() => handleSave(index)}>
                    Сохранить
                  </button>
                  <button onClick={() => handleDelete(rating.id)}>
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="add-personal">
          <h3>Добавить нового персонала</h3>
          <input
            type="text"
            placeholder="Фамилия и Имя"
            value={newPersonal.nameAndSerName}
            onChange={(e) =>
              setNewPersonal({ ...newPersonal, nameAndSerName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Логин"
            value={newPersonal.login}
            onChange={(e) =>
              setNewPersonal({ ...newPersonal, login: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Пароль"
            value={newPersonal.password}
            onChange={(e) =>
              setNewPersonal({ ...newPersonal, password: e.target.value })
            }
          />
          <select
            value={newPersonal.role}
            onChange={(e) =>
              setNewPersonal({ ...newPersonal, role: e.target.value })
            }
          >
            <option value="admin">admin</option>
            <option value="waiter">waiter</option>
          </select>
          <button onClick={handleAdd}>Добавить</button>
        </div>
        {error && (
          <div className="error" style={{ color: "red" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Personal;
