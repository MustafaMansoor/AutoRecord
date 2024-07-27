import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/dashboard/Sidebar";
import Topbar from "./components/dashboard/Topbar";
import Dashboard from "./components/dashboard/Dashboard";
import People from "./components/people/People";
import "./app.css";
import FolderComponent from "./components/FolderComponents/FolderComponent";
import Folders from "./components/folders/Folders";
import PurchaseEditAndViewPage from "./components/FolderComponents/PurchaseViewAndEdit/PurchaseEditAndViewPage";
import SaleEditAndView from "./components/sales/SaleViewAndEdit/SaleEditAndView";
import SupplierEditAndView from "./components/suppliers/SupplierViewAndEdit/SupplierEditAndView";
import LoginForm from "./components/LoginForm";
import ResetPassword from "./components/resetPassword/ResetPassword";
import { AuthProvider } from "./components/Context/AuthContext";
import { useAuth } from "./components/Context/AuthContext";
import { Navigate } from "react-router-dom";

function InnerApp() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/companies/:companyId/folders" element={<Folders />} />
            <Route
              path="/purchases/:companyId"
              element={<FolderComponent value="purchases" />}
            />
            <Route
              path="/purchases/:companyId/View"
              element={<PurchaseEditAndViewPage />}
            />
            <Route
              path="/sales/:companyId"
              element={<FolderComponent value="sales" />}
            />
            <Route
              path="/sales/:companyId/View"
              element={<SaleEditAndView />}
            />
            <Route
              path="/suppliers/:companyId"
              element={<FolderComponent value="suppliers" />}
            />
            <Route
              path="/suppliers/:companyId/View"
              element={<SupplierEditAndView />}
            />
            <Route path="/people" element={<People />} />
            <Route path="/settings" element={<div>Settings Page</div>} />
            <Route path="/profile" element={<div>Profile Page</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/*" element={<InnerApp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
