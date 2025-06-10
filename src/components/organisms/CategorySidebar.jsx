import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const CategorySidebar = ({ categories, selectedCategory, onCategorySelect, tasks }) => {
  const getCategoryTaskCount = (categoryId) => {
    return tasks.filter(task => task.categoryId === categoryId && !task.completed).length;
  };

  const getTotalTaskCount = () => {
    return tasks.filter(task => !task.completed).length;
  };

  const getCategoryColor = (color) => {
    const colorMap = {
      red: 'bg-gradient-to-r from-error/20 to-error/10 border-error/30 text-error',
      blue: 'bg-gradient-to-r from-info/20 to-info/10 border-info/30 text-info',
      green: 'bg-gradient-to-r from-success/20 to-success/10 border-success/30 text-success',
      yellow: 'bg-gradient-to-r from-warning/20 to-warning/10 border-warning/30 text-warning',
      purple: 'bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30 text-primary'
    };
    return colorMap[color] || colorMap.purple;
  };

  return (
    <div className="w-80 bg-white border-r border-surface-200 flex flex-col max-w-full overflow-hidden">
      <div className="p-6 border-b border-surface-200">
        <h2 className="text-lg font-heading font-semibold text-gray-900">Categories</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {/* All Tasks */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => onCategorySelect(null)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-primary/20 to-secondary/10 border-primary/30 text-primary'
                  : 'bg-surface-50 border-surface-200 text-gray-700 hover:bg-surface-100'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`p-2 rounded-lg ${
                  selectedCategory === null ? 'bg-primary/20' : 'bg-surface-200'
                }`}>
                  <ApperIcon name="List" size={16} />
                </div>
                <span className="font-medium break-words">All Tasks</span>
              </div>
              <span className="text-sm font-medium bg-white/50 px-2 py-1 rounded-full">
                {getTotalTaskCount()}
              </span>
            </Button>
          </motion.div>

          {/* Category List */}
          {categories.map(category => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => onCategorySelect(category.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border ${
                  selectedCategory === category.id
                    ? getCategoryColor(category.color)
                    : 'bg-surface-50 border-surface-200 text-gray-700 hover:bg-surface-100'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`p-2 rounded-lg ${
                    selectedCategory === category.id 
                      ? 'bg-white/20' 
                      : 'bg-surface-200'
                  }`}>
                    <ApperIcon name={category.icon} size={16} />
                  </div>
                  <span className="font-medium break-words">{category.name}</span>
                </div>
                <span className="text-sm font-medium bg-white/50 px-2 py-1 rounded-full">
                  {getCategoryTaskCount(category.id)}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;