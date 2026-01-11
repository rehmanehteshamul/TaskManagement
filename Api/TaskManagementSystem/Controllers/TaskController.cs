using Application.Interfaces;
using Application.DTOs;
using Entities.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace FileApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _service;

        public TasksController(ITaskService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] Entities.Entities.TaskStatus? status,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 2)
        {
            var result = await _service.GetAllAsync(status, page, pageSize);
            return Ok(ApiResponse<object>.SuccessResponse(
                result,
                "Tasks fetched successfully"));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var task = await _service.GetByIdAsync(id);
            if (task == null)
                return NotFound(ApiResponse<object>.Failure("Task not found"));

            return Ok(ApiResponse<object>.SuccessResponse(task));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTaskRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Failure("Invalid request data"));

            var createdTask = await _service.CreateAsync(request);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdTask.Id },
                ApiResponse<object>.SuccessResponse(createdTask, "Task created successfully"));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Failure("Invalid request data"));

            var updated = await _service.UpdateAsync(id, request);
            if (!updated)
                return NotFound(ApiResponse<object>.Failure("Task not found"));

            return Ok(ApiResponse<object>.SuccessResponse(null, "Task updated successfully"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted)
                return NotFound(ApiResponse<object>.Failure("Task not found"));

            return Ok(ApiResponse<object>.SuccessResponse(null, "Task deleted successfully"));
        }
    }
}
