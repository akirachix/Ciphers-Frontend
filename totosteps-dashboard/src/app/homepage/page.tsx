'use client';
import React from 'react';
import { useUsers } from '../hooks/useGetUsers';
import { useResources } from '../hooks/useGetResources';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { resourcesCount, loading: resourcesLoading, error: resourcesError } = useResources();

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center w-full h-screen overflow-hidden p-5 bg-white">
        <div className="flex-grow p-4 sm:p-8 font-sans bg-white text-base">
          <h1 className="text-[30px] sm:text-[50px] font-bold font-nunito text-black">Totosteps</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[150px] mb-16 md:mb-[150px] mt-8 md:mt-[100px]">
            <div className="bg-pink-100 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-[20px] sm:text-[30px] text-pink-500 font-bold">Total Users</h2>
              <p className="text-[20px] sm:text-[30px] mt-4 font-bold text-black">{users.length}</p>
            </div>

            <div className="bg-green-100 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-[20px] sm:text-[30px] text-green-500 font-bold">Total Resources</h2>
              <p className="text-[20px] sm:text-[30px] mt-4 font-bold text-black">{resourcesCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden mb-10 md:mb-[40px]">
            <div className="flex justify-between space-x-2 md:space-x-[400px] py-4 md:py-6 px-4 md:px-10 border-b text-lg border-pink-200">
              <div className="flex-1 text-pink-500 font-bold text-[20px] sm:text-[30px]">UserID</div>
              <div className="flex-1 text-pink-500 font-bold text-[20px] sm:text-[30px] text-center">FirstName</div>
              <div className="flex-1 text-pink-500 font-bold text-[20px] sm:text-[30px] text-right">LastName</div>
            </div>

            {users.map((user) => (
              <div className="flex justify-between px-2 md:px-[29px] py-4 border-b border-gray-100" key={user.id}>
                <div className="flex items-center text-gray-800 text-[18px] sm:text-[25px]">
                  <img
                    src="/images/icon.png"
                    alt="User Icon"
                    className="inline-block w-6 h-6 mr-2"
                    style={{ width: '30px', height: '30px' }}
                  />
                  <span>{user.id}</span>
                </div>
                <div className="text-black text-[18px] sm:text-[25px] text-center mx-auto">{user.first_name}</div>
                <div className="text-black text-[18px] sm:text-[25px] text-right">{user.last_name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
