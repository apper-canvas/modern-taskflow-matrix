import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isPast } from 'date-fns';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import ViewSwitcher from './ViewSwitcher';
import CategorySidebar from './CategorySidebar';
import ApperIcon from './ApperIcon';
import { taskService, categoryService } from '../services';

const MainFeature = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentView, setCurrentView] = useState('today');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory && task.categoryId !== selectedCategory) {
      return false;
    }
    if (currentView === 'today') {
      return isToday(new Date(task.dueDate)) || (isPast(new Date(task.dueDate)) && !task.completed);
    }
    return true;
  }).sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
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
      }
    } catch (err) {
      toast.error('Failed to update task');
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

  if (loading) {
    return (
      <div className="flex h-full">
        <div className="w-80 bg-white border-r border-surface-200 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse h-10 bg-surface-200 rounded-full"></div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6 shadow-sm">
                <div className="h-6 bg-surface-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-surface-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full max-w-full overflow-hidden">
      <CategorySidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        tasks={tasks}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-shrink-0 p-6 pb-0">
          <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  category={categories.find(c => c.id === task.categoryId)}
                  onComplete={handleTaskComplete}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center z-30"
      >
        <ApperIcon name="Plus" size={24} />
      </motion.button>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleTaskCreate}
        categories={categories}
      />
    </div>
  );
};

export default MainFeature;