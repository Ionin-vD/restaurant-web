import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../src/css/GridClient.css";
import { globals } from "../config";

function Client() {
  const [datas, setDatas] = useState([]);
  const [newClient, setNewClient] = useState({
    nameAndSerName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://${globals.ipAddress}:${globals.port}/restaurant/client/get_all`
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
    const client = datas[index];
    const validationError = validateFields(client);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const response = await axios.put(
        `http://${globals.ipAddress}:${globals.port}/restaurant/client/update`,
        client
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
        `http://${globals.ipAddress}:${globals.port}/restaurant/client/delete/${id}`
      );
      if (response.status === 204) {
        setDatas(datas.filter((data) => data.id !== id));
        setError("");
      } else {
        console.log(response.status);
        setError("Не удалось удалить запись.");
      }
    } catch (error) {
      setError("Ошибка при выполнении запроса. Пожалуйста, попробуйте позже.");
    }
  };

  const handleAdd = async () => {
    const validationError = validateFields(newClient);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const response = await axios.post(
        `http://${globals.ipAddress}:${globals.port}/restaurant/client/add`,
        newClient
      );
      if (response.status === 201) {
        setDatas([...datas, response.data]);
        setNewClient({
          nameAndSerName: "",
          phoneNumber: "",
        });
        setError("");
      } else {
        setError("Не удалось добавить клиента.");
      }
    } catch (error) {
      setError("Ошибка при выполнении запроса. Пожалуйста, попробуйте позже.");
    }
  };

  const validateFields = (client) => {
    if (!client.nameAndSerName || !client.phoneNumber) {
      return "Все поля должны быть заполнены.";
    }
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(client.phoneNumber)) {
      return "Введите корректный номер телефона.";
    }
    return null;
  };

  return (
    <div className="container">
      <div className="rating-container">
        <h2 className="h2-auth-text">Клиенты</h2>
        <div className="table-wrapper">
          <div className="table-header">
            <div className="row">
              <div className="text">Номер клиента</div>
              <div className="text">Фамилия и имя</div>
              <div className="text">Номер телефона</div>
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
                  value={rating.phoneNumber}
                  onChange={(e) =>
                    handleInputChange(index, "phoneNumber", e.target.value)
                  }
                />
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
          <h3>Добавить нового клиента</h3>
          <input
            type="text"
            placeholder="Фамилия и Имя"
            value={newClient.nameAndSerName}
            onChange={(e) =>
              setNewClient({ ...newClient, nameAndSerName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Номер телефона"
            value={newClient.phoneNumber}
            onChange={(e) =>
              setNewClient({ ...newClient, phoneNumber: e.target.value })
            }
          />
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

export default Client;
