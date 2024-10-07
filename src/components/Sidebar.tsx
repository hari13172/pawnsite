import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <div
                className={`${isOpen ? 'w-64' : 'w-16'
                    } lg:h-screen bg-gray-800 text-white transition-all duration-300 fixed top-0 left-0 z-10 flex flex-col`}
            >
                {/* <div className="p-4 flex items-center justify-between">
                    {isOpen && <div className="text-2xl font-bold">Pawmshop Admin</div>}
                    <button onClick={toggleSidebar} className="text-2xl">
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div> */}

                <ul className={`space-y-2 mt-4 p-4 ${isOpen ? 'block' : 'hidden'}`}>
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? 'bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200 block'
                                    : 'hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200 block'
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/addcustomer"
                            className={({ isActive }) =>
                                isActive
                                    ? 'bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200 block'
                                    : 'hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200 block'
                            }
                        >
                            Add Customer
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/customers"
                            className={({ isActive }) =>
                                isActive
                                    ? 'bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200 block'
                                    : 'hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200 block'
                            }
                        >
                            Customers
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/reports"
                            className={({ isActive }) =>
                                isActive
                                    ? 'bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200 block'
                                    : 'hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200 block'
                            }
                        >
                            Reports
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            {/* <div
                className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'
                    } p-6 flex-1`}
            >
                <h1 className="text-3xl font-bold">Main Content</h1>
                <p>This is the main content area. It adjusts based on the sidebar's state.</p>
            </div> */}
        </div>
    );
};

export default Sidebar;
