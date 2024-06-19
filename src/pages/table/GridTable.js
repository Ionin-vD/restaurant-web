import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "./Table";
import "../../css/Grid.css";
import { globals } from "../../config";

function Grid() {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get(
          `http://${globals.ipAddress}:${globals.port}/restaurant/table/get_all`
        );
        if (response.status === 200) {
          const sortedTables = response.data.sort(
            (a, b) => a.numberTable - b.numberTable
          );
          setTables(sortedTables);
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

    fetchTables();
  }, []);

  return (
    <>
      <div className="grid-container">
        {error && <p className="error">{error}</p>}
        {tables.map((table) => (
          <Table
            key={table.id}
            id={table.id}
            number={table.numberTable}
            status={table.status}
          />
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </>
  );
}

export default Grid;
