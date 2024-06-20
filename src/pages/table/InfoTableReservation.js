import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { globals } from "../../config";
import "../../css/InfoTable.css";

function InfoTable() {
  const { id, number } = useParams();

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
  const [tableStatus, setTableStatus] = useState(null);
  const [bookedClient, setBookedClient] = useState(null);

  useEffect(() => {
    const fetchTableStatus = async () => {
      try {
        const response = await axios.get(
          `http://${globals.ipAddress}:${globals.port}/restaurant/table/get_id/${id}`
        );
        if (response.status === 200) {
          const tableData = response.data;
          setTableStatus(tableData.status);

          if (tableData.status === "booked" || tableData.status === "service") {
            setBookedClient(tableData.client);
            setIsReserved(true);
            if (tableData.status === "service") {
              setIsBeingServed(true);
            }
          }
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

    fetchTableStatus();
  }, [id]);

  const fetchOrderedDishes = async () => {
    try {
      const response = await axios.get(
        `http://${globals.ipAddress}:${globals.port}/restaurant/table/get_ordered_dishes/${id}`
      );
      if (response.status === 200) {
        setOrderedDishes(response.data);
      } else {
        setError(
          "Ошибка при получении списка заказанных блюд. Пожалуйста, попробуйте позже."
        );
      }
    } catch (error) {
      setError(
        "Ошибка при получении списка заказанных блюд. Пожалуйста, попробуйте позже."
      );
    }
  };

  useEffect(() => {
    if (tableStatus === "service") {
      fetchOrderedDishes();
    }
  }, [tableStatus]);

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

  const handleAddDish = async () => {
    if (selectedDish) {
      try {
        const foodIds = [selectedDish];
        const response = await axios.put(
          `http://${globals.ipAddress}:${globals.port}/restaurant/table/add_food?tableId=${id}`,
          foodIds
        );

        if (response.status === 200) {
          const dish = dishes.find(
            (dish) => dish.id === parseInt(selectedDish)
          );
          setOrderedDishes([...orderedDishes, dish]);
          setSelectedDish("");
        } else {
          setError(
            "Ошибка при добавлении блюда. Пожалуйста, попробуйте позже."
          );
        }
      } catch (error) {
        setError("Ошибка при добавлении блюда. Пожалуйста, попробуйте позже.");
      }
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
        window.location.reload();
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

  const handleCancelReservation = async () => {
    try {
      if (!isBeingServed) {
        const tableResponse = await axios.put(
          `http://${globals.ipAddress}:${globals.port}/restaurant/table/update_book`,
          { id: id, status: "available" }
        );

        if (tableResponse.status === 200) {
          setIsReserved(false);
          setSelectedClient("");
          setCustomClient("");
          setCustomPhoneNumber("");
          setOrderedDishes([]);
          window.location.reload();
        } else {
          setError(
            "Не удалось обновить данные столика. Пожалуйста, попробуйте позже."
          );
        }
      } else {
        alert(
          "Невозможно отменить бронь, когда столик находится в обслуживании."
        );
      }
    } catch (error) {
      setError("Ошибка при выполнении запроса. Пожалуйста, попробуйте позже.");
    }
  };

  const handleStartServing = async () => {
    try {
      if (!isBeingServed) {
        const tableResponse = await axios.put(
          `http://${globals.ipAddress}:${globals.port}/restaurant/table/update_book`,
          { id: id, status: "service" }
        );

        if (tableResponse.status === 200) {
          setIsBeingServed(true);
          fetchOrderedDishes();
        } else {
          setError(
            "Не удалось начать обслуживать столик. Пожалуйста, попробуйте позже."
          );
        }
      } else {
        setError(
          "Ошибка при выполнении запроса. Пожалуйста, попробуйте позже."
        );
      }
    } catch (error) {
      setError("Ошибка при выполнении запроса. Пожалуйста, попробуйте позже.");
    }
  };

  const handlePrintBill = async () => {
    try {
      if (isReserved) {
        const tableResponse = await axios.put(
          `http://${globals.ipAddress}:${globals.port}/restaurant/table/update_book`,
          { id: id, status: "available" }
        );

        if (tableResponse.status === 200) {
          alert("Чек напечатан!");
          setIsReserved(false);
          setIsBeingServed(false);
          setSelectedClient("");
          setCustomClient("");
          setCustomPhoneNumber("");
          setOrderedDishes([]);
          window.location.reload();
        } else {
          setError("Не удалось напечатать чек. Пожалуйста, попробуйте позже.");
        }
      } else {
        setError(
          "Ошибка при выполнении запроса. Пожалуйста, попробуйте позже."
        );
      }
    } catch (error) {
      setError("Ошибка при выполнении запроса. Пожалуйста, попробуйте позже.");
    }
  };

  if (tableStatus === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="info-table">
      <h1 className="h2-auth-text">Столик {number}</h1>

      {tableStatus === "available" && !isReserved ? (
        <button
          onClick={handleReserveTable}
          className="btn"
          disabled={!selectedClient && (!customClient || !customPhoneNumber)}
        >
          Забронировать столик
        </button>
      ) : (
        <>
          <p>
            Забронировано для{" "}
            {bookedClient?.nameAndSerName + " " + bookedClient?.phoneNumber}
          </p>
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

      {tableStatus === "available" && !isBeingServed && (
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
                  <option key={dish.id} value={dish.id}>
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

          {/* <table className="table">
            <thead>
              <tr>
                <th>Блюдо</th>
                <th>Цена</th>
              </tr>
            </thead>
            <tbody>
              {orderedDishes.map((dish, index) => (
                <tr key={index}>
                  <td>{dish.name}</td>
                  <td>{dish.price}</td>
                </tr>
              ))}
            </tbody>
          </table> */}
          <h2 className="h2-auth-text">Блюда</h2>
          <div className="table-wrapper">
            <div className="table-header">
              <div className="row">
                <div className="text">Название блюда</div>
                <div className="text">Цена</div>
              </div>
            </div>
            <div className="table-body">
              {orderedDishes.map((dish, index) => (
                <div className="row" key={index}>
                  <div className="inStyle">{dish.name}</div>
                  <div className="inStyle">{dish.price}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default InfoTable;
