import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import PriorityBadge from '@/components/molecules/PriorityBadge';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const AddTaskForm = ({
  formData,
  handleChange,
  errors,
  categories,
  onSubmit,
  onCancel,
  isEditMode = false
}) => {
  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-gray-500' },
    { value: 'medium', label: 'Medium', color: 'text-warning' },
    { value: 'high', label: 'High', color: 'text-error' },
    { value: 'urgent', label: 'Urgent', color: 'text-error font-bold' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
      {/* Title */}
      <FormField
        label="Task Title"
        id="title"
        type="text"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="What needs to be done?"
        error={errors.title}
        required
        autoFocus
      />

      {/* Description */}
      <FormField
        label="Description"
        id="description"
        type="textarea"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Add more details..."
        rows="3"
      />

      {/* Category */}
      <FormField
        label="Category"
        id="categoryId"
        type="select"
        value={formData.categoryId}
        onChange={(e) => handleChange('categoryId', e.target.value)}
        error={errors.categoryId}
        required
        options={[
          { value: '', label: 'Select a category' },
          ...categories.map(cat => ({ value: cat.id, label: cat.name }))
        ]}
      />

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priority
        </label>
        <div className="grid grid-cols-2 gap-2">
          {priorityOptions.map(option => (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="button"
                onClick={() => handleChange('priority', option.value)}
                className={`p-3 rounded-lg border-2 text-sm font-medium ${
                  formData.priority === option.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-surface-200 bg-surface-50 text-gray-700 hover:bg-surface-100'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <PriorityBadge priority={option.value} showLabel={false} />
                  <span>{option.label}</span>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Due Date */}
      <FormField
        label="Due Date"
        id="dueDate"
        type="date"
        value={formData.dueDate}
        onChange={(e) => handleChange('dueDate', e.target.value)}
      />

      {/* Actions */}
      <div className="flex space-x-3 pt-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1"
        >
          <Button
            type="button"
            onClick={onCancel}
            className="w-full px-4 py-3 bg-surface-100 text-gray-700 rounded-lg hover:bg-surface-200 font-medium"
          >
            Cancel
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1"
        >
          <Button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg font-medium"
          >
            {isEditMode ? 'Save Changes' : 'Create Task'}
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default AddTaskForm;