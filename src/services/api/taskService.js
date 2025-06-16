import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        Fields: [
          'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
          'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 
          'completed_at', 'created_at', 'order'
        ],
        orderBy: [{
          FieldName: 'order',
          SortType: 'ASC'
        }]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to UI field names
      return response.data?.map(task => ({
        id: task.Id,
        title: task.title,
        description: task.description,
        categoryId: task.category_id,
        priority: task.priority,
        dueDate: task.due_date,
        completed: task.completed,
        completedAt: task.completed_at,
        createdAt: task.created_at,
        order: task.order
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error('Failed to fetch tasks');
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
          'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 
          'completed_at', 'created_at', 'order'
        ]
      };

      const response = await this.apperClient.getRecordById('task', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Task not found');
      }

      const task = response.data;
      return {
        id: task.Id,
        title: task.title,
        description: task.description,
        categoryId: task.category_id,
        priority: task.priority,
        dueDate: task.due_date,
        completed: task.completed,
        completedAt: task.completed_at,
        createdAt: task.created_at,
        order: task.order
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Map UI field names to database field names and include only Updateable fields
      const params = {
        records: [{
          title: taskData.title,
          description: taskData.description || '',
          category_id: parseInt(taskData.categoryId),
          priority: taskData.priority,
          due_date: taskData.dueDate,
          completed: taskData.completed || false,
          completed_at: taskData.completedAt || null,
          created_at: taskData.createdAt || new Date().toISOString(),
          order: taskData.order || 0
        }]
      };

      const response = await this.apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const created = successfulRecords[0].data;
          return {
            id: created.Id,
            title: created.title,
            description: created.description,
            categoryId: created.category_id,
            priority: created.priority,
            dueDate: created.due_date,
            completed: created.completed,
            completedAt: created.completed_at,
            createdAt: created.created_at,
            order: created.order
          };
        }
      }
      
      throw new Error('Failed to create task');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Map UI field names to database field names and include only Updateable fields
      const updateData = {
        Id: parseInt(id)
      };
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.categoryId !== undefined) updateData.category_id = parseInt(updates.categoryId);
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt;
      if (updates.order !== undefined) updateData.order = updates.order;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updated = successfulUpdates[0].data;
          return {
            id: updated.Id,
            title: updated.title,
            description: updated.description,
            categoryId: updated.category_id,
            priority: updated.priority,
            dueDate: updated.due_date,
            completed: updated.completed,
            completedAt: updated.completed_at,
            createdAt: updated.created_at,
            order: updated.order
          };
        }
      }
      
      throw new Error('Failed to update task');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  async getByCategory(categoryId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        Fields: [
          'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
          'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 
          'completed_at', 'created_at', 'order'
        ],
        where: [{
          FieldName: 'category_id',
          Operator: 'ExactMatch',
          Values: [categoryId]
        }],
        orderBy: [{
          FieldName: 'order',
          SortType: 'ASC'
        }]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data?.map(task => ({
        id: task.Id,
        title: task.title,
        description: task.description,
        categoryId: task.category_id,
        priority: task.priority,
        dueDate: task.due_date,
        completed: task.completed,
        completedAt: task.completed_at,
        createdAt: task.created_at,
        order: task.order
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks by category:", error);
      return [];
    }
  }

  async getByPriority(priority) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        Fields: [
          'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
          'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 
          'completed_at', 'created_at', 'order'
        ],
        where: [{
          FieldName: 'priority',
          Operator: 'ExactMatch',
          Values: [priority]
        }],
        orderBy: [{
          FieldName: 'order',
          SortType: 'ASC'
        }]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data?.map(task => ({
        id: task.Id,
        title: task.title,
        description: task.description,
        categoryId: task.category_id,
        priority: task.priority,
        dueDate: task.due_date,
        completed: task.completed,
        completedAt: task.completed_at,
        createdAt: task.created_at,
        order: task.order
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks by priority:", error);
      return [];
    }
  }
}

export default new TaskService();