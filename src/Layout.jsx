import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import ApperIcon from './components/ApperIcon';
import { motion } from 'framer-motion';

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="h-full flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-heading font-bold text-gray-900">TaskFlow</h1>
            </motion.div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Progress Ring */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-200"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="transparent"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-success"
                  strokeWidth="3"
                  strokeDasharray="75, 100"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700">75%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ searchQuery, setSearchQuery }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;