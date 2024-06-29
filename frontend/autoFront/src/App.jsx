import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/dashboard/Sidebar';
import Topbar from './components/dashboard/Topbar';
import Dashboard from './components/dashboard/Dashboard';
import './app.css'
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
              
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;