"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Edit, Trash2, X } from 'lucide-react';

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

  const handleDelete = async (resourceId: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        const response = await fetch(`https://totosteps-29a482165136.herokuapp.com/api/resources/${resourceId}/`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete resource');
        }
        setResources(resources.filter(r => r.resource_id !== resourceId));
      } catch (err) {
        console.error('Error deleting resource:', err);
        alert('Failed to delete resource. Please try again.');
      }
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
      alert(`Failed to update resource: ${err.message}`);
    }
  };

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.milestone]) {
      acc[resource.milestone] = [];
    }
    acc[resource.milestone].push(resource);
    return acc;
  }, {} as Record<number, Resource[]>);

  if (loading) return <Layout><div className="flex justify-center items-center h-screen">Loading resources...</div></Layout>;
  if (error) return <Layout><div className="flex justify-center items-center h-screen text-red-500">{error}</div></Layout>;

  return (
    <Layout>
      <div className="p-6 bg-white rounded-lg shadow w-full">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#4C0033' }}>Resources for Your Child's Growth</h2>

        {Object.entries(groupedResources).sort(([a], [b]) => Number(a) - Number(b)).map(([milestone, milestoneResources]) => (
          <div key={milestone} className="mb-12">
            <h3 className="text-2xl font-semibold mb-4" style={{ color: '#F58220' }}>
              Milestone {milestone}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {milestoneResources.map((resource) => (
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
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(resource.resource_id); }} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Click to view full content</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="mt-8 text-sm text-gray-600 text-center">
          These resources are designed to support your child's development at each stage.
        </p>
      </div>

      {isContentModalOpen && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">{selectedResource.title}</h3>
              <button onClick={() => setIsContentModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <h4 className="text-lg font-medium mb-2">Tips:</h4>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{selectedResource.tips}</p>
            </div>
            <div className="mb-4">
              <h4 className="text-lg font-medium mb-2">Activities:</h4>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{selectedResource.activities}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Type:</strong> {selectedResource.type}</p>
                <p><strong>Milestone:</strong> {selectedResource.milestone}</p>
              </div>
              <div>
                <p><strong>Created:</strong> {new Date(selectedResource.created_at).toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {new Date(selectedResource.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editingResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Resource</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={editingResource.title}
                  onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tips</label>
                <textarea
                  value={editingResource.tips}
                  onChange={(e) => setEditingResource({ ...editingResource, tips: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Activities</label>
                <textarea
                  value={editingResource.activities}
                  onChange={(e) => setEditingResource({ ...editingResource, activities: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Milestone</label>
                <input
                  type="number"
                  value={editingResource.milestone}
                  onChange={(e) => setEditingResource({ ...editingResource, milestone: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <input
                  type="text"
                  value={editingResource.type}
                  onChange={(e) => setEditingResource({ ...editingResource, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Resources;