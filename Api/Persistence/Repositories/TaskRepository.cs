using Domain.Models;
using Entities.Entities;
using Entities.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence.DBContext;

namespace Persistence.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly ApplicationDbContext _context;

        public TaskRepository(ApplicationDbContext context)
        {
            _context = context;
        }

       
        public async Task<PagedResult<TaskItem>> GetAllAsync(Entities.Entities.TaskStatus? status, int page, int pageSize)
        {
            IQueryable<TaskItem> query = _context.TaskItem;

            if (status.HasValue)
                query = query.Where(t => t.Status == status);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(t => t.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new TaskItem
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    CreatedAt = t.CreatedAt,
                    DueDate = t.DueDate,
                    UpdatedAt = t.UpdatedAt
                })
                .ToListAsync();

            return new PagedResult<TaskItem>
            {
                Items = items,
                TotalCount = totalCount
            };
        }
        public async Task<TaskItem?> GetByIdAsync(int id)
        {
            return await _context.TaskItem.FindAsync(id);
        }

        public async Task AddAsync(TaskItem task)
        {
            await _context.TaskItem.AddAsync(task);
        }

        public void Update(TaskItem task)
        {
            _context.TaskItem.Update(task);
        }

        public void Delete(TaskItem task)
        {
            _context.TaskItem.Remove(task);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
