import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const TaskCard = ({ task, category, onComplete, onDelete, onUpdate, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || ''
  });

  const getDueDateDisplay = () => {
    if (!task.dueDate) return null;
    
    const date = new Date(task.dueDate);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date) && !task.completed) return 'Overdue';
    return format(date, 'MMM d');
  };

  const getDueDateColor = () => {
    if (!task.dueDate) return 'text-gray-500';
    
    const date = new Date(task.dueDate);
    if (isPast(date) && !task.completed) return 'text-error';
    if (isToday(date)) return 'text-warning';
    return 'text-gray-500';
  };

  const handleSaveEdit = () => {
    if (editData.title.trim()) {
      onUpdate(task.id, editData);
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditData({ title: task.title, description: task.description || '' });
    }
  };

  return (
    <motion.div
    layout
    initial={{
        opacity: 0,
        y: 20
    }}
    animate={{
        opacity: 1,
        y: 0,
        scale: task.completed ? 0.98 : 1
    }}
    exit={{
        opacity: 0,
        x: 20
    }}
    transition={{
        duration: 0.2,
        delay: index * 0.05
    }}
    className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${task.completed ? "opacity-60 border-l-success" : category?.color === "red" ? "border-l-error" : category?.color === "blue" ? "border-l-info" : category?.color === "green" ? "border-l-success" : category?.color === "yellow" ? "border-l-warning" : "border-l-primary"} max-w-full overflow-hidden group`}>
    <div className="flex items-start space-x-4 max-w-full">
        {/* Checkbox */}
        <motion.div
            whileHover={{
                scale: 1.1
            }}
            whileTap={{
                scale: 0.9
            }}
            className="flex-shrink-0 mt-1">
            <Button
                onClick={() => onComplete(task.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${task.completed ? "bg-success border-success" : "border-gray-300 hover:border-primary"}`}>
                <AnimatePresence>
                    {task.completed && <motion.div
                        initial={{
                            scale: 0
                        }}
                        animate={{
                            scale: 1
                        }}
                        exit={{
                            scale: 0
                        }}
                        className="text-white">
                        <ApperIcon name="Check" size={12} />
                    </motion.div>}
                </AnimatePresence>
            </Button>
        </motion.div>
        {/* Content */}
        <div className="flex-1 min-w-0">
            {isEditing ? <div className="space-y-2">
                <Input
                    type="text"
                    value={editData.title}
                    onChange={e => setEditData({
                        ...editData,
                        title: e.target.value
                    })}
                    onKeyDown={handleKeyPress}
                    className="text-lg font-medium bg-transparent border-b-2 border-primary focus:outline-none"
                    autoFocus />
                <Input
                    type="textarea"
                    value={editData.description}
                    onChange={e => setEditData({
                        ...editData,
                        description: e.target.value
                    })}
                    onKeyDown={handleKeyPress}
                    placeholder="Add description..."
                    className="text-gray-600 bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary resize-none"
                    rows="2" />
                <div className="flex space-x-2 pt-2">
                    <Button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">Save
                                        </Button>
                    <Button
                        onClick={() => {
                            setIsEditing(false);

                            setEditData({
                                title: task.title,
                                description: task.description || ""
                            });
                        }}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300">Cancel
                                        </Button>
                </div>
            </div> : <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
                <h3
                    className={`text-lg font-medium break-words ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                    {task.title}
                </h3>
                {task.description && <p
                    className={`mt-1 text-gray-600 break-words ${task.completed ? "line-through" : ""}`}>
                    {task.description}
                </p>}
            </div>}
            {/* Metadata */}
            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-3">
                    <PriorityBadge priority={task.priority} />
                    {category && <div className="flex items-center space-x-1">
                        <ApperIcon name={category.icon} size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-500">{category.name}</span>
                    </div>}
                    {task.dueDate && <div className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" size={14} className="text-gray-400" />
                        <span className={`text-sm ${getDueDateColor()}`}>
                            {getDueDateDisplay()}
                        </span>
                    </div>}
                </div>
                {/* Actions */}
                {!isEditing && <div
                    className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.div
                        whileHover={{
                            scale: 1.1
                        }}
                        whileTap={{
                            scale: 0.9
                        }}>
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="p-1 text-gray-400 hover:text-primary">
                            <ApperIcon name="Edit2" size={16} />
                        </Button>
                    </motion.div>
                    <motion.div
                        whileHover={{
                            scale: 1.1
                        }}
                        whileTap={{
                            scale: 0.9
                        }}>
                        <Button
                            onClick={() => onDelete(task.id)}
                            className="p-1 text-gray-400 hover:text-error">
                            <ApperIcon name="Trash2" size={16} />
                        </Button>
                    </motion.div>
                </div>}
            </div>
        </div>
    </div>
</motion.div>
  );
};

export default TaskCard;