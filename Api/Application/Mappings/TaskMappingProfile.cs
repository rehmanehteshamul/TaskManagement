using Application.DTOs;
using AutoMapper;
using Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.Mappings
{
    public class TaskMappingProfile : Profile
    {
        public TaskMappingProfile()
        {
            // Map TaskItem -> TaskDto
            CreateMap<TaskItem, TaskDto>();

            // Map CreateTaskRequest -> TaskItem
            CreateMap<CreateTaskRequest, TaskItem>();

            CreateMap<UpdateTaskRequest, TaskItem>()
            // Only map non-null properties (optional, useful if you have nullable fields)
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
