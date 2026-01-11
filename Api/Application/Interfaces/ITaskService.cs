using Application.DTOs;
using Domain.Models;
using Entities.Entities;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Application.Interfaces
{
    public interface ITaskService
    {
        Task<PagedResult<TaskItem>> GetAllAsync(Entities.Entities.TaskStatus? status, int  page, int pageSize);
        Task<TaskItem?> GetByIdAsync(int id);
        Task<TaskDto> CreateAsync(CreateTaskRequest request);
        Task<bool> UpdateAsync(int id, UpdateTaskRequest task);
        Task<bool> DeleteAsync(int id);
    }
}
