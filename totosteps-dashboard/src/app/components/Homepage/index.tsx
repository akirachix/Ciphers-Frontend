import React from 'react';
import Sidebar from '../Sidebar';

const Dashboard = () => {
  const users = [
    { id: '001', name: 'Nancy Shimwe' },
    { id: '002', name: 'Eyvone Oyella' },
    { id: '003', name: 'Simon Peter' },
    { id: '004', name: 'Moses Abraham' },
    { id: '005', name: 'Lauryn Hills' },
  ];

  return (
    <div className="flex w-full h-screen bg-white">
        <Sidebar/>
      <div className="flex flex-col flex-1 px-[80px] py-4 mt-20">
        <div className="grid grid-cols-3 gap-48 mb-8">
          <div className="flex flex-col items-center justify-center p-4 bg-purple-100 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Total Number of Users</h3>
            <span className="text-4xl font-bold">25</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-purple-100 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Total Number of Resources</h3>
            <span className="text-4xl font-bold">13</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-purple-100 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Total Milestones</h3>
            <span className="text-4xl font-bold">10</span>
          </div>
        </div>

        {/* Users Table */}
        <div className="flex flex-col mt-[100px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Users</h2>
            <button className="text-customOrange font-bold">View All</button>
          </div>
          <hr className="border-b-2 border-purple-700 mb-4" /> {/* Added line here */}

          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="px-[50px] py-2 text-lg font-semibold text-purple-700">User ID</th>
                <th className="px-[50px] py-2 text-lg font-semibold text-purple-700">Name</th>
                <th className="px-[50px] py-2"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-[50px] py-2 text-purple-700 font-bold">{user.id}</td>
                  <td className="px-[50px] py-2">{user.name}</td>
                  <td className="px-[50px] py-2">
                    <div className="flex space-x-4">
                      <button className="px-[50px] py-2 bg-red-100 border border-red-400 text-red-600 rounded-md">RESTRICT</button>
                      <button className="px-[50px] py-2 bg-green-100 border border-green-400 text-green-600 rounded-md">RESTORE</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
