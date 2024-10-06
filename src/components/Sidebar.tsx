import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (


        <div>
            <div className='lg:flex lg:flex-col lg:w-64 lg:h-screen lg:bg-gray-800 text-white fixed top-0 left-0 z-10'>
                <div className='p-4 text-2xl font-bold'>Pawmshop Admin</div>

                <ul className='space-y-2 mt-4 p-4'>
                    <li className="hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? 'bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200' : 'hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200'
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li className="hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200">
                        <NavLink
                            to="/addcustomer"
                            className={({ isActive }) =>
                                isActive ? 'bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200' : 'hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200'
                            }
                        >
                            Add Customer
                        </NavLink>
                    </li>
                    <li className="hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200">
                        <NavLink
                            to="/customers"
                            className={({ isActive }) =>
                                isActive ? 'bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200' : 'hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200'
                            }
                        >
                            Customers
                        </NavLink>
                    </li>
                    <li className="hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200">
                        <NavLink
                            to="/reports"
                            className={({ isActive }) =>
                                isActive ? 'bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200' : 'hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200'
                            }
                        >
                            Reports
                        </NavLink>
                    </li>
                </ul>

            </div>
        </div>
    );
};

export default Sidebar;
