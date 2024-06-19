import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../src/css/GridClient.css";
import { globals } from "../config";

function ListDishes() {
  const [datas, setDatas] = useState([]);
  const [newListDishes, setNewListDishes] = useState({
    name: "",
    price: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://${globals.ipAddress}:${globals.port}/restaurant/food/get_all`
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
    try {
      const response = await axios.put(
        `https://${globals.ipAddress}:${globals.port}/restaurant/food/update`,
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
        `https://${globals.ipAddress}:${globals.port}/restaurant/food/delete/${id}`
      );
      if (response.status === 200) {
        setDatas(datas.filter((data) => data.id !== id));
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
        `https://${globals.ipAddress}:${globals.port}/restaurant/food/add`,
        newListDishes
      );
      if (response.status === 201) {
        setDatas([...datas, response.data]);
        setNewListDishes({
          name: "",
          price: "",
        });
        setError("");
      } else {
        setError("Не удалось добавить клиента.");
      }
    } catch (error) {
      setError("Ошибка при выполнении запроса. Пожалуйста, попробуйте позже.");
    }
  };

  return (
    <div>
      <div className="rating-container">
        <h2 className="h2-auth-text">Блюда</h2>
        <div className="table-wrapper">
          <div className="table-header">
            <div className="row">
              <div>номер блюда</div>
              <div>название</div>
              <div>цена</div>
            </div>
          </div>
          <div className="table-body">
            {datas.map((rating, index) => (
              <div className="row" key={index}>
                <div>{rating.id}</div>
                <input
                  type="text"
                  value={rating.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  value={rating.price}
                  onChange={(e) =>
                    handleInputChange(index, "price", e.target.value)
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
          <h3>Добавить новое блюдо</h3>
          <input
            type="text"
            placeholder="Название"
            value={newListDishes.name}
            onChange={(e) =>
              setNewListDishes({
                ...newListDishes,
                name: e.target.value,
              })
            }
          />
          <input
            type="text"
            placeholder="Цена"
            value={newListDishes.price}
            onChange={(e) =>
              setNewListDishes({
                ...newListDishes,
                price: e.target.value,
              })
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

export default ListDishes;
