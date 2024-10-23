"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FaUsers, FaChartLine } from 'react-icons/fa';
import { GiMountainClimbing, GiBookshelf } from 'react-icons/gi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Metrics {
  totalUsers: number;
  totalMilestones: number;
  totalResources: number;
  totalChildren: number;
}

interface User {
  user_id: number;
  status: string;
  created_at?: string;
}

interface Milestone {
  milestone_id: number;
  status: string;
  created_at?: string;
}

const Home = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    totalUsers: 0,
    totalMilestones: 0,
    totalResources: 0,
    totalChildren: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, milestonesResponse, resourcesResponse, childrenResponse] = await Promise.all([
          fetch('https://totosteps-29a482165136.herokuapp.com/api/users/'),
          fetch('https://totosteps-29a482165136.herokuapp.com/api/milestones/'),
          fetch('https://totosteps-29a482165136.herokuapp.com/api/resources/'),
          fetch('https://totosteps-29a482165136.herokuapp.com/api/children/')
        ]);

        const [usersData, milestonesData, resourcesData, childrenData] = await Promise.all([
          usersResponse.json(),
          milestonesResponse.json(),
          resourcesResponse.json(),
          childrenResponse.json()
        ]);

        setMetrics({
          totalUsers: usersData.length,
          totalMilestones: milestonesData.length,
          totalResources: resourcesData.length,
          totalChildren: childrenData.length
        });

        setUsers(usersData);
        setMilestones(milestonesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const growthData = [
    { 
      name: 'Week 1', 
      Parents: Math.round(metrics.totalUsers * 0.4),
      Children: Math.round(metrics.totalChildren * 0.4)
    },
    { 
      name: 'Week 2', 
      Parents: Math.round(metrics.totalUsers * 0.6),
      Children: Math.round(metrics.totalChildren * 0.6)
    },
    { 
      name: 'Week 3', 
      Parents: Math.round(metrics.totalUsers * 0.8),
      Children: Math.round(metrics.totalChildren * 0.8)
    },
    { 
      name: 'Week 4', 
      Parents: metrics.totalUsers,
      Children: metrics.totalChildren
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-2xl text-[#4C0033]">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#4C0033] mb-8 text-center">Dashboard Overview</h1>
        
        {/* Reduced the vertical space from space-y-16 to space-y-4 to bring graph closer */}
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-gradient-to-r from-[#4C0033] to-[#800033] rounded-lg p-6 text-white h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-semibold mb-2">Total Users</p>
                    <p className="text-4xl font-bold">{metrics.totalUsers}</p>
                  </div>
                  <div className="text-white">
                    <FaUsers size={36} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="bg-gradient-to-r from-[#F58220] to-[#FF9F45] rounded-lg p-6 text-white h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-semibold mb-2">Total Milestones</p>
                    <p className="text-4xl font-bold">{metrics.totalMilestones}</p>
                  </div>
                  <div className="text-white">
                    <GiMountainClimbing size={36} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="bg-gradient-to-r from-[#4C0033] to-[#800033] rounded-lg p-6 text-white h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-semibold mb-2">Total Resources</p>
                    <p className="text-4xl font-bold">{metrics.totalResources}</p>
                  </div>
                  <div className="text-white">
                    <GiBookshelf size={36} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold text-[#4C0033] mb-4 text-center">Parents and Children Growth</h2>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={growthData} 
                  margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name"
                    tick={{ fill: '#4C0033' }}
                    axisLine={{ stroke: '#4C0033' }}
                    interval={0}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Number of Parents & Children', 
                      angle: -90, 
                      position: 'insideLeft',
                      offset: 10,
                      dy: 50,
                      style: { 
                        fill: '#4C0033',
                        fontSize: '12px'
                      }
                    }}
                    tick={{ fill: '#4C0033' }}
                    axisLine={{ stroke: '#4C0033' }}
                    tickLine={{ stroke: '#4C0033' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #4C0033'
                    }}
                    cursor={{ fill: 'rgba(245, 130, 32, 0.1)' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="Parents" 
                    fill="#4C0033"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                  <Bar 
                    dataKey="Children" 
                    fill="#F58220"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
