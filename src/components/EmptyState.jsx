import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const EmptyState = ({ view, hasSearch, hasCategory, onAddTask, onClearFilters }) => {
  const getEmptyStateContent = () => {
    if (hasSearch) {
      return {
        icon: 'Search',
        title: 'No tasks found',
        description: 'Try adjusting your search terms or filters.',
        actionLabel: 'Clear Filters',
        onAction: onClearFilters
      };
    }

    if (hasCategory) {
      return {
        icon: 'Filter',
        title: 'No tasks in this category',
        description: 'Tasks in this category will appear here.',
        actionLabel: 'Add Task',
        onAction: onAddTask
      };
    }

    switch (view) {
      case 'today':
        return {
          icon: 'Calendar',
          title: 'No tasks for today',
          description: "Great! You're all caught up. Add a new task or plan ahead.",
          actionLabel: 'Add Task',
          onAction: onAddTask
        };
      case 'upcoming':
        return {
          icon: 'Clock',
          title: 'No upcoming tasks',
          description: 'Your future is looking clear. Time to plan something new!',
          actionLabel: 'Add Task',
          onAction: onAddTask
        };
      default:
        return {
          icon: 'Plus',
          title: 'No tasks yet',
          description: 'Start organizing your life by creating your first task.',
          actionLabel: 'Create Your First Task',
          onAction: onAddTask
        };
    }
  };

  const { icon, title, description, actionLabel, onAction } = getEmptyStateContent();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="mb-6"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-primary/60" />
        </div>
      </motion.div>
      
      <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;