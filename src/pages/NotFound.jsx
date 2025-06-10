import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-full bg-surface-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-8"
        >
          <ApperIcon name="FileQuestion" className="w-24 h-24 text-surface-300 mx-auto" />
        </motion.div>
        
        <h1 className="text-6xl font-heading font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-heading font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          The page you're looking for doesn't exist. Let's get you back to managing your tasks.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          Back to Tasks
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;