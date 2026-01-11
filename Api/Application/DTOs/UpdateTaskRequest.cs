using Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class UpdateTaskRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Entities.Entities.TaskStatus Status { get; set; }
        public DateTime DueDate { get; set; } // optional, if you want to allow updating due date
    }
}
