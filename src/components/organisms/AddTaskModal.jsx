import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import AddTaskForm from '@/components/organisms/AddTaskForm';

const AddTaskModal = ({ isOpen, onClose, onSubmit, categories, initialTask = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: categories[0]?.id || '',
    priority: 'medium',
    dueDate: format(new Date(), 'yyyy-MM-dd')
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setFormData({
          title: initialTask.title,
          description: initialTask.description || '',
          categoryId: initialTask.categoryId || categories[0]?.id || '',
          priority: initialTask.priority || 'medium',
          dueDate: initialTask.dueDate ? format(new Date(initialTask.dueDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
        });
      } else {
        setFormData({
          title: '',
          description: '',
          categoryId: categories[0]?.id || '',
          priority: 'medium',
          dueDate: format(new Date(), 'yyyy-MM-dd')
        });
      }
      setErrors({});
    }
  }, [isOpen, initialTask, categories]);

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
      }, initialTask?.id);
      onClose();
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
            <h2 className="text-xl font-heading font-semibold text-gray-900">{initialTask ? 'Edit Task' : 'Add New Task'}</h2>
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
          <AddTaskForm
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isEditMode={!!initialTask}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddTaskModal;