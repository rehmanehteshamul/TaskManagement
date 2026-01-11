import React, { useEffect, useState } from 'react';
import { taskService } from '../services/api';
import api from '../services/api';
import './TaskManager.css';

const TaskManager = ({ setLoggedIn }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dueDate, setDueDate] = useState('');
  const itemsPerPage = 2;

  // Load tasks from API
  const loadTasks = async (status = null, page = 1) => {
    try {
      const response = await taskService.getAll(status, page, itemsPerPage);
      const data = response.data || { items: [], totalCount: 0 };
      setTasks(data.items || []);
      setTotalPages(Math.ceil((data.totalCount || 0) / itemsPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error loading tasks:", error);
      setTasks([]);
      setTotalPages(1);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    loadTasks(statusFilter || null, 1);
  }, [searchTerm, statusFilter]);

  // Create new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!title.trim()) return;

    if (!dueDate) {
      setErrorMessage('Please select a due date.');
      return;
    }

    const selectedDate = new Date(dueDate);
    const now = new Date();
    if (selectedDate <= now) {
      setErrorMessage('Due date must be in the future.');
      return;
    }

    try {
      await taskService.create({
        title,
        description,
        status: 0,
        dueDate: selectedDate.toISOString()
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      setSuccessMessage('Task created successfully!');
      loadTasks(statusFilter || null, 1);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Toggle task status
  const toggleStatus = async (task) => {
    try {
      await taskService.update(task.id, {
        ...task,
        status: task.status === 0 ? 1 : 0
      });
      setSuccessMessage('Task updated successfully!');
      loadTasks(statusFilter || null, currentPage);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(id);
        setSuccessMessage('Task deleted successfully!');
        loadTasks(statusFilter || null, currentPage);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    loadTasks(value || null, 1);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    api.defaults.headers.common['Authorization'] = undefined;
    setLoggedIn(false);
  };

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="task-manager-container">
      <div className="header">
        <h2>Task Management System</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {successMessage && <div className="success-banner">{successMessage}</div>}
      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      {/* Create Task */}
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength="200"
        />
        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength="1000"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Filter */}
      <div className="task-filter">
        <select value={statusFilter} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Search */}
      <div className="task-search">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Task List */}
      <ul className="task-list">
        {(!filteredTasks || filteredTasks.length === 0) && <div className="no-tasks">No tasks found</div>}

        {filteredTasks.map((task) => (
          <li key={task.id} className="task-item">
            <strong>Title: {task.title}</strong>
            {task.description && <p><strong>Description:</strong> {task.description}</p>}
            <span className={`status-badge ${task.status}`}>{task.status === 0 ? 'Pending' : 'Completed'}</span>
            <div className="task-dates">
              <small>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'N/A'}</small>
              <small>Created: {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}</small>
              {task.updatedAt && <small>Updated: {new Date(task.updatedAt).toLocaleString()}</small>}
            </div>

            <div className="task-actions">
              <button className="btn-toggle" onClick={() => toggleStatus(task)}>
                Mark {task.status === 0 ? 'Completed' : 'Pending'}
              </button>
              <button className="btn-delete" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => loadTasks(statusFilter || null, Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => loadTasks(statusFilter || null, Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
