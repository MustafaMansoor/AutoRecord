import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/dashboard/Sidebar";
import Topbar from "./components/dashboard/Topbar";
import Dashboard from "./components/dashboard/Dashboard";
import "./app.css";
import Purchases from "./components/purchase/Purchase";
import Sales from "./components/sales/Sales";
import Supplier from "./components/suppliers/Supplier";
import Folders from "./components/folders/Folders";
function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <div>
            <Routes>
              <Route path="/" element={<Dashboard />} />

              <Route
                path="/companies/:companyId/folders"
                element={<Folders />}
              />

              <Route path="/purchases/:companyId" element={<Purchases />} />

              <Route path="/sales/:companyId" element={<Sales />} />

              <Route path="/suppliers/:companyId" element={<Supplier />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
