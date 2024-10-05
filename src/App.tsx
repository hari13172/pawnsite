import React from 'react';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/DashboardPage';
import TransactionPage from './components/TransactionPage';
import ReporPage from './components/ReporPage';
import CustomerPage from './components/CustomerPage';
import ProfilePage from './components/ProfilePage';
import CustomerFormWithTable from './components/CustomerFormWithTable';
import Profile from './components/Profile';

const App: React.FC = () => {


  return (

    <Router>
      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-6 ml-0 lg:ml-64">
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/transaction' element={<TransactionPage />} />
            <Route path='/reports' element={<ReporPage />} />
            <Route path='/addcustomer' element={<CustomerPage />} />
            <Route path='/customers' element={<CustomerFormWithTable />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/profiles' element={<Profile />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
