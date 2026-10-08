import React from 'react';

export const PriorityBadge = ({ priority }) => {
  const normalized = (priority || 'LOW').toUpperCase();
  
  if (normalized === 'HIGH') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
        High Priority
      </span>
    );
  }
  if (normalized === 'MEDIUM') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        Medium Priority
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      Low Priority
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const normalized = (status || 'NOT_STARTED').toUpperCase();

  if (normalized === 'COMPLETED') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
        Completed
      </span>
    );
  }
  if (normalized === 'IN_PROGRESS') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
      Not Started
    </span>
  );
};
