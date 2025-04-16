"use client";

import React, { useState, useEffect } from "react";
import { 
  StaggerContainer, 
  StaggerItem, 
  FadeIn 
} from "@/components/ui/animated-elements";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle,
  Circle,
  CalendarDays,
  Plus,
  Tag,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  X,
  Trash,
  Edit,
  Loader2,
  PlusCircle,
  Clock,
  ArrowDown,
  ArrowUp,
  SlidersHorizontal,
} from "lucide-react";

// Task interface from the API
interface Task {
  task_id: number;
  student_id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: number;
  recurrence_pattern: string | null;
  parent_task_id: number | null;
  created_at: string;
  completed_at: string | null;
  is_recurring: boolean;
  tags: string[];
}

export default function TasksPage() {
  // States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 3, // Medium priority by default
    tags: [] as string[],
    student_id: 1, // Hardcoded for now, should come from auth
  });
  
  // Editing state
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);
  
  // Update filtered tasks when tasks, search query, or filters change
  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, priorityFilter, selectedTags, activeTab]);
  
  // Extract all unique tags from tasks
  useEffect(() => {
    if (tasks.length > 0) {
      const tags = new Set<string>();
      tasks.forEach(task => {
        task.tags?.forEach(tag => {
          if (tag) tags.add(tag);
        });
      });
      setAllTags(Array.from(tags));
    }
  }, [tasks]);

  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/tasks?student_id=1');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Error loading tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter tasks based on search, priority, tags, and active tab
  const filterTasks = () => {
    let filtered = [...tasks];
    
    // Filter by active tab
    if (activeTab === 'completed') {
      filtered = filtered.filter(task => task.completed_at !== null);
    } else if (activeTab === 'pending') {
      filtered = filtered.filter(task => task.completed_at === null);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by priority
    if (priorityFilter !== null) {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(task => 
        selectedTags.some(tag => task.tags?.includes(tag))
      );
    }
    
    setFilteredTasks(filtered);
  };
  
  // Toggle task completion
  const toggleTaskCompletion = async (task: Task) => {
    try {
      const newCompletedStatus = task.completed_at ? null : new Date().toISOString();
      
      const response = await fetch(`/api/tasks/${task.task_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed_at: newCompletedStatus
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      // Update local state
      setTasks(tasks.map(t => 
        t.task_id === task.task_id 
          ? { ...t, completed_at: newCompletedStatus } 
          : t
      ));
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Error updating task. Please try again.');
    }
  };
  
  // Delete task
  const deleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      // Update local state
      setTasks(tasks.filter(t => t.task_id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Error deleting task. Please try again.');
    }
  };
  
  // Create new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      const createdTask = await response.json();
      
      // Update local state
      setTasks([...tasks, createdTask]);
      
      // Reset form and close modal
      setNewTask({
        title: '',
        description: '',
        due_date: '',
        priority: 3,
        tags: [],
        student_id: 1,
      });
      setShowTaskModal(false);
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Error creating task. Please try again.');
    }
  };
  
  // Update task
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTask) return;
    
    try {
      const response = await fetch(`/api/tasks/${editingTask.task_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingTask.title,
          description: editingTask.description,
          due_date: editingTask.due_date,
          priority: editingTask.priority,
          tags: editingTask.tags,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      const updatedTask = await response.json();
      
      // Update local state
      setTasks(tasks.map(t => 
        t.task_id === editingTask.task_id ? updatedTask : t
      ));
      
      // Reset form and close modal
      setEditingTask(null);
      setShowTaskModal(false);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Error updating task. Please try again.');
    }
  };
  
  // Handle tag input in task form
  const handleTagInput = (input: string, isEditing = false) => {
    if (input.trim() && input.endsWith(',')) {
      const newTag = input.slice(0, -1).trim();
      if (newTag) {
        if (isEditing && editingTask) {
          setEditingTask({
            ...editingTask,
            tags: [...(editingTask.tags || []), newTag]
          });
        } else {
          setNewTask({
            ...newTask,
            tags: [...newTask.tags, newTag]
          });
        }
        return '';
      }
    }
    return input;
  };
  
  // Remove tag from task form
  const removeTag = (tag: string, isEditing = false) => {
    if (isEditing && editingTask) {
      setEditingTask({
        ...editingTask,
        tags: editingTask.tags.filter(t => t !== tag)
      });
    } else {
      setNewTask({
        ...newTask,
        tags: newTask.tags.filter(t => t !== tag)
      });
    }
  };
  
  // Get priority label and color
  const getPriorityInfo = (priority: number) => {
    switch (priority) {
      case 1:
        return { label: 'High', color: 'bg-red-100 text-red-700 border-red-500', icon: <ArrowUp size={12} /> };
      case 2:
        return { label: 'Medium-High', color: 'bg-orange-100 text-orange-700 border-orange-500', icon: <ArrowUp size={12} /> };
      case 3:
        return { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-500', icon: null };
      case 4:
        return { label: 'Medium-Low', color: 'bg-blue-100 text-blue-700 border-blue-500', icon: <ArrowDown size={12} /> };
      case 5:
        return { label: 'Low', color: 'bg-green-100 text-green-700 border-green-500', icon: <ArrowDown size={12} /> };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-700 border-gray-500', icon: null };
    }
  };
  
  // Format date string to readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
      });
    }
  };
  
  // Check if a date is past due
  const isPastDue = (dateString: string | null) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date < today && !date.toDateString().includes(today.toDateString());
  };
  
  // Task form modal
  const TaskFormModal = () => {
    const isEditing = !!editingTask;
    const activeTask = isEditing ? editingTask : newTask;
    const [tagInput, setTagInput] = useState('');
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-white p-3">
          <CardHeader className="border-b-4 border-black">
            <CardTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</CardTitle>
            <button 
              onClick={() => {
                setShowTaskModal(false);
                setEditingTask(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </CardHeader>
          <form onSubmit={isEditing ? handleUpdateTask : handleCreateTask}>
            <CardContent className="space-y-4 pt-6">
              <div>
                <label className="block text-sm font-bold mb-2">Title</label>
                <Input 
                  type="text"
                  value={activeTask.title} 
                  onChange={(e) => isEditing 
                    ? setEditingTask({...editingTask!, title: e.target.value})
                    : setNewTask({...newTask, title: e.target.value})
                  }
                  placeholder="Task title" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Description (optional)</label>
                <textarea 
                  className="border-black bg-white text-black placeholder:text-gray-400 rounded-[6px] border-[3px] w-full px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-visible:border-black focus-visible:ring-black focus-visible:ring-[3px] transition-all outline-none"
                  value={activeTask.description || ''} 
                  onChange={(e) => isEditing 
                    ? setEditingTask({...editingTask!, description: e.target.value})
                    : setNewTask({...newTask, description: e.target.value})
                  }
                  placeholder="Task description" 
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Due Date</label>
                  <Input 
                    type="date"
                    value={activeTask.due_date ? activeTask.due_date.split('T')[0] : ''} 
                    onChange={(e) => isEditing 
                      ? setEditingTask({...editingTask!, due_date: e.target.value})
                      : setNewTask({...newTask, due_date: e.target.value})
                    }
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2">Priority</label>
                  <select 
                    className="border-black bg-white text-black placeholder:text-gray-400 rounded-[6px] border-[3px] w-full px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-visible:border-black focus-visible:ring-black focus-visible:ring-[3px] transition-all outline-none"
                    value={activeTask.priority} 
                    onChange={(e) => isEditing 
                      ? setEditingTask({...editingTask!, priority: parseInt(e.target.value)})
                      : setNewTask({...newTask, priority: parseInt(e.target.value)})
                    }
                  >
                    <option value={1}>High</option>
                    <option value={2}>Medium-High</option>
                    <option value={3}>Medium</option>
                    <option value={4}>Medium-Low</option>
                    <option value={5}>Low</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Tags (comma-separated)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {activeTask.tags?.map(tag => (
                    <div key={tag} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm border-2 border-gray-300">
                      <span className="mr-1">{tag}</span>
                      <button 
                        type="button"
                        onClick={() => removeTag(tag, isEditing)}
                        className="text-gray-500 hover:text-black"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <Input 
                  type="text"
                  value={tagInput} 
                  onChange={(e) => {
                    const result = handleTagInput(e.target.value, isEditing);
                    setTagInput(typeof result === 'string' ? result : e.target.value);
                  }}
                  placeholder="Add tags (press comma to add)" 
                />
                <p className="text-xs text-gray-500 mt-1">Type a tag and press comma to add it</p>
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-end gap-2">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  setShowTaskModal(false);
                  setEditingTask(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="neuPrimary">
                {isEditing ? 'Update Task' : 'Create Task'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">Task Management</h1>
        <p className="text-gray-600">Create, organize, and track your tasks to boost productivity.</p>
      </div>
      
      <Card className="bg-white mb-6">
        <CardHeader className="border-b-4 border-black">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-1"
              >
                <SlidersHorizontal size={16} />
                Filters
              </Button>
              
              <Button 
                variant="neuPrimary"
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskModal(true);
                }}
                className="gap-1"
              >
                <Plus size={16} />
                New Task
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 border-t pt-4 border-gray-200">
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-sm font-bold mb-1">Priority</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriorityFilter(priorityFilter === p ? null : p)}
                        className={`px-2 py-1 rounded border-2 text-xs font-bold ${
                          priorityFilter === p
                            ? 'bg-black text-white border-black'
                            : 'bg-white border-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {getPriorityInfo(p).label}
                      </button>
                    ))}
                    {priorityFilter !== null && (
                      <button
                        onClick={() => setPriorityFilter(null)}
                        className="px-1 rounded hover:bg-gray-100"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                {allTags.length > 0 && (
                  <div>
                    <p className="text-sm font-bold mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTags(
                            selectedTags.includes(tag)
                              ? selectedTags.filter(t => t !== tag)
                              : [...selectedTags, tag]
                          )}
                          className={`px-2 py-1 rounded border-2 text-xs font-bold ${
                            selectedTags.includes(tag)
                              ? 'bg-black text-white border-black'
                              : 'bg-white border-gray-300 hover:border-gray-500'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                      {selectedTags.length > 0 && (
                        <button
                          onClick={() => setSelectedTags([])}
                          className="px-1 rounded hover:bg-gray-100"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
              ) : (
                <>
                  {filteredTasks.length > 0 ? (
                    <ul className="space-y-3">
                      {filteredTasks.map(task => (
                        <li 
                          key={task.task_id}
                          className={`border-3 border-black rounded-md bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                            task.completed_at ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="p-3 flex items-start">
                            <button 
                              onClick={() => toggleTaskCompletion(task)}
                              className="mt-1 mr-3 min-w-[24px]"
                            >
                              {task.completed_at ? (
                                <CheckCircle size={24} className="text-green-500" />
                              ) : (
                                <Circle size={24} className="text-gray-300 hover:text-gray-400" />
                              )}
                            </button>
                            
                            <div className="flex-1">
                              <h3 className={`font-bold text-lg ${task.completed_at ? 'line-through' : ''}`}>
                                {task.title}
                              </h3>
                              
                              {task.description && (
                                <p className="text-gray-700 mt-1">{task.description}</p>
                              )}
                              
                              <div className="flex flex-wrap items-center gap-2 mt-3">
                                {task.due_date && (
                                  <div className={`flex items-center text-xs px-2 py-1 rounded-md border-2 ${
                                    isPastDue(task.due_date) && !task.completed_at
                                      ? 'border-red-500 bg-red-50 text-red-700'
                                      : 'border-gray-300 bg-white'
                                  }`}>
                                    <CalendarDays size={12} className="mr-1" />
                                    {formatDate(task.due_date)}
                                  </div>
                                )}
                                
                                <div className={`flex items-center text-xs px-2 py-1 rounded-md border-2 ${getPriorityInfo(task.priority).color}`}>
                                  {getPriorityInfo(task.priority).icon && (
                                    <span className="mr-1">{getPriorityInfo(task.priority).icon}</span>
                                  )}
                                  {getPriorityInfo(task.priority).label}
                                </div>
                                
                                {task.tags?.map(tag => (
                                  <div key={tag} className="text-xs px-2 py-1 rounded-md border-2 border-gray-300 bg-white flex items-center">
                                    <Tag size={12} className="mr-1" />
                                    {tag}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex gap-1 ml-2">
                              <button 
                                onClick={() => {
                                  setEditingTask(task);
                                  setShowTaskModal(true);
                                }}
                                className="p-2 rounded-full hover:bg-gray-100"
                                title="Edit task"
                              >
                                <Edit size={16} />
                              </button>
                              
                              <button 
                                onClick={() => deleteTask(task.task_id)}
                                className="p-2 rounded-full hover:bg-gray-100 text-red-500 hover:text-red-700"
                                title="Delete task"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-16">
                      <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={36} className="text-gray-400" />
                      </div>
                      <h3 className="font-bold text-xl mb-1">No tasks found</h3>
                      <p className="text-gray-500 mb-6">
                        {activeTab === 'completed'
                          ? "You haven't completed any tasks yet."
                          : activeTab === 'pending'
                          ? "You don't have any pending tasks."
                          : searchQuery || priorityFilter !== null || selectedTags.length > 0
                          ? "No tasks match your filters."
                          : "Create your first task to get started!"}
                      </p>
                      <Button 
                        variant="neuPrimary"
                        onClick={() => {
                          setEditingTask(null);
                          setShowTaskModal(true);
                        }}
                        className="gap-1"
                      >
                        <PlusCircle size={16} />
                        Create Task
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {showTaskModal && <TaskFormModal />}
    </div>
  );
}