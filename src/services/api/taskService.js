import { delay } from '../index';
import tasksData from '../mockData/tasks.json';

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    return { ...task };
  }

  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    this.tasks[index] = { ...this.tasks[index], ...updates };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    this.tasks.splice(index, 1);
    return { success: true };
  }

  async getByCategory(categoryId) {
    await delay(250);
    return this.tasks.filter(t => t.categoryId === categoryId).map(t => ({ ...t }));
  }

  async getByPriority(priority) {
    await delay(250);
    return this.tasks.filter(t => t.priority === priority).map(t => ({ ...t }));
  }
}

export default new TaskService();