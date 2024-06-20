import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../src/css/GridListDishes.css";
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
          `http://${globals.ipAddress}:${globals.port}/restaurant/food/get_all`
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
    const food = datas[index];
    const validationError = validateFields(food);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const response = await axios.put(
        `http://${globals.ipAddress}:${globals.port}/restaurant/food/update`,
        food
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
        `http://${globals.ipAddress}:${globals.port}/restaurant/food/delete/${id}`
      );
      if (response.status === 204) {
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
    const validationError = validateFields(newListDishes);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const response = await axios.post(
        `http://${globals.ipAddress}:${globals.port}/restaurant/food/add`,
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
        setError("Не удалось добавить блюдо.");
      }
    } catch (error) {
      setError("Ошибка при выполнении запроса. Пожалуйста, попробуйте позже.");
    }
  };

  const validateFields = (listDishes) => {
    if (!listDishes.name || !listDishes.price) {
      return "Все поля должны быть заполнены.";
    }
    return null;
  };

  return (
    <div>
      <div className="rating-container">
        <h2 className="h2-auth-text">Блюда</h2>
        <div className="table-wrapper">
          <div className="table-header">
            <div className="row">
              <div className="text">Номер блюда</div>
              <div className="text">Название</div>
              <div className="text">Цена</div>
              <div className="text">Действия</div>
            </div>
          </div>
          <div className="table-body">
            {datas.map((rating, index) => (
              <div className="row" key={index}>
                <div className="inStyle">{rating.id}</div>
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
            type="number"
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
