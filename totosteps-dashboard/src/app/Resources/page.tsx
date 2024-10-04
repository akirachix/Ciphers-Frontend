"use client";

import React from 'react';
import Layout from '../components/Layout';

const initialResources = [
  { id: '001', title: 'Parental tips at 1 year' },
  { id: '002', title: 'Children Physical Health' },
  { id: '003', title: 'Social-Emotional Development' },
  { id: '004', title: 'Early Intervention' },
  { id: '005', title: 'Transitions and Routines' },
 
];

const Resources: React.FC = () => {
  return (
    <Layout>
    <div className="p-6 bg-white rounded-lg shadow w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#4C0033' }}>Resources</h2>
      </div>

      <div
        className="grid grid-cols-12 gap-4 mb-4 font-bold text-black border-b-2 pb-2"
        style={{ borderColor: '#4C0033' }}
      >
        <div className="col-span-3">Resource ID</div>
        <div className="col-span-7">Resource Title</div>
      </div>

      {initialResources.map((resource) => (
        <div
          key={resource.id}
          className={`grid grid-cols-12 gap-4 py-6 border-b border-gray-200 items-center`}
        >
          <div className="col-span-3 text-gray-800 text-lg font-medium">{resource.id}</div>
          <div className="col-span-7 text-gray-800 text-lg font-medium">
            {resource.title}
          </div>
        </div>
      ))}

      <br/> <br/>
      <p className="mt-8 text-sm text-gray-600 text-center">
        This table shows the different resources offered in our mobile application. 
      </p>
    </div>
    </Layout>
  );
};

export default Resources;