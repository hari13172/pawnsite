import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (


        <div>
            <div className='lg:flex lg:flex-col lg:w-64 lg:h-screen lg:bg-gray-800 text-white fixed top-0 left-0 z-10'>
                <div className='p-4 text-2xl font-bold'>Pawmshop Admin</div>

                <ul className='space-y-2 mt-4 p-4'>
                    {/* {['Dashboard', 'Transaction', 'customer', 'Loans', 'Reports'].map((menu, idx) => (
                        <li key={idx} className='hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200'>
                            {menu}
                        </li>
                    ))} */}

                    <li className="hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200">
                        <Link to="/">Dashboard</Link>
                    </li>
                    <li className="hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200">
                        <Link to="/transactions">Transaction</Link>
                    </li>
                    <li className="hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200">
                        <Link to="/addcustomer">Add Customer</Link>
                    </li>
                    <li className="hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200">
                        <Link to="/customers">Customers</Link>
                    </li>
                    <li className="hover:bg-gray-700 p-3 rounded-md cursor-pointer text-lg transition-colors duration-200">
                        <Link to="/reports">Reports</Link>
                    </li>
                </ul>

            </div>
        </div>
    );
};

export default Sidebar;
