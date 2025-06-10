import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isTomorrow, isPast, isThisWeek } from 'date-fns';
import TaskCard from '@/components/organisms/TaskCard';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import AddTaskModal from '@/components/organisms/AddTaskModal';
import ViewSwitcher from '@/components/molecules/ViewSwitcher';
import EmptyState from '@/components/organisms/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { taskService, categoryService } from '@/services';

const HomePage = () => {
  const { searchQuery } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentView, setCurrentView] = useState('today');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tasksData, categoriesData] = await Promise.all([
          taskService.getAll(),
          categoryService.getAll()
        ]);
        setTasks(tasksData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter tasks based on current view, search, and category
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (selectedCategory && task.categoryId !== selectedCategory) {
      return false;
    }

    // View filter
    if (currentView === 'today') {
      return isToday(new Date(task.dueDate)) || (isPast(new Date(task.dueDate)) && !task.completed);
    } else if (currentView === 'upcoming') {
      const taskDate = new Date(task.dueDate);
      return (isTomorrow(taskDate) || isThisWeek(taskDate)) && !isPast(taskDate);
    }

    return true; // 'all' view
  }).sort((a, b) => {
    // Sort by completion status, then priority, then due date
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const handleTaskComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      });
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      
      if (updatedTask.completed) {
        toast.success('Task completed! 🎉');
      } else {
        toast.info('Task marked as incomplete');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleTaskCreate = async (taskData) => {
    try {
      const newTask = await taskService.create({
        ...taskData,
        id: Date.now().toString(),
        completed: false,
        createdAt: new Date().toISOString(),
        order: tasks.length
      });
      
      setTasks(prev => [...prev, newTask]);
      setIsAddModalOpen(false);
      toast.success('Task created successfully!');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleTaskUpdate = async (taskId, taskData) => {
    try {
      const updatedTask = await taskService.update(taskId, taskData);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      toast.success('Task updated successfully!');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  if (loading) {
    return (
      <div className="flex h-full">
        <div className="w-80 bg-white border-r border-surface-200 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-10 bg-surface-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="animate-pulse"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="space-y-3">
                    <div className="h-6 bg-surface-200 rounded w-3/4"></div>
                    <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full max-w-full overflow-hidden">
      {/* Category Sidebar */}
      <CategorySidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        tasks={tasks}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* View Switcher */}
        <div className="flex-shrink-0 p-6 pb-0">
          <ViewSwitcher
            currentView={currentView}
            onViewChange={setCurrentView}
          />
        </div>

        {/* Task List */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl">
            {filteredTasks.length === 0 ? (
              <EmptyState
                view={currentView}
                hasSearch={!!searchQuery}
                hasCategory={!!selectedCategory}
                onAddTask={() => setIsAddModalOpen(true)}
                onClearFilters={() => {
                  setSelectedCategory(null);
                }}
              />
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      category={categories.find(c => c.id === task.categoryId)}
                      onComplete={handleTaskComplete}
                      onDelete={handleTaskDelete}
                      onUpdate={handleTaskUpdate}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center z-30"
      >
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full h-full rounded-full"
        >
          <ApperIcon name="Plus" size={24} />
        </Button>
      </motion.div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleTaskCreate}
        categories={categories}
      />
    </div>
  );
};

export default HomePage;