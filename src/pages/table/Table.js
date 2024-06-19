import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Table.css"; // Import CSS file for styling

function Table({ number, status }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/InfoTable/${number}`);
  };

  let tableClass;
  switch (status) {
    case "available":
      tableClass = "table_available";
      break;
    case "booked":
      tableClass = "table_booked";
      break;
    case "service":
      tableClass = "table_service";
      break;
    default:
      tableClass = "";
  }

  return (
    <button className={`table ${tableClass}`} onClick={handleButtonClick}>
      Столик {number}
    </button>
  );
}

export default Table;
