import taskService from './api/taskService';
import categoryService from './api/categoryService';

// Helper function to add delay for realistic loading
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export {
  taskService,
  categoryService
};