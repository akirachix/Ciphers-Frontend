"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Milestone {
  milestone_id: number;
  name: string;
  age: number;
  category: string;
  summary: string[];
  created_at: string;
  updated_at: string;
  is_current: boolean;
  child_id: number | null;
}

const categories = ['Social', 'Language', 'Cognitive', 'Movement'];

const Milestones: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [milestonesPerPage] = useState<number>(6);
  const [activeCategory, setActiveCategory] = useState<string>('Social');

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const response = await fetch('https://totosteps-29a482165136.herokuapp.com/api/milestones/');
      if (!response.ok) {
        throw new Error('Failed to fetch milestones');
      }
      const data = await response.json();
      setMilestones(data);
    } catch (err) {
      console.error('Error fetching milestones:', err);
      setError('Failed to fetch milestones. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMilestones = milestones.filter(
    milestone => milestone.category.toLowerCase() === activeCategory.toLowerCase()
  );

  // Pagination logic
  const indexOfLastMilestone = currentPage * milestonesPerPage;
  const indexOfFirstMilestone = indexOfLastMilestone - milestonesPerPage;
  const currentMilestones = filteredMilestones.slice(indexOfFirstMilestone, indexOfLastMilestone);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredMilestones.length / milestonesPerPage);

  if (loading) return <Layout><div className="flex justify-center items-center h-screen">Loading milestones...</div></Layout>;
  if (error) return <Layout><div className="flex justify-center items-center h-screen text-red-500">{error}</div></Layout>;

  return (
    <Layout>
      <div className="p-6 bg-white rounded-lg shadow w-full">
        <h2 className="text-4xl font-bold mb-8 text-center text-[#4C0033]">Child Development Milestones</h2>

        {/* Category Tabs */}
        <div className="flex justify-center mb-6">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 mx-2 rounded-t-lg font-semibold ${
                activeCategory === category
                  ? 'bg-[#4C0033] text-white'
                  : 'bg-gray-200 text-[#4C0033] hover:bg-gray-300'
              }`}
              onClick={() => {
                setActiveCategory(category);
                setCurrentPage(1);
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredMilestones.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {currentMilestones.map((milestone) => (
              <div
                key={milestone.milestone_id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#F58220] flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xl font-semibold text-[#4C0033]">{milestone.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">Age: {milestone.age} months</p>
                  <ul className="text-sm text-gray-700 mb-4 list-disc pl-5">
                    {milestone.summary.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(milestone.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-8">
            No milestones available for the {activeCategory} category.
          </div>
        )}

        {filteredMilestones.length > 0 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50 text-[#4C0033] border-[#4C0033] hover:bg-[#4C0033] hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-[#4C0033] font-semibold">{currentPage} of {totalPages}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-50 text-[#4C0033] border-[#4C0033] hover:bg-[#4C0033] hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        <p className="mt-8 text-sm text-gray-600 text-center">
          These milestones provide a general idea of how your child is developing. Every child is unique and may reach these milestones at different times.
        </p>
      </div>
    </Layout>
  );
};

export default Milestones;