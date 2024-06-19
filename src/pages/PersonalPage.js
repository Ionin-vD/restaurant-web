import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../src/css/GridClient.css";
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
          `https://${globals.ipAddress}:${globals.port}/restaurant/personal/get_all`
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

  const handleSave = async (index) => {
    const personal = datas[index];
    try {
      const response = await axios.put(
        `https://${globals.ipAddress}:${globals.port}/restaurant/personal/update`,
        personal
      );
      if (response.status === 200) {
        // Обработка успешного обновления
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
        `https://${globals.ipAddress}:${globals.port}/restaurant/personal/delete/${id}`
      );
      if (response.status === 200) {
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
    try {
      const response = await axios.post(
        `https://${globals.ipAddress}:${globals.port}/restaurant/personal/add`,
        newPersonal
      );
      if (response.status === 201) {
        setDatas([...datas, response.data]);
        setNewPersonal({
          nameAndSerName: "",
          login: "",
          password: "",
          role: "waiter",
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
    <div>
      <div className="rating-container">
        <h2 className="h2-auth-text">Персонал</h2>
        <div className="table-wrapper">
          <div className="table-header">
            <div className="row">
              <div>номер персонала</div>
              <div>фамилия и имя</div>
              <div>логин</div>
              <div>пароль</div>
              <div>роль</div>
            </div>
          </div>
          <div className="table-body">
            {datas.map((rating, index) => (
              <div className="row" key={index}>
                <div>{rating.id}</div>
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
                  type="text"
                  value={rating.password}
                  onChange={(e) =>
                    handleInputChange(index, "password", e.target.value)
                  }
                />
                <input
                  type="text"
                  value={rating.role}
                  onChange={(e) =>
                    handleInputChange(index, "role", e.target.value)
                  }
                />
                <div>
                  <button onClick={() => handleSave(index)}>Сохранить</button>
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
