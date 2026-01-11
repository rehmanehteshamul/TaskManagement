

using Entities.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence.DBContext
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {

        }

        public DbSet<TaskItem> TaskItem { get; set; }
    }
}
