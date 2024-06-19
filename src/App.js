import "./css/App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import Home from "./pages/HomePage";
import Login from "./pages/AuthPage";
import PreservationTable from "./pages/PreservationTablePage";
import Client from "./pages/ClientPage";
import Personal from "./pages/PersonalPage";
import ListDishes from "./pages/ListDishesPage";
import Grid from "./pages/table/GridTable";
import Menu from "./pages/Menu";
import AddTable from "./pages/table/AddTable";
import DelTable from "./pages/table/DelTable";
import InfoTable from "./pages/table/InfoTableReservation";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    // Check if the user is already logged in when the component mounts
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  if (!isLoggedIn) {
    return <Navigate to="/Login" replace />;
  }

  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is already logged in when the component mounts
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      setUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUser(user);
  };

  return (
    <Router>
      <div className="App">
        <div className="App-header">
          <img src="./photo/free-icon-open-134509.png" alt="Иконка сайта" />
          <h1>Ресторан</h1>
        </div>
        <div style={{ display: isLoggedIn ? "" : "none" }}>
          <Menu onLogout={handleLogout} />
        </div>
        <div className="App-body">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/Login" element={<Login onLogin={handleLogin} />} />
            <Route path="/Preservation_Table" element={<PreservationTable />} />
            <Route path="/Client" element={<Client />} />
            <Route path="/Personal" element={<Personal />} />
            <Route path="/List_Dishes" element={<ListDishes />} />
            <Route path="/Grid" element={<Grid />} />
            {/* <Route path="/SubReservation" element={<AddTable />} />
            <Route path="/DelReservation" element={<DelTable />} /> */}
            <Route path="/InfoTable/:id/:number" element={<InfoTable />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
