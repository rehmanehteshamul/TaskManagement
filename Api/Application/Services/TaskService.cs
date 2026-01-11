using Application.Interfaces;
using Application.DTOs;
using AutoMapper;
using Entities.Entities;
using Entities.Interfaces;
using Domain.Models;

namespace Application.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repository;
        private readonly IMapper _mapper;
        public TaskService(ITaskRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<PagedResult<TaskItem>> GetAllAsync(Entities.Entities.TaskStatus? status, int page, int pageSize)
        {
            return await _repository.GetAllAsync(status, page,pageSize);
        }

        public async Task<TaskItem?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<TaskDto> CreateAsync(CreateTaskRequest request)
        {
            var taskEntity = _mapper.Map<TaskItem>(request); 
            taskEntity.CreatedAt = DateTime.UtcNow;


            await _repository.AddAsync(taskEntity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<TaskDto>(taskEntity);
        }

        public async Task<bool> UpdateAsync(int id, UpdateTaskRequest task)
        {
            var existingTask = await _repository.GetByIdAsync(id);
            if (existingTask == null) return false;

            _mapper.Map(task, existingTask);
            existingTask.UpdatedAt = DateTime.UtcNow;

            _repository.Update(existingTask);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var task = await _repository.GetByIdAsync(id);
            if (task == null) return false;

            _repository.Delete(task);
            await _repository.SaveChangesAsync();
            return true;
        }
    }
}
