# TaskManagement

Task Management System — Usage Guide
________________________________________
1. Project Overview
The Task Management System is a full-stack application for managing tasks. It allows users to create, update, delete, and view tasks with features like filtering, search, pagination, and validation. Key functionalities include:
•	Create, update, and delete tasks.
•	Set task status: Pending or Completed.
•	Assign a future due date for each task.
•	Search and filter tasks by title, description, and status.
•	Pagination for task lists.
•	Frontend: React.js, fully responsive, consuming a .NET 9 Web API backend.
•	Backend implements Clean Architecture for maintainable and scalable code.
•	Validation and error handling with generic API responses (success, message, data).
Project Components:
1.	API: .NET 9 Web API handling backend logic, validation, and database interactions.
2.	Task Management: React frontend communicating with the API.
________________________________________
2. Project Structure
TaskManagementSystem/
├─ Api/               # .NET API project
│  ├─ Controllers/    # API endpoints
│  ├─ Application/    # Services, DTOs, interfaces
│  ├─ Domain/       # Domain entities
│  ├─ Infrastructure/ # Repository & DbContext
│  └─ Program.cs      # Application entry point
├─ Front End/         # React frontend project
│  ├─ src/
│  │  ├─ components/  # React components (TaskManager)
│  │  ├─ services/    # API service calls (Axios)
│  │  └─ App.js
├─ .gitignore
└─ README.md________________________________________

1. 3. Technologies Used
Backend (.NET API):
•	.NET 9 Web API
•	Entity Framework Core (Code First)
•	SQL Server database
•	AutoMapper for DTO mapping
•	Clean Architecture principles (Separation of Concerns)
•	Asynchronous programming with async/await
•	Generic API response model (ApiResponse)
•	BusinessException for controlled errors
Frontend (React):
•	React.js
•	Axios for API calls
•	Pagination, filtering, and search features
•	Client-side validation (title required, future due date)
•	Success and error messages for user feedback
•	CSS for styling
________________________________________
4. How to Run the Application
4.1 Backend (.NET API)
1.	Open the solution in Visual Studio.
2.	Update the connection string in appsettings.json for your SQL Server instance.
3.	Run migrations (Package Manager Console):
Update-Database
4.	Run the API.
API Endpoints:
Method	Endpoint	Description
GET	/api/tasks	Get all tasks (optional filter by status)
GET	/api/tasks/{id}	Get a task by ID
POST	/api/tasks	Create a new task
PUT	/api/tasks/{id}	Update a task
DELETE	/api/tasks/{id}	Delete a task
All responses follow a generic structure:
{
  "success": true,
  "message": "Task created successfully",
  "data": { ... }
}
________________________________________
4.2 Frontend (React)
1.	Open terminal in ClientApp/ folder.
2.	Install dependencies:
npm install
3.	Start the development server:
npm start
4.	The frontend will open at http://localhost:3000.
Login credentials (default for trial):
•	Username: admin
•	Password: admin123
Usage Notes:
•	Task Creation:
o	Title is required.
o	Due date must be in the future (validated on frontend and backend).
o	Status defaults to Pending.
•	Filtering & Pagination:
o	Use dropdown to filter by status (Pending / Completed).
o	Pagination controls appear when tasks exceed items per page.
________________________________________
5. Clean Architecture Implementation
•	Entities: Domain models (Task, TaskStatus).
•	DTOs: Data Transfer Objects for API requests/responses (TaskDto, CreateTaskRequest, UpdateTaskRequest).
•	Services: Business logic layer (ITaskService, TaskService) handling validation and exceptions.
•	Repositories: Data access layer (ITaskRepository, EF Core).
•	Controllers: Handle HTTP requests, map data to DTOs, return ApiResponse objects.
Other Notes:
•	AutoMapper is used for mapping between DTOs and entities.
•	BusinessException is thrown for controlled errors like invalid due dates.
•	Frontend displays success and error messages returned from API.
________________________________________
6. Summary
This project demonstrates:
•	Full-stack development with .NET 9 API and React frontend.
•	CRUD operations with task management, filtering, search, and pagination.
•	Use of Clean Architecture, AutoMapper, EF Core, and async programming.
•	Proper validation, exception handling, and generic API responses.
•	Separation of concerns and maintainable project structure.

