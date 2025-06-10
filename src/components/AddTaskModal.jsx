import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';
import PriorityBadge from './PriorityBadge';

const AddTaskModal = ({ isOpen, onClose, onSubmit, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: categories[0]?.id || '',
    priority: 'medium',
    dueDate: format(new Date(), 'yyyy-MM-dd')
  });

  const [errors, setErrors] = useState({});

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-gray-500' },
    { value: 'medium', label: 'Medium', color: 'text-warning' },
    { value: 'high', label: 'High', color: 'text-error' },
    { value: 'urgent', label: 'Urgent', color: 'text-error font-bold' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        categoryId: categories[0]?.id || '',
        priority: 'medium',
        dueDate: format(new Date(), 'yyyy-MM-dd')
      });
      setErrors({});
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-surface-200">
            <h2 className="text-xl font-heading font-semibold text-gray-900">Add New Task</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="What needs to be done?"
                  className={`w-full px-4 py-3 bg-surface-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                    errors.title ? 'border-error' : 'border-surface-200'
                  }`}
                  autoFocus
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-error">{errors.title}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Add more details..."
                rows="3"
                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                className={`w-full px-4 py-3 bg-surface-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                  errors.categoryId ? 'border-error' : 'border-surface-200'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-error">{errors.categoryId}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="grid grid-cols-2 gap-2">
                {priorityOptions.map(option => (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChange('priority', option.value)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                      formData.priority === option.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-surface-200 bg-surface-50 text-gray-700 hover:bg-surface-100'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <PriorityBadge priority={option.value} showLabel={false} />
                      <span>{option.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-surface-100 text-gray-700 rounded-lg hover:bg-surface-200 transition-colors font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
              >
                Create Task
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddTaskModal;