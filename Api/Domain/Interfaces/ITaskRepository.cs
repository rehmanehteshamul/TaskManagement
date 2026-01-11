using Domain.Models;
using Entities.Entities;

namespace Entities.Interfaces
{
    public interface ITaskRepository
    {
        Task<PagedResult<TaskItem>> GetAllAsync(Entities.TaskStatus? status, int page, int pageSize);
        Task<TaskItem?> GetByIdAsync(int id);
        Task AddAsync(TaskItem task);
        void Update(TaskItem task);
        void Delete(TaskItem task);
        Task SaveChangesAsync();
    }
}
