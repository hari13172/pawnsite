import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TransactionPage from './components/TransactionPage';
import ReporPage from './components/ReporPage';
import CustomerPage from './components/CustomerPage';
import ProfilePage from './components/ProfilePage';
import CustomerFormWithTable from './components/CustomerFormWithTable';
import Profile from './components/Profile';
import PendingCustomers from './components/PendingCustomer';
import TotalCustomers from './components/TotalCustomers';
import DueDateCustomers from './components/DueDateCustomers';
import CompletedCustomers from './components/CompletedCustomers';
import UpdateCustomer from './components/UpdateCustomer';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import AuthRoute from './api/AuthRoute';

const App: React.FC = () => {
  const location = useLocation();

  // Determine whether to show the sidebar or not (do not show it on the login page)
  const showSidebar = location.pathname !== '/';

  return (
    <div className="flex">
      {/* Conditionally render the Sidebar based on the current route */}
      {showSidebar && <Sidebar />}
      <div className={`flex-1 bg-gray-100 p-6 ${showSidebar ? 'ml-0 lg:ml-64' : ''}`}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
          <Route path="/transaction" element={<AuthRoute><TransactionPage /></AuthRoute>} />
          <Route path="/reports" element={<AuthRoute><ReporPage /></AuthRoute>} />
          <Route path="/addcustomer" element={<AuthRoute><CustomerPage /></AuthRoute>} />
          <Route path="/updatecustomer/:id" element={<AuthRoute><UpdateCustomer /></AuthRoute>} />
          <Route path="/customers" element={<AuthRoute><CustomerFormWithTable /></AuthRoute>} />
          <Route path="/customers/:id" element={<AuthRoute><ProfilePage /></AuthRoute>} />
          <Route path="/profiles" element={<AuthRoute><Profile /></AuthRoute>} />
          <Route path="/pending-customers" element={<AuthRoute><PendingCustomers /></AuthRoute>} />
          <Route path="/all-customers" element={<AuthRoute><TotalCustomers /></AuthRoute>} />
          <Route path="/due-customers" element={<AuthRoute><DueDateCustomers /></AuthRoute>} />
          <Route path="/completed-customers" element={<AuthRoute><CompletedCustomers /></AuthRoute>} />
        </Routes>
      </div>
    </div>
  );
};

const AppWithRouter: React.FC = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWithRouter;
