import React from 'react';

export const PriorityBadge = ({ priority }) => {
  const normalized = (priority || 'LOW').toUpperCase();
  
  if (normalized === 'HIGH') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEDCDA] text-[#783636] border border-[#DEBDB9]">
        High Priority
      </span>
    );
  }
  if (normalized === 'MEDIUM') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ECE5D8] text-[#695530] border border-[#D8CEBA]">
        Medium Priority
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DEE6D8] text-[#3B5441] border border-[#C6D4BD]">
      Low Priority
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const normalized = (status || 'NOT_STARTED').toUpperCase();

  if (normalized === 'COMPLETED') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#DEE6D8] text-[#3B5441]">
        Completed
      </span>
    );
  }
  if (normalized === 'IN_PROGRESS') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#A5B392]/30 text-[#40594C]">
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ECEBE4] text-[#536158]">
      Not Started
    </span>
  );
};
