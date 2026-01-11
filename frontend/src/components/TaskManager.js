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

    const clearMessages = () => {
        setSuccessMessage('');
        setErrorMessage('');
    };

    // ----------------------------
    // Load tasks
    // ----------------------------
    const loadTasks = async (status = null, page = 1) => {
        clearMessages();
        try {
            const response = await taskService.getAll(status, page, itemsPerPage);
            const result = response.data;

            if (!result.success) {
                setErrorMessage(result.message || 'Failed to load tasks');
                return;
            }

            const data = result.data || { items: [], totalCount: 0 };
            setTasks(data.items || []);
            setTotalPages(Math.ceil(data.totalCount / itemsPerPage));
            setCurrentPage(page);
        } catch (error) {
            setErrorMessage('Something went wrong while loading tasks.');
            console.error(error);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        loadTasks(statusFilter || null, 1);
    }, [statusFilter, searchTerm]);

    // ----------------------------
    // Create Task
    // ----------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearMessages();

        if (!title.trim()) {
            setErrorMessage('Title is required');
            return;
        }

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
            const response = await taskService.create({
                title,
                description,
                status: 0,
                dueDate: new Date(dueDate).toISOString()
            });

            const result = response.data;

            if (!result.success) {
                setErrorMessage(result.message);
                return;
            }

            setTitle('');
            setDescription('');
            setDueDate('');
            setSuccessMessage(result.message || 'Task created successfully');
            loadTasks(statusFilter || null, 1);
        } catch (error) {
            setErrorMessage('Failed to create task');
            console.error(error);
        }
    };

    // ----------------------------
    // Toggle Status
    // ----------------------------
    const toggleStatus = async (task) => {
        clearMessages();
        try {
            const response = await taskService.update(task.id, {
                ...task,
                status: task.status === 0 ? 1 : 0
            });

            const result = response.data;

            if (!result.success) {
                setErrorMessage(result.message);
                return;
            }

            setSuccessMessage(result.message || 'Task updated successfully');
            loadTasks(statusFilter || null, currentPage);
        } catch (error) {
            setErrorMessage('Failed to update task');
            console.error(error);
        }
    };

    // ----------------------------
    // Delete Task
    // ----------------------------
    const deleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        clearMessages();
        try {
            const response = await taskService.delete(id);
            const result = response.data;

            if (!result.success) {
                setErrorMessage(result.message);
                return;
            }

            setSuccessMessage(result.message || 'Task deleted successfully');
            loadTasks(statusFilter || null, currentPage);
        } catch (error) {
            setErrorMessage('Failed to delete task');
            console.error(error);
        }
    };

    // ----------------------------
    // Logout
    // ----------------------------
    const handleLogout = () => {
        localStorage.removeItem('token');
        api.defaults.headers.common['Authorization'] = undefined;
        setLoggedIn(false);
    };

    // ----------------------------
    // Search Filter
    // ----------------------------
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
                    maxLength="200"
                    required
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
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
                {filteredTasks.length === 0 && <div className="no-tasks">No tasks found</div>}

                {filteredTasks.map(task => (
                    <li key={task.id} className="task-item">
                        <strong>Title: {task.title}</strong>
                        {task.description && <p><strong>Description:</strong> {task.description}</p>}
                        <span className={`status-badge ${task.status}`}>
                            {task.status === 0 ? 'Pending' : 'Completed'}
                        </span>

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
                    <button disabled={currentPage === 1}
                        onClick={() => loadTasks(statusFilter || null, currentPage - 1)}>
                        Prev
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button disabled={currentPage === totalPages}
                        onClick={() => loadTasks(statusFilter || null, currentPage + 1)}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskManager;
