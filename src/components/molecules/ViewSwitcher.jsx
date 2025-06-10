import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ViewSwitcher = ({ currentView, onViewChange }) => {
  const views = [
    { id: 'today', label: 'Today', icon: 'Calendar' },
    { id: 'upcoming', label: 'Upcoming', icon: 'Clock' },
    { id: 'all', label: 'All Tasks', icon: 'List' }
  ];

  return (
    <div className="flex space-x-1 bg-surface-100 p-1 rounded-xl w-fit">
      {views.map(view => (
        <motion.div
          key={view.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
            <Button
                onClick={() => onViewChange(view.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === view.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                <ApperIcon name={view.icon} size={16} />
                <span>{view.label}</span>
            </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default ViewSwitcher;