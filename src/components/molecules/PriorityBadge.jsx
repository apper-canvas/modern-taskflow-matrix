import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const PriorityBadge = ({ priority, showLabel = true }) => {
  const config = {
    low: {
      color: 'bg-gray-100 text-gray-600',
      icon: 'Minus',
      label: 'Low'
    },
    medium: {
      color: 'bg-warning/20 text-warning',
      icon: 'Equal',
      label: 'Medium'
    },
    high: {
      color: 'bg-error/20 text-error',
      icon: 'ChevronUp',
      label: 'High'
    },
    urgent: {
      color: 'bg-error text-white',
      icon: 'AlertTriangle',
      label: 'Urgent'
    }
  };

  const { color, icon, label } = config[priority] || config.medium;

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      <ApperIcon name={icon} size={12} />
      {showLabel && <span>{label}</span>}
    </div>
  );
};

export default PriorityBadge;