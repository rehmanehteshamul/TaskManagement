using Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TaskStatus = Entities.Entities.TaskStatus;

namespace Application.DTOs
{
    public class CreateTaskRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TaskStatus Status { get; set; }
        public DateTime DueDate { get; set; }
    }

}
