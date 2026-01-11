using Entities.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using TaskStatus = Entities.Entities.TaskStatus;

namespace Application.DTOs
{
    public class CreateTaskRequest
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public TaskStatus Status { get; set; }
        [Required]
        public DateTime? DueDate { get; set; }
    }

}
