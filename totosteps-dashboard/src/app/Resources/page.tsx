"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Edit, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Resource {
  resource_id: string;
  title: string;
  type: string;
  tips: string;
  activities: string;
  milestone: number;
  created_at: string;
  updated_at: string;
}

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isContentModalOpen, setIsContentModalOpen] = useState<boolean>(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [resourcesPerPage] = useState<number>(6);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('https://totosteps-29a482165136.herokuapp.com/api/resources/');
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      const data = await response.json();
      setResources(data);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to fetch resources. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResourceClick = async (resourceId: string) => {
    try {
      const response = await fetch(`https://totosteps-29a482165136.herokuapp.com/api/resources/${resourceId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch resource details');
      }
      const data = await response.json();
      setSelectedResource(data);
      setIsContentModalOpen(true);
    } catch (err) {
      console.error('Error fetching resource details:', err);
      alert('Failed to fetch resource details. Please try again.');
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (resourceId: string) => {
    setResourceToDelete(resourceId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;

    try {
      const response = await fetch(`https://totosteps-29a482165136.herokuapp.com/api/resources/${resourceToDelete}/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }
      setResources(resources.filter(r => r.resource_id !== resourceToDelete));
      setIsDeleteModalOpen(false);
      setResourceToDelete(null);
    } catch (err) {
      console.error('Error deleting resource:', err);
      alert('Failed to delete resource. Please try again.');
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingResource) return;

    try {
      const response = await fetch(`https://totosteps-29a482165136.herokuapp.com/api/resources/${editingResource.resource_id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingResource),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update resource: ${errorData.detail}`);
      }
      const updatedResource = await response.json();
      setResources(resources.map(r => r.resource_id === updatedResource.resource_id ? updatedResource : r));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating resource:', err);
      alert(`Failed to update resource: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = resources.slice(indexOfFirstResource, indexOfLastResource);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(resources.length / resourcesPerPage);

  if (loading) return <Layout><div className="flex justify-center items-center h-screen">Loading resources...</div></Layout>;
  if (error) return <Layout><div className="flex justify-center items-center h-screen text-red-500">{error}</div></Layout>;

  return (
    <Layout>
      <div className="p-6 bg-white rounded-lg shadow w-full">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#4C0033' }}>Resources for Your Child&apos;s Growth</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentResources.map((resource) => (
            <div
              key={resource.resource_id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 cursor-pointer"
              onClick={() => handleResourceClick(resource.resource_id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-800">{resource.title}</h4>
                <div className="flex space-x-2">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(resource); }} className="text-blue-500 hover:text-blue-700">
                    <Edit size={18} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(resource.resource_id); }} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">Type: {resource.type}</p>
              <p className="text-xs text-gray-500">Click to view full content</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span>{currentPage} of {totalPages}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-600 text-center">
          These resources are designed to support your child&apos;s development at each stage.
        </p>
      </div>

      {isContentModalOpen && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-[calc(100%-4rem)] h-[90vh] max-w-4xl overflow-y-auto mx-auto nest-hub:w-[calc(100%-4rem)] nest-hub:h-[95vh] nest-hub-max:w-[calc(100%-6rem)] nest-hub-max:h-[92vh]">
            <div className="sticky top-0 bg-white z-10 p-6 border-b nest-hub:p-4 nest-hub-max:p-5">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold nest-hub.content-modal h3 nest-hub-max.content-modal h3 { font-size: 50px; }">{selectedResource.title}</h3>
                <button onClick={() => setIsContentModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} className="nest-hub:w-16 nest-hub:h-16 nest-hub-max:w-16 nest-hub-max:h-16" />
                </button>
              </div>
            </div>
            <div className="p-6 nest-hub:p-4 nest-hub-max:p-5">
              <div className="mb-6">
                <h4 className="text-xl font-medium mb-2 nest-hub.content-modal h4 nest-hub-max.content-modal h4 { font-size: 50px; }">Tips:</h4>
                <p className="text-base text-gray-800 whitespace-pre-wrap nest-hub.content-modal p nest-hub-max.content-modal p { font-size: 50px; }">{selectedResource.tips}</p>
              </div>
              <div>
                <h4 className="text-xl font-medium mb-2 nest-hub.content-modal h4 nest-hub-max.content-modal h4 { font-size: 50px; }">Activities:</h4>
                <p className="text-base text-gray-800 whitespace-pre-wrap nest-hub.content-modal p nest-hub-max.content-modal p { font-size: 50px; }">{selectedResource.activities}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editingResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 sm:p-6">
          <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-semibold">Edit Resource</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-sm sm:text-base font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={editingResource.title}
                  onChange={(e) => setEditingResource({...editingResource, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm sm:text-base font-medium text-gray-700">Type</label>
                <select
                  value={editingResource.type}
                  onChange={(e) => setEditingResource({...editingResource, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="reading">Reading</option>
                  <option value="writing">Writing</option>
                  <option value="math">Math</option>
                  <option value="science">Science</option>
                  <option value="social studies">Social Studies</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm sm:text-base font-medium text-gray-700">Milestone</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={editingResource.milestone}
                  onChange={(e) => setEditingResource({...editingResource, milestone: parseInt(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm sm:text-base font-medium text-gray-700">Tips</label>
                <textarea
                  rows={3}
                  value={editingResource.tips}
                  onChange={(e) => setEditingResource({...editingResource, tips: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm sm:text-base font-medium text-gray-700">Activities</label>
                <textarea
                  rows={3}
                  value={editingResource.activities}
                  onChange={(e) => setEditingResource({...editingResource, activities: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <button type="submit" className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

{isDeleteModalOpen && resourceToDelete && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
      <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
      <p className="text-gray-600 mb-6">Are you sure you want to delete this resource? This action cannot be undone.</p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setIsDeleteModalOpen(false)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </Layout>
  );
};

export default Resources;