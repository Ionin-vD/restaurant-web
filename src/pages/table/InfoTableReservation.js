import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { globals } from "../../config";
import "../../css/InfoTable.css";

function InfoTable() {
  const { number } = useParams();

  const [selectedClient, setSelectedClient] = useState("");
  const [customClient, setCustomClient] = useState("");
  const [customPhoneNumber, setCustomPhoneNumber] = useState("");
  const [selectedDish, setSelectedDish] = useState("");
  const [orderedDishes, setOrderedDishes] = useState([]);
  const [clients, setClients] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState("");
  const [isReserved, setIsReserved] = useState(false);
  const [isBeingServed, setIsBeingServed] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          `http://${globals.ipAddress}:${globals.port}/restaurant/client/get_all`
        );
        if (response.status === 200) {
          setClients(response.data);
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

    const fetchDishes = async () => {
      try {
        const response = await axios.get(
          `http://${globals.ipAddress}:${globals.port}/restaurant/food/get_all`
        );
        if (response.status === 200) {
          setDishes(response.data);
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

    fetchClients();
    fetchDishes();
  }, []);

  const handleAddDish = () => {
    if (selectedDish) {
      setOrderedDishes([...orderedDishes, selectedDish]);
      setSelectedDish("");
    }
  };

  const handleReserveTable = async () => {
    try {
      let clientId = selectedClient;

      if (!clientId && customClient && customPhoneNumber) {
        const clientResponse = await axios.post(
          `http://${globals.ipAddress}:${globals.port}/restaurant/client/add`,
          { nameAndSerName: customClient, phoneNumber: customPhoneNumber }
        );
        if (clientResponse.status === 201) {
          clientId = clientResponse.data.id;
        } else {
          setError("Не удалось создать клиента. Пожалуйста, попробуйте позже.");
          return;
        }
      }

      const tableResponse = await axios.put(
        `http://${globals.ipAddress}:${globals.port}/restaurant/table/book`,
        {
          numberTable: number,
          clientId,
        }
      );

      if (tableResponse.status === 200) {
        const clientName =
          customClient ||
          clients.find((client) => client.id === parseInt(selectedClient))
            ?.nameAndSerName;
        alert(`Столик ${number} забронирован для ${clientName}`);
        setIsReserved(true);
      } else {
        setError(
          "Не удалось забронировать столик. Пожалуйста, попробуйте позже."
        );
      }
    } catch (error) {
      setError("Ошибка при выполнении запроса. Пожалуйста, попробуйте позже.");
    }
  };

  const handleCancelReservation = () => {
    if (!isBeingServed) {
      setIsReserved(false);
      setSelectedClient("");
      setCustomClient("");
      setCustomPhoneNumber("");
      setOrderedDishes([]);
    } else {
      alert(
        "Невозможно отменить бронь, когда столик находится в обслуживании."
      );
    }
  };

  const handleStartServing = () => {
    setIsBeingServed(true);
    alert(`Обслуживание клиента за столиком ${number} началось`);
  };

  const handlePrintBill = () => {
    alert("Чек напечатан!");
    setIsReserved(false);
    setIsBeingServed(false);
    setSelectedClient("");
    setCustomClient("");
    setCustomPhoneNumber("");
    setOrderedDishes([]);
  };

  return (
    <div className="info-table">
      <h1>Столик {number}</h1>

      {!isReserved ? (
        <button
          onClick={handleReserveTable}
          className="btn"
          disabled={!selectedClient && (!customClient || !customPhoneNumber)}
        >
          Забронировать столик
        </button>
      ) : (
        <>
          {!isBeingServed && (
            <button onClick={handleCancelReservation} className="btn">
              Отменить бронь
            </button>
          )}
          <button
            onClick={handleStartServing}
            disabled={isBeingServed}
            className="btn"
          >
            В обслуживание
          </button>
          {isBeingServed && (
            <button onClick={handlePrintBill} className="btn">
              Напечатать чек
            </button>
          )}
        </>
      )}
      {!isBeingServed && (
        <>
          <div className="form-group">
            <label>
              Клиенты:
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                disabled={isReserved}
                className="select"
              >
                <option value="">Выберите клиента</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nameAndSerName + " " + client.phoneNumber}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Или введите нового клиента:
              <input
                type="text"
                value={customClient}
                onChange={(e) => setCustomClient(e.target.value)}
                disabled={selectedClient !== "" || isReserved}
                className="input"
              />
            </label>
            <label>
              Телефонный номер:
              <input
                type="text"
                value={customPhoneNumber}
                onChange={(e) => setCustomPhoneNumber(e.target.value)}
                disabled={selectedClient !== "" || isReserved}
                className="input"
              />
            </label>
          </div>
        </>
      )}
      {isBeingServed && (
        <>
          <div className="form-group">
            <label>
              Блюда:
              <select
                value={selectedDish}
                onChange={(e) => setSelectedDish(e.target.value)}
                disabled={!isBeingServed}
                className="select"
              >
                <option value="">Выберите блюдо</option>
                {dishes.map((dish) => (
                  <option key={dish.id} value={dish.name + " " + dish.price}>
                    {dish.name + " " + dish.price}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={handleAddDish}
              disabled={!isBeingServed}
              className="btn"
            >
              Добавить блюдо
            </button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Блюдо</th>
              </tr>
            </thead>
            <tbody>
              {orderedDishes.map((dish, index) => (
                <tr key={index}>
                  <td>{dish}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default InfoTable;
